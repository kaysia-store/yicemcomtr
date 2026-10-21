"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDefaultLocale, nextSortOrder } from "@/lib/admin-data";
import { readFeatureDrafts } from "@/lib/features";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { readText, uuidPattern } from "@/lib/validators";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  previewDeleteCategory,
  previewMoveCategory,
  previewSaveCategory,
  previewToggleCategory,
} from "@/lib/preview";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { FeatureDraft } from "@/lib/features";

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewSaveCategory(formData);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const id = readText(formData, "id");
  const name = readText(formData, "name");
  const isPublished = formData.get("isPublished") === "true";

  if (id && !uuidPattern.test(id)) return { status: "error", message: "Kategori bulunamadı." };
  if (name.length < 1 || name.length > 80) {
    return { status: "error", message: "Kategori adı 1 ile 80 karakter arasında olmalı." };
  }
  const featureResult = readFeatureDrafts(typeof formData.get("featuresJson") === "string" ? String(formData.get("featuresJson")) : "[]");
  if (!featureResult.ok) return { status: "error", message: featureResult.message };

  const locale = await getDefaultLocale(auth.supabase);
  let categoryId = id;

  if (!id) {
    const sortOrder = await nextSortOrder(auth.supabase, "categories");
    const { data, error } = await auth.supabase
      .from("categories")
      .insert({ sort_order: sortOrder, is_published: isPublished })
      .select("id")
      .single();
    if (error || !data) return { status: "error", message: "Kategori eklenemedi." };
    categoryId = data.id;

    const { error: translationError } = await auth.supabase
      .from("category_translations")
      .insert({ category_id: data.id, locale, name });
    if (translationError) return { status: "error", message: "Kategori adı kaydedilemedi." };
  } else {
    const { error } = await auth.supabase.from("categories").update({ is_published: isPublished }).eq("id", id);
    if (error) return { status: "error", message: "Kategori güncellenemedi." };

    const { error: translationError } = await auth.supabase
      .from("category_translations")
      .upsert({ category_id: id, locale, name });
    if (translationError) return { status: "error", message: "Kategori adı kaydedilemedi." };
  }

  const featureError = await syncCategoryFeatures(auth.supabase, categoryId, locale, featureResult.features);
  if (featureError) return { status: "error", message: featureError };

  revalidateMenu();
  redirect("/admin/categories");
}

async function syncCategoryFeatures(
  supabase: SupabaseClient,
  categoryId: string,
  locale: string,
  drafts: FeatureDraft[],
) {
  const { data, error } = await supabase.from("category_features").select("id").eq("category_id", categoryId);
  if (error) return "Özellikler yüklenemedi.";
  const existing = new Set(((data ?? []) as { id: string }[]).map((row) => row.id));
  const kept = new Set<string>();

  for (let index = 0; index < drafts.length; index += 1) {
    const draft = drafts[index];
    const featureId = draft.id && existing.has(draft.id) ? draft.id : randomUUID();
    kept.add(featureId);
    const { error: featureError } = await supabase.from("category_features").upsert({
      id: featureId,
      category_id: categoryId,
      selection: draft.selection,
      is_required: draft.required,
      sort_order: index,
    });
    if (featureError) return "Özellik kaydedilemedi.";
    const { error: nameError } = await supabase.from("category_feature_translations").upsert({
      feature_id: featureId,
      locale,
      name: draft.name,
    });
    if (nameError) return "Özellik adı kaydedilemedi.";
  }

  const removed = [...existing].filter((featureId) => !kept.has(featureId));
  if (removed.length > 0) {
    const { error: deleteError } = await supabase.from("category_features").delete().in("id", removed);
    if (deleteError) return "Özellik silinemedi.";
  }
  return null;
}

export async function moveCategory(formData: FormData) {
  if (!getSupabaseEnv()) return previewMoveCategory(formData);
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const id = readText(formData, "id");
  if (!uuidPattern.test(id)) return;
  const direction = formData.get("direction") === "down" ? "down" : "up";
  const { data, error } = await auth.supabase.from("categories").select("id, sort_order").order("sort_order");
  if (error || !data) return;

  const rows = data as { id: string; sort_order: number }[];
  const index = rows.findIndex((row) => row.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return;

  const next = rows.slice();
  const [item] = next.splice(index, 1);
  next.splice(target, 0, item);
  await Promise.all(
    next.map((row, sortOrder) => auth.supabase.from("categories").update({ sort_order: sortOrder }).eq("id", row.id)),
  );
  revalidateMenu();
}

export async function toggleCategoryPublished(formData: FormData) {
  if (!getSupabaseEnv()) return previewToggleCategory(formData);
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const id = readText(formData, "id");
  if (!uuidPattern.test(id)) return;
  const { error } = await auth.supabase
    .from("categories")
    .update({ is_published: formData.get("published") === "true" })
    .eq("id", id);
  if (!error) revalidateMenu();
}

export async function deleteCategory(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewDeleteCategory(id);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };
  if (!uuidPattern.test(id)) return { status: "error", message: "Kategori bulunamadı." };

  const { count, error: countError } = await auth.supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
  if (countError) return { status: "error", message: "Kategori silinemedi." };
  if ((count ?? 0) > 0) {
    return {
      status: "error",
      message: "Bu kategoride ürün var. Önce ürünleri silin veya başka kategoriye taşıyın.",
    };
  }

  const { error } = await auth.supabase.from("categories").delete().eq("id", id);
  if (error) return { status: "error", message: "Kategori silinemedi." };

  revalidateMenu();
  redirect("/admin/categories");
}
