import { Suspense } from "react";
import { ImportMenuButton } from "@/components/admin/import-menu-button";
import { PhotoBoard } from "@/components/admin/photo-board";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { getProductList } from "@/lib/admin-data";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const metadata = { title: "Görseller" };

export default function PhotosPage({ searchParams }: { searchParams: Promise<{ imported?: string }> }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <PhotosContent searchParams={searchParams} />
    </Suspense>
  );
}

async function PhotosContent({ searchParams }: { searchParams: Promise<{ imported?: string }> }) {
  const params = await searchParams;
  const imported = Number(params.imported);
  if (!getSupabaseEnv()) {
    return (
      <div>
        <PageHeader description="Görseller Supabase depolamasına yazılır." title="Görseller" />
        <Notice tone="info">Supabase bağlı değil. Bağlantıdan sonra yerel menüyü buradan aktarabilirsiniz.</Notice>
      </div>
    );
  }

  const result = await getProductList();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        description="Önce yerel menüyü veritabanına alın. Sonra görselleri sürükleyip tek seferde kaydedin."
        title="Görseller"
      />
      <div className="grid gap-6">
        {Number.isInteger(imported) && imported > 0 ? <Notice tone="ok">{imported} ürün Supabase'e aktarıldı. Görselleri aşağıya bırakabilirsiniz.</Notice> : null}
        {result.products.length === 0 ? (
          <div className="grid gap-4 rounded-3xl border border-dashed border-line px-5 py-8">
            <p className="text-sm leading-6 text-muted">
              Supabase'te ürün yok. Bu bilgisayardaki menü duruyor; aktarınca kategoriler, çeviriler ve seçenekler de gider. Fotoğraflar ayrı yüklenir.
            </p>
            <ImportMenuButton />
          </div>
        ) : (
          <PhotoBoard
            products={result.products.map((product) => ({
              id: product.id,
              name: product.name,
              categoryName: product.categoryName,
              imageUrl: product.imageUrl,
            }))}
          />
        )}
      </div>
    </div>
  );
}
