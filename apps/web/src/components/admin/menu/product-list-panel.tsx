"use client";

import { useMemo, useState } from "react";
import SortableList from "@/components/admin/sortable-list";
import CreateProductDialog from "./create-product-dialog";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";

type Props = {
  category: AdminCategory;
  products: AdminProduct[];
  selectedProductId: string | null;
  allProductIds: string[];
  onSelectProduct: (id: string) => void;
  onProductsChange: (products: AdminProduct[]) => void;
  onReorder: (products: AdminProduct[]) => Promise<void>;
};

export default function ProductListPanel({
  category,
  products,
  selectedProductId,
  allProductIds,
  onSelectProduct,
  onProductsChange,
  onReorder,
}: Props) {
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [reordering, setReordering] = useState(false);

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
    try {
      await onReorder(withOrder);
    } finally {
      setReordering(false);
    }
  };

  return (
    <section className="admin-k-card admin-k-card-padded admin-products-panel">
      <div className="admin-k-card-head">
        <div>
          <h3 className="admin-k-section-title">Ürünler</h3>
          <p className="admin-muted">
            {filtered.length} ürün{reordering ? " · kaydediliyor…" : ""}
          </p>
        </div>
        <button type="button" className="admin-button admin-button-sm" onClick={() => setShowCreate(true)}>
          + Yeni Ürün
        </button>
      </div>

      <input
        className="admin-input admin-search-compact"
        type="search"
        placeholder="Ürün ara…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      {query.trim() ? (
        <div className="admin-product-rows">
          {filtered.map((product) => (
            <button
              key={product.id}
              type="button"
              className={`admin-product-row ${selectedProductId === product.id ? "active" : ""}`}
              onClick={() => onSelectProduct(product.id)}
            >
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
            <button
              type="button"
              className={`admin-product-row ${selectedProductId === product.id ? "active" : ""}`}
              onClick={() => onSelectProduct(product.id)}
            >
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
          onCreated={(product) => {
            onProductsChange([...products, product]);
            onSelectProduct(product.id);
          }}
          onClose={() => setShowCreate(false)}
        />
      ) : null}
    </section>
  );
}
