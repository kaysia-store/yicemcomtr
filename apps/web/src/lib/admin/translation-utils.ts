import type { LangCode } from "@/lib/menu/types";
import { ADMIN_LANGS } from "./types";
import type { AdminCategory, AdminProduct } from "./types";

export type MissingTranslationItem = {
  id: string;
  type: "category" | "product";
  name: string;
  missingLangs: LangCode[];
};

export function missingLangsForNames(names: Record<LangCode, string>, requireTr = true): LangCode[] {
  const missing: LangCode[] = [];
  if (requireTr && !names.tr?.trim()) missing.push("tr");
  for (const lang of ADMIN_LANGS) {
    if (lang === "tr") continue;
    if (!names[lang]?.trim()) missing.push(lang);
  }
  return missing;
}

export function collectMissingTranslations(
  categories: AdminCategory[],
  products: AdminProduct[],
): MissingTranslationItem[] {
  const items: MissingTranslationItem[] = [];

  for (const category of categories) {
    const missingLangs = missingLangsForNames(category.names);
    if (missingLangs.length > 0) {
      items.push({
        id: category.id,
        type: "category",
        name: category.names.tr || category.id,
        missingLangs,
      });
    }
  }

  for (const product of products) {
    const missingLangs = missingLangsForNames(product.names);
    if (missingLangs.length > 0) {
      items.push({
        id: product.id,
        type: "product",
        name: product.names.tr || product.id,
        missingLangs,
      });
    }
  }

  return items.sort((a, b) => a.name.localeCompare(b.name, "tr"));
}
