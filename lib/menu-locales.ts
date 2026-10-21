export const menuLanguages = [
  { code: "tr", name: "Türkçe", isDefault: true, sortOrder: 0 },
  { code: "en", name: "English", isDefault: false, sortOrder: 1 },
  { code: "ru", name: "Русский", isDefault: false, sortOrder: 2 },
  { code: "de", name: "Deutsch", isDefault: false, sortOrder: 3 },
  { code: "fr", name: "Français", isDefault: false, sortOrder: 4 },
  { code: "ar", name: "العربية", isDefault: false, sortOrder: 5 },
] as const;

export const allergenNames: Record<string, Record<string, string>> = {
  gluten: { tr: "Gluten", en: "Gluten", ru: "Глютен", de: "Gluten", fr: "Gluten", ar: "غلوتين" },
  crustaceans: { tr: "Kabuklular", en: "Crustaceans", ru: "Ракообразные", de: "Krebstiere", fr: "Crustacés", ar: "قشريات" },
  eggs: { tr: "Yumurta", en: "Eggs", ru: "Яйца", de: "Eier", fr: "Œufs", ar: "بيض" },
  fish: { tr: "Balık", en: "Fish", ru: "Рыба", de: "Fisch", fr: "Poisson", ar: "سمك" },
  peanuts: { tr: "Yer fıstığı", en: "Peanuts", ru: "Арахис", de: "Erdnüsse", fr: "Arachides", ar: "فول سوداني" },
  soybeans: { tr: "Soya", en: "Soybeans", ru: "Соя", de: "Soja", fr: "Soja", ar: "صويا" },
  milk: { tr: "Süt", en: "Milk", ru: "Молоко", de: "Milch", fr: "Lait", ar: "حليب" },
  nuts: { tr: "Sert kabuklu meyveler", en: "Nuts", ru: "Орехи", de: "Schalenfrüchte", fr: "Fruits à coque", ar: "مكسرات" },
  celery: { tr: "Kereviz", en: "Celery", ru: "Сельдерей", de: "Sellerie", fr: "Céleri", ar: "كرفس" },
  mustard: { tr: "Hardal", en: "Mustard", ru: "Горчица", de: "Senf", fr: "Moutarde", ar: "خردل" },
  sesame: { tr: "Susam", en: "Sesame", ru: "Кунжут", de: "Sesam", fr: "Sésame", ar: "سمسم" },
  sulphites: { tr: "Sülfitler", en: "Sulphites", ru: "Сульфиты", de: "Sulfite", fr: "Sulfites", ar: "كبريتيت" },
  lupin: { tr: "Acı bakla", en: "Lupin", ru: "Люпин", de: "Lupinen", fr: "Lupin", ar: "ترمس" },
  molluscs: { tr: "Yumuşakçalar", en: "Molluscs", ru: "Моллюски", de: "Weichtiere", fr: "Mollusques", ar: "رخويات" },
};
