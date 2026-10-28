import { Suspense } from "react";
import { OrdersBoard } from "@/components/admin/orders-board";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { listOrders, loadOrderSettings } from "@/lib/admin-orders";
import { defaultOrderSettings } from "@/lib/orders";

export const metadata = { title: "Siparişler" };

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const [ordersResult, settingsResult] = await Promise.all([listOrders(), loadOrderSettings()]);
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
      <OrdersBoard orders={ordersResult.orders} settings={settings} />
    </div>
  );
}
