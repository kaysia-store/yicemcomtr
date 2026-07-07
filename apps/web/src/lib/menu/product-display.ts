import type { LangCode, LocalizedString, MenuProduct, ProductModifier } from "./types";
import { tLocalized } from "./i18n";

export type ModifierGroup = {
  key: string;
  title: string;
  inputType: "radio" | "checkbox";
  items: ProductModifier[];
};

const GROUP_LABELS: Record<string, LocalizedString> = {
  size: {
    tr: "Boyut",
    en: "Size",
    de: "Größe",
    ru: "Размер",
    fr: "Taille",
    ar: "الحجم",
  },
  option: {
    tr: "Seçenek",
    en: "Option",
    de: "Option",
    ru: "Опция",
    fr: "Option",
    ar: "خيار",
  },
  mainProducts: {
    tr: "Ana Ürünler (2 seçim)",
    en: "Main Products (choose 2)",
    de: "Hauptprodukte (2 auswählen)",
    ru: "Основные продукты (выбрать 2)",
    fr: "Produits principaux (choisir 2)",
    ar: "المنتجات الرئيسية (اختياران)",
  },
  sideProducts: {
    tr: "Yan Ürünler (4 seçim)",
    en: "Side Products (choose 4)",
    de: "Beilagen (4 auswählen)",
    ru: "Гарниры (выбрать 4)",
    fr: "Accompagnements (choisir 4)",
    ar: "المنتجات الجانبية (4 اختيارات)",
  },
  menuOptions: {
    tr: "Menü Seçenekleri",
    en: "Menu Options",
    de: "Menü-Optionen",
    ru: "Варианты меню",
    fr: "Options de Menu",
    ar: "خيارات القائمة",
  },
  potatoOptions: {
    tr: "Patates Seçenekleri",
    en: "Potato Options",
    de: "Kartoffel-Optionen",
    ru: "Варианты картофеля",
    fr: "Options de Pommes",
    ar: "خيارات البطاطس",
  },
  drinkOptions: {
    tr: "İçecek Seçenekleri",
    en: "Drink Options",
    de: "Getränkeoptionen",
    ru: "Варианты напитков",
    fr: "Options de Boisson",
    ar: "خيارات المشروبات",
  },
};

export function getProductDescription(product: MenuProduct, lang: LangCode): string {
  const donerCategories = ["tavuk-doner", "et-doner"];
  if (donerCategories.includes(product.categorySlug)) {
    return tLocalized(product.description, lang);
  }

  const contents = product.contents[lang];
  if (contents.length > 0) {
    return contents.join(", ");
  }

  const description = tLocalized(product.description, lang);
  if (description) return description;

  const fallbackContents = product.contents.tr;
  if (fallbackContents.length > 0) {
    return fallbackContents.join(", ");
  }

  return "";
}

export function getProductContents(product: MenuProduct, lang: LangCode): string[] {
  const contents = product.contents[lang];
  if (contents.length > 0) return contents;
  return product.contents.tr;
}

export function getProductModifierGroups(product: MenuProduct, lang: LangCode): ModifierGroup[] {
  const groups: ModifierGroup[] = [];

  if (product.options.length > 0) {
    const sizeKey = product.id === "d6" ? "option" : "size";
    groups.push({
      key: sizeKey,
      title: tLocalized(GROUP_LABELS[sizeKey], lang),
      inputType: "radio",
      items: product.options,
    });
  }

  const extraMap: Array<{ key: keyof MenuProduct["extras"]; labelKey: string }> = [
    { key: "mainProducts", labelKey: "mainProducts" },
    { key: "sideProducts", labelKey: "sideProducts" },
    { key: "menuOptions", labelKey: "menuOptions" },
    { key: "potatoOptions", labelKey: "potatoOptions" },
    { key: "drinkOptions", labelKey: "drinkOptions" },
  ];

  for (const { key, labelKey } of extraMap) {
    const items = product.extras[key];
    if (items.length > 0) {
      groups.push({
        key: labelKey,
        title: tLocalized(GROUP_LABELS[labelKey], lang),
        inputType: "checkbox",
        items,
      });
    }
  }

  return groups;
}

export function formatModifierPrice(price: number): string | null {
  if (!price) return null;
  return `+₺${price}`;
}
