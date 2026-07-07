"use client";

import { useMemo, useState } from "react";
import CategoryForm from "@/components/admin/forms/category-form";
import AdminHeaderToolbar from "@/components/admin/admin-header-toolbar";
import EmptyState from "@/components/admin/ui/empty-state";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import {
  deleteCategory,
  reorderCategories,
  toggleCategoryVisibility,
} from "@/lib/admin/menu-data";
import type { AdminCategory } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function CategoriesPage() {
  const { categories, loading, error, refresh } = useAdminData();
  const [editing, setEditing] = useState<AdminCategory | "new" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [ordered, setOrdered] = useState<AdminCategory[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [reordering, setReordering] = useState(false);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const displayList = useMemo(() => {
    const base = ordered.length > 0 ? ordered : sorted;
    const q = search.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (c) =>
        c.names.tr?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.slug?.toLowerCase().includes(q),
    );
  }, [ordered, sorted, search]);

  const totalProducts = useMemo(
    () => categories.reduce((sum, c) => sum + c.productCount, 0),
    [categories],
  );

  const handleSaved = async () => {
    setEditing(null);
    setOrdered([]);
    await refresh();
  };

  const handleToggle = async (category: AdminCategory) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await toggleCategoryVisibility(supabase, category);
      await refresh();
      setOrdered([]);
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
      setOrdered([]);
      await refresh();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Silme başarısız.");
    }
  };

  const handleReorderDrop = async (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex || search.trim()) {
      setDragIndex(null);
      return;
    }

    const base = ordered.length > 0 ? [...ordered] : [...sorted];
    const [moved] = base.splice(dragIndex, 1);
    base.splice(dropIndex, 0, moved);
    setOrdered(base);
    setDragIndex(null);
    setReordering(true);
    setActionError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      await reorderCategories(supabase, base);
      await refresh();
      setOrdered([]);
    } catch (reorderError) {
      setActionError(reorderError instanceof Error ? reorderError.message : "Sıralama kaydedilemedi.");
      setOrdered([]);
    } finally {
      setReordering(false);
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

  const canDrag = !search.trim() && !reordering;

  return (
    <div className="admin-page">
      <AdminHeaderToolbar>
        <div className="admin-header-search">
          <span className="material-symbols-outlined" aria-hidden>
            search
          </span>
          <input
            type="search"
            placeholder="Kategori ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Kategori ara"
          />
        </div>
        <button type="button" className="admin-btn-primary" onClick={() => setEditing("new")}>
          <span className="material-symbols-outlined" aria-hidden>
            add
          </span>
          Kategori Ekle
        </button>
      </AdminHeaderToolbar>

      {actionError ? <p className="admin-error">{actionError}</p> : null}

      {editing ? (
        <div className="admin-cat-card admin-form-modal-inline" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <CategoryForm
            category={editing === "new" ? null : editing}
            isNew={editing === "new"}
            onSaved={() => void handleSaved()}
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
            <button type="button" className="admin-btn-primary" onClick={() => setEditing("new")}>
              Kategori Ekle
            </button>
          }
        />
      ) : (
        <>
          <div className="admin-cat-card">
            <div className="admin-cat-table-wrap">
              <table className="admin-cat-table">
                <thead>
                  <tr>
                    <th className="admin-cat-th-drag" aria-label="Sırala" />
                    <th>Görsel</th>
                    <th>Ad</th>
                    <th>Ürün Sayısı</th>
                    <th>Durum</th>
                    <th className="admin-cat-th-actions">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {displayList.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--admin-text-secondary)" }}>
                        Arama sonucu bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    displayList.map((category, index) => (
                      <tr
                        key={category.id}
                        className={dragIndex === index ? "admin-cat-row-dragging" : ""}
                        onDragOver={(e) => {
                          if (!canDrag) return;
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          void handleReorderDrop(index);
                        }}
                      >
                        <td>
                          <span
                            className="material-symbols-outlined admin-cat-drag"
                            draggable={canDrag}
                            onDragStart={() => setDragIndex(index)}
                            onDragEnd={() => setDragIndex(null)}
                            aria-label="Sürükleyerek sırala"
                            title={canDrag ? "Sürükleyerek sırala" : "Arama aktifken sıralama kapalı"}
                          >
                            drag_indicator
                          </span>
                        </td>
                        <td>
                          <div className="admin-cat-thumb">
                            <span className="material-symbols-outlined" aria-hidden>
                              restaurant
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="admin-cat-name">{category.names.tr || category.id}</span>
                        </td>
                        <td>
                          <span className="admin-cat-count">{category.productCount} ürün</span>
                        </td>
                        <td>
                          <label className="admin-toggle">
                            <input
                              type="checkbox"
                              checked={category.isVisible}
                              onChange={() => void handleToggle(category)}
                              aria-label={category.isVisible ? "Görünür" : "Gizli"}
                            />
                            <span className="admin-toggle-track" />
                            <span className="admin-toggle-thumb" />
                          </label>
                        </td>
                        <td>
                          <div className="admin-cat-actions">
                            <button
                              type="button"
                              className="admin-cat-icon-btn admin-cat-icon-btn-edit"
                              onClick={() => setEditing(category)}
                              aria-label="Düzenle"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button
                              type="button"
                              className="admin-cat-icon-btn admin-cat-icon-btn-delete"
                              onClick={() => void handleDelete(category)}
                              disabled={category.productCount > 0}
                              aria-label="Sil"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="admin-cat-footer">
              <span>
                {displayList.length} / {sorted.length} kategori gösteriliyor
              </span>
              <div className="admin-cat-pagination">
                <button type="button" className="admin-cat-page-btn" disabled aria-label="Önceki">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button type="button" className="admin-cat-page-btn active" aria-current="page">
                  1
                </button>
                <button type="button" className="admin-cat-page-btn" disabled aria-label="Sonraki">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="admin-insights">
            <div className="admin-insight-card admin-insight-card-hint">
              <div>
                <h4 className="admin-insight-title">Menünüzü yeniden sıralamak mı istiyorsunuz?</h4>
                <p className="admin-insight-text">
                  Satırları sürükleyip bırakarak müşteri QR menüsündeki görüntüleme sırasını değiştirin.
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
                <span className="admin-insight-stat-suffix">Aktif Ürün</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
