"use client";

import { useMemo, useState } from "react";
import SortableList from "@/components/admin/sortable-list";
import CreateCategoryDialog from "./create-category-dialog";
import type { AdminCategory } from "@/lib/admin/types";

type Props = {
  categories: AdminCategory[];
  onSelectCategory: (id: string) => void;
  onEditCategory: (id: string) => void;
  onCategoriesChange: (categories: AdminCategory[]) => void;
  onReorder: (categories: AdminCategory[]) => Promise<void>;
};

export default function CategoryList({
  categories,
  onSelectCategory,
  onEditCategory,
  onCategoriesChange,
  onReorder,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const nextSortOrder = useMemo(() => {
    if (sortedCategories.length === 0) return 0;
    return Math.max(...sortedCategories.map((category) => category.sortOrder)) + 1;
  }, [sortedCategories]);

  const handleReorder = async (reordered: AdminCategory[]) => {
    const withOrder = reordered.map((category, index) => ({ ...category, sortOrder: index }));
    onCategoriesChange(withOrder);
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

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Kategoriler</h1>
          <p className="admin-muted">
            {categories.length} kategori · Sürükleyerek sıralayın
            {reordering ? " · Kaydediliyor…" : ""}
          </p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-button" onClick={() => setShowCreate(true)}>
            + Yeni Kategori
          </button>
        </div>
      </div>

      {reorderError ? <p className="admin-error">{reorderError}</p> : null}

      <SortableList
        items={sortedCategories}
        onReorder={(items) => void handleReorder(items)}
        disabled={reordering}
        renderItem={(category, _index, dragHandle) => (
          <article className="admin-card admin-card-sortable">
            {dragHandle}
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
        )}
      />

      {showCreate ? (
        <CreateCategoryDialog
          existingIds={categories.map((category) => category.id)}
          nextSortOrder={nextSortOrder}
          onCreated={(category) => onCategoriesChange([...categories, category])}
          onClose={() => setShowCreate(false)}
        />
      ) : null}
    </section>
  );
}
