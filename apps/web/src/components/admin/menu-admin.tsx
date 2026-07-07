"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryNav from "./menu/category-nav";
import CategorySettings from "./menu/category-settings";
import ProductListPanel from "./menu/product-list-panel";
import ProductEditor from "./menu/product-editor";
import { loadAdminMenuData, reorderCategories, reorderProducts } from "@/lib/admin/menu-data";
import type { AdminCategory, AdminMenuData, AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function MenuAdminInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const productId = searchParams.get("product");

  const [data, setData] = useState<AdminMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const menu = await loadAdminMenuData(supabase);
      setData(menu);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Veri yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const sortedCategories = useMemo(
    () => (data ? [...data.categories].sort((a, b) => a.sortOrder - b.sortOrder) : []),
    [data],
  );

  useEffect(() => {
    if (!data || loading) return;
    if (categoryId && data.categories.some((category) => category.id === categoryId)) return;
    if (sortedCategories.length === 0) return;

    const next = new URLSearchParams(searchParams.toString());
    next.set("category", sortedCategories[0].id);
    next.delete("product");
    router.replace(`/admin/menu?${next.toString()}`);
  }, [categoryId, data, loading, router, searchParams, sortedCategories]);

  const navigate = useCallback(
    (params: Record<string, string | null>) => {
      if (dirty && !window.confirm("Kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz?")) {
        return;
      }
      setDirty(false);
      const next = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value) next.set(key, value);
      }
      const query = next.toString();
      router.push(query ? `/admin/menu?${query}` : "/admin/menu");
    },
    [dirty, router],
  );

  const selectedCategory = useMemo(
    () => data?.categories.find((category) => category.id === categoryId) ?? null,
    [data, categoryId],
  );

  const selectedProduct = useMemo(() => {
    if (!productId || !categoryId) return null;
    const product = data?.products.find((item) => item.id === productId);
    if (!product || product.categoryId !== categoryId) return null;
    return product;
  }, [data, productId, categoryId]);

  const categoryProducts = useMemo(
    () => (categoryId ? (data?.products.filter((product) => product.categoryId === categoryId) ?? []) : []),
    [data, categoryId],
  );

  const handleCategorySaved = (category: AdminCategory) => {
    setData((current) =>
      current
        ? { ...current, categories: current.categories.map((c) => (c.id === category.id ? category : c)) }
        : current,
    );
    setDirty(false);
  };

  const handleProductSaved = (product: AdminProduct) => {
    setData((current) =>
      current
        ? { ...current, products: current.products.map((p) => (p.id === product.id ? product : p)) }
        : current,
    );
    setDirty(false);
  };

  const handleCategoriesChange = (categories: AdminCategory[]) => {
    setData((current) => (current ? { ...current, categories } : current));
  };

  const handleCategoryProductsChange = (updatedProducts: AdminProduct[]) => {
    setData((current) => {
      if (!current || !categoryId) return current;
      const otherProducts = current.products.filter((product) => product.categoryId !== categoryId);
      const categories = current.categories.map((category) =>
        category.id === categoryId ? { ...category, productCount: updatedProducts.length } : category,
      );
      return { ...current, categories, products: [...otherProducts, ...updatedProducts] };
    });
  };

  const handleReorderCategories = async (categories: AdminCategory[]) => {
    const supabase = getSupabaseBrowserClient();
    await reorderCategories(supabase, categories);
  };

  const handleReorderProducts = async (products: AdminProduct[]) => {
    if (!categoryId) return;
    const supabase = getSupabaseBrowserClient();
    await reorderProducts(supabase, products, categoryId);
  };

  if (loading) {
    return <p className="admin-muted admin-menu-loading">Menü verileri yükleniyor…</p>;
  }

  if (error || !data) {
    return <p className="admin-error">{error ?? "Veri bulunamadı."}</p>;
  }

  return (
    <div className="admin-menu-workspace">
      <CategoryNav
        categories={data.categories}
        selectedId={categoryId}
        onSelect={(id) => navigate({ category: id })}
        onCategoriesChange={handleCategoriesChange}
        onReorder={handleReorderCategories}
      />

      <div className="admin-menu-main">
        {selectedCategory ? (
          <>
            <CategorySettings
              category={selectedCategory}
              onDirtyChange={setDirty}
              onSaved={handleCategorySaved}
            />
            <ProductListPanel
              category={selectedCategory}
              products={categoryProducts}
              selectedProductId={productId}
              allProductIds={data.products.map((product) => product.id)}
              onSelectProduct={(id) => navigate({ category: categoryId, product: id })}
              onProductsChange={handleCategoryProductsChange}
              onReorder={handleReorderProducts}
            />
          </>
        ) : (
          <div className="admin-empty-panel">
            <h2>Kategori seçin</h2>
            <p className="admin-muted">Sol listeden bir kategori seçerek başlayın.</p>
          </div>
        )}
      </div>

      <aside className="admin-menu-detail">
        {selectedProduct && selectedCategory ? (
          <ProductEditor
            product={selectedProduct}
            categoryName={selectedCategory.names.tr}
            embedded
            onDirtyChange={setDirty}
            onSaved={handleProductSaved}
          />
        ) : (
          <div className="admin-empty-panel admin-empty-detail">
            <h2>Ürün özellikleri</h2>
            <p className="admin-muted">Düzenlemek için listeden bir ürün seçin.</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function MenuAdmin() {
  return (
    <Suspense fallback={<p className="admin-muted admin-menu-loading">Yükleniyor…</p>}>
      <MenuAdminInner />
    </Suspense>
  );
}
