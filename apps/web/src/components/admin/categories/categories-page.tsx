"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import CategoryForm from "@/components/admin/forms/category-form";
import EmptyState from "@/components/admin/ui/empty-state";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import {
  deleteCategory,
  toggleCategoryVisibility,
} from "@/lib/admin/menu-data";
import type { AdminCategory } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function CategoriesPage() {
  const { categories, loading, error, refresh } = useAdminData();
  const [editing, setEditing] = useState<AdminCategory | "new" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sorted = useMemo(() => [...categories].sort((a, b) => a.sortOrder - b.sortOrder), [categories]);

  const handleSaved = async (category: AdminCategory) => {
    setEditing(null);
    await refresh();
  };

  const handleToggle = async (category: AdminCategory) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await toggleCategoryVisibility(supabase, category);
      await refresh();
    } catch (toggleError) {
      setActionError(toggleError instanceof Error ? toggleError.message : "Durum güncellenemedi.");
    }
  };

  const handleDelete = async (category: AdminCategory) => {
    if (category.productCount > 0) {
      setActionError("Ürünü olan kategori silinemez. Önce ürünleri taşıyın veya silin.");
      return;
    }
    if (!window.confirm(`«${category.names.tr}» kategorisini silmek istiyor musunuz?`)) return;
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await deleteCategory(supabase, category.id);
      await refresh();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Silme başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Kategoriler yükleniyor…" />
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
      <div className="admin-page-toolbar">
        <div>
          <h2 className="admin-page-section-title">Kategoriler</h2>
          <p className="admin-muted">{sorted.length} kategori</p>
        </div>
        <button type="button" className="admin-button admin-button-sm" onClick={() => setEditing("new")}>
          + Yeni Kategori
        </button>
      </div>

      {actionError ? <p className="admin-error">{actionError}</p> : null}

      {editing ? (
        <div className="admin-k-card admin-k-card-padded admin-form-modal-inline">
          <CategoryForm
            category={editing === "new" ? null : editing}
            isNew={editing === "new"}
            onSaved={(category) => void handleSaved(category)}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : null}

      {sorted.length === 0 ? (
        <EmptyState
          icon="category"
          title="Henüz kategori yok"
          description="İlk kategorinizi ekleyerek başlayın."
          action={
            <button type="button" className="admin-button admin-button-sm" onClick={() => setEditing("new")}>
              Kategori Ekle
            </button>
          }
        />
      ) : (
        <div className="admin-k-card admin-k-table-card">
          <div className="admin-k-table-wrap">
            <table className="admin-k-table">
              <thead>
                <tr>
                  <th>Sıra</th>
                  <th>Kategori</th>
                  <th>Ürün</th>
                  <th>Durum</th>
                  <th className="admin-table-actions-col">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((category) => (
                  <tr key={category.id}>
                    <td>{category.sortOrder}</td>
                    <td>
                      <strong>{category.names.tr || category.id}</strong>
                      <div className="admin-muted admin-mono">{category.id}</div>
                    </td>
                    <td>{category.productCount}</td>
                    <td>
                      <span className={`admin-pill ${category.isVisible ? "admin-pill-active" : "admin-pill-muted"}`}>
                        {category.isVisible ? "Aktif" : "Gizli"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <button type="button" className="admin-text-btn" onClick={() => setEditing(category)}>
                          Düzenle
                        </button>
                        <button type="button" className="admin-text-btn" onClick={() => void handleToggle(category)}>
                          {category.isVisible ? "Gizle" : "Göster"}
                        </button>
                        <Link href={`/admin/products?category=${category.id}`} className="admin-text-btn">
                          Ürünler
                        </Link>
                        <button
                          type="button"
                          className="admin-text-btn admin-text-danger"
                          onClick={() => void handleDelete(category)}
                          disabled={category.productCount > 0}
                        >
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
