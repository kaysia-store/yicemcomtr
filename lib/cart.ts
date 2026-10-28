import { place } from "@/lib/place";
import type { MenuProduct } from "@/lib/types";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  optionNames: string[];
  removedIngredients: string[];
};

export type PaymentMethod = "cash" | "card" | "meal_card";

export const MEAL_CARD_BRANDS = [
  { id: "multinet", label: "Multinet" },
  { id: "sodexo", label: "Sodexo" },
  { id: "setcard", label: "Setcard" },
  { id: "tokenflex", label: "TokenFlex" },
  { id: "ticket", label: "Ticket" },
] as const;

export type MealCardBrandId = (typeof MEAL_CARD_BRANDS)[number]["id"];

export type CartState = {
  lines: CartLine[];
  firstName: string;
  lastName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  mealCardBrand: MealCardBrandId | "";
  address: string;
  note: string;
};

export const emptyCart: CartState = {
  lines: [],
  firstName: "",
  lastName: "",
  phone: "",
  paymentMethod: "cash",
  mealCardBrand: "",
  address: "",
  note: "",
};

const storageKey = "yicem-cart-v4";

export function isMealCardBrandId(value: unknown): value is MealCardBrandId {
  return typeof value === "string" && MEAL_CARD_BRANDS.some((brand) => brand.id === value);
}

export function mealCardBrandLabel(brand: string | null | undefined) {
  if (!brand) return "";
  return MEAL_CARD_BRANDS.find((item) => item.id === brand)?.label ?? brand;
}

export function parseIngredients(raw: string) {
  return raw
    .split(/[,،]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function cartLineKey(productId: string, optionIds: string[], removed: string[]) {
  return [productId, [...optionIds].sort().join("|"), [...removed].sort().join("|")].join("::");
}

export function buildCartLine(
  product: MenuProduct,
  optionIds: string[],
  removedIngredients: string[],
  quantity = 1,
): CartLine {
  const options = product.features.flatMap((feature) => feature.options.filter((option) => optionIds.includes(option.id)));
  const unitPrice = product.price + options.reduce((sum, option) => sum + option.priceDelta, 0);
  return {
    key: cartLineKey(
      product.id,
      options.map((option) => option.id),
      removedIngredients,
    ),
    productId: product.id,
    name: product.name,
    unitPrice,
    quantity,
    optionNames: options.map((option) => option.name),
    removedIngredients,
  };
}

export function cartCount(cart: CartState) {
  return cart.lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function cartTotal(cart: CartState) {
  return cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function customerFullName(cart: Pick<CartState, "firstName" | "lastName">) {
  return `${cart.firstName.trim()} ${cart.lastName.trim()}`.trim();
}

export function addCartLine(cart: CartState, line: CartLine): CartState {
  const existing = cart.lines.find((item) => item.key === line.key);
  if (!existing) return { ...cart, lines: [...cart.lines, line] };
  return {
    ...cart,
    lines: cart.lines.map((item) => (item.key === line.key ? { ...item, quantity: item.quantity + line.quantity } : item)),
  };
}

export function setCartQuantity(cart: CartState, key: string, quantity: number): CartState {
  if (quantity <= 0) return { ...cart, lines: cart.lines.filter((line) => line.key !== key) };
  return {
    ...cart,
    lines: cart.lines.map((line) => (line.key === key ? { ...line, quantity } : line)),
  };
}

export function readCart(): CartState {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw) as Partial<CartState> & { customerName?: string };
    const payment: PaymentMethod =
      parsed.paymentMethod === "card" || parsed.paymentMethod === "meal_card" ? parsed.paymentMethod : "cash";
    const mealCardBrand = isMealCardBrandId(parsed.mealCardBrand) ? parsed.mealCardBrand : "";
    const firstName =
      typeof parsed.firstName === "string"
        ? parsed.firstName
        : typeof parsed.customerName === "string"
          ? parsed.customerName.split(/\s+/)[0] ?? ""
          : "";
    const lastName =
      typeof parsed.lastName === "string"
        ? parsed.lastName
        : typeof parsed.customerName === "string"
          ? parsed.customerName.split(/\s+/).slice(1).join(" ")
          : "";
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines.filter(isCartLine) : [],
      firstName,
      lastName,
      phone: typeof parsed.phone === "string" ? parsed.phone : "",
      paymentMethod: payment,
      mealCardBrand: payment === "meal_card" ? mealCardBrand : "",
      address: typeof parsed.address === "string" ? parsed.address : "",
      note: typeof parsed.note === "string" ? parsed.note : "",
    };
  } catch {
    return emptyCart;
  }
}

export function writeCart(cart: CartState) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(cart));
  } catch {
    /* depolama kapalıysa sepet yalnızca oturumda kalır */
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const row = value as CartLine;
  return (
    typeof row.key === "string" &&
    typeof row.productId === "string" &&
    typeof row.name === "string" &&
    typeof row.unitPrice === "number" &&
    typeof row.quantity === "number" &&
    Array.isArray(row.optionNames) &&
    Array.isArray(row.removedIngredients)
  );
}

export function formatCartMoney(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value);
}

export function paymentLabel(method: PaymentMethod, mealCardBrand?: string | null) {
  if (method === "card") return "Kredi kartı";
  if (method === "meal_card") {
    const brand = mealCardBrandLabel(mealCardBrand);
    return brand ? `Yemek kartı · ${brand}` : "Yemek kartı";
  }
  return "Nakit";
}

export function normalizePhone(value: string) {
  return value.replace(/[^\d+]/g, "").trim();
}

export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

export function whatsappOrderUrl(cart: CartState, restaurantName: string) {
  const phone = place.mobileTel.replace(/\D/g, "");
  const lines: string[] = [`${restaurantName} sipariş`];
  const name = customerFullName(cart);
  if (name) lines.push(`İsim: ${name}`);
  if (cart.phone.trim()) lines.push(`Tel: ${cart.phone.trim()}`);
  lines.push(`Ödeme: ${paymentLabel(cart.paymentMethod, cart.mealCardBrand)}`);
  if (cart.address.trim()) lines.push(`Adres: ${cart.address.trim()}`);
  lines.push("");
  for (const line of cart.lines) {
    lines.push(`• ${line.quantity}× ${line.name} — ${formatCartMoney(line.unitPrice * line.quantity)}`);
    if (line.optionNames.length > 0) lines.push(`  Seçenek: ${line.optionNames.join(", ")}`);
    if (line.removedIngredients.length > 0) lines.push(`  Çıkarılan: ${line.removedIngredients.join(", ")}`);
  }
  lines.push("");
  lines.push(`Toplam: ${formatCartMoney(cartTotal(cart))}`);
  if (cart.note.trim()) {
    lines.push("");
    lines.push(`Not: ${cart.note.trim()}`);
  }
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
