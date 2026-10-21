"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDefaultLocale, nextSortOrder } from "@/lib/admin-data";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { localePattern, readText } from "@/lib/validators";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  previewAddLanguage,
  previewDeleteLanguage,
  previewSaveTranslations,
  previewSetLanguageActive,
} from "@/lib/preview";

export async function addLanguage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewAddLanguage(formData);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const code = readText(formData, "code").toLowerCase();
  const name = readText(formData, "name");
  if (!localePattern.test(code)) {
    return { status: "error", message: "Dil kodu tr veya en-gb biçiminde olmalı." };
  }
  if (name.length < 2 || name.length > 40) {
    return { status: "error", message: "Dil adı 2 ile 40 karakter arasında olmalı." };
  }

  const sortOrder = await nextSortOrder(auth.supabase, "languages");
  const { error } = await auth.supabase.from("languages").insert({
    code,
    name,
    is_default: false,
    is_active: true,
    sort_order: sortOrder,
  });

  if (error) {
    if (error.code === "23505") return { status: "error", message: "Bu dil zaten ekli." };
    return { status: "error", message: "Dil eklenemedi." };
  }

  revalidateMenu();
  redirect(`/admin/languages/${code}`);
}

export async function setLanguageActive(formData: FormData) {
  if (!getSupabaseEnv()) return previewSetLanguageActive(formData);
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const code = readText(formData, "code").toLowerCase();
  if (!localePattern.test(code)) return;
  const isActive = formData.get("active") === "true";
  const { data, error } = await auth.supabase.from("languages").select("is_default").eq("code", code).maybeSingle();
  if (error || !data) return;
  if (data.is_default && !isActive) return;

  const { error: updateError } = await auth.supabase.from("languages").update({ is_active: isActive }).eq("code", code);
  if (!updateError) revalidateMenu();
}

export async function deleteLanguage(code: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewDeleteLanguage(code);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };
  const locale = code.toLowerCase();
  if (!localePattern.test(locale)) return { status: "error", message: "Dil bulunamadı." };

  const { data, error } = await auth.supabase.from("languages").select("is_default").eq("code", locale).maybeSingle();
  if (error || !data) return { status: "error", message: "Dil bulunamadı." };
  if (data.is_default) return { status: "error", message: "Varsayılan dil silinemez." };

  const { error: deleteError } = await auth.supabase.from("languages").delete().eq("code", locale);
  if (deleteError) return { status: "error", message: "Dil silinemedi." };

  revalidateMenu();
  redirect("/admin/languages");
}

export async function saveTranslations(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewSaveTranslations(formData);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const code = readText(formData, "locale").toLowerCase();
  const languageName = readText(formData, "languageName");
  if (!localePattern.test(code)) return { status: "error", message: "Dil kodu geçersiz." };
  if (languageName.length < 2 || languageName.length > 40) {
    return { status: "error", message: "Dil adı 2 ile 40 karakter arasında olmalı." };
  }

  const { data: language, error: languageError } = await auth.supabase
    .from("languages")
    .select("code")
    .eq("code", code)
    .maybeSingle();
  if (languageError || !language) return { status: "error", message: "Dil bulunamadı." };

  const defaultLocale = await getDefaultLocale(auth.supabase);
  const { error: nameError } = await auth.supabase.from("languages").update({ name: languageName }).eq("code", code);
  if (nameError) return { status: "error", message: "Dil adı kaydedilemedi." };

  const { data: categories, error: categoryError } = await auth.supabase.from("categories").select("id");
  if (categoryError) return { status: "error", message: "Kategoriler yüklenemedi." };

  for (const category of (categories ?? []) as { id: string }[]) {
    const name = readText(formData, `category:${category.id}`);
    if (name.length > 80) return { status: "error", message: "Bir kategori adı 80 karakteri aşıyor." };
    if (code === defaultLocale && name.length === 0) {
      return { status: "error", message: "Varsayılan dildeki kategori adları boş bırakılamaz." };
    }
    if (name.length === 0) {
      const { error } = await auth.supabase
        .from("category_translations")
        .delete()
        .eq("category_id", category.id)
        .eq("locale", code);
      if (error) return { status: "error", message: "Kategori çevirisi silinemedi." };
      continue;
    }
    const { error } = await auth.supabase
      .from("category_translations")
      .upsert({ category_id: category.id, locale: code, name });
    if (error) return { status: "error", message: "Kategori çevirisi kaydedilemedi." };
  }

  const { data: products, error: productError } = await auth.supabase.from("products").select("id");
  if (productError) return { status: "error", message: "Ürünler yüklenemedi." };

  for (const product of (products ?? []) as { id: string }[]) {
    const name = readText(formData, `product:${product.id}:name`);
    const description = readText(formData, `product:${product.id}:description`);
    const ingredients = readText(formData, `product:${product.id}:ingredients`);
    if (name.length > 120) return { status: "error", message: "Bir ürün adı 120 karakteri aşıyor." };
    if (description.length > 2000 || ingredients.length > 2000) {
      return { status: "error", message: "Açıklama ve içindekiler 2000 karakteri aşamaz." };
    }
    if (code === defaultLocale && name.length === 0) {
      return { status: "error", message: "Varsayılan dildeki ürün adları boş bırakılamaz." };
    }
    if (name.length === 0) {
      const { error } = await auth.supabase
        .from("product_translations")
        .delete()
        .eq("product_id", product.id)
        .eq("locale", code);
      if (error) return { status: "error", message: "Ürün çevirisi silinemedi." };
      continue;
    }
    const { error } = await auth.supabase.from("product_translations").upsert({
      product_id: product.id,
      locale: code,
      name,
      description,
      ingredients,
    });
    if (error) return { status: "error", message: "Ürün çevirisi kaydedilemedi." };
  }

  const { data: allergens, error: allergenError } = await auth.supabase.from("allergens").select("code");
  if (allergenError) return { status: "error", message: "Alerjenler yüklenemedi." };

  for (const allergen of (allergens ?? []) as { code: string }[]) {
    const name = readText(formData, `allergen:${allergen.code}`);
    if (name.length > 80) return { status: "error", message: "Bir alerjen adı 80 karakteri aşıyor." };
    if (code === defaultLocale && name.length === 0) {
      return { status: "error", message: "Varsayılan dildeki alerjen adları boş bırakılamaz." };
    }
    if (name.length === 0) {
      const { error } = await auth.supabase
        .from("allergen_translations")
        .delete()
        .eq("allergen_code", allergen.code)
        .eq("locale", code);
      if (error) return { status: "error", message: "Alerjen çevirisi silinemedi." };
      continue;
    }
    const { error } = await auth.supabase
      .from("allergen_translations")
      .upsert({ allergen_code: allergen.code, locale: code, name });
    if (error) return { status: "error", message: "Alerjen çevirisi kaydedilemedi." };
  }

  const { data: features, error: featureError } = await auth.supabase.from("category_features").select("id");
  if (featureError) return { status: "error", message: "Özellikler yüklenemedi." };
  for (const feature of (features ?? []) as { id: string }[]) {
    const name = readText(formData, `feature:${feature.id}`);
    if (name.length > 80) return { status: "error", message: "Bir özellik adı 80 karakteri aşıyor." };
    if (code === defaultLocale && name.length === 0) {
      return { status: "error", message: "Varsayılan dildeki özellik adları boş bırakılamaz." };
    }
    if (name.length === 0) {
      const { error } = await auth.supabase
        .from("category_feature_translations")
        .delete()
        .eq("feature_id", feature.id)
        .eq("locale", code);
      if (error) return { status: "error", message: "Özellik çevirisi silinemedi." };
      continue;
    }
    const { error } = await auth.supabase
      .from("category_feature_translations")
      .upsert({ feature_id: feature.id, locale: code, name });
    if (error) return { status: "error", message: "Özellik çevirisi kaydedilemedi." };
  }

  const { data: options, error: optionError } = await auth.supabase.from("product_options").select("id");
  if (optionError) return { status: "error", message: "Seçenekler yüklenemedi." };
  for (const option of (options ?? []) as { id: string }[]) {
    const name = readText(formData, `option:${option.id}`);
    if (name.length > 80) return { status: "error", message: "Bir seçenek adı 80 karakteri aşıyor." };
    if (code === defaultLocale && name.length === 0) {
      return { status: "error", message: "Varsayılan dildeki seçenek adları boş bırakılamaz." };
    }
    if (name.length === 0) {
      const { error } = await auth.supabase
        .from("product_option_translations")
        .delete()
        .eq("option_id", option.id)
        .eq("locale", code);
      if (error) return { status: "error", message: "Seçenek çevirisi silinemedi." };
      continue;
    }
    const { error } = await auth.supabase
      .from("product_option_translations")
      .upsert({ option_id: option.id, locale: code, name });
    if (error) return { status: "error", message: "Seçenek çevirisi kaydedilemedi." };
  }

  revalidateMenu();
  redirect(`/admin/languages/${code}?saved=1`);
}
