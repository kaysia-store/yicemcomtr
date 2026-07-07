import { Suspense } from "react";
import ProductEditPage from "@/components/admin/products/product-edit-page";
import LoadingBlock from "@/components/admin/ui/loading-block";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock label="Yükleniyor…" />}>
      <ProductEditPage />
    </Suspense>
  );
}
