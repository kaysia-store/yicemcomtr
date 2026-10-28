import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Receipt } from "@/components/admin/receipt";
import { PrintActions } from "@/components/admin/print-actions";
import { LoadingState } from "@/components/loading-state";
import { getDashboard } from "@/lib/admin-data";
import { getOrder } from "@/lib/admin-orders";

export const metadata = { title: "Fiş" };

export default function PrintOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ copies?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState label="Fiş yükleniyor…" />}>
      <PrintOrderContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function PrintOrderContent({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ copies?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const copies = Math.min(5, Math.max(1, Number(query.copies ?? 1) || 1));
  const [orderResult, dashboard] = await Promise.all([getOrder(id), getDashboard()]);
  if (!orderResult.ok) notFound();
  const restaurantName = dashboard.ok ? dashboard.name : "Yicem";

  return (
    <div className="min-h-screen bg-paper px-3 py-6 print:bg-white print:p-0">
      <PrintActions orderId={orderResult.order.id} />
      <Receipt copies={copies} order={orderResult.order} restaurantName={restaurantName} />
    </div>
  );
}
