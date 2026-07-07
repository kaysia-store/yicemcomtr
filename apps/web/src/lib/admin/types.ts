import type { LangCode } from "@/lib/menu/types";

export const ADMIN_LANGS: LangCode[] = ["tr", "en", "ru", "de", "fr", "ar"];

export const ADMIN_LANG_LABELS: Record<LangCode, string> = {
  tr: "Türkçe",
  en: "English",
  ru: "Русский",
  de: "Deutsch",
  fr: "Français",
  ar: "العربية",
};

export type LocalizedFields = Record<LangCode, string>;

export type LocalizedContents = Record<LangCode, string[]>;

export type AdminCategory = {
  id: string;
  slug: string;
  sortOrder: number;
  isVisible: boolean;
  names: LocalizedFields;
  productCount: number;
};

export type AdminModifier = {
  productId: string;
  modifierId: string;
  modifierType: string;
  price: number;
  sortOrder: number;
  isActive: boolean;
  labels: LocalizedFields;
};

export type AdminProduct = {
  id: string;
  categoryId: string;
  price: number;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  names: LocalizedFields;
  descriptions: LocalizedFields;
  contents: LocalizedContents;
  modifiers: AdminModifier[];
};

export type AdminMenuData = {
  categories: AdminCategory[];
  products: AdminProduct[];
};
