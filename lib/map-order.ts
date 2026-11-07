import type { FulfillmentMethod, PaymentMethod } from "@/lib/cart";
import type { OrderRow, OrderStatus } from "@/lib/orders";

export function mapOrderRow(row: Record<string, unknown>): OrderRow {
  const first = String(row.customer_first_name ?? "").trim();
  const last = String(row.customer_last_name ?? "").trim();
  const legacy = String(row.customer_name ?? "").trim();
  const paymentRaw = String(row.payment_method ?? "cash");
  const payment: PaymentMethod =
    paymentRaw === "card" || paymentRaw === "meal_card" ? paymentRaw : "cash";
  const fulfillmentRaw = String(row.fulfillment ?? "delivery");
  const fulfillment: FulfillmentMethod = fulfillmentRaw === "pickup" ? "pickup" : "delivery";
  return {
    id: String(row.id),
    status: row.status as OrderStatus,
    customerFirstName: first,
    customerLastName: last,
    customerName: `${first} ${last}`.trim() || legacy,
    phone: String(row.phone ?? "").trim(),
    paymentMethod: payment,
    mealCardBrand: String(row.meal_card_brand ?? "").trim(),
    fulfillment,
    address: String(row.address ?? ""),
    note: String(row.note ?? ""),
    items: Array.isArray(row.items) ? (row.items as OrderRow["items"]) : [],
    total: Number(row.total ?? 0),
    locale: String(row.locale ?? "tr"),
    createdAt: String(row.created_at ?? ""),
    acceptedAt: row.accepted_at ? String(row.accepted_at) : null,
    printedAt: row.printed_at ? String(row.printed_at) : null,
  };
}
