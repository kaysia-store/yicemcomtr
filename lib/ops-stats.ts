import { formatIstanbulDay, istanbulDayBounds, shiftDay, todayIstanbul } from "@/lib/order-day";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod } from "@/lib/cart";

export type DayBucket = {
  day: string;
  label: string;
  count: number;
  revenue: number;
};

export type TopProduct = {
  name: string;
  quantity: number;
};

export type PaymentBucket = {
  method: PaymentMethod;
  count: number;
  revenue: number;
};

export type OpsStats = {
  pending: number;
  todayOrders: number;
  todayRevenue: number;
  avgBasket: number;
  last7Days: DayBucket[];
  topProducts: TopProduct[];
  payments: PaymentBucket[];
};

function shortDayLabel(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("tr-TR", {
    weekday: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function emptyStats(): OpsStats {
  const today = todayIstanbul();
  const last7Days: DayBucket[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = shiftDay(today, -i);
    last7Days.push({ day, label: shortDayLabel(day), count: 0, revenue: 0 });
  }
  return {
    pending: 0,
    todayOrders: 0,
    todayRevenue: 0,
    avgBasket: 0,
    last7Days,
    topProducts: [],
    payments: [],
  };
}

function isActiveStatus(status: string) {
  return status !== "cancelled";
}

export async function loadOpsStats(): Promise<OpsStats> {
  const base = emptyStats();
  if (!getSupabaseEnv()) return base;

  try {
    const supabase = await createClient();
    const today = todayIstanbul();
    const weekStart = shiftDay(today, -6);
    const { start } = istanbulDayBounds(weekStart);

    const [{ count: pending }, { data, error }] = await Promise.all([
      supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase
        .from("orders")
        .select("status, total, payment_method, items, created_at")
        .gte("created_at", start)
        .order("created_at", { ascending: true })
        .limit(2000),
    ]);

    if (error || !data) {
      return { ...base, pending: pending ?? 0 };
    }

    const byDay = new Map(base.last7Days.map((bucket) => [bucket.day, { ...bucket }]));
    const productMap = new Map<string, number>();
    const paymentMap = new Map<PaymentMethod, { count: number; revenue: number }>();
    let todayOrders = 0;
    let todayRevenue = 0;
    let weekOrders = 0;
    let weekRevenue = 0;

    for (const row of data) {
      const status = String(row.status ?? "");
      const total = Number(row.total ?? 0);
      const created = String(row.created_at ?? "");
      const day = formatIstanbulDay(new Date(created));
      const bucket = byDay.get(day);

      if (bucket && isActiveStatus(status)) {
        bucket.count += 1;
        bucket.revenue += total;
      }

      if (!isActiveStatus(status)) continue;

      weekOrders += 1;
      weekRevenue += total;

      if (day === today) {
        todayOrders += 1;
        todayRevenue += total;
      }

      const paymentRaw = String(row.payment_method ?? "cash");
      const method: PaymentMethod =
        paymentRaw === "card" || paymentRaw === "meal_card" ? paymentRaw : "cash";
      const pay = paymentMap.get(method) ?? { count: 0, revenue: 0 };
      pay.count += 1;
      pay.revenue += total;
      paymentMap.set(method, pay);

      if (Array.isArray(row.items)) {
        for (const item of row.items) {
          if (!item || typeof item !== "object") continue;
          const rec = item as Record<string, unknown>;
          const name = String(rec.name ?? "").trim() || "Ürün";
          const qty = Number(rec.quantity ?? 0);
          if (qty <= 0) continue;
          productMap.set(name, (productMap.get(name) ?? 0) + qty);
        }
      }
    }

    return {
      pending: pending ?? 0,
      todayOrders,
      todayRevenue,
      avgBasket: todayOrders > 0 ? todayRevenue / todayOrders : weekOrders > 0 ? weekRevenue / weekOrders : 0,
      last7Days: Array.from(byDay.values()),
      topProducts: Array.from(productMap.entries())
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      payments: (["cash", "card", "meal_card"] as PaymentMethod[])
        .map((method) => ({
          method,
          count: paymentMap.get(method)?.count ?? 0,
          revenue: paymentMap.get(method)?.revenue ?? 0,
        }))
        .filter((row) => row.count > 0),
    };
  } catch {
    return base;
  }
}
