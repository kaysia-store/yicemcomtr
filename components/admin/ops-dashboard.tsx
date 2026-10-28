import Link from "next/link";
import { formatCartMoney, type PaymentMethod } from "@/lib/cart";
import type { OpsStats } from "@/lib/ops-stats";

const paymentTitles: Record<PaymentMethod, string> = {
  cash: "Nakit",
  card: "Kart",
  meal_card: "Yemek kartı",
};

export function OpsDashboard({ stats }: { stats: OpsStats }) {
  const maxCount = Math.max(1, ...stats.last7Days.map((d) => d.count));
  const maxProduct = Math.max(1, ...stats.topProducts.map((p) => p.quantity));

  return (
    <div className="mb-10 grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          href="/admin/orders"
          hint="Onay bekleyen"
          label="Bekleyen"
          tone={stats.pending > 0 ? "accent" : "default"}
          value={String(stats.pending)}
        />
        <Metric hint="Bugün" label="Sipariş" value={String(stats.todayOrders)} />
        <Metric hint="Bugün" label="Ciro" value={formatCartMoney(stats.todayRevenue)} />
        <Metric
          hint={stats.todayOrders > 0 ? "Bugün ortalama" : "7 gün ortalama"}
          label="Sepet ort."
          value={formatCartMoney(stats.avgBasket)}
        />
      </div>

      <section className="rounded-3xl border border-line bg-card p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl">Son 7 gün</h2>
            <p className="mt-1 text-sm text-muted">Günlük sipariş adedi</p>
          </div>
          <p className="text-sm tabular-nums text-muted">
            Toplam {stats.last7Days.reduce((sum, d) => sum + d.count, 0)} sipariş ·{" "}
            {formatCartMoney(stats.last7Days.reduce((sum, d) => sum + d.revenue, 0))}
          </p>
        </div>
        <div className="mt-6 flex h-40 items-end gap-2 sm:gap-3">
          {stats.last7Days.map((day) => {
            const height = Math.max(4, Math.round((day.count / maxCount) * 100));
            return (
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={day.day}>
                <span className="text-xs font-medium tabular-nums">{day.count}</span>
                <div className="flex h-28 w-full items-end justify-center">
                  <div
                    className="w-full max-w-10 rounded-t-lg bg-accent/85"
                    style={{ height: `${height}%` }}
                    title={`${day.label}: ${day.count} · ${formatCartMoney(day.revenue)}`}
                  />
                </div>
                <span className="truncate text-[11px] text-muted">{day.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Çok satanlar</h2>
          <p className="mt-1 text-sm text-muted">Son 7 gün · adet</p>
          {stats.topProducts.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Henüz veri yok.</p>
          ) : (
            <ul className="mt-5 grid gap-3">
              {stats.topProducts.map((product) => (
                <li key={product.name}>
                  <div className="mb-1 flex justify-between gap-3 text-sm">
                    <span className="truncate font-medium">{product.name}</span>
                    <span className="shrink-0 tabular-nums text-muted">{product.quantity}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-accent/70"
                      style={{ width: `${Math.round((product.quantity / maxProduct) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-line bg-card p-5">
          <h2 className="font-serif text-2xl">Ödeme</h2>
          <p className="mt-1 text-sm text-muted">Son 7 gün dağılımı</p>
          {stats.payments.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Henüz veri yok.</p>
          ) : (
            <ul className="mt-5 grid gap-3">
              {stats.payments.map((row) => (
                <li
                  className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-3 py-3"
                  key={row.method}
                >
                  <div>
                    <p className="font-medium">{paymentTitles[row.method]}</p>
                    <p className="text-xs text-muted">{row.count} sipariş</p>
                  </div>
                  <p className="tabular-nums text-accent">{formatCartMoney(row.revenue)}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-5 text-xs text-muted">
            Ziyaretçi sayıları Vercel Analytics üzerinden gelir; canlıda Analytics açık olmalı.
          </p>
        </section>
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
  hint,
  href,
  tone = "default",
}: {
  label: string;
  value: string;
  hint: string;
  href?: string;
  tone?: "default" | "accent";
}) {
  const className =
    tone === "accent"
      ? "rounded-3xl border border-accent/30 bg-accent/10 px-4 py-4"
      : "rounded-3xl border border-line bg-card px-4 py-4";
  const body = (
    <>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-serif text-3xl tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </>
  );
  if (href) {
    return (
      <Link className={className} href={href}>
        {body}
      </Link>
    );
  }
  return <div className={className}>{body}</div>;
}
