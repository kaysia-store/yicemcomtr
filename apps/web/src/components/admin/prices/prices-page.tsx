"use client";

import { useMemo, useState } from "react";
import AdminHeaderToolbar from "@/components/admin/admin-header-toolbar";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import { buildModifierPriceGroups } from "@/lib/admin/category-modifiers";
import { MODIFIER_TYPE_LABELS } from "@/lib/admin/modifier-types";
import { bulkUpdateModifierPrices, bulkUpdateProductPrices } from "@/lib/admin/price-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type TabId = "products" | "extras";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
}

export default function PricesPage() {
  const { categories, products, loading, error, refresh, getCategoryName } = useAdminData();
  const [tab, setTab] = useState<TabId>("products");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [productDrafts, setProductDrafts] = useState<Record<string, string>>({});
  const [extraDrafts, setExtraDrafts] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const sortedProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return [...products]
      .filter((product) => (categoryFilter === "all" ? true : product.categoryId === categoryFilter))
      .filter((product) => !q || product.names.tr.toLowerCase().includes(q))
      .sort((a, b) => {
        const catDiff = a.categoryId.localeCompare(b.categoryId);
        if (catDiff !== 0) return catDiff;
        return a.sortOrder - b.sortOrder;
      });
  }, [products, categoryFilter, search]);

  const modifierGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return buildModifierPriceGroups(sortedCategories, products, getCategoryName)
      .filter((group) => (categoryFilter === "all" ? true : group.categoryId === categoryFilter))
      .filter(
        (group) =>
          !q ||
          group.label.toLowerCase().includes(q) ||
          group.categoryName.toLowerCase().includes(q) ||
          (MODIFIER_TYPE_LABELS[group.modifierType] ?? group.modifierType).toLowerCase().includes(q),
      );
  }, [sortedCategories, products, getCategoryName, categoryFilter, search]);

  const groupedProducts = useMemo(() => {
    const map = new Map<string, typeof sortedProducts>();
    for (const product of sortedProducts) {
      const list = map.get(product.categoryId) ?? [];
      list.push(product);
      map.set(product.categoryId, list);
    }
    return map;
  }, [sortedProducts]);

  const groupedExtras = useMemo(() => {
    const map = new Map<string, typeof modifierGroups>();
    for (const group of modifierGroups) {
      const list = map.get(group.categoryId) ?? [];
      list.push(group);
      map.set(group.categoryId, list);
    }
    return map;
  }, [modifierGroups]);

  const getProductDraft = (productId: string, currentPrice: number) =>
    productDrafts[productId] ?? String(currentPrice);

  const getExtraDraft = (key: string, currentPrice: number) => extraDrafts[key] ?? String(currentPrice);

  const productChanges = useMemo(() => {
    return sortedProducts.flatMap((product) => {
      const raw = getProductDraft(product.id, product.price);
      const next = Number(raw);
      if (!Number.isFinite(next) || next < 0 || next === product.price) return [];
      return [{ productId: product.id, price: next }];
    });
  }, [sortedProducts, productDrafts]);

  const extraChanges = useMemo(() => {
    return modifierGroups.flatMap((group) => {
      const key = `${group.categoryId}::${group.modifierType}::${group.modifierId}`;
      const raw = getExtraDraft(key, group.price);
      const next = Number(raw);
      if (!Number.isFinite(next) || next < 0 || next === group.price) return [];
      return [
        {
          categoryId: group.categoryId,
          modifierType: group.modifierType,
          modifierId: group.modifierId,
          price: next,
        },
      ];
    });
  }, [modifierGroups, extraDrafts]);

  const pendingCount = tab === "products" ? productChanges.length : extraChanges.length;

  const handleSave = async () => {
    setActionError(null);
    setSavedMessage(null);
    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (tab === "products") {
        await bulkUpdateProductPrices(supabase, productChanges, products);
        setProductDrafts({});
      } else {
        await bulkUpdateModifierPrices(supabase, extraChanges, products);
        setExtraDrafts({});
      }
      await refresh();
      setSavedMessage("Fiyatlar kaydedildi.");
    } catch (saveError) {
      setActionError(saveError instanceof Error ? saveError.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Fiyatlar yükleniyor…" />
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
    <div className="admin-page admin-prices-page">
      <AdminHeaderToolbar>
        <div className="admin-header-search">
          <input
            type="search"
            placeholder="Ürün veya ekstra ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Fiyat listesinde ara"
          />
        </div>
        <select
          className="admin-input admin-select-inline"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Kategori filtresi"
        >
          <option value="all">Tüm kategoriler</option>
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.names.tr || category.id}
            </option>
          ))}
        </select>
      </AdminHeaderToolbar>

      <div className="admin-panel-tabs">
        <button type="button" className={`admin-panel-tab ${tab === "products" ? "active" : ""}`} onClick={() => setTab("products")}>
          Ürün Fiyatları
        </button>
        <button type="button" className={`admin-panel-tab ${tab === "extras" ? "active" : ""}`} onClick={() => setTab("extras")}>
          Ekstra Fiyat Farkları
        </button>
      </div>

      {actionError ? <p className="admin-error">{actionError}</p> : null}
      {savedMessage ? <p className="admin-success">{savedMessage}</p> : null}

      {tab === "products" ? (
        sortedProducts.length === 0 ? (
          <p className="admin-muted">Gösterilecek ürün yok.</p>
        ) : (
          <div className="admin-prices-sections">
            {[...groupedProducts.entries()].map(([categoryId, categoryProducts]) => (
              <section key={categoryId} className="admin-k-card admin-k-card-padded">
                <h3 className="admin-k-section-title">{getCategoryName(categoryId)}</h3>
                <div className="admin-prices-table-wrap">
                  <table className="admin-prices-table">
                    <thead>
                      <tr>
                        <th>Ürün</th>
                        <th>Mevcut</th>
                        <th>Yeni fiyat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.map((product) => {
                        const draft = getProductDraft(product.id, product.price);
                        const changed = Number(draft) !== product.price && draft.trim() !== "";
                        return (
                          <tr key={product.id} className={changed ? "changed" : ""}>
                            <td>{product.names.tr || product.id}</td>
                            <td className="admin-prices-current">{formatPrice(product.price)}</td>
                            <td>
                              <input
                                className="admin-input admin-input-price-inline"
                                type="number"
                                min="0"
                                step="0.01"
                                value={draft}
                                onChange={(e) =>
                                  setProductDrafts((current) => ({ ...current, [product.id]: e.target.value }))
                                }
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )
      ) : modifierGroups.length === 0 ? (
        <p className="admin-muted">Bu filtrede ekstra fiyat farkı bulunamadı.</p>
      ) : (
        <div className="admin-prices-sections">
          {[...groupedExtras.entries()].map(([categoryId, groups]) => (
            <section key={categoryId} className="admin-k-card admin-k-card-padded">
              <h3 className="admin-k-section-title">{getCategoryName(categoryId)}</h3>
              <div className="admin-prices-table-wrap">
                <table className="admin-prices-table">
                  <thead>
                    <tr>
                      <th>Grup</th>
                      <th>Ekstra</th>
                      <th>Ürün</th>
                      <th>Mevcut</th>
                      <th>Yeni fark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((group) => {
                      const key = `${group.categoryId}::${group.modifierType}::${group.modifierId}`;
                      const draft = getExtraDraft(key, group.price);
                      const changed = Number(draft) !== group.price && draft.trim() !== "";
                      return (
                        <tr key={key} className={changed ? "changed" : group.priceVariance ? "variance" : ""}>
                          <td>{MODIFIER_TYPE_LABELS[group.modifierType] ?? group.modifierType}</td>
                          <td>{group.label}</td>
                          <td className="admin-muted">
                            {group.productCount}/{group.totalProducts} ürün
                            {group.priceVariance ? (
                              <span className="admin-prices-variance">
                                {" "}
                                · farklı ({formatPrice(group.priceVariance.min)}–{formatPrice(group.priceVariance.max)})
                              </span>
                            ) : null}
                          </td>
                          <td className="admin-prices-current">
                            {group.priceVariance
                              ? `${formatPrice(group.priceVariance.min)}–${formatPrice(group.priceVariance.max)}`
                              : formatPrice(group.price)}
                          </td>
                          <td>
                            <input
                              className="admin-input admin-input-price-inline"
                              type="number"
                              min="0"
                              step="0.01"
                              value={draft}
                              onChange={(e) => setExtraDrafts((current) => ({ ...current, [key]: e.target.value }))}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}

      {pendingCount > 0 ? (
        <div className="admin-prices-savebar">
          <span>{pendingCount} değişiklik bekliyor</span>
          <button type="button" className="admin-btn-primary" disabled={saving} onClick={() => void handleSave()}>
            {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
