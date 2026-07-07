import type { LangCode, MenuProduct } from "@/lib/menu/types";
import type { ModifierGroup } from "@/lib/menu/product-display";
import { tLocalized } from "@/lib/menu/i18n";
import { getProductContents } from "@/lib/menu/product-display";
import type { CartItemInput, SelectedModifier } from "./types";
import { createCartItemKey } from "./types";

export function getSelectedModifiers(
  groups: ModifierGroup[],
  lang: LangCode,
  radioSelections: Record<string, string>,
  checkboxSelections: Record<string, string[]>,
): SelectedModifier[] {
  const selected: SelectedModifier[] = [];

  for (const group of groups) {
    if (group.inputType === "radio") {
      const modifierId = radioSelections[group.key];
      if (!modifierId) continue;

      const item = group.items.find((entry) => entry.id === modifierId);
      if (!item) continue;

      selected.push({
        groupKey: group.key,
        groupTitle: group.title,
        modifierId: item.id,
        label: tLocalized(item.label, lang),
        price: item.price,
      });
      continue;
    }

    const modifierIds = checkboxSelections[group.key] ?? [];
    for (const modifierId of modifierIds) {
      const item = group.items.find((entry) => entry.id === modifierId);
      if (!item) continue;

      selected.push({
        groupKey: group.key,
        groupTitle: group.title,
        modifierId: item.id,
        label: tLocalized(item.label, lang),
        price: item.price,
      });
    }
  }

  return selected;
}

export function computeUnitPrice(basePrice: number, modifiers: SelectedModifier[]): number {
  const extrasTotal = modifiers.reduce((sum, modifier) => sum + modifier.price, 0);
  return basePrice + extrasTotal;
}

export function buildCartItemInput(
  product: MenuProduct,
  lang: LangCode,
  groups: ModifierGroup[],
  radioSelections: Record<string, string>,
  checkboxSelections: Record<string, string[]>,
  includedIngredients: Set<string>,
): CartItemInput {
  const contents = getProductContents(product, lang);
  const removedIngredients = contents.filter((ingredient) => !includedIngredients.has(ingredient));
  const selectedModifiers = getSelectedModifiers(groups, lang, radioSelections, checkboxSelections);
  const unitPrice = computeUnitPrice(product.price, selectedModifiers);

  return {
    productId: product.id,
    name: tLocalized(product.name, lang),
    basePrice: product.price,
    selectedModifiers,
    removedIngredients,
    unitPrice,
  };
}

export function withCartItemKey(input: CartItemInput): { key: string } & CartItemInput {
  return {
    ...input,
    key: createCartItemKey({
      productId: input.productId,
      selectedModifiers: input.selectedModifiers,
      removedIngredients: input.removedIngredients,
    }),
  };
}
