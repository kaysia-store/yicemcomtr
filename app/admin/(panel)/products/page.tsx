import Link from "next/link";
import { Suspense } from "react";
import { deleteProduct, moveProduct, toggleProductPublished } from "@/app/admin/actions/products";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { PublishButton, SortButtons } from "@/components/admin/list-controls";
import { MenuSectionNav } from "@/components/admin/menu-section-nav";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { getProductList } from "@/lib/admin-data";
import { formatPrice, menuImageFit } from "@/lib/format";

export const metadata = { title: "Ürünler" };

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const result = await getProductList();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  const groups = new Map<string, typeof result.products>();
  for (const product of result.products) {
    const list = groups.get(product.categoryId) ?? [];
    list.push(product);
    groups.set(product.categoryId, list);
  }

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-primary" href="/admin/products/new">
            Ürün ekle
          </Link>
        }
        description="Kategori, fiyat ve görseller bu bölümün sekmelerinde."
        title="Ürünler"
      />
      <MenuSectionNav />
      {result.products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted">
          <p>Henüz ürün yok.</p>
          <Link className="mt-3 inline-flex text-ink underline" href="/admin/photos">
            Yerel menüyü Supabase'e aktar
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {[...groups.entries()].map(([categoryId, products]) => (
            <section key={categoryId}>
              <h2 className="mb-3 font-serif text-2xl">{products[0]?.categoryName}</h2>
              <ul className="grid gap-3">
                {products.map((product, index) => (
                  <li className="flex flex-wrap items-center gap-3 rounded-3xl border border-line bg-card px-3 py-3" key={product.id}>
                    <div className="h-14 w-14 overflow-hidden rounded-2xl bg-paper">
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img alt="" className={`h-full w-full ${menuImageFit(product.imageUrl)}`} src={product.imageUrl} />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{product.name}</p>
                      {product.ingredients ? <p className="text-sm text-muted">{product.ingredients}</p> : null}
                      <p className="text-xs text-muted">
                        {formatPrice(product.price)} · {product.isPublished ? "Yayında" : "Gizli"}
                      </p>
                    </div>
                    <SortButtons
                      action={moveProduct}
                      extra={{ categoryId: product.categoryId }}
                      id={product.id}
                      index={index}
                      total={products.length}
                    />
                    <PublishButton action={toggleProductPublished} id={product.id} published={product.isPublished} />
                    <Link className="btn btn-secondary" href={`/admin/products/${product.id}`}>
                      Düzenle
                    </Link>
                    <ConfirmSubmit
                      action={deleteProduct.bind(null, product.id)}
                      confirm="Bu ürünü silmek istediğinize emin misiniz?"
                    >
                      Sil
                    </ConfirmSubmit>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
