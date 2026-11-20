import type { MenuFeature, MenuProduct } from "@/lib/types";

/** Bu üründe yalnızca bir üst seçenekle açılan özellik id'leri */
export function gatedFeatureIds(product: MenuProduct) {
  const gated = new Set<string>();
  for (const feature of product.features) {
    for (const option of feature.options) {
      if (option.unlocksFeatureId) gated.add(option.unlocksFeatureId);
    }
  }
  return gated;
}

/** Seçili seçeneklerin açtığı özellik id'leri */
export function unlockedFeatureIds(product: MenuProduct, selected: Set<string>) {
  const unlocked = new Set<string>();
  for (const feature of product.features) {
    for (const option of feature.options) {
      if (selected.has(option.id) && option.unlocksFeatureId) unlocked.add(option.unlocksFeatureId);
    }
  }
  return unlocked;
}

export function isFeatureVisible(featureId: string, gated: Set<string>, unlocked: Set<string>) {
  if (!gated.has(featureId)) return true;
  return unlocked.has(featureId);
}

export function visibleFeatures(product: MenuProduct, selected: Set<string>) {
  const gated = gatedFeatureIds(product);
  const unlocked = unlockedFeatureIds(product, selected);
  return product.features.filter((feature) => isFeatureVisible(feature.id, gated, unlocked));
}

/** Kilitlenen özelliklerin seçimlerini temizle */
export function pruneLockedSelections(product: MenuProduct, selected: Set<string>) {
  const gated = gatedFeatureIds(product);
  const unlocked = unlockedFeatureIds(product, selected);
  const next = new Set(selected);
  for (const feature of product.features) {
    if (isFeatureVisible(feature.id, gated, unlocked)) continue;
    for (const option of feature.options) next.delete(option.id);
  }
  return next;
}

export function requiredFeaturesReady(features: MenuFeature[], selected: Set<string>) {
  for (const feature of features) {
    if (!feature.required) continue;
    const picked = feature.options.some((option) => selected.has(option.id));
    if (!picked) return false;
  }
  return true;
}
