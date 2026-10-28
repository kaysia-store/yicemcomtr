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

export type PaymentMethod = "cash" | "card" | "online";

export type CartState = {
  lines: CartLine[];
  customerName: string;
  paymentMethod: PaymentMethod;
  address: string;
  note: string;
};

export const emptyCart: CartState = {
  lines: [],
  customerName: "",
  paymentMethod: "cash",
  address: "",
  note: "",
};

const storageKey = "yicem-cart-v2";

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
    const parsed = JSON.parse(raw) as Partial<CartState>;
    const payment =
      parsed.paymentMethod === "card" || parsed.paymentMethod === "online" || parsed.paymentMethod === "cash"
        ? parsed.paymentMethod
        : "cash";
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines.filter(isCartLine) : [],
      customerName: typeof parsed.customerName === "string" ? parsed.customerName : "",
      paymentMethod: payment,
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

export function paymentLabel(method: PaymentMethod) {
  if (method === "card") return "Kart";
  if (method === "online") return "Online";
  return "Nakit";
}

export function whatsappOrderUrl(cart: CartState, restaurantName: string) {
  const phone = place.mobileTel.replace(/\D/g, "");
  const lines: string[] = [`${restaurantName} sipariş`];
  if (cart.customerName.trim()) lines.push(`İsim: ${cart.customerName.trim()}`);
  lines.push(`Ödeme: ${paymentLabel(cart.paymentMethod)}`);
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
