import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/product-form";
import { LoadError } from "@/components/load-error";
import { LoadingState } from "@/components/loading-state";
import { Notice } from "@/components/notice";
import { PageHeader } from "@/components/page-header";
import { saveProduct } from "@/app/admin/actions/products";
import { getProductEditor, getProductOptions } from "@/lib/admin-data";
import { uuidPattern } from "@/lib/validators";

export const metadata = { title: "Ürünü düzenle" };

export default function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <Suspense fallback={<LoadingState />}>
      <Editor params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Editor({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  if (!uuidPattern.test(id)) notFound();

  const [productResult, optionsResult] = await Promise.all([getProductEditor(id), getProductOptions()]);
  if (!productResult.ok) return <LoadError message={productResult.message} reason={productResult.reason} />;
  if (!optionsResult.ok) return <LoadError message={optionsResult.message} reason={optionsResult.reason} />;
  if (!productResult.product) notFound();

  const product = productResult.product;

  return (
    <div>
      <PageHeader
        action={
          <Link className="btn btn-secondary" href="/admin/products">
            Listeye dön
          </Link>
        }
        title="Ürünü düzenle"
      />
      {query.error ? (
        <div className="mb-4">
          <Notice tone="error">{query.error}</Notice>
        </div>
      ) : null}
      <ProductForm
        action={saveProduct}
        allergens={optionsResult.allergens}
        categories={optionsResult.categories}
        product={{
          ...product,
          price: product.price.toFixed(2),
        }}
      />
    </div>
  );
}
