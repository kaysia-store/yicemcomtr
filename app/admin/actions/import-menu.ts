"use server";

import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/auth";
import { readPreview, type PreviewDb } from "@/lib/preview";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { uuidPattern } from "@/lib/validators";

export async function importPreviewMenu(_prev: ActionState, _formData: FormData): Promise<ActionState> {
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const db = readPreview();
  const name = db.settings.name.trim();
  if (name.length < 1 || name.length > 80) {
    return { status: "error", message: "Restoran adı 1 ile 80 karakter arasında olmalı." };
  }

  const { count: productCount, error: productCountError } = await auth.supabase
    .from("products")
    .select("id", { count: "exact", head: true });
  const { count: categoryCount, error: categoryCountError } = await auth.supabase
    .from("categories")
    .select("id", { count: "exact", head: true });
  if (productCountError || categoryCountError) {
    return { status: "error", message: "Mevcut menü sayılamadı." };
  }
  if ((productCount ?? 0) > 0 || (categoryCount ?? 0) > 0) {
    return { status: "error", message: "Supabase'te zaten kategori veya ürün var. Aktarma yalnızca boş menüye yazılır." };
  }

  const { data: languageRows, error: languageError } = await auth.supabase.from("languages").select("code");
  if (languageError) return { status: "error", message: "Diller okunamadı." };
  const locales = new Set(((languageRows ?? []) as { code: string }[]).map((row) => row.code));
  if (!locales.has(db.settings.defaultLocale)) {
    return { status: "error", message: "Varsayılan dil veritabanında yok." };
  }

  const { data: allergenRows, error: allergenError } = await auth.supabase.from("allergens").select("code");
  if (allergenError) return { status: "error", message: "Alerjenler okunamadı." };
  const allergens = new Set(((allergenRows ?? []) as { code: string }[]).map((row) => row.code));

  const prepared = prepareMenu(db, locales, allergens);
  if (!prepared.ok) return { status: "error", message: prepared.message };

  const settings = await auth.supabase
    .from("restaurant_settings")
    .update({ name, show_title: db.settings.showTitle === true })
    .eq("id", 1);
  if (settings.error) {
    const fallback = await auth.supabase.from("restaurant_settings").update({ name }).eq("id", 1);
    if (fallback.error) return { status: "error", message: "Restoran adı yazılamadı." };
  }

  const categoryIds = prepared.categories.map((row) => row.id);
  const productIds = prepared.products.map((row) => row.id);
  const failed = await writeMenu(auth.supabase, prepared);
  if (failed) {
    if (productIds.length > 0) await auth.supabase.from("products").delete().in("id", productIds);
    if (categoryIds.length > 0) await auth.supabase.from("categories").delete().in("id", categoryIds);
    return { status: "error", message: failed };
  }

  revalidateMenu();
  redirect(`/admin/photos?imported=${prepared.products.length}`);
}

type MenuRows = {
  categories: { id: string; sort_order: number; is_published: boolean }[];
  categoryTranslations: { category_id: string; locale: string; name: string }[];
  features: { id: string; category_id: string; selection: "single" | "multiple"; is_required: boolean; sort_order: number }[];
  featureTranslations: { feature_id: string; locale: string; name: string }[];
  products: { id: string; category_id: string; price: number; image_path: null; sort_order: number; is_published: boolean }[];
  productTranslations: { product_id: string; locale: string; name: string; description: string; ingredients: string }[];
  productAllergens: { product_id: string; allergen_code: string }[];
  options: { id: string; product_id: string; feature_id: string; price_delta: number; is_default: boolean; sort_order: number }[];
  optionTranslations: { option_id: string; locale: string; name: string }[];
};

function prepareMenu(db: PreviewDb, locales: Set<string>, allergens: Set<string>): { ok: true } & MenuRows | { ok: false; message: string } {
  const categoryIds = new Set<string>();
  const categories: MenuRows["categories"] = [];
  for (const category of db.categories) {
    if (!uuidPattern.test(category.id)) return { ok: false, message: "Kategori kimliği geçersiz." };
    const name = db.categoryTranslations.find((item) => item.categoryId === category.id && item.locale === db.settings.defaultLocale)?.name.trim() ?? "";
    if (name.length < 1 || name.length > 80) {
      return { ok: false, message: "Kategori adı 1 ile 80 karakter arasında olmalı." };
    }
    categoryIds.add(category.id);
    categories.push({ id: category.id, sort_order: category.sortOrder, is_published: category.isPublished });
  }

  const categoryTranslations = db.categoryTranslations
    .filter((item) => categoryIds.has(item.categoryId) && locales.has(item.locale))
    .map((item) => ({ category_id: item.categoryId, locale: item.locale, name: item.name.trim() }))
    .filter((item) => item.name.length >= 1 && item.name.length <= 80);

  const featureIds = new Set<string>();
  const features: MenuRows["features"] = [];
  for (const feature of db.features) {
    if (!categoryIds.has(feature.categoryId) || !uuidPattern.test(feature.id)) continue;
    if (feature.selection !== "single" && feature.selection !== "multiple") continue;
    featureIds.add(feature.id);
    features.push({
      id: feature.id,
      category_id: feature.categoryId,
      selection: feature.selection,
      is_required: feature.isRequired,
      sort_order: feature.sortOrder,
    });
  }
  const featureTranslations = db.featureTranslations
    .filter((item) => featureIds.has(item.featureId) && locales.has(item.locale))
    .map((item) => ({ feature_id: item.featureId, locale: item.locale, name: item.name.trim() }))
    .filter((item) => item.name.length >= 1 && item.name.length <= 80);

  const productIds = new Set<string>();
  const products: MenuRows["products"] = [];
  for (const product of db.products) {
    if (!categoryIds.has(product.categoryId) || !uuidPattern.test(product.id)) {
      return { ok: false, message: "Ürün kimliği veya kategorisi geçersiz." };
    }
    const copy = db.productTranslations.find((item) => item.productId === product.id && item.locale === db.settings.defaultLocale);
    const productName = copy?.name.trim() ?? "";
    if (productName.length < 1 || productName.length > 120) {
      return { ok: false, message: "Ürün adı 1 ile 120 karakter arasında olmalı." };
    }
    if ((copy?.description.length ?? 0) > 2000 || (copy?.ingredients.length ?? 0) > 2000) {
      return { ok: false, message: "Açıklama veya içindekiler 2000 karakteri aşıyor." };
    }
    if (!Number.isFinite(product.price) || product.price < 0) {
      return { ok: false, message: "Geçersiz ürün fiyatı var." };
    }
    productIds.add(product.id);
    products.push({
      id: product.id,
      category_id: product.categoryId,
      price: Math.round(product.price * 100) / 100,
      image_path: null,
      sort_order: product.sortOrder,
      is_published: product.isPublished,
    });
  }

  const productTranslations = db.productTranslations
    .filter((item) => productIds.has(item.productId) && locales.has(item.locale))
    .map((item) => ({
      product_id: item.productId,
      locale: item.locale,
      name: item.name.trim(),
      description: item.description.trim(),
      ingredients: item.ingredients.trim(),
    }))
    .filter((item) => item.name.length >= 1 && item.name.length <= 120 && item.description.length <= 2000 && item.ingredients.length <= 2000);

  const seenAllergens = new Set<string>();
  const productAllergens = db.productAllergens
    .filter((item) => productIds.has(item.productId) && allergens.has(item.code))
    .filter((item) => {
      const key = `${item.productId}:${item.code}`;
      if (seenAllergens.has(key)) return false;
      seenAllergens.add(key);
      return true;
    })
    .map((item) => ({ product_id: item.productId, allergen_code: item.code }));

  const optionIds = new Set<string>();
  const options: MenuRows["options"] = [];
  for (const option of db.options) {
    if (!productIds.has(option.productId) || !featureIds.has(option.featureId) || !uuidPattern.test(option.id)) continue;
    if (!Number.isFinite(option.priceDelta) || option.priceDelta < 0) continue;
    optionIds.add(option.id);
    options.push({
      id: option.id,
      product_id: option.productId,
      feature_id: option.featureId,
      price_delta: Math.round(option.priceDelta * 100) / 100,
      is_default: option.isDefault,
      sort_order: option.sortOrder,
    });
  }
  const optionTranslations = db.optionTranslations
    .filter((item) => optionIds.has(item.optionId) && locales.has(item.locale))
    .map((item) => ({ option_id: item.optionId, locale: item.locale, name: item.name.trim() }))
    .filter((item) => item.name.length >= 1 && item.name.length <= 80);

  return {
    ok: true,
    categories,
    categoryTranslations,
    features,
    featureTranslations,
    products,
    productTranslations,
    productAllergens,
    options,
    optionTranslations,
  };
}

async function writeMenu(supabase: SupabaseClient, rows: MenuRows) {
  const steps: [string, Record<string, unknown>[]][] = [
    ["categories", rows.categories],
    ["category_translations", rows.categoryTranslations],
    ["category_features", rows.features],
    ["category_feature_translations", rows.featureTranslations],
    ["products", rows.products],
    ["product_translations", rows.productTranslations],
    ["product_allergens", rows.productAllergens],
    ["product_options", rows.options],
    ["product_option_translations", rows.optionTranslations],
  ];
  for (const [table, records] of steps) {
    const error = await insertRows(supabase, table, records);
    if (error) return `${tableLabel(table)} ${error}`.slice(0, 240);
  }
  return null;
}

async function insertRows(supabase: SupabaseClient, table: string, rows: Record<string, unknown>[]) {
  for (let index = 0; index < rows.length; index += 80) {
    const { error } = await supabase.from(table).insert(rows.slice(index, index + 80));
    if (error) return error.message;
  }
  return null;
}

function tableLabel(table: string) {
  const labels: Record<string, string> = {
    categories: "Kategoriler yazılamadı.",
    category_translations: "Kategori adları yazılamadı.",
    category_features: "Kategori özellikleri yazılamadı.",
    category_feature_translations: "Özellik adları yazılamadı.",
    products: "Ürünler yazılamadı.",
    product_translations: "Ürün metinleri yazılamadı.",
    product_allergens: "Alerjenler yazılamadı.",
    product_options: "Seçenekler yazılamadı.",
    product_option_translations: "Seçenek adları yazılamadı.",
  };
  return labels[table] ?? "Menü yazılamadı.";
}
