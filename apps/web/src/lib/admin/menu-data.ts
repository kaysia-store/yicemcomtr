import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";
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
      .select(
        "product_id, modifier_id, modifier_type, price, sort_order, is_active, product_modifier_translations(lang, label)",
      )
      .order("sort_order"),
  ]);

  if (catError) throw catError;
  if (prodError) throw prodError;
  if (modError) throw modError;

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
    const list = modifiersByProduct.get(modifier.product_id) ?? [];
    list.push({
      productId: modifier.product_id,
      modifierId: modifier.modifier_id,
      modifierType: modifier.modifier_type,
      price: Number(modifier.price),
      sortOrder: modifier.sort_order ?? 0,
      isActive: modifier.is_active ?? true,
      labels: buildLocalized(
        modifier.product_modifier_translations as Array<{ lang: string; label?: string }>,
        "label",
      ),
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
}

export async function saveProduct(supabase: SupabaseClient, product: AdminProduct) {
  const { error: prodError } = await supabase
    .from("products")
    .update({
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

  for (const modifier of product.modifiers) {
    const { error: modError } = await supabase
      .from("product_modifiers")
      .update({
        price: modifier.price,
        sort_order: modifier.sortOrder,
        is_active: modifier.isActive,
      })
      .eq("product_id", modifier.productId)
      .eq("modifier_id", modifier.modifierId);

    if (modError) throw modError;

    const modTranslations = LANG_CODES.map((lang) => ({
      product_id: modifier.productId,
      modifier_id: modifier.modifierId,
      lang,
      label: modifier.labels[lang] || modifier.labels.tr || modifier.modifierId,
    }));

    const { error: modTransError } = await supabase
      .from("product_modifier_translations")
      .upsert(modTranslations, { onConflict: "product_id,modifier_id,lang" });

    if (modTransError) throw modTransError;
  }
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
