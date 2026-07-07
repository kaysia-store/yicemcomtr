import { Suspense } from "react";
import ProductsPage from "@/components/admin/products/products-page";
import LoadingBlock from "@/components/admin/ui/loading-block";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock label="Yükleniyor…" />}>
      <ProductsPage />
    </Suspense>
  );
}
