"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProductForm from "@/components/admin/forms/product-form";
import LoadingBlock from "@/components/admin/ui/loading-block";
import EmptyState from "@/components/admin/ui/empty-state";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import type { AdminProduct } from "@/lib/admin/types";

function emptyProduct(categoryId: string): AdminProduct {
  return {
    id: "",
    categoryId,
    price: 0,
    imageUrl: "",
    sortOrder: 0,
    isActive: true,
    names: { tr: "", en: "", ru: "", de: "", fr: "", ar: "" },
    descriptions: { tr: "", en: "", ru: "", de: "", fr: "", ar: "" },
    contents: { tr: [], en: [], ru: [], de: [], fr: [], ar: [] },
    modifiers: [],
  };
}

export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { products, categories, loading, error, refresh } = useAdminData();

  const isNew = params.id === "new";
  const product = isNew ? null : products.find((item) => item.id === params.id);

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Ürün yükleniyor…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <p className="admin-error">{error}</p>
      </div>
    );
  }

  if (!isNew && !product) {
    return (
      <div className="admin-page">
        <EmptyState
          icon="search_off"
          title="Ürün bulunamadı"
          description="Bu ürün silinmiş veya mevcut değil."
          action={
            <Link href="/admin/products" className="admin-button admin-button-sm">
              Ürün listesine dön
            </Link>
          }
        />
      </div>
    );
  }

  const defaultCategory = searchParams.get("category") ?? categories[0]?.id ?? "";
  const draft = product ?? emptyProduct(defaultCategory);

  return (
    <div className="admin-page">
      <div className="admin-page-toolbar">
        <div>
          <h2 className="admin-page-section-title">{isNew ? "Yeni Ürün" : product?.names.tr || product?.id}</h2>
          <p className="admin-muted">Temel bilgiler, çeviriler ve seçenekler</p>
        </div>
        <Link href="/admin/products" className="admin-button admin-button-secondary admin-button-sm">
          ← Ürün listesi
        </Link>
      </div>

      <ProductForm
        product={draft}
        categories={categories}
        isNew={isNew}
        onSaved={async () => {
          await refresh();
          router.push("/admin/products");
        }}
        onCancel={() => router.push("/admin/products")}
      />
    </div>
  );
}
