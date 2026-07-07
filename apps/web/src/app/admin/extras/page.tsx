import { Suspense } from "react";
import ExtrasPage from "@/components/admin/extras/extras-page";
import LoadingBlock from "@/components/admin/ui/loading-block";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock label="Ek özellikler yükleniyor…" />}>
      <ExtrasPage />
    </Suspense>
  );
}
