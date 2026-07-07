"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CategoryForm from "@/components/admin/forms/category-form";
import ProductForm from "@/components/admin/forms/product-form";
import AdminHeaderToolbar from "@/components/admin/admin-header-toolbar";
import CreateProductDialog from "@/components/admin/menu/create-product-dialog";
import EmptyState from "@/components/admin/ui/empty-state";
import LoadingBlock from "@/components/admin/ui/loading-block";
import SortableList from "@/components/admin/sortable-list";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import {
  deleteCategory,
  reorderCategories,
  reorderProducts,
  toggleCategoryVisibility,
  toggleProductActive,
} from "@/lib/admin/menu-data";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
}

function productMatchesQuery(product: AdminProduct, query: string) {
  const q = query.toLowerCase();
  return (
    product.id.toLowerCase().includes(q) ||
    product.names.tr.toLowerCase().includes(q) ||
    product.names.en.toLowerCase().includes(q)
  );
}

type CategorySectionProps = {
  category: AdminCategory;
  products: AdminProduct[];
  expanded: boolean;
  canDragCategory: boolean;
  canDragProducts: boolean;
  searchQuery: string;
  onToggleExpand: () => void;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onToggleVisibility: () => void;
  onEditProduct: (product: AdminProduct) => void;
  onCreateProduct: () => void;
  onToggleProduct: (product: AdminProduct) => void;
  onReorderProducts: (products: AdminProduct[]) => Promise<void>;
  categoryDragHandle: ReactNode;
};

function CategorySection({
  category,
  products,
  expanded,
  canDragCategory,
  canDragProducts,
  searchQuery,
  onToggleExpand,
  onEditCategory,
  onDeleteCategory,
  onToggleVisibility,
  onEditProduct,
  onCreateProduct,
  onToggleProduct,
  onReorderProducts,
  categoryDragHandle,
}: CategorySectionProps) {
  const [reordering, setReordering] = useState(false);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );

  const displayProducts = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return sortedProducts;
    return sortedProducts.filter((product) => productMatchesQuery(product, q));
  }, [sortedProducts, searchQuery]);

  const handleReorder = async (reordered: AdminProduct[]) => {
    const withOrder = reordered.map((product, index) => ({ ...product, sortOrder: index }));
    setReordering(true);
    try {
      await onReorderProducts(withOrder);
    } finally {
      setReordering(false);
    }
  };

  return (
    <section className={`admin-menu-accordion ${expanded ? "open" : ""}`}>
      <div className="admin-menu-accordion-head">
        {canDragCategory ? categoryDragHandle : null}
        <button type="button" className="admin-menu-accordion-toggle" onClick={onToggleExpand}>
          <span className="material-symbols-outlined admin-menu-accordion-chevron" aria-hidden>
            expand_more
          </span>
          <span className="admin-menu-accordion-title">{category.names.tr || category.id}</span>
          <span className="admin-menu-accordion-count">{category.productCount} ürün</span>
        </button>
        <div className="admin-menu-accordion-actions" onClick={(e) => e.stopPropagation()}>
          <label className="admin-toggle admin-toggle-sm">
            <input
              type="checkbox"
              checked={category.isVisible}
              onChange={onToggleVisibility}
              aria-label={category.isVisible ? "Görünür" : "Gizli"}
            />
            <span className="admin-toggle-track" />
            <span className="admin-toggle-thumb" />
          </label>
          <button type="button" className="admin-cat-icon-btn admin-cat-icon-btn-edit" onClick={onEditCategory} aria-label="Kategori düzenle">
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button
            type="button"
            className="admin-cat-icon-btn admin-cat-icon-btn-delete"
            onClick={onDeleteCategory}
            disabled={category.productCount > 0}
            aria-label="Kategori sil"
          >
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="admin-menu-accordion-body">
          {displayProducts.length === 0 ? (
            <p className="admin-muted admin-menu-empty-products">
              {searchQuery.trim() ? "Bu kategoride arama sonucu yok." : "Henüz ürün yok."}
            </p>
          ) : canDragProducts && !searchQuery.trim() ? (
            <SortableList
              items={sortedProducts}
              className="admin-menu-product-grid"
              onReorder={(items) => void handleReorder(items)}
              disabled={reordering}
              renderItem={(product, _index, dragHandle) => (
                <article className="admin-menu-product-card">
                  <div className="admin-menu-product-card-drag">{dragHandle}</div>
                    <button type="button" className="admin-menu-product-card-btn" onClick={() => onEditProduct(product)}>
                      <div className="admin-menu-product-image-wrap">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt="" className="admin-menu-product-image" />
                        ) : (
                          <span className="admin-menu-product-placeholder" aria-hidden>
                            🍽️
                          </span>
                        )}
                      </div>
                      <div className="admin-menu-product-info">
                        <strong>{product.names.tr || product.id}</strong>
                        <span className="admin-muted">{formatPrice(product.price)}</span>
                      </div>
                    </button>
                    <div className="admin-menu-product-card-foot">
                      <label className="admin-toggle admin-toggle-sm">
                        <input
                          type="checkbox"
                          checked={product.isActive}
                          onChange={() => onToggleProduct(product)}
                          aria-label={product.isActive ? "Aktif" : "Pasif"}
                        />
                        <span className="admin-toggle-track" />
                        <span className="admin-toggle-thumb" />
                      </label>
                      <button
                        type="button"
                        className="admin-text-btn"
                        onClick={() => onEditProduct(product)}
                        aria-label="Ürünü düzenle"
                      >
                        Düzenle
                      </button>
                    </div>
                </article>
              )}
            />
          ) : (
            <div className="admin-menu-product-grid">
              {displayProducts.map((product) => (
                <article key={product.id} className="admin-menu-product-card">
                  <button type="button" className="admin-menu-product-card-btn" onClick={() => onEditProduct(product)}>
                    <div className="admin-menu-product-image-wrap">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt="" className="admin-menu-product-image" />
                      ) : (
                        <span className="admin-menu-product-placeholder" aria-hidden>
                          🍽️
                        </span>
                      )}
                    </div>
                    <div className="admin-menu-product-info">
                      <strong>{product.names.tr || product.id}</strong>
                      <span className="admin-muted">{formatPrice(product.price)}</span>
                    </div>
                  </button>
                  <div className="admin-menu-product-card-foot">
                    <label className="admin-toggle admin-toggle-sm">
                      <input
                        type="checkbox"
                        checked={product.isActive}
                        onChange={() => onToggleProduct(product)}
                        aria-label={product.isActive ? "Aktif" : "Pasif"}
                      />
                      <span className="admin-toggle-track" />
                      <span className="admin-toggle-thumb" />
                    </label>
                    <button type="button" className="admin-text-btn" onClick={() => onEditProduct(product)}>
                      Düzenle
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <button type="button" className="admin-menu-add-product" onClick={onCreateProduct}>
            <span className="material-symbols-outlined" aria-hidden>
              add
            </span>
            Ürün Ekle
          </button>

          {reordering ? <p className="admin-muted admin-menu-reorder-hint">Sıralama kaydediliyor…</p> : null}
        </div>
      ) : null}
    </section>
  );
}

export default function MenuPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialProductId = searchParams.get("product");
  const { categories, products, loading, error, refresh } = useAdminData();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [editingCategory, setEditingCategory] = useState<AdminCategory | "new" | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [creatingProductCategoryId, setCreatingProductCategoryId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [categoryOrder, setCategoryOrder] = useState<AdminCategory[]>([]);
  const [categoryDragIndex, setCategoryDragIndex] = useState<number | null>(null);
  const [categoryReordering, setCategoryReordering] = useState(false);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const displayCategories = useMemo(() => {
    const base = categoryOrder.length > 0 ? categoryOrder : sortedCategories;
    const q = search.trim().toLowerCase();
    if (!q) return base;

    return base.filter((category) => {
      if (
        category.names.tr?.toLowerCase().includes(q) ||
        category.id.toLowerCase().includes(q) ||
        category.slug?.toLowerCase().includes(q)
      ) {
        return true;
      }
      return products.some((product) => product.categoryId === category.id && productMatchesQuery(product, q));
    });
  }, [categoryOrder, sortedCategories, search, products]);

  const autoExpanded = useMemo(() => {
    const q = search.trim();
    if (!q) return expanded;
    const next = new Set(expanded);
    for (const category of displayCategories) {
      next.add(category.id);
    }
    return next;
  }, [expanded, search, displayCategories]);

  const totalProducts = useMemo(() => products.length, [products]);
  const canDragCategories = !search.trim() && !categoryReordering;
  const allProductIds = useMemo(() => products.map((product) => product.id), [products]);

  useEffect(() => {
    if (!initialProductId || loading || products.length === 0) return;
    const product = products.find((item) => item.id === initialProductId);
    if (!product) return;
    setEditingProduct(product);
    setExpanded((current) => new Set(current).add(product.categoryId));
    router.replace("/admin/menu");
  }, [initialProductId, loading, products, router]);

  const toggleExpanded = (categoryId: string) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const handleCategoryReorderDrop = async (dropIndex: number) => {
    if (categoryDragIndex === null || categoryDragIndex === dropIndex || search.trim()) {
      setCategoryDragIndex(null);
      return;
    }

    const base = categoryOrder.length > 0 ? [...categoryOrder] : [...sortedCategories];
    const [moved] = base.splice(categoryDragIndex, 1);
    base.splice(dropIndex, 0, moved);
    setCategoryOrder(base);
    setCategoryDragIndex(null);
    setCategoryReordering(true);
    setActionError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      await reorderCategories(supabase, base);
      await refresh();
      setCategoryOrder([]);
    } catch (reorderError) {
      setActionError(reorderError instanceof Error ? reorderError.message : "Kategori sıralaması kaydedilemedi.");
      setCategoryOrder([]);
    } finally {
      setCategoryReordering(false);
    }
  };

  const handleToggleCategory = async (category: AdminCategory) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await toggleCategoryVisibility(supabase, category);
      await refresh();
    } catch (toggleError) {
      setActionError(toggleError instanceof Error ? toggleError.message : "Kategori durumu güncellenemedi.");
    }
  };

  const handleDeleteCategory = async (category: AdminCategory) => {
    if (category.productCount > 0) {
      setActionError("Ürünü olan kategori silinemez. Önce ürünleri taşıyın veya silin.");
      return;
    }
    if (!window.confirm(`«${category.names.tr}» kategorisini silmek istiyor musunuz?`)) return;
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await deleteCategory(supabase, category.id);
      setCategoryOrder([]);
      await refresh();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Kategori silinemedi.");
    }
  };

  const handleToggleProduct = async (product: AdminProduct) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await toggleProductActive(supabase, product);
      await refresh();
    } catch (toggleError) {
      setActionError(toggleError instanceof Error ? toggleError.message : "Ürün durumu güncellenemedi.");
    }
  };

  const handleReorderProducts = async (categoryId: string, reordered: AdminProduct[]) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await reorderProducts(supabase, reordered, categoryId);
      await refresh();
    } catch (reorderError) {
      setActionError(reorderError instanceof Error ? reorderError.message : "Ürün sıralaması kaydedilemedi.");
    }
  };

  const getCategoryProducts = (categoryId: string) => products.filter((product) => product.categoryId === categoryId);

  const getNextSortOrder = (categoryId: string) => {
    const categoryProducts = getCategoryProducts(categoryId);
    if (categoryProducts.length === 0) return 0;
    return Math.max(...categoryProducts.map((product) => product.sortOrder)) + 1;
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Menü yükleniyor…" />
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

  return (
    <div className="admin-page">
      <AdminHeaderToolbar>
        <div className="admin-header-search">
          <span className="material-symbols-outlined" aria-hidden>
            search
          </span>
          <input
            type="search"
            placeholder="Kategori veya ürün ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Menüde ara"
          />
        </div>
        <button type="button" className="admin-btn-primary" onClick={() => setEditingCategory("new")}>
          <span className="material-symbols-outlined" aria-hidden>
            add
          </span>
          Kategori Ekle
        </button>
      </AdminHeaderToolbar>

      {actionError ? <p className="admin-error">{actionError}</p> : null}

      {sortedCategories.length === 0 ? (
        <EmptyState
          icon="restaurant_menu"
          title="Henüz menü yok"
          description="İlk kategorinizi ekleyerek başlayın, ardından ürünleri ekleyin."
          action={
            <button type="button" className="admin-btn-primary" onClick={() => setEditingCategory("new")}>
              Kategori Ekle
            </button>
          }
        />
      ) : displayCategories.length === 0 ? (
        <p className="admin-muted">Arama sonucu bulunamadı.</p>
      ) : (
        <>
          <div className="admin-menu-summary">
            <span>{displayCategories.length} kategori</span>
            <span>·</span>
            <span>{totalProducts} ürün</span>
            {categoryReordering ? <span>· sıralama kaydediliyor…</span> : null}
          </div>

          <div className="admin-menu-accordions">
            {displayCategories.map((category, index) => {
              const categoryDragHandle = (
                <span
                  className={`admin-drag-handle ${canDragCategories ? "" : "disabled"}`}
                  draggable={canDragCategories}
                  onDragStart={() => setCategoryDragIndex(index)}
                  onDragEnd={() => setCategoryDragIndex(null)}
                  onClick={(event) => event.stopPropagation()}
                  title={canDragCategories ? "Kategoriyi sürükleyerek sırala" : "Arama aktifken sıralama kapalı"}
                  aria-label="Kategoriyi sürükleyerek sırala"
                >
                  ⋮⋮
                </span>
              );

              return (
                <div
                  key={category.id}
                  className={categoryDragIndex === index ? "admin-menu-accordion-wrap dragging" : "admin-menu-accordion-wrap"}
                  onDragOver={(e) => {
                    if (!canDragCategories) return;
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    void handleCategoryReorderDrop(index);
                  }}
                >
                  <CategorySection
                    category={category}
                    products={getCategoryProducts(category.id)}
                    expanded={autoExpanded.has(category.id)}
                    canDragCategory={canDragCategories}
                    canDragProducts={!search.trim()}
                    searchQuery={search}
                    onToggleExpand={() => toggleExpanded(category.id)}
                    onEditCategory={() => setEditingCategory(category)}
                    onDeleteCategory={() => void handleDeleteCategory(category)}
                    onToggleVisibility={() => void handleToggleCategory(category)}
                    onEditProduct={setEditingProduct}
                    onCreateProduct={() => setCreatingProductCategoryId(category.id)}
                    onToggleProduct={(product) => void handleToggleProduct(product)}
                    onReorderProducts={(reordered) => handleReorderProducts(category.id, reordered)}
                    categoryDragHandle={categoryDragHandle}
                  />
                </div>
              );
            })}
          </div>

          <div className="admin-insights">
            <div className="admin-insight-card admin-insight-card-hint">
              <div>
                <h4 className="admin-insight-title">Menünüzü düzenleyin</h4>
                <p className="admin-insight-text">
                  Kategorileri ve ürünleri sürükleyerek sıralayın. Ürün kartına tıklayarak düzenleme ve seçenekleri yönetin.
                </p>
              </div>
              <span className="material-symbols-outlined admin-insight-icon" aria-hidden>
                reorder
              </span>
            </div>
            <div className="admin-insight-card admin-insight-card-stat">
              <span className="admin-insight-stat-label">Toplam Ürün</span>
              <div className="admin-insight-stat-value">
                <span className="admin-insight-stat-number">{totalProducts}</span>
                <span className="admin-insight-stat-suffix">menüde</span>
              </div>
            </div>
          </div>
        </>
      )}

      {editingCategory ? (
        <div className="admin-modal-backdrop" onClick={() => setEditingCategory(null)} role="presentation">
          <div
            className="admin-modal-sheet admin-modal-sheet-wide"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
          >
            <button type="button" className="admin-modal-close" onClick={() => setEditingCategory(null)} aria-label="Kapat">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="admin-modal-scroll">
              <CategoryForm
                category={editingCategory === "new" ? null : editingCategory}
                isNew={editingCategory === "new"}
                onSaved={() => {
                  setEditingCategory(null);
                  setCategoryOrder([]);
                  void refresh();
                }}
                onCancel={() => setEditingCategory(null)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {editingProduct ? (
        <div className="admin-modal-backdrop" onClick={() => setEditingProduct(null)} role="presentation">
          <div
            className="admin-modal-sheet admin-modal-sheet-wide"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
          >
            <button type="button" className="admin-modal-close" onClick={() => setEditingProduct(null)} aria-label="Kapat">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="admin-modal-scroll">
              <ProductForm
                product={editingProduct}
                categories={sortedCategories}
                onSaved={() => {
                  setEditingProduct(null);
                  void refresh();
                }}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          </div>
        </div>
      ) : null}

      {creatingProductCategoryId ? (
        <CreateProductDialog
          categoryId={creatingProductCategoryId}
          existingIds={allProductIds}
          nextSortOrder={getNextSortOrder(creatingProductCategoryId)}
          onCreated={(product) => {
            setCreatingProductCategoryId(null);
            void refresh().then(() => setEditingProduct(product));
          }}
          onClose={() => setCreatingProductCategoryId(null)}
        />
      ) : null}
    </div>
  );
}
