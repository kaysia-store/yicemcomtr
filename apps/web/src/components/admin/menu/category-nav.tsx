"use client";

import { useMemo, useState } from "react";
import SortableList from "@/components/admin/sortable-list";
import CreateCategoryDialog from "./create-category-dialog";
import type { AdminCategory } from "@/lib/admin/types";

type Props = {
  categories: AdminCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCategoriesChange: (categories: AdminCategory[]) => void;
  onReorder: (categories: AdminCategory[]) => Promise<void>;
};

export default function CategoryNav({
  categories,
  selectedId,
  onSelect,
  onCategoriesChange,
  onReorder,
}: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [reordering, setReordering] = useState(false);

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
    try {
      await onReorder(withOrder);
    } finally {
      setReordering(false);
    }
  };

  return (
    <aside className="admin-menu-categories">
      <div className="admin-menu-panel-head">
        <div>
          <h2>Kategoriler</h2>
          <p className="admin-muted">{categories.length} adet{reordering ? " · kaydediliyor…" : ""}</p>
        </div>
        <button type="button" className="admin-icon-btn" onClick={() => setShowCreate(true)} title="Yeni kategori">
          +
        </button>
      </div>

      <SortableList
        items={sortedCategories}
        onReorder={(items) => void handleReorder(items)}
        disabled={reordering}
        renderItem={(category, _index, dragHandle) => (
          <button
            type="button"
            className={`admin-category-nav-item ${selectedId === category.id ? "active" : ""}`}
            onClick={() => onSelect(category.id)}
          >
            {dragHandle}
            <span className="admin-category-nav-body">
              <strong>{category.names.tr || category.id}</strong>
              <span className="admin-muted">
                {category.productCount} ürün
                {!category.isVisible ? " · gizli" : ""}
              </span>
            </span>
          </button>
        )}
      />

      {showCreate ? (
        <CreateCategoryDialog
          existingIds={categories.map((category) => category.id)}
          nextSortOrder={nextSortOrder}
          onCreated={(category) => {
            onCategoriesChange([...categories, category]);
            onSelect(category.id);
          }}
          onClose={() => setShowCreate(false)}
        />
      ) : null}
    </aside>
  );
}
