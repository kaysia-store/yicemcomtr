import { Suspense } from "react";
import PricesPage from "@/components/admin/prices/prices-page";
import LoadingBlock from "@/components/admin/ui/loading-block";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock label="Fiyatlar yükleniyor…" />}>
      <PricesPage />
    </Suspense>
  );
}
