import type { LangCode } from "@/lib/menu/types";
import type { CartItem } from "./types";
import { ORDER_GREETING, WHATSAPP_PHONE } from "./types";

const TOTAL_LABEL: Record<LangCode, string> = {
  tr: "Toplam",
  en: "Total",
  ru: "Итого",
  de: "Gesamt",
  fr: "Total",
  ar: "الإجمالي",
};

const REMOVED_LABEL: Record<LangCode, string> = {
  tr: "Çıkarılanlar",
  en: "Removed",
  ru: "Без",
  de: "Ohne",
  fr: "Sans",
  ar: "بدون",
};

function formatPrice(amount: number): string {
  return `₺${amount.toFixed(2)}`;
}

function formatModifiers(item: CartItem, lang: LangCode): string[] {
  const lines: string[] = [];

  for (const modifier of item.selectedModifiers) {
    const priceSuffix = modifier.price > 0 ? ` (+${formatPrice(modifier.price)})` : "";
    lines.push(`  ${modifier.groupTitle}: ${modifier.label}${priceSuffix}`);
  }

  if (item.removedIngredients.length > 0) {
    const removedLabel = REMOVED_LABEL[lang] ?? REMOVED_LABEL.tr;
    lines.push(`  ${removedLabel}: ${item.removedIngredients.join(", ")}`);
  }

  return lines;
}

export function buildWhatsAppMessage(items: CartItem[], lang: LangCode): string {
  const greeting = ORDER_GREETING[lang] ?? ORDER_GREETING.tr;

  if (items.length === 0) {
    return greeting;
  }

  const lines = [greeting, ""];
  let grandTotal = 0;

  for (const item of items) {
    const lineTotal = item.unitPrice * item.quantity;
    grandTotal += lineTotal;
    lines.push(`${item.quantity}x ${item.name} - ${formatPrice(lineTotal)}`);

    const detailLines = formatModifiers(item, lang);
    if (detailLines.length > 0) {
      lines.push(...detailLines);
    }

    lines.push("");
  }

  const totalLabel = TOTAL_LABEL[lang] ?? TOTAL_LABEL.tr;
  lines.push(`${totalLabel}: ${formatPrice(grandTotal)}`);

  return lines.join("\n").trim();
}

export function getWhatsAppOrderUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}
