"use client";

import { useMemo, useState } from "react";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";

type Props = {
  category: AdminCategory;
  products: AdminProduct[];
  onSelectProduct: (id: string) => void;
  onEditCategory: () => void;
  onBack: () => void;
};

export default function ProductList({ category, products, onSelectProduct, onEditCategory, onBack }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (product) =>
        product.id.toLowerCase().includes(q) ||
        product.names.tr.toLowerCase().includes(q) ||
        product.names.en.toLowerCase().includes(q),
    );
  }, [products, query]);

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>{category.names.tr || category.id}</h1>
          <p className="admin-muted">{filtered.length} ürün</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onBack}>
            ← Kategoriler
          </button>
          <button type="button" className="admin-button admin-button-secondary" onClick={onEditCategory}>
            Kategori Düzenle
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

      <div className="admin-list">
        {filtered.map((product) => (
          <button key={product.id} type="button" className="admin-list-item" onClick={() => onSelectProduct(product.id)}>
            <img
              src={product.imageUrl || "/favicon.png"}
              alt=""
              className="admin-list-thumb"
            />
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
    </section>
  );
}
