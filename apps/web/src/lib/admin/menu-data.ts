import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";
import { logAudit } from "./audit";
import { notifyPublicMenuUpdated } from "./revalidate-public-menu";
import type {
  AdminCategory,
  AdminMenuData,
  AdminModifier,
  AdminProduct,
  LocalizedContents,
  LocalizedFields,
} from "./types";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

function emptyLocalized(): LocalizedFields {
  return { tr: "", en: "", ru: "", de: "", fr: "", ar: "" };
}

function emptyContents(): LocalizedContents {
  return { tr: [], en: [], ru: [], de: [], fr: [], ar: [] };
}

function buildLocalized(
  rows: Array<{ lang: string; name?: string; label?: string }> | null | undefined,
  field: "name" | "label",
): LocalizedFields {
  const out = emptyLocalized();
  for (const row of rows ?? []) {
    if (LANG_CODES.includes(row.lang as LangCode)) {
      out[row.lang as LangCode] = field === "name" ? (row.name ?? "") : (row.label ?? "");
    }
  }
  return out;
}

function buildContents(
  rows: Array<{ lang: string; contents?: string[] }> | null | undefined,
): LocalizedContents {
  const out = emptyContents();
  for (const row of rows ?? []) {
    if (LANG_CODES.includes(row.lang as LangCode)) {
      out[row.lang as LangCode] = Array.isArray(row.contents) ? row.contents : [];
    }
  }
  return out;
}

export async function loadAdminMenuData(supabase: SupabaseClient): Promise<AdminMenuData> {
  const [
    { data: categories, error: catError },
    { data: products, error: prodError },
    { data: modifiers, error: modError },
    { data: modifierTranslations, error: modTransError },
  ] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, sort_order, is_visible, category_translations(lang, name)")
      .order("sort_order"),
    supabase
      .from("products")
      .select(
        "id, category_id, price, image_url, sort_order, is_active, product_translations(lang, name, description, contents)",
      )
      .order("sort_order"),
    supabase
      .from("product_modifiers")
      .select("product_id, modifier_id, modifier_type, price, sort_order, is_active")
      .order("sort_order"),
    supabase.from("product_modifier_translations").select("product_id, modifier_id, lang, label"),
  ]);

  if (catError) throw catError;
  if (prodError) throw prodError;
  if (modError) throw modError;
  if (modTransError) throw modTransError;

  const modTransByKey = new Map<string, Array<{ lang: string; label?: string }>>();
  for (const row of modifierTranslations ?? []) {
    const key = `${row.product_id}::${row.modifier_id}`;
    const list = modTransByKey.get(key) ?? [];
    list.push({ lang: row.lang, label: row.label });
    modTransByKey.set(key, list);
  }

  const productCountByCategory = new Map<string, number>();
  for (const product of products ?? []) {
    productCountByCategory.set(product.category_id, (productCountByCategory.get(product.category_id) ?? 0) + 1);
  }

  const adminCategories: AdminCategory[] = (categories ?? []).map((category) => ({
    id: category.id,
    slug: category.slug,
    sortOrder: category.sort_order ?? 0,
    isVisible: category.is_visible ?? true,
    names: buildLocalized(category.category_translations as Array<{ lang: string; name?: string }>, "name"),
    productCount: productCountByCategory.get(category.id) ?? 0,
  }));

  const modifiersByProduct = new Map<string, AdminModifier[]>();
  for (const modifier of modifiers ?? []) {
    const key = `${modifier.product_id}::${modifier.modifier_id}`;
    const list = modifiersByProduct.get(modifier.product_id) ?? [];
    list.push({
      productId: modifier.product_id,
      modifierId: modifier.modifier_id,
      modifierType: modifier.modifier_type,
      price: Number(modifier.price),
      sortOrder: modifier.sort_order ?? 0,
      isActive: modifier.is_active ?? true,
      labels: buildLocalized(modTransByKey.get(key) ?? [], "label"),
    });
    modifiersByProduct.set(modifier.product_id, list);
  }

  const adminProducts: AdminProduct[] = (products ?? []).map((product) => {
    const trans = product.product_translations as Array<{
      lang: string;
      name?: string;
      description?: string;
      contents?: string[];
    }>;

    return {
      id: product.id,
      categoryId: product.category_id,
      price: Number(product.price),
      imageUrl: product.image_url ?? "",
      sortOrder: product.sort_order ?? 0,
      isActive: product.is_active ?? true,
      names: buildLocalized(trans, "name"),
      descriptions: buildLocalized(
        trans.map((row) => ({ lang: row.lang, label: row.description })),
        "label",
      ),
      contents: buildContents(trans),
      modifiers: modifiersByProduct.get(product.id) ?? [],
    };
  });

  return { categories: adminCategories, products: adminProducts };
}

export async function saveCategory(supabase: SupabaseClient, category: AdminCategory) {
  const { error: catError } = await supabase
    .from("categories")
    .update({
      is_visible: category.isVisible,
      sort_order: category.sortOrder,
      updated_at: new Date().toISOString(),
    })
    .eq("id", category.id);

  if (catError) throw catError;

  const translations = LANG_CODES.map((lang) => ({
    category_id: category.id,
    lang,
    name: category.names[lang] || category.names.tr || category.id,
  }));

  const { error: transError } = await supabase
    .from("category_translations")
    .upsert(translations, { onConflict: "category_id,lang" });

  if (transError) throw transError;

  await logAudit(supabase, {
    entityType: "category",
    entityId: category.id,
    action: "update",
    summary: `Kategori güncellendi: ${category.names.tr || category.id}`,
  });

  await notifyPublicMenuUpdated();
}

export async function createCategory(supabase: SupabaseClient, category: AdminCategory) {
  const { error: catError } = await supabase.from("categories").insert({
    id: category.id,
    slug: category.slug,
    sort_order: category.sortOrder,
    is_visible: category.isVisible,
  });

  if (catError) throw catError;

  const translations = LANG_CODES.map((lang) => ({
    category_id: category.id,
    lang,
    name: category.names[lang] || category.names.tr || category.id,
  }));

  const { error: transError } = await supabase.from("category_translations").insert(translations);

  if (transError) throw transError;

  await logAudit(supabase, {
    entityType: "category",
    entityId: category.id,
    action: "create",
    summary: `Kategori eklendi: ${category.names.tr || category.id}`,
  });

  await notifyPublicMenuUpdated();
}

export async function reorderCategories(supabase: SupabaseClient, categories: AdminCategory[]) {
  const updates = categories.map((category, index) =>
    supabase.from("categories").update({ sort_order: index, updated_at: new Date().toISOString() }).eq("id", category.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  await logAudit(supabase, {
    entityType: "category",
    entityId: "all",
    action: "reorder",
    summary: "Kategori sıralaması güncellendi",
    changes: { order: categories.map((category) => category.id) },
  });

  await notifyPublicMenuUpdated();
}

export async function saveProduct(supabase: SupabaseClient, product: AdminProduct) {
  const { error: prodError } = await supabase
    .from("products")
    .update({
      category_id: product.categoryId,
      price: product.price,
      image_url: product.imageUrl || null,
      sort_order: product.sortOrder,
      is_active: product.isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", product.id);

  if (prodError) throw prodError;

  const translations = LANG_CODES.map((lang) => ({
    product_id: product.id,
    lang,
    name: product.names[lang] || product.names.tr || product.id,
    description: product.descriptions[lang] ?? "",
    contents: product.contents[lang] ?? [],
  }));

  const { error: transError } = await supabase
    .from("product_translations")
    .upsert(translations, { onConflict: "product_id,lang" });

  if (transError) throw transError;

  await syncProductModifiers(supabase, product);

  await logAudit(supabase, {
    entityType: "product",
    entityId: product.id,
    action: "update",
    summary: `Ürün güncellendi: ${product.names.tr || product.id}`,
    changes: { price: product.price, isActive: product.isActive },
  });

  await notifyPublicMenuUpdated();
}

export async function deleteCategory(supabase: SupabaseClient, categoryId: string) {
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw error;

  await logAudit(supabase, {
    entityType: "category",
    entityId: categoryId,
    action: "delete",
    summary: `Kategori silindi: ${categoryId}`,
  });

  await notifyPublicMenuUpdated();
}

export async function deleteProduct(supabase: SupabaseClient, productId: string) {
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw error;

  await logAudit(supabase, {
    entityType: "product",
    entityId: productId,
    action: "delete",
    summary: `Ürün silindi: ${productId}`,
  });

  await notifyPublicMenuUpdated();
}

export async function toggleCategoryVisibility(supabase: SupabaseClient, category: AdminCategory) {
  await saveCategory(supabase, { ...category, isVisible: !category.isVisible });
}

export async function toggleProductActive(supabase: SupabaseClient, product: AdminProduct) {
  await saveProduct(supabase, { ...product, isActive: !product.isActive });
}

export async function syncProductModifiers(supabase: SupabaseClient, product: AdminProduct) {
  const modifierRows = product.modifiers.map((modifier) => ({
    product_id: modifier.productId,
    modifier_id: modifier.modifierId,
    modifier_type: modifier.modifierType,
    price: modifier.price,
    sort_order: modifier.sortOrder,
    is_active: modifier.isActive,
  }));

  if (modifierRows.length > 0) {
    const { error: upsertError } = await supabase
      .from("product_modifiers")
      .upsert(modifierRows, { onConflict: "product_id,modifier_id" });

    if (upsertError) throw upsertError;
  }

  const { data: existing, error: readError } = await supabase
    .from("product_modifiers")
    .select("modifier_id")
    .eq("product_id", product.id);

  if (readError) throw readError;

  const keepIds = new Set(product.modifiers.map((modifier) => modifier.modifierId));
  const toDelete = (existing ?? []).filter((row) => !keepIds.has(row.modifier_id));

  if (toDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_modifiers")
      .delete()
      .eq("product_id", product.id)
      .in(
        "modifier_id",
        toDelete.map((row) => row.modifier_id),
      );

    if (deleteError) throw deleteError;
  }

  for (const modifier of product.modifiers) {
    const fallbackLabel = modifier.labels.tr.trim() || modifier.modifierId;
    const modTranslations = LANG_CODES.map((lang) => ({
      product_id: modifier.productId,
      modifier_id: modifier.modifierId,
      lang,
      label: modifier.labels[lang]?.trim() || modifier.labels.tr?.trim() || fallbackLabel,
    }));

    const { error: modTransError } = await supabase
      .from("product_modifier_translations")
      .upsert(modTranslations, { onConflict: "product_id,modifier_id,lang" });

    if (modTransError) throw modTransError;
  }
}

export async function createProduct(supabase: SupabaseClient, product: AdminProduct) {
  const { error: prodError } = await supabase.from("products").insert({
    id: product.id,
    category_id: product.categoryId,
    price: product.price,
    image_url: product.imageUrl || null,
    sort_order: product.sortOrder,
    is_active: product.isActive,
  });

  if (prodError) throw prodError;

  const translations = LANG_CODES.map((lang) => ({
    product_id: product.id,
    lang,
    name: product.names[lang] || product.names.tr || product.id,
    description: product.descriptions[lang] ?? "",
    contents: product.contents[lang] ?? [],
  }));

  const { error: transError } = await supabase.from("product_translations").insert(translations);

  if (transError) throw transError;

  if (product.modifiers.length > 0) {
    await syncProductModifiers(supabase, product);
  }

  await logAudit(supabase, {
    entityType: "product",
    entityId: product.id,
    action: "create",
    summary: `Ürün eklendi: ${product.names.tr || product.id}`,
    changes: { categoryId: product.categoryId, price: product.price },
  });

  await notifyPublicMenuUpdated();
}

export async function reorderProducts(supabase: SupabaseClient, products: AdminProduct[], categoryId: string) {
  const updates = products.map((product, index) =>
    supabase
      .from("products")
      .update({ sort_order: index, updated_at: new Date().toISOString() })
      .eq("id", product.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);
  if (failed?.error) throw failed.error;

  await logAudit(supabase, {
    entityType: "product",
    entityId: categoryId,
    action: "reorder",
    summary: `Ürün sıralaması güncellendi (${products[0]?.names.tr ?? categoryId})`,
    changes: { order: products.map((product) => product.id) },
  });

  await notifyPublicMenuUpdated();
}

export function slugifyId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Benzersiz kayıt anahtarı — admin arayüzünde gösterilmez. */
export function uniqueSlugId(base: string, existingIds: string[]): string {
  let slug = slugifyId(base);
  if (!slug) slug = `item-${Date.now()}`;
  if (!existingIds.includes(slug)) return slug;
  let suffix = 2;
  while (existingIds.includes(`${slug}-${suffix}`)) suffix += 1;
  return `${slug}-${suffix}`;
}

export function copyLocalizedFromTr(fields: LocalizedFields): LocalizedFields {
  const out = { ...fields };
  for (const lang of LANG_CODES) {
    if (lang !== "tr") out[lang] = fields.tr;
  }
  return out;
}

export function copyContentsFromTr(contents: LocalizedContents): LocalizedContents {
  const out = { ...contents };
  for (const lang of LANG_CODES) {
    if (lang !== "tr") out[lang] = [...contents.tr];
  }
  return out;
}
