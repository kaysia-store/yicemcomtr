import { defaultOrderSettings, mapOrderSettings, type OrderRow } from "@/lib/orders";
import { mapOrderRow } from "@/lib/map-order";
import { istanbulDayBounds } from "@/lib/order-day";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/schema-error";

function mapOrder(row: Record<string, unknown>): OrderRow {
  return mapOrderRow(row);
}

export async function listOrders(day?: string) {
  if (!getSupabaseEnv()) return { ok: false as const, reason: "setup" as const };
  const supabase = await createClient();
  let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(200);
  if (day) {
    const { start, end } = istanbulDayBounds(day);
    query = query.gte("created_at", start).lt("created_at", end);
  }
  const { data, error } = await query;
  if (error) {
    if (isSchemaError(error)) return { ok: false as const, reason: "schema" as const, message: error.message };
    return { ok: false as const, reason: "error" as const, message: "Siparişler yüklenemedi." };
  }
  return { ok: true as const, orders: (data ?? []).map((row) => mapOrder(row as Record<string, unknown>)) };
}

/** Seçili günden önceki görülmemiş (new) sipariş sayısı */
export async function countNewOrdersBeforeDay(day: string) {
  if (!getSupabaseEnv()) return 0;
  try {
    const supabase = await createClient();
    const { start } = istanbulDayBounds(day);
    const { count } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "new")
      .lt("created_at", start);
    return count ?? 0;
  } catch {
    return 0;
  }
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
