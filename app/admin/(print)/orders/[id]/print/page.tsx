import { Suspense } from "react";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { Receipt } from "@/components/admin/receipt";
import { PrintActions } from "@/components/admin/print-actions";
import { LoadingState } from "@/components/loading-state";
import { getDashboard } from "@/lib/admin-data";
import { getOrder } from "@/lib/admin-orders";
import { getSiteUrl } from "@/lib/supabase/env";

export const metadata = { title: "Fiş" };

export default function PrintOrderPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<LoadingState label="Fiş yükleniyor…" />}>
      <PrintOrderContent params={params} />
    </Suspense>
  );
}

async function PrintOrderContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [orderResult, dashboard] = await Promise.all([getOrder(id), getDashboard()]);
  if (!orderResult.ok) notFound();
  const restaurantName = dashboard.ok ? dashboard.name : "Yicem";
  const locale = orderResult.order.locale || (dashboard.ok ? dashboard.defaultLocale : "tr") || "tr";
  const configured = getSiteUrl();
  const site =
    configured && !/localhost|127\.0\.0\.1/i.test(configured) ? configured : "https://yicem.com.tr";
  const menuUrl = `${site}/${locale}`;
  const menuQrDataUrl = await QRCode.toDataURL(menuUrl, {
    width: 240,
    margin: 1,
    color: { dark: "#111111", light: "#ffffff" },
  });

  return (
    <div className="min-h-screen bg-paper px-3 py-6 print:bg-white print:p-0">
      <PrintActions orderId={orderResult.order.id} />
      <Receipt menuQrDataUrl={menuQrDataUrl} menuUrl={menuUrl} order={orderResult.order} restaurantName={restaurantName} />
    </div>
  );
}
