import type { LangCode } from "@/lib/menu/types";

export type SelectedModifier = {
  groupKey: string;
  groupTitle: string;
  modifierId: string;
  label: string;
  price: number;
};

export type CartItem = {
  key: string;
  productId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  removedIngredients: string[];
  unitPrice: number;
};

export type CartItemInput = Omit<CartItem, "key" | "quantity">;

export function createCartItemKey(item: Pick<CartItem, "productId" | "selectedModifiers" | "removedIngredients">): string {
  const modifiers = item.selectedModifiers
    .map((modifier) => `${modifier.groupKey}:${modifier.modifierId}`)
    .sort()
    .join("|");
  const removed = [...item.removedIngredients].sort().join("|");
  return `${item.productId}::${modifiers}::${removed}`;
}

export const WHATSAPP_PHONE = "905412429007";

export const ORDER_GREETING: Record<LangCode, string> = {
  tr: "Merhaba Yi'Cem, sipariş vermek istiyorum",
  en: "Hello Yi'Cem, I would like to place an order",
  ru: "Здравствуйте Yi'Cem, хочу сделать заказ",
  de: "Hallo Yi'Cem, ich möchte bestellen",
  fr: "Bonjour Yi'Cem, je souhaite passer une commande",
  ar: "مرحباً يجم، أريد تقديم طلب",
};
