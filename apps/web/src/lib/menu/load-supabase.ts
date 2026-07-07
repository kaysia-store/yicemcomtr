import "server-only";
import { createClient } from "@supabase/supabase-js";
import type { LangCode, LocalizedString, MenuCategory, MenuData, MenuProduct, ModifierType, ProductModifier } from "./types";
import { categoryIdToSlug } from "./category-map";

const LANGS: LangCode[] = ["tr", "en", "ru", "de", "fr", "ar"];

function emptyLocalized(): LocalizedString {
  return { tr: "", en: "", ru: "", de: "", fr: "", ar: "" };
}

function normalizeImageUrl(url: string | null | undefined): string {
  if (!url?.trim()) return "/favicon.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return url.replace(/^\.\//, "/");
}

function buildLocalized(
  rows: Array<{ lang: string; value: string }>,
  field: "name" | "label" = "name",
): LocalizedString {
  const out = emptyLocalized();
  for (const row of rows) {
    if (LANGS.includes(row.lang as LangCode)) {
      out[row.lang as LangCode] = row.value;
    }
  }
  return out;
}

export async function loadMenuFromSupabase(): Promise<MenuData | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });

  const [
    { data: categories, error: catErr },
    { data: catTrans },
    { data: products, error: prodErr },
    { data: prodTrans },
    { data: modifiers },
    { data: modTrans },
    { data: settings },
  ] = await Promise.all([
    supabase.from("categories").select("*").eq("is_visible", true).order("sort_order"),
    supabase.from("category_translations").select("*"),
    supabase.from("products").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("product_translations").select("*"),
    supabase.from("product_modifiers").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("product_modifier_translations").select("*"),
    supabase.from("site_settings").select("value").eq("key", "restaurant").maybeSingle(),
  ]);

  if (catErr || prodErr) {
    console.warn("Supabase menü yüklenemedi:", catErr?.message ?? prodErr?.message);
    return null;
  }

  if (!categories?.length) {
    console.warn("Supabase menü yüklenemedi: kategori bulunamadı.");
    return null;
  }

  const catTransMap = new Map<string, Array<{ lang: string; value: string }>>();
  for (const t of catTrans ?? []) {
    const list = catTransMap.get(t.category_id) ?? [];
    list.push({ lang: t.lang, value: t.name });
    catTransMap.set(t.category_id, list);
  }

  const prodTransMap = new Map<string, typeof prodTrans>();
  for (const t of prodTrans ?? []) {
    const list = prodTransMap.get(t.product_id) ?? [];
    list.push(t);
    prodTransMap.set(t.product_id, list);
  }

  const modTransMap = new Map<string, Array<{ lang: string; value: string }>>();
  for (const t of modTrans ?? []) {
    const key = `${t.product_id}::${t.modifier_id}`;
    const list = modTransMap.get(key) ?? [];
    list.push({ lang: t.lang, value: t.label });
    modTransMap.set(key, list);
  }

  const menuCategories: MenuCategory[] = categories.map((c, i) => ({
    id: c.id,
    slug: c.slug ?? categoryIdToSlug(c.id),
    name: buildLocalized(catTransMap.get(c.id) ?? [], "name"),
    sortOrder: c.sort_order ?? i,
  }));

  const menuProducts: MenuProduct[] = (products ?? []).map((p) => {
    const trans = prodTransMap.get(p.id) ?? [];
    const name = emptyLocalized();
    const description = emptyLocalized();
    const contents = {} as Record<LangCode, string[]>;

    for (const t of trans) {
      if (LANGS.includes(t.lang as LangCode)) {
        name[t.lang as LangCode] = t.name;
        description[t.lang as LangCode] = t.description ?? "";
        contents[t.lang as LangCode] = Array.isArray(t.contents) ? t.contents : [];
      }
    }

    const productMods = (modifiers ?? []).filter((m) => m.product_id === p.id);
    const mapMod = (m: (typeof productMods)[0]): ProductModifier => ({
      id: m.modifier_id,
      type: m.modifier_type as ModifierType,
      price: Number(m.price),
      label: buildLocalized(modTransMap.get(`${m.product_id}::${m.modifier_id}`) ?? [], "label"),
    });

    const options = productMods.filter((m) => m.modifier_type === "option").map(mapMod);
    const byType = (type: ModifierType) => productMods.filter((m) => m.modifier_type === type).map(mapMod);

    const cat = categories.find((c) => c.id === p.category_id);

    return {
      id: p.id,
      categoryId: p.category_id,
      categorySlug: cat?.slug ?? categoryIdToSlug(p.category_id),
      name,
      description,
      contents,
      price: Number(p.price),
      image: normalizeImageUrl(p.image_url),
      options,
      extras: {
        mainProducts: byType("mainProduct"),
        sideProducts: byType("sideProduct"),
        menuOptions: byType("menuOption"),
        potatoOptions: byType("potatoOption"),
        drinkOptions: byType("drinkOption"),
      },
    };
  });

  const restaurantRaw = settings?.value as Partial<LocalizedString> | undefined;

  return {
    source: "supabase",
    restaurantName: {
      tr: restaurantRaw?.tr ?? "Yi'Cem Restoran",
      en: restaurantRaw?.en ?? "Yi'Cem Restaurant",
      ru: restaurantRaw?.ru ?? "",
      de: restaurantRaw?.de ?? "",
      fr: restaurantRaw?.fr ?? "",
      ar: restaurantRaw?.ar ?? "",
    },
    categories: menuCategories,
    products: menuProducts,
  };
}
