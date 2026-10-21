import Link from "next/link";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/page-header";
import { saveProduct } from "@/app/admin/actions/products";
import { getProductOptions } from "@/lib/admin-data";

export const metadata = { title: "Yeni ürün" };

export default function NewProductPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <NewProductContent />
    </Suspense>
  );
}

async function NewProductContent() {
  const result = await getProductOptions();
  if (!result.ok) return <LoadError message={result.message} reason={result.reason} />;

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/products">
            Listeye dön
          </Link>
        }
        title="Yeni ürün"
      />
      {result.categories.length === 0 ? (
        <p className="text-sm text-muted">
          Ürün eklemeden önce bir{" "}
          <Link className="font-medium text-accent" href="/admin/categories/new">
            kategori oluşturun
          </Link>
          .
        </p>
      ) : (
        <ProductForm action={saveProduct} allergens={result.allergens} categories={result.categories} />
      )}
    </div>
  );
}
