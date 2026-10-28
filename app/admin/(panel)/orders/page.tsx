import { Suspense } from "react";
import { OrdersBoard } from "@/components/admin/orders-board";
import { OrdersDateNav } from "@/components/admin/orders-date-nav";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { countNewOrdersBeforeDay, listOrders, loadOrderSettings } from "@/lib/admin-orders";
import { parseDayParam } from "@/lib/order-day";
import { defaultOrderSettings } from "@/lib/orders";

export const metadata = { title: "Siparişler" };

export default function OrdersPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrdersContent searchParams={searchParams} />
    </Suspense>
  );
}

async function OrdersContent({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const query = await searchParams;
  const day = parseDayParam(query.date);
  const [ordersResult, settingsResult, pastUnseen] = await Promise.all([
    listOrders(day),
    loadOrderSettings(),
    countNewOrdersBeforeDay(day),
  ]);
  if (!ordersResult.ok) {
    return <LoadError message={ordersResult.message} reason={ordersResult.reason} />;
  }
  const settings = settingsResult.ok ? settingsResult.settings : defaultOrderSettings;
  const fresh = ordersResult.orders.filter((order) => order.status === "new").length;

  return (
    <div>
      <PageHeader
        description={fresh > 0 ? `${fresh} yeni sipariş bekliyor.` : "Gelen siparişleri onaylayın ve fiş yazdırın."}
        title="Siparişler"
      />
      <OrdersDateNav day={day} pastUnseen={pastUnseen} />
      <OrdersBoard day={day} orders={ordersResult.orders} settings={settings} />
    </div>
  );
}
