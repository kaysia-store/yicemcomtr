import type { LangCode, LocalizedString, MenuCategory, MenuData, MenuProduct, ModifierType, ProductModifier } from "./types";
import { categoryIdToSlug } from "./category-map";

const LANGS: LangCode[] = ["tr", "en", "ru", "de", "fr", "ar"];

type RawAllJson = {
  restaurant?: Partial<LocalizedString>;
  categories?: Array<{
    id: string;
    name?: Partial<LocalizedString>;
    products?: RawProduct[];
  }>;
};

type RawProduct = {
  id: string;
  name?: Partial<LocalizedString>;
  price?: number;
  description?: Partial<LocalizedString>;
  image?: string;
  contents?: Partial<Record<LangCode, string[]>>;
  options?: RawModifier[];
  extras?: Partial<Record<string, RawModifier[]>>;
};

type RawModifier = {
  id: string;
  price?: number;
  label?: Partial<LocalizedString>;
  name?: Partial<LocalizedString>;
};

function toLocalized(obj?: Partial<LocalizedString>): LocalizedString {
  return {
    tr: obj?.tr ?? "",
    en: obj?.en ?? obj?.tr ?? "",
    ru: obj?.ru ?? obj?.en ?? obj?.tr ?? "",
    de: obj?.de ?? obj?.en ?? obj?.tr ?? "",
    fr: obj?.fr ?? obj?.en ?? obj?.tr ?? "",
    ar: obj?.ar ?? obj?.en ?? obj?.tr ?? "",
  };
}

function toContents(obj?: Partial<Record<LangCode, string[]>>): Record<LangCode, string[]> {
  const out = {} as Record<LangCode, string[]>;
  for (const lang of LANGS) {
    out[lang] = Array.isArray(obj?.[lang]) ? obj[lang]! : Array.isArray(obj?.tr) ? obj.tr! : [];
  }
  return out;
}

function mapModifier(raw: RawModifier, type: ModifierType): ProductModifier {
  return {
    id: raw.id,
    type,
    price: raw.price ?? 0,
    label: toLocalized(raw.label ?? raw.name),
  };
}

function mapProduct(raw: RawProduct, categoryId: string, categorySlug: string): MenuProduct {
  const extras = raw.extras ?? {};
  return {
    id: raw.id,
    categoryId,
    categorySlug,
    name: toLocalized(raw.name),
    description: toLocalized(raw.description),
    contents: toContents(raw.contents),
    price: raw.price ?? 0,
    image: (raw.image ?? "").replace(/^\.\//, "/"),
    options: (raw.options ?? []).map((o) => mapModifier(o, "option")),
    extras: {
      mainProducts: (extras.mainProducts ?? []).map((e) => mapModifier(e, "mainProduct")),
      sideProducts: (extras.sideProducts ?? []).map((e) => mapModifier(e, "sideProduct")),
      menuOptions: (extras.menuOptions ?? []).map((e) => mapModifier(e, "menuOption")),
      potatoOptions: (extras.potatoOptions ?? []).map((e) => mapModifier(e, "potatoOption")),
      drinkOptions: (extras.drinkOptions ?? []).map((e) => mapModifier(e, "drinkOption")),
    },
  };
}

export function parseAllJson(raw: RawAllJson): MenuData {
  const categories: MenuCategory[] = [];
  const products: MenuProduct[] = [];

  (raw.categories ?? []).forEach((cat, index) => {
    const slug = categoryIdToSlug(cat.id);
    categories.push({
      id: cat.id,
      slug,
      name: toLocalized(cat.name),
      sortOrder: index,
    });

    for (const p of cat.products ?? []) {
      products.push(mapProduct(p, cat.id, slug));
    }
  });

  return {
    source: "json",
    restaurantName: toLocalized(raw.restaurant as Partial<LocalizedString>),
    categories,
    products,
  };
}
