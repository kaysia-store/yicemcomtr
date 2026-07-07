import { Suspense } from "react";
import MenuPage from "@/components/admin/menu/menu-page";
import LoadingBlock from "@/components/admin/ui/loading-block";

export default function Page() {
  return (
    <Suspense fallback={<LoadingBlock label="Menü yükleniyor…" />}>
      <MenuPage />
    </Suspense>
  );
}
