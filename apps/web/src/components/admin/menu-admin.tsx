"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AdminBreadcrumb } from "./admin-shell";
import CategoryList from "./menu/category-list";
import ProductList from "./menu/product-list";
import ProductEditor from "./menu/product-editor";
import CategoryEditor from "./menu/category-editor";
import { loadAdminMenuData, reorderCategories, reorderProducts } from "@/lib/admin/menu-data";
import type { AdminCategory, AdminMenuData, AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function MenuAdminInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const productId = searchParams.get("product");
  const editCategory = searchParams.get("editCategory");

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

  const selectedProduct = useMemo(
    () => data?.products.find((product) => product.id === productId) ?? null,
    [data, productId],
  );

  const categoryProducts = useMemo(
    () => (categoryId ? (data?.products.filter((product) => product.categoryId === categoryId) ?? []) : []),
    [data, categoryId],
  );

  const breadcrumbs = useMemo(() => {
    const items: Array<{ label: string; href?: string }> = [{ label: "Menü", href: "/admin/menu" }];
    if (selectedCategory) {
      items.push({
        label: selectedCategory.names.tr || selectedCategory.id,
        href: `/admin/menu?category=${selectedCategory.id}`,
      });
    }
    if (selectedProduct) {
      items.push({ label: selectedProduct.names.tr || selectedProduct.id });
    }
    return items;
  }, [selectedCategory, selectedProduct]);

  const handleCategorySaved = (category: AdminCategory) => {
    setData((current) =>
      current
        ? { ...current, categories: current.categories.map((c) => (c.id === category.id ? category : c)) }
        : current,
    );
    setDirty(false);
    navigate({ category: category.id });
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
    return <p className="admin-muted">Menü verileri yükleniyor…</p>;
  }

  if (error || !data) {
    return <p className="admin-error">{error ?? "Veri bulunamadı."}</p>;
  }

  if (editCategory && selectedCategory) {
    return (
      <>
        <AdminBreadcrumb items={breadcrumbs} />
        <CategoryEditor
          category={selectedCategory}
          onDirtyChange={setDirty}
          onSaved={handleCategorySaved}
          onCancel={() => navigate({ category: selectedCategory.id })}
        />
      </>
    );
  }

  if (productId && selectedProduct && selectedCategory) {
    return (
      <>
        <AdminBreadcrumb items={breadcrumbs} />
        <ProductEditor
          product={selectedProduct}
          categoryName={selectedCategory.names.tr}
          onDirtyChange={setDirty}
          onSaved={handleProductSaved}
          onCancel={() => navigate({ category: selectedCategory.id })}
        />
      </>
    );
  }

  if (categoryId && selectedCategory) {
    return (
      <>
        <AdminBreadcrumb items={breadcrumbs} />
        <ProductList
          category={selectedCategory}
          products={categoryProducts}
          allProductIds={data.products.map((product) => product.id)}
          onSelectProduct={(id) => navigate({ category: categoryId, product: id })}
          onEditCategory={() => navigate({ category: categoryId, editCategory: "1" })}
          onBack={() => navigate({})}
          onProductsChange={handleCategoryProductsChange}
          onReorder={handleReorderProducts}
        />
      </>
    );
  }

  return (
    <>
      <AdminBreadcrumb items={breadcrumbs} />
      <CategoryList
        categories={data.categories}
        onSelectCategory={(id) => navigate({ category: id })}
        onEditCategory={(id) => navigate({ category: id, editCategory: "1" })}
        onCategoriesChange={handleCategoriesChange}
        onReorder={handleReorderCategories}
      />
    </>
  );
}

export default function MenuAdmin() {
  return (
    <Suspense fallback={<p className="admin-muted">Yükleniyor…</p>}>
      <MenuAdminInner />
    </Suspense>
  );
}
