"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import EmptyState from "@/components/admin/ui/empty-state";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import { deleteProduct, toggleProductActive } from "@/lib/admin/menu-data";
import type { AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category") ?? "all";
  const { products, categories, loading, error, refresh, getCategoryName } = useAdminData();
  const [query, setQuery] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (categoryFilter !== "all") {
      list = list.filter((product) => product.categoryId === categoryFilter);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (product) =>
          product.id.toLowerCase().includes(q) ||
          product.names.tr.toLowerCase().includes(q) ||
          product.names.en.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [products, categoryFilter, query]);

  const handleToggle = async (product: AdminProduct) => {
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await toggleProductActive(supabase, product);
      await refresh();
    } catch (toggleError) {
      setActionError(toggleError instanceof Error ? toggleError.message : "Durum güncellenemedi.");
    }
  };

  const handleDelete = async (product: AdminProduct) => {
    if (!window.confirm(`«${product.names.tr}» ürününü silmek istiyor musunuz?`)) return;
    setActionError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await deleteProduct(supabase, product.id);
      await refresh();
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : "Silme başarısız.");
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Ürünler yükleniyor…" />
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
          <h2 className="admin-page-section-title">Ürünler</h2>
          <p className="admin-muted">{filtered.length} ürün listeleniyor</p>
        </div>
        <Link
          href={categoryFilter !== "all" ? `/admin/products/new?category=${categoryFilter}` : "/admin/products/new"}
          className="admin-button admin-button-sm"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="admin-filters-row">
        <select
          className="admin-input admin-filter-select"
          value={categoryFilter}
          onChange={(e) => {
            const value = e.target.value;
            router.push(value === "all" ? "/admin/products" : `/admin/products?category=${value}`);
          }}
        >
          <option value="all">Tüm kategoriler</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.names.tr || category.id}
            </option>
          ))}
        </select>
        <input
          className="admin-input admin-filter-search"
          type="search"
          placeholder="Ürün ara…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {actionError ? <p className="admin-error">{actionError}</p> : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon="fastfood"
          title="Ürün bulunamadı"
          description="Filtreyi değiştirin veya yeni ürün ekleyin."
          action={
            <Link href="/admin/products/new" className="admin-button admin-button-sm">
              Ürün Ekle
            </Link>
          }
        />
      ) : (
        <div className="admin-k-card admin-k-table-card">
          <div className="admin-k-table-wrap">
            <table className="admin-k-table">
              <thead>
                <tr>
                  <th>Görsel</th>
                  <th>Ürün</th>
                  <th>Kategori</th>
                  <th>Fiyat</th>
                  <th>Sıra</th>
                  <th>Durum</th>
                  <th className="admin-table-actions-col">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img src={product.imageUrl || "/favicon.png"} alt="" className="admin-table-thumb" />
                    </td>
                    <td>
                      <strong>{product.names.tr || product.id}</strong>
                      <div className="admin-muted admin-mono">{product.id}</div>
                    </td>
                    <td>{getCategoryName(product.categoryId)}</td>
                    <td className="admin-mono">₺{product.price}</td>
                    <td>{product.sortOrder}</td>
                    <td>
                      <span className={`admin-pill ${product.isActive ? "admin-pill-active" : "admin-pill-muted"}`}>
                        {product.isActive ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/admin/products/${product.id}`} className="admin-text-btn">
                          Düzenle
                        </Link>
                        <button type="button" className="admin-text-btn" onClick={() => void handleToggle(product)}>
                          {product.isActive ? "Pasif" : "Aktif"}
                        </button>
                        <button
                          type="button"
                          className="admin-text-btn admin-text-danger"
                          onClick={() => void handleDelete(product)}
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
