"use client";

import type { AdminCategory } from "@/lib/admin/types";

type Props = {
  categories: AdminCategory[];
  onSelectCategory: (id: string) => void;
  onEditCategory: (id: string) => void;
};

export default function CategoryList({ categories, onSelectCategory, onEditCategory }: Props) {
  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Kategoriler</h1>
          <p className="admin-muted">{categories.length} kategori</p>
        </div>
      </div>

      <div className="admin-card-grid">
        {categories.map((category) => (
          <article key={category.id} className="admin-card">
            <button type="button" className="admin-card-main" onClick={() => onSelectCategory(category.id)}>
              <h2>{category.names.tr || category.id}</h2>
              <p className="admin-muted">{category.productCount} ürün</p>
              <div className="admin-badges">
                <span className={`admin-badge ${category.isVisible ? "success" : "muted"}`}>
                  {category.isVisible ? "Görünür" : "Gizli"}
                </span>
                <span className="admin-badge">{category.slug}</span>
              </div>
            </button>
            <button type="button" className="admin-card-action" onClick={() => onEditCategory(category.id)}>
              Düzenle
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
