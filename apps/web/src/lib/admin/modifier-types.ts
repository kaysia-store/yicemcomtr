export const MODIFIER_TYPE_LABELS: Record<string, string> = {
  option: "Boyut / Seçenek",
  mainProduct: "Ana Ürün",
  sideProduct: "Yan Ürün",
  menuOption: "Menü Seçeneği",
  potatoOption: "Patates",
  drinkOption: "İçecek",
};

export const MODIFIER_TYPES = Object.entries(MODIFIER_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));
