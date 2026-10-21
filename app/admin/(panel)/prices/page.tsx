import { Suspense } from "react";
import { PriceBoard } from "@/components/admin/price-board";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { getPriceBoard } from "@/lib/admin-data";

export const metadata = { title: "Fiyatlar" };

export default function PricesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <PricesContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PricesContent({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [{ saved }, result] = await Promise.all([searchParams, getPriceBoard()]);
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        description="Taban fiyat ve özellik ek ücretleri aynı tabloda. Yüzde veya sabit tutar ikisine de uygulanır. Kayıt, yalnızca yeni tutarı dolu olan satırlara yazılır."
        title="Fiyat Yönetimi"
      />
      {saved === "1" ? (
        <div className="mb-4">
          <Notice tone="ok">Fiyatlar kaydedildi.</Notice>
        </div>
      ) : null}
      {result.groups.length === 0 ? (
        <p className="text-sm text-muted">Fiyatı yönetilecek ürün yok.</p>
      ) : (
        <PriceBoard groups={result.groups} />
      )}
    </div>
  );
}
