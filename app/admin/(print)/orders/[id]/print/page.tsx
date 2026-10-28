import { notFound } from "next/navigation";
import { Receipt } from "@/components/admin/receipt";
import { PrintActions } from "@/components/admin/print-actions";
import { getDashboard } from "@/lib/admin-data";
import { getOrder } from "@/lib/admin-orders";

export const metadata = { title: "Fiş" };

export default async function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [orderResult, dashboard] = await Promise.all([getOrder(id), getDashboard()]);
  if (!orderResult.ok) notFound();
  const restaurantName = dashboard.ok ? dashboard.name : "Yicem";

  return (
    <div className="min-h-screen bg-paper px-3 py-6 print:bg-white print:p-0">
      <PrintActions orderId={orderResult.order.id} />
      <Receipt order={orderResult.order} restaurantName={restaurantName} />
    </div>
  );
}
