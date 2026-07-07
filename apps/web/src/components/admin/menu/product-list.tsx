"use client";

import { useMemo, useState } from "react";
import SortableList from "@/components/admin/sortable-list";
import CreateProductDialog from "./create-product-dialog";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";

type Props = {
  category: AdminCategory;
  products: AdminProduct[];
  allProductIds: string[];
  onSelectProduct: (id: string) => void;
  onEditCategory: () => void;
  onBack: () => void;
  onProductsChange: (products: AdminProduct[]) => void;
  onReorder: (products: AdminProduct[]) => Promise<void>;
};

export default function ProductList({
  category,
  products,
  allProductIds,
  onSelectProduct,
  onEditCategory,
  onBack,
  onProductsChange,
  onReorder,
}: Props) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.sortOrder - b.sortOrder),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedProducts;
    return sortedProducts.filter(
      (product) =>
        product.id.toLowerCase().includes(q) ||
        product.names.tr.toLowerCase().includes(q) ||
        product.names.en.toLowerCase().includes(q),
    );
  }, [sortedProducts, query]);

  const nextSortOrder = useMemo(() => {
    if (sortedProducts.length === 0) return 0;
    return Math.max(...sortedProducts.map((product) => product.sortOrder)) + 1;
  }, [sortedProducts]);

  const handleReorder = async (reordered: AdminProduct[]) => {
    const withOrder = reordered.map((product, index) => ({ ...product, sortOrder: index }));
    onProductsChange(withOrder);
    setReordering(true);
    setReorderError(null);
    try {
      await onReorder(withOrder);
    } catch (error) {
      setReorderError(error instanceof Error ? error.message : "Sıralama kaydedilemedi.");
    } finally {
      setReordering(false);
    }
  };

  const handleProductCreated = (product: AdminProduct) => {
    onProductsChange([...products, product]);
    onSelectProduct(product.id);
  };

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>{category.names.tr || category.id}</h1>
          <p className="admin-muted">
            {filtered.length} ürün · Sürükleyerek sıralayın
            {reordering ? " · Kaydediliyor…" : ""}
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onBack}>
            ← Kategoriler
          </button>
          <button type="button" className="admin-button admin-button-secondary" onClick={onEditCategory}>
            Kategori Düzenle
          </button>
          <button type="button" className="admin-button" onClick={() => setShowCreate(true)}>
            + Yeni Ürün
          </button>
        </div>
      </div>

      <input
        className="admin-input admin-search"
        type="search"
        placeholder="Ürün ara (isim veya ID)…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {reorderError ? <p className="admin-error">{reorderError}</p> : null}

      {query.trim() ? (
        <div className="admin-list">
          {filtered.map((product) => (
            <button key={product.id} type="button" className="admin-list-item" onClick={() => onSelectProduct(product.id)}>
              <img src={product.imageUrl || "/favicon.png"} alt="" className="admin-list-thumb" />
              <div className="admin-list-body">
                <strong>{product.names.tr || product.id}</strong>
                <span className="admin-muted">
                  {product.id} · ₺{product.price}
                </span>
              </div>
              <span className={`admin-badge ${product.isActive ? "success" : "muted"}`}>
                {product.isActive ? "Aktif" : "Pasif"}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <SortableList
          items={sortedProducts}
          onReorder={(items) => void handleReorder(items)}
          disabled={reordering}
          renderItem={(product, _index, dragHandle) => (
            <button type="button" className="admin-list-item admin-list-item-sortable" onClick={() => onSelectProduct(product.id)}>
              {dragHandle}
              <img src={product.imageUrl || "/favicon.png"} alt="" className="admin-list-thumb" />
              <div className="admin-list-body">
                <strong>{product.names.tr || product.id}</strong>
                <span className="admin-muted">
                  {product.id} · ₺{product.price}
                </span>
              </div>
              <span className={`admin-badge ${product.isActive ? "success" : "muted"}`}>
                {product.isActive ? "Aktif" : "Pasif"}
              </span>
            </button>
          )}
        />
      )}

      {showCreate ? (
        <CreateProductDialog
          categoryId={category.id}
          existingIds={allProductIds}
          nextSortOrder={nextSortOrder}
          onCreated={handleProductCreated}
          onClose={() => setShowCreate(false)}
        />
      ) : null}
    </section>
  );
}
