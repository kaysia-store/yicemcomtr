import { logAudit } from "./audit";
import { MODIFIER_TYPE_LABELS } from "./modifier-types";
import { syncProductModifiers } from "./menu-data";
import { notifyPublicMenuUpdated } from "./revalidate-public-menu";
import type { AdminModifier, AdminProduct } from "./types";
import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type ModifierTemplateItem = {
  modifierId: string;
  modifierType: string;
  price: number;
  sortOrder: number;
  isActive: boolean;
  labels: AdminModifier["labels"];
  productCount: number;
  totalProducts: number;
  priceVariance?: { min: number; max: number };
};

export type ProductModifierSyncStatus = {
  productId: string;
  productName: string;
  status: "synced" | "missing" | "different";
  missingCount: number;
  differentCount: number;
};

export type ModifierPriceGroup = {
  categoryId: string;
  categoryName: string;
  modifierType: string;
  modifierTypeLabel: string;
  modifierId: string;
  label: string;
  price: number;
  productCount: number;
  totalProducts: number;
  priceVariance?: { min: number; max: number };
};

function modifierKey(modifierType: string, modifierId: string) {
  return `${modifierType}::${modifierId}`;
}

function pickCanonicalModifier(mods: AdminModifier[]): AdminModifier {
  return mods.reduce((best, mod) => {
    const bestScore = (best.labels.tr?.trim().length ?? 0) + (best.isActive ? 1 : 0);
    const modScore = (mod.labels.tr?.trim().length ?? 0) + (mod.isActive ? 1 : 0);
    return modScore > bestScore ? mod : best;
  }, mods[0]);
}

export function getCategoryProducts(categoryId: string, products: AdminProduct[]) {
  return products.filter((product) => product.categoryId === categoryId);
}

export function buildCategoryModifierTemplate(
  categoryId: string,
  products: AdminProduct[],
): ModifierTemplateItem[] {
  const categoryProducts = getCategoryProducts(categoryId, products);
  const totalProducts = categoryProducts.length;
  const grouped = new Map<string, AdminModifier[]>();

  for (const product of categoryProducts) {
    for (const modifier of product.modifiers) {
      const key = modifierKey(modifier.modifierType, modifier.modifierId);
      const list = grouped.get(key) ?? [];
      list.push(modifier);
      grouped.set(key, list);
    }
  }

  const items: ModifierTemplateItem[] = [];
  for (const [, mods] of grouped) {
    const canonical = pickCanonicalModifier(mods);
    const prices = mods.map((mod) => mod.price);
    const uniquePrices = [...new Set(prices)];

    items.push({
      modifierId: canonical.modifierId,
      modifierType: canonical.modifierType,
      price: uniquePrices.length === 1 ? uniquePrices[0] : prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)],
      sortOrder: canonical.sortOrder,
      isActive: canonical.isActive,
      labels: { ...canonical.labels },
      productCount: mods.length,
      totalProducts,
      priceVariance:
        uniquePrices.length > 1
          ? { min: Math.min(...prices), max: Math.max(...prices) }
          : undefined,
    });
  }

  return items.sort(
    (a, b) =>
      a.modifierType.localeCompare(b.modifierType) ||
      a.sortOrder - b.sortOrder ||
      a.labels.tr.localeCompare(b.labels.tr, "tr"),
  );
}

export function buildModifierPriceGroups(
  categories: Array<{ id: string; names: { tr: string } }>,
  products: AdminProduct[],
  getCategoryName: (id: string) => string,
): ModifierPriceGroup[] {
  const groups: ModifierPriceGroup[] = [];

  for (const category of categories) {
    const template = buildCategoryModifierTemplate(category.id, products);
    for (const item of template) {
      groups.push({
        categoryId: category.id,
        categoryName: getCategoryName(category.id) || category.names.tr,
        modifierType: item.modifierType,
        modifierTypeLabel: MODIFIER_TYPE_LABELS[item.modifierType] ?? item.modifierType,
        modifierId: item.modifierId,
        label: item.labels.tr || item.modifierId,
        price: item.price,
        productCount: item.productCount,
        totalProducts: item.totalProducts,
        priceVariance: item.priceVariance,
      });
    }
  }

  return groups;
}

export function getProductSyncStatuses(
  categoryId: string,
  products: AdminProduct[],
  template: ModifierTemplateItem[],
): ProductModifierSyncStatus[] {
  const categoryProducts = getCategoryProducts(categoryId, products);

  return categoryProducts.map((product) => {
    let missingCount = 0;
    let differentCount = 0;

    for (const item of template) {
      const modifier = product.modifiers.find(
        (mod) => mod.modifierType === item.modifierType && mod.modifierId === item.modifierId,
      );
      if (!modifier) {
        missingCount += 1;
        continue;
      }
      if (
        modifier.price !== item.price ||
        modifier.isActive !== item.isActive ||
        modifier.sortOrder !== item.sortOrder ||
        modifier.labels.tr.trim() !== item.labels.tr.trim()
      ) {
        differentCount += 1;
      }
    }

    const status: ProductModifierSyncStatus["status"] =
      missingCount > 0 ? "missing" : differentCount > 0 ? "different" : "synced";

    return {
      productId: product.id,
      productName: product.names.tr || product.id,
      status,
      missingCount,
      differentCount,
    };
  });
}

export async function applyCategoryModifierTemplate(
  supabase: SupabaseClient,
  categoryId: string,
  template: ModifierTemplateItem[],
  products: AdminProduct[],
  categoryName: string,
) {
  const categoryProducts = getCategoryProducts(categoryId, products);

  for (const product of categoryProducts) {
    const nextModifiers = [...product.modifiers];

    for (const item of template) {
      const index = nextModifiers.findIndex(
        (mod) => mod.modifierType === item.modifierType && mod.modifierId === item.modifierId,
      );
      const payload: AdminModifier = {
        productId: product.id,
        modifierId: item.modifierId,
        modifierType: item.modifierType,
        price: item.price,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        labels: { ...item.labels },
      };

      if (index >= 0) nextModifiers[index] = payload;
      else nextModifiers.push(payload);
    }

    await syncProductModifiers(supabase, { ...product, modifiers: nextModifiers });
  }

  await logAudit(supabase, {
    entityType: "category_modifiers",
    entityId: categoryId,
    action: "update",
    summary: `Kategori ek özellikleri uygulandı: ${categoryName}`,
    changes: { templateCount: template.length, productCount: categoryProducts.length },
  });

  await notifyPublicMenuUpdated();
}

export async function removeModifierFromCategory(
  supabase: SupabaseClient,
  categoryId: string,
  modifierType: string,
  modifierId: string,
  products: AdminProduct[],
  categoryName: string,
) {
  const categoryProducts = getCategoryProducts(categoryId, products);

  for (const product of categoryProducts) {
    const nextModifiers = product.modifiers.filter(
      (mod) => !(mod.modifierType === modifierType && mod.modifierId === modifierId),
    );
    if (nextModifiers.length === product.modifiers.length) continue;
    await syncProductModifiers(supabase, { ...product, modifiers: nextModifiers });
  }

  await logAudit(supabase, {
    entityType: "category_modifiers",
    entityId: categoryId,
    action: "delete",
    summary: `Kategori ek özelliği kaldırıldı: ${categoryName} / ${modifierId}`,
  });

  await notifyPublicMenuUpdated();
}

export function createEmptyTemplateItem(modifierType: string, sortOrder: number): ModifierTemplateItem {
  const emptyLabels = Object.fromEntries(LANG_CODES.map((lang) => [lang, ""])) as Record<LangCode, string>;
  return {
    modifierId: `${modifierType}-${Date.now()}`,
    modifierType,
    price: 0,
    sortOrder,
    isActive: true,
    labels: emptyLabels,
    productCount: 0,
    totalProducts: 0,
  };
}
