import { defaultOrderSettings, mapOrderSettings, type OrderRow, type OrderStatus } from "@/lib/orders";
import type { PaymentMethod } from "@/lib/cart";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/schema-error";

function mapOrder(row: Record<string, unknown>): OrderRow {
  const first = String(row.customer_first_name ?? "").trim();
  const last = String(row.customer_last_name ?? "").trim();
  const legacy = String(row.customer_name ?? "").trim();
  const paymentRaw = String(row.payment_method ?? "cash");
  const payment: PaymentMethod =
    paymentRaw === "card" || paymentRaw === "meal_card" ? paymentRaw : "cash";
  return {
    id: String(row.id),
    status: row.status as OrderStatus,
    customerFirstName: first,
    customerLastName: last,
    customerName: `${first} ${last}`.trim() || legacy,
    phone: String(row.phone ?? "").trim(),
    paymentMethod: payment,
    mealCardBrand: String(row.meal_card_brand ?? "").trim(),
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

export async function listOrders() {
  if (!getSupabaseEnv()) return { ok: false as const, reason: "setup" as const };
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) {
    if (isSchemaError(error)) return { ok: false as const, reason: "schema" as const, message: error.message };
    return { ok: false as const, reason: "error" as const, message: "Siparişler yüklenemedi." };
  }
  return { ok: true as const, orders: (data ?? []).map((row) => mapOrder(row as Record<string, unknown>)) };
}

export async function getOrder(id: string) {
  if (!getSupabaseEnv()) return { ok: false as const, reason: "setup" as const };
  const supabase = await createClient();
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) {
    if (isSchemaError(error)) return { ok: false as const, reason: "schema" as const, message: error.message };
    return { ok: false as const, reason: "error" as const, message: "Sipariş bulunamadı." };
  }
  if (!data) return { ok: false as const, reason: "error" as const, message: "Sipariş bulunamadı." };
  return { ok: true as const, order: mapOrder(data as Record<string, unknown>) };
}

export async function loadOrderSettings() {
  if (!getSupabaseEnv()) return { ok: false as const, reason: "setup" as const };
  const supabase = await createClient();
  const { data, error } = await supabase.from("order_settings").select("*").eq("id", 1).maybeSingle();
  if (error) {
    if (isSchemaError(error)) return { ok: false as const, reason: "schema" as const, message: error.message };
    return { ok: false as const, reason: "error" as const, message: "Ayarlar yüklenemedi." };
  }
  if (!data) return { ok: true as const, settings: defaultOrderSettings };
  return { ok: true as const, settings: mapOrderSettings(data as Record<string, unknown>) };
}

export async function countNewOrders() {
  if (!getSupabaseEnv()) return 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new");
    return count ?? 0;
  } catch {
    return 0;
  }
}
