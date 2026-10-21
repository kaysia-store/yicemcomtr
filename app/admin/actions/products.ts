"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDefaultLocale, nextSortOrder } from "@/lib/admin-data";
import { readOptionDrafts, type OptionDraft } from "@/lib/features";
import { removeProductImages, uploadProductImage } from "@/lib/images";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { readPrice, readText, uuidPattern } from "@/lib/validators";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  previewDeleteProduct,
  previewMoveProduct,
  previewSaveProduct,
  previewToggleProduct,
} from "@/lib/preview";

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewSaveProduct(formData);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const existingId = readText(formData, "id");
  const categoryId = readText(formData, "categoryId");
  const name = readText(formData, "name");
  const description = readText(formData, "description");
  const ingredients = readText(formData, "ingredients");
  const priceResult = readPrice(readText(formData, "price"));
  const isPublished = formData.get("isPublished") === "true";
  const removeImage = formData.get("removeImage") === "true";

  if (existingId && !uuidPattern.test(existingId)) return { status: "error", message: "Ürün bulunamadı." };
  if (!uuidPattern.test(categoryId)) return { status: "error", message: "Kategori seçin." };
  if (name.length < 1 || name.length > 120) {
    return { status: "error", message: "Ürün adı 1 ile 120 karakter arasında olmalı." };
  }
  if (description.length > 2000 || ingredients.length > 2000) {
    return { status: "error", message: "Açıklama ve içindekiler 2000 karakteri aşamaz." };
  }
  if (!priceResult.ok) return { status: "error", message: priceResult.message };

  const { data: category, error: categoryError } = await auth.supabase
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();
  if (categoryError || !category) return { status: "error", message: "Kategori seçin." };

  const { data: allergenRows, error: allergenError } = await auth.supabase.from("allergens").select("code");
  if (allergenError) return { status: "error", message: "Alerjenler yüklenemedi." };
  const allowed = new Set(((allergenRows ?? []) as { code: string }[]).map((row) => row.code));
  const allergenCodes = formData
    .getAll("allergens")
    .map(String)
    .filter((code) => allowed.has(code));

  const locale = await getDefaultLocale(auth.supabase);
  const id = existingId || randomUUID();
  let imagePath: string | null = null;
  let sortOrder = 0;

  if (existingId) {
    const { data: current, error } = await auth.supabase
      .from("products")
      .select("image_path, sort_order, category_id")
      .eq("id", existingId)
      .maybeSingle();
    if (error || !current) return { status: "error", message: "Ürün bulunamadı." };
    imagePath = current.image_path as string | null;
    sortOrder = current.sort_order as number;
    if (current.category_id !== categoryId) {
      sortOrder = await nextSortOrder(auth.supabase, "products", categoryId);
    }
  } else {
    sortOrder = await nextSortOrder(auth.supabase, "products", categoryId);
  }

  const file = formData.get("image");
  const hasFile = file instanceof File && file.size > 0;
  if (removeImage && !hasFile) {
    await removeProductImages(auth.supabase, id);
    imagePath = null;
  }
  if (hasFile) {
    const uploaded = await uploadProductImage(auth.supabase, id, file);
    if (!uploaded.ok) return uploaded.message ? { status: "error", message: uploaded.message } : { status: "error", message: "Görsel yüklenemedi." };
    imagePath = uploaded.path;
  }

  const payload = {
    category_id: categoryId,
    price: priceResult.price,
    image_path: imagePath,
    sort_order: sortOrder,
    is_published: isPublished,
  };

  if (!existingId) {
    const { error } = await auth.supabase.from("products").insert({ id, ...payload });
    if (error) {
      await removeProductImages(auth.supabase, id);
      return { status: "error", message: "Ürün eklenemedi." };
    }
  } else {
    const { error } = await auth.supabase.from("products").update(payload).eq("id", id);
    if (error) return { status: "error", message: "Ürün güncellenemedi." };
  }

  const { error: translationError } = await auth.supabase
    .from("product_translations")
    .upsert({ product_id: id, locale, name, description, ingredients });
  if (translationError) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent("Ürün kaydedildi ama metin yazılamadı.")}`);
  }

  const { error: clearError } = await auth.supabase.from("product_allergens").delete().eq("product_id", id);
  if (clearError) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent("Ürün kaydedildi ama alerjenler yazılamadı.")}`);
  }
  if (allergenCodes.length > 0) {
    const { error: linkError } = await auth.supabase
      .from("product_allergens")
      .insert(allergenCodes.map((code) => ({ product_id: id, allergen_code: code })));
    if (linkError) {
      redirect(`/admin/products/${id}?error=${encodeURIComponent("Ürün kaydedildi ama alerjenler yazılamadı.")}`);
    }
  }

  const { data: featureRows, error: featureError } = await auth.supabase
    .from("category_features")
    .select("id, selection, is_required")
    .eq("category_id", categoryId);
  if (featureError) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent("Ürün kaydedildi ama özellikler yüklenemedi.")}`);
  }
  const optionResult = readOptionDrafts(
    typeof formData.get("optionsJson") === "string" ? String(formData.get("optionsJson")) : "[]",
    ((featureRows ?? []) as { id: string; selection: "single" | "multiple"; is_required: boolean }[]).map((feature) => ({
      id: feature.id,
      selection: feature.selection === "multiple" ? "multiple" : "single",
      required: feature.is_required,
    })),
  );
  if (!optionResult.ok) return { status: "error", message: optionResult.message };
  const optionError = await syncProductOptions(auth.supabase, id, locale, optionResult.options);
  if (optionError) {
    redirect(`/admin/products/${id}?error=${encodeURIComponent(optionError)}`);
  }

  revalidateMenu();
  redirect("/admin/products");
}

async function syncProductOptions(supabase: SupabaseClient, productId: string, locale: string, drafts: OptionDraft[]) {
  const { data, error } = await supabase.from("product_options").select("id").eq("product_id", productId);
  if (error) return "Seçenekler yüklenemedi.";
  const existing = new Set(((data ?? []) as { id: string }[]).map((row) => row.id));
  const kept = new Set<string>();
  const sortByFeature = new Map<string, number>();

  for (const draft of drafts) {
    const optionId = draft.id && existing.has(draft.id) ? draft.id : randomUUID();
    const sortOrder = sortByFeature.get(draft.featureId) ?? 0;
    sortByFeature.set(draft.featureId, sortOrder + 1);
    kept.add(optionId);
    const { error: optionError } = await supabase.from("product_options").upsert({
      id: optionId,
      product_id: productId,
      feature_id: draft.featureId,
      price_delta: draft.priceDelta,
      is_default: draft.isDefault,
      sort_order: sortOrder,
    });
    if (optionError) return "Seçenek kaydedilemedi.";
    const { error: nameError } = await supabase.from("product_option_translations").upsert({
      option_id: optionId,
      locale,
      name: draft.name,
    });
    if (nameError) return "Seçenek adı kaydedilemedi.";
  }

  const removed = [...existing].filter((optionId) => !kept.has(optionId));
  if (removed.length > 0) {
    const { error: deleteError } = await supabase.from("product_options").delete().in("id", removed);
    if (deleteError) return "Seçenek silinemedi.";
  }
  return null;
}

export async function moveProduct(formData: FormData) {
  if (!getSupabaseEnv()) return previewMoveProduct(formData);
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const id = readText(formData, "id");
  const categoryId = readText(formData, "categoryId");
  if (!uuidPattern.test(id) || !uuidPattern.test(categoryId)) return;
  const direction = formData.get("direction") === "down" ? "down" : "up";
  const { data, error } = await auth.supabase
    .from("products")
    .select("id, sort_order")
    .eq("category_id", categoryId)
    .order("sort_order");
  if (error || !data) return;

  const rows = data as { id: string; sort_order: number }[];
  const index = rows.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;

  const next = rows.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  await Promise.all(
    next.map((row, sortOrder) => auth.supabase.from("products").update({ sort_order: sortOrder }).eq("id", row.id)),
  );
  revalidateMenu();
}

export async function toggleProductPublished(formData: FormData) {
  if (!getSupabaseEnv()) return previewToggleProduct(formData);
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const id = readText(formData, "id");
  if (!uuidPattern.test(id)) return;
  const { error } = await auth.supabase
    .from("products")
    .update({ is_published: formData.get("published") === "true" })
    .eq("id", id);
  if (!error) revalidateMenu();
}

export async function deleteProduct(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewDeleteProduct(id);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };
  if (!uuidPattern.test(id)) return { status: "error", message: "Ürün bulunamadı." };

  const { error } = await auth.supabase.from("products").delete().eq("id", id);
  if (error) return { status: "error", message: "Ürün silinemedi." };
  await removeProductImages(auth.supabase, id);
  revalidateMenu();
  redirect("/admin/products");
}
