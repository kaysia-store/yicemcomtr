import type { MenuExtra, MenuFeature, MenuProduct } from "@/lib/types";

export type ExtraPickState = {
  /** fixed: seçili mi */
  fixedOn: boolean;
  /** list: seçilen choice id'leri */
  choiceIds: string[];
  /** menu: seçilen ürün id'leri */
  menuProductIds: string[];
  /** menu ürün özellik seçimleri: option id set */
  menuOptionIds: string[];
  /** menü ürününe bağlı ek seçenekler: `${productId}::${nestedExtraId}` */
  nestedPicks: Record<string, ExtraPickState>;
};

export function emptyExtraPick(): ExtraPickState {
  return { fixedOn: false, choiceIds: [], menuProductIds: [], menuOptionIds: [], nestedPicks: {} };
}

export function nestedPickKey(productId: string, nestedExtraId: string) {
  return `${productId}::${nestedExtraId}`;
}

function defaultPickForExtra(extra: MenuExtra): ExtraPickState {
  const pick = emptyExtraPick();
  if (extra.kind === "list") {
    const defaults = extra.choices.filter((choice) => choice.isDefault);
    if (extra.selection === "single") {
      const choice = defaults[0] ?? (extra.required ? extra.choices[0] : undefined);
      if (choice) pick.choiceIds = [choice.id];
    } else {
      pick.choiceIds = defaults.map((choice) => choice.id);
    }
  }
  if (extra.kind === "fixed" && extra.required) pick.fixedOn = true;
  return pick;
}

export function defaultExtraPicks(extras: MenuExtra[]) {
  const map: Record<string, ExtraPickState> = {};
  for (const extra of extras) {
    map[extra.id] = defaultPickForExtra(extra);
  }
  return map;
}

function nestedAmount(extra: MenuExtra, pick: ExtraPickState) {
  let sum = 0;
  for (const product of extra.menuProducts) {
    if (!pick.menuProductIds.includes(product.id)) continue;
    for (const nested of product.extras) {
      const nestedPick = pick.nestedPicks[nestedPickKey(product.id, nested.id)] ?? emptyExtraPick();
      sum += leafExtraAmount(nested, nestedPick);
    }
  }
  return sum;
}

function leafExtraAmount(extra: MenuExtra, pick: ExtraPickState) {
  if (extra.kind === "fixed") return pick.fixedOn ? extra.price : 0;
  if (extra.kind === "list") {
    return extra.choices
      .filter((choice) => pick.choiceIds.includes(choice.id))
      .reduce((sum, choice) => sum + choice.priceDelta, 0);
  }
  return 0;
}

export function extraAmount(extra: MenuExtra, pick: ExtraPickState) {
  if (extra.kind === "fixed" || extra.kind === "list") return leafExtraAmount(extra, pick);
  if (!pick.menuProductIds.length) return 0;
  let sum = extra.price;
  for (const product of extra.menuProducts) {
    if (!pick.menuProductIds.includes(product.id)) continue;
    for (const feature of product.features) {
      for (const option of feature.options) {
        if (pick.menuOptionIds.includes(option.id)) sum += option.priceDelta;
      }
    }
  }
  return sum + nestedAmount(extra, pick);
}

export function extraLabels(extra: MenuExtra, pick: ExtraPickState) {
  const labels: string[] = [];
  if (extra.kind === "fixed") {
    if (pick.fixedOn) labels.push(extra.name);
    return labels;
  }
  if (extra.kind === "list") {
    for (const choice of extra.choices) {
      if (pick.choiceIds.includes(choice.id)) labels.push(`${extra.name}: ${choice.name}`);
    }
    return labels;
  }
  if (pick.menuProductIds.length === 0) return labels;
  labels.push(extra.name);
  for (const product of extra.menuProducts) {
    if (!pick.menuProductIds.includes(product.id)) continue;
    labels.push(product.name);
    for (const feature of product.features) {
      for (const option of feature.options) {
        if (pick.menuOptionIds.includes(option.id)) labels.push(`${feature.name}: ${option.name}`);
      }
    }
    for (const nested of product.extras) {
      const nestedPick = pick.nestedPicks[nestedPickKey(product.id, nested.id)] ?? emptyExtraPick();
      labels.push(...extraLabels(nested, nestedPick));
    }
  }
  return labels;
}

export function extrasTotal(product: MenuProduct, picks: Record<string, ExtraPickState>) {
  return product.extras.reduce((sum, extra) => sum + extraAmount(extra, picks[extra.id] ?? emptyExtraPick()), 0);
}

export function extrasLabels(product: MenuProduct, picks: Record<string, ExtraPickState>) {
  return product.extras.flatMap((extra) => extraLabels(extra, picks[extra.id] ?? emptyExtraPick()));
}

export function extrasFingerprint(product: MenuProduct, picks: Record<string, ExtraPickState>) {
  return product.extras
    .map((extra) => {
      const pick = picks[extra.id] ?? emptyExtraPick();
      const nested = Object.keys(pick.nestedPicks)
        .sort()
        .map((key) => {
          const nestedPick = pick.nestedPicks[key] ?? emptyExtraPick();
          return [
            key,
            nestedPick.fixedOn ? "1" : "0",
            [...nestedPick.choiceIds].sort().join(","),
          ].join("=");
        })
        .join(";");
      return [
        extra.id,
        pick.fixedOn ? "1" : "0",
        [...pick.choiceIds].sort().join(","),
        [...pick.menuProductIds].sort().join(","),
        [...pick.menuOptionIds].sort().join(","),
        nested,
      ].join(":");
    })
    .join("|");
}

function featureReady(feature: MenuFeature, selected: Set<string>) {
  if (!feature.required) return true;
  return feature.options.some((option) => selected.has(option.id));
}

function leafExtraReady(extra: MenuExtra, pick: ExtraPickState) {
  if (extra.kind === "fixed") return !extra.required || pick.fixedOn;
  if (extra.kind === "list") {
    if (!extra.required && pick.choiceIds.length === 0) return true;
    return pick.choiceIds.length > 0;
  }
  return true;
}

export function extraReady(extra: MenuExtra, pick: ExtraPickState) {
  if (extra.kind === "fixed" || extra.kind === "list") return leafExtraReady(extra, pick);
  if (!extra.required && pick.menuProductIds.length === 0) return true;
  if (pick.menuProductIds.length === 0) return false;
  if (extra.selection === "single" && pick.menuProductIds.length !== 1) return false;
  for (const product of extra.menuProducts) {
    if (!pick.menuProductIds.includes(product.id)) continue;
    const selected = new Set(pick.menuOptionIds);
    for (const feature of product.features) {
      if (!featureReady(feature, selected)) return false;
    }
    for (const nested of product.extras) {
      const nestedPick = pick.nestedPicks[nestedPickKey(product.id, nested.id)] ?? emptyExtraPick();
      if (!leafExtraReady(nested, nestedPick)) return false;
    }
  }
  return true;
}

export function productExtrasReady(product: MenuProduct, picks: Record<string, ExtraPickState>) {
  return product.extras.every((extra) => extraReady(extra, picks[extra.id] ?? emptyExtraPick()));
}

export function productFeaturesReady(product: MenuProduct, selected: Set<string>) {
  return product.features.every((feature) => featureReady(feature, selected));
}

export type ConfigStep =
  | { type: "features" }
  | { type: "extra"; extraId: string }
  | { type: "menu-features"; extraId: string; productId: string }
  | { type: "menu-extra"; extraId: string; productId: string; nestedExtraId: string }
  | { type: "ingredients" };

export function buildConfigSteps(product: MenuProduct, picks: Record<string, ExtraPickState>): ConfigStep[] {
  const steps: ConfigStep[] = [];
  if (product.features.length > 0) steps.push({ type: "features" });

  for (const extra of product.extras) {
    steps.push({ type: "extra", extraId: extra.id });
    if (extra.kind !== "menu") continue;
    const pick = picks[extra.id] ?? emptyExtraPick();
    for (const menuProduct of extra.menuProducts) {
      if (!pick.menuProductIds.includes(menuProduct.id)) continue;
      if (menuProduct.features.length > 0) {
        steps.push({ type: "menu-features", extraId: extra.id, productId: menuProduct.id });
      }
      for (const nested of menuProduct.extras) {
        steps.push({
          type: "menu-extra",
          extraId: extra.id,
          productId: menuProduct.id,
          nestedExtraId: nested.id,
        });
      }
    }
  }

  if (product.ingredients.trim()) steps.push({ type: "ingredients" });
  return steps;
}

/** Menü ürünü seçilince nested ek seçenek varsayılanlarını doldur */
export function ensureNestedDefaults(extra: MenuExtra, pick: ExtraPickState): ExtraPickState {
  if (extra.kind !== "menu") return pick;
  let nestedPicks = pick.nestedPicks;
  let changed = false;
  for (const product of extra.menuProducts) {
    if (!pick.menuProductIds.includes(product.id)) continue;
    for (const nested of product.extras) {
      const key = nestedPickKey(product.id, nested.id);
      if (nestedPicks[key]) continue;
      if (!changed) nestedPicks = { ...nestedPicks };
      nestedPicks[key] = defaultPickForExtra(nested);
      changed = true;
    }
  }
  // Seçimi kalkmış ürünlerin nested pick'lerini temizle
  for (const key of Object.keys(nestedPicks)) {
    const productId = key.split("::")[0];
    if (pick.menuProductIds.includes(productId)) continue;
    if (!changed) nestedPicks = { ...nestedPicks };
    delete nestedPicks[key];
    changed = true;
  }
  return changed ? { ...pick, nestedPicks } : pick;
}
