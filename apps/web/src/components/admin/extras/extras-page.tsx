"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHeaderToolbar from "@/components/admin/admin-header-toolbar";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { useAdminData } from "@/components/admin/providers/admin-data-provider";
import {
  applyCategoryModifierTemplate,
  buildCategoryModifierTemplate,
  createEmptyTemplateItem,
  getProductSyncStatuses,
  removeModifierFromCategory,
  type ModifierTemplateItem,
} from "@/lib/admin/category-modifiers";
import { translateLocalizedFromTr } from "@/lib/admin/translate-api";
import { MODIFIER_TYPES, MODIFIER_TYPE_LABELS } from "@/lib/admin/modifier-types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function formatPrice(price: number) {
  return new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(price);
}

export default function ExtrasPage() {
  const { categories, products, loading, error, refresh, getCategoryName } = useAdminData();
  const [categoryId, setCategoryId] = useState("");
  const [template, setTemplate] = useState<ModifierTemplateItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [newGroupType, setNewGroupType] = useState("menuOption");
  const [saving, setSaving] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  useEffect(() => {
    if (categoryId || sortedCategories.length === 0) return;
    setCategoryId(sortedCategories[0].id);
  }, [categoryId, sortedCategories]);

  useEffect(() => {
    if (!categoryId) return;
    setTemplate(buildCategoryModifierTemplate(categoryId, products));
    setDirty(false);
  }, [categoryId, products]);

  const syncStatuses = useMemo(
    () => (categoryId ? getProductSyncStatuses(categoryId, products, template) : []),
    [categoryId, products, template],
  );

  const outOfSync = useMemo(
    () => syncStatuses.filter((item) => item.status !== "synced"),
    [syncStatuses],
  );

  const groupedTemplate = useMemo(() => {
    const map = new Map<string, ModifierTemplateItem[]>();
    for (const item of template) {
      const list = map.get(item.modifierType) ?? [];
      list.push(item);
      map.set(item.modifierType, list);
    }
    return [...map.entries()].map(([type, items]) => ({
      type,
      label: MODIFIER_TYPE_LABELS[type] ?? type,
      items: [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [template]);

  const updateTemplateItem = (modifierId: string, modifierType: string, patch: Partial<ModifierTemplateItem>) => {
    setTemplate((current) =>
      current.map((item) =>
        item.modifierId === modifierId && item.modifierType === modifierType ? { ...item, ...patch } : item,
      ),
    );
    setDirty(true);
    setSavedMessage(null);
  };

  const handleAddOption = (modifierType: string) => {
    const sortOrder = template.filter((item) => item.modifierType === modifierType).length;
    setTemplate((current) => [...current, createEmptyTemplateItem(modifierType, sortOrder)]);
    setDirty(true);
    setSavedMessage(null);
  };

  const handleRemoveOption = (modifierType: string, modifierId: string, label: string) => {
    if (!window.confirm(`«${label || modifierId}» seçeneğini kategorideki tüm ürünlerden kaldırmak istiyor musunuz?`)) {
      return;
    }
    setTemplate((current) =>
      current.filter((item) => !(item.modifierType === modifierType && item.modifierId === modifierId)),
    );
    setDirty(true);
    setSavedMessage(null);
  };

  const handleApply = async () => {
    if (!categoryId) return;

    const invalid = template.find((item) => !item.labels.tr.trim());
    if (invalid) {
      setActionError("Tüm seçenekler için Türkçe ad zorunludur.");
      return;
    }

    setSaving(true);
    setActionError(null);
    setSavedMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const categoryName = getCategoryName(categoryId);
      await applyCategoryModifierTemplate(supabase, categoryId, template, products, categoryName);
      await refresh();
      setDirty(false);
      setSavedMessage("Ek özellikler kategorideki tüm ürünlere uygulandı.");
    } catch (applyError) {
      setActionError(applyError instanceof Error ? applyError.message : "Uygulama başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const handleApplyAndRemoveDeleted = async () => {
    if (!categoryId || !dirty) {
      await handleApply();
      return;
    }

    const baseline = buildCategoryModifierTemplate(categoryId, products);
    const baselineKeys = new Set(baseline.map((item) => `${item.modifierType}::${item.modifierId}`));
    const templateKeys = new Set(template.map((item) => `${item.modifierType}::${item.modifierId}`));
    const removed = baseline.filter((item) => !templateKeys.has(`${item.modifierType}::${item.modifierId}`));

    setSaving(true);
    setActionError(null);
    setSavedMessage(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const categoryName = getCategoryName(categoryId);

      for (const item of removed) {
        await removeModifierFromCategory(
          supabase,
          categoryId,
          item.modifierType,
          item.modifierId,
          products,
          categoryName,
        );
      }

      await applyCategoryModifierTemplate(supabase, categoryId, template, products, categoryName);
      await refresh();
      setDirty(false);
      setSavedMessage("Ek özellikler güncellendi ve kategoriye uygulandı.");
    } catch (applyError) {
      setActionError(applyError instanceof Error ? applyError.message : "Uygulama başarısız.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Ek özellikler yükleniyor…" />
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
    <div className="admin-page admin-extras-page">
      <AdminHeaderToolbar>
        <select
          className="admin-input admin-select-inline admin-select-wide"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          aria-label="Kategori seç"
        >
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.names.tr || category.id}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="admin-btn-primary"
          disabled={saving || !categoryId}
          onClick={() => void handleApplyAndRemoveDeleted()}
        >
          {saving ? "Uygulanıyor…" : "Tümüne Uygula"}
        </button>
      </AdminHeaderToolbar>

      {actionError ? <p className="admin-error">{actionError}</p> : null}
      {savedMessage ? <p className="admin-success">{savedMessage}</p> : null}

      <p className="admin-hint admin-extras-hint">
        Bu panel kategori şablonunu düzenler. Kaydettiğinizde seçenekler kategorideki tüm ürünlere kopyalanır veya
        güncellenir.
      </p>

      {outOfSync.length > 0 ? (
        <section className="admin-k-card admin-k-card-padded admin-extras-sync-card">
          <h3 className="admin-k-section-title">Senkron durumu</h3>
          <p className="admin-muted">{outOfSync.length} ürün şablondan farklı veya eksik seçenek içeriyor.</p>
          <ul className="admin-extras-sync-list">
            {outOfSync.slice(0, 8).map((item) => (
              <li key={item.productId}>
                <strong>{item.productName}</strong>
                <span className="admin-extras-sync-badge" data-status={item.status}>
                  {item.status === "missing"
                    ? `${item.missingCount} eksik`
                    : `${item.differentCount} farklı`}
                </span>
              </li>
            ))}
          </ul>
          {outOfSync.length > 8 ? <p className="admin-muted">… ve {outOfSync.length - 8} ürün daha</p> : null}
        </section>
      ) : categoryId ? (
        <p className="admin-success admin-extras-all-sync">Bu kategorideki tüm ürünler şablonla uyumlu görünüyor.</p>
      ) : null}

      <div className="admin-extras-add-row">
        <select className="admin-input admin-select-inline" value={newGroupType} onChange={(e) => setNewGroupType(e.target.value)}>
          {MODIFIER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <button type="button" className="admin-button admin-button-sm" onClick={() => handleAddOption(newGroupType)}>
          + Seçenek Ekle
        </button>
      </div>

      {groupedTemplate.length === 0 ? (
        <p className="admin-muted">Bu kategoride henüz ek özellik yok. Yukarıdan yeni seçenek ekleyebilirsiniz.</p>
      ) : (
        groupedTemplate.map((group) => (
          <section key={group.type} className="admin-k-card admin-k-card-padded admin-extras-group">
            <div className="admin-k-card-head">
              <h3 className="admin-k-section-title">{group.label}</h3>
              <button type="button" className="admin-text-btn" onClick={() => handleAddOption(group.type)}>
                + Ekle
              </button>
            </div>

            {group.items.map((item) => (
              <div key={`${item.modifierType}-${item.modifierId}`} className="admin-extras-item">
                <div className="admin-extras-item-head">
                  <strong>{item.labels.tr || "Yeni seçenek"}</strong>
                  <div className="admin-header-actions">
                    <label className="admin-checkbox-label admin-modifier-active">
                      <input
                        type="checkbox"
                        checked={item.isActive}
                        onChange={(e) => updateTemplateItem(item.modifierId, item.modifierType, { isActive: e.target.checked })}
                      />
                      Aktif
                    </label>
                    <button
                      type="button"
                      className="admin-text-btn admin-text-danger"
                      onClick={() => handleRemoveOption(item.modifierType, item.modifierId, item.labels.tr)}
                    >
                      Sil
                    </button>
                  </div>
                </div>

                <div className="admin-form-grid">
                  <label>
                    Türkçe ad
                    <input
                      className="admin-input"
                      value={item.labels.tr}
                      onChange={(e) =>
                        updateTemplateItem(item.modifierId, item.modifierType, {
                          labels: { ...item.labels, tr: e.target.value },
                        })
                      }
                    />
                  </label>
                  <label>
                    Fiyat farkı (₺)
                    <input
                      className="admin-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateTemplateItem(item.modifierId, item.modifierType, { price: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Sıra
                    <input
                      className="admin-input"
                      type="number"
                      value={item.sortOrder}
                      onChange={(e) =>
                        updateTemplateItem(item.modifierId, item.modifierType, { sortOrder: Number(e.target.value) })
                      }
                    />
                  </label>
                  <label className="admin-muted admin-extras-meta">
                    {item.productCount}/{item.totalProducts} üründe mevcut
                    {item.priceVariance ? (
                      <span>
                        {" "}
                        · fiyat farkı {formatPrice(item.priceVariance.min)}–{formatPrice(item.priceVariance.max)}
                      </span>
                    ) : null}
                  </label>
                </div>

                <button
                  type="button"
                  className="admin-text-btn"
                  disabled={translatingId === `${item.modifierType}-${item.modifierId}`}
                  onClick={() => {
                    void (async () => {
                      if (!item.labels.tr.trim()) return;
                      const key = `${item.modifierType}-${item.modifierId}`;
                      setTranslatingId(key);
                      setActionError(null);
                      try {
                        const labels = await translateLocalizedFromTr(item.labels);
                        updateTemplateItem(item.modifierId, item.modifierType, { labels });
                      } catch (translateError) {
                        setActionError(translateError instanceof Error ? translateError.message : "Çeviri başarısız.");
                      } finally {
                        setTranslatingId(null);
                      }
                    })();
                  }}
                >
                  {translatingId === `${item.modifierType}-${item.modifierId}`
                    ? "Çevriliyor…"
                    : "Diğer dillere otomatik çevir"}
                </button>
              </div>
            ))}
          </section>
        ))
      )}

      {dirty ? (
        <div className="admin-prices-savebar">
          <span>Kaydedilmemiş şablon değişiklikleri var</span>
          <button type="button" className="admin-btn-primary" disabled={saving} onClick={() => void handleApplyAndRemoveDeleted()}>
            {saving ? "Uygulanıyor…" : "Kategorideki Tüm Ürünlere Uygula"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
