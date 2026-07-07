export const CATEGORY_SLUG_MAP: Record<string, string> = {
  pizza: "pizzalar",
  toast: "ayvalik-tostu",
  sandwich: "soguk-sandvic",
  "chicken-doner": "tavuk-doner",
  "beef-doner": "et-doner",
  pasta: "makarnalar",
  manti: "manti",
  hamburger: "hamburger",
  kofte: "kofte-spesiyel",
  aperatifler: "aperatifler",
  bistro: "bistro",
  salad: "salata",
  drinks: "icecekler",
};

export function categoryIdToSlug(id: string): string {
  return CATEGORY_SLUG_MAP[id] ?? id;
}
