export const LANG_CODES = ["tr", "en", "ru", "de", "fr", "ar"] as const;
export type LangCode = (typeof LANG_CODES)[number];

export type ModifierType =
  | "option"
  | "mainProduct"
  | "sideProduct"
  | "menuOption"
  | "potatoOption"
  | "drinkOption";

export interface LocalizedString {
  tr: string;
  en: string;
  ru: string;
  de: string;
  fr: string;
  ar: string;
}

export interface ProductModifier {
  id: string;
  type: ModifierType;
  price: number;
  label: LocalizedString;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: LocalizedString;
  sortOrder: number;
}

export interface MenuProduct {
  id: string;
  categoryId: string;
  categorySlug: string;
  name: LocalizedString;
  description: LocalizedString;
  contents: Record<LangCode, string[]>;
  price: number;
  image: string;
  options: ProductModifier[];
  extras: {
    mainProducts: ProductModifier[];
    sideProducts: ProductModifier[];
    menuOptions: ProductModifier[];
    potatoOptions: ProductModifier[];
    drinkOptions: ProductModifier[];
  };
}

export interface MenuData {
  source: "supabase" | "json";
  restaurantName: LocalizedString;
  categories: MenuCategory[];
  products: MenuProduct[];
}
