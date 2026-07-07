"use client";

import { useMemo, useState } from "react";
import type { AdminModifier } from "@/lib/admin/types";
import type { LangCode } from "@/lib/menu/types";
import { slugifyId } from "@/lib/admin/menu-data";

const MODIFIER_TYPES = [
  { value: "option", label: "Boyut / Seçenek" },
  { value: "mainProduct", label: "Ana Ürün" },
  { value: "sideProduct", label: "Yan Ürün" },
  { value: "menuOption", label: "Menü Seçeneği" },
  { value: "potatoOption", label: "Patates" },
  { value: "drinkOption", label: "İçecek" },
] as const;

const TYPE_LABELS = Object.fromEntries(MODIFIER_TYPES.map((item) => [item.value, item.label])) as Record<string, string>;

type Props = {
  productId: string;
  modifiers: AdminModifier[];
  onChange: (modifiers: AdminModifier[]) => void;
  activeLang: LangCode;
};

export default function OptionGroupsEditor({ productId, modifiers, onChange, activeLang }: Props) {
  const [newGroupType, setNewGroupType] = useState<string>("option");

  const groups = useMemo(() => {
    const map = new Map<string, AdminModifier[]>();
    for (const modifier of modifiers) {
      const list = map.get(modifier.modifierType) ?? [];
      list.push(modifier);
      map.set(modifier.modifierType, list);
    }
    return [...map.entries()].map(([type, items]) => ({
      type,
      label: TYPE_LABELS[type] ?? type,
      items: [...items].sort((a, b) => a.sortOrder - b.sortOrder),
    }));
  }, [modifiers]);

  const updateModifier = (modifierId: string, patch: Partial<AdminModifier>) => {
    onChange(modifiers.map((modifier) => (modifier.modifierId === modifierId ? { ...modifier, ...patch } : modifier)));
  };

  const updateModifierLabel = (modifierId: string, lang: LangCode, value: string) => {
    onChange(
      modifiers.map((modifier) =>
        modifier.modifierId === modifierId
          ? { ...modifier, labels: { ...modifier.labels, [lang]: value } }
          : modifier,
      ),
    );
  };

  const addOption = (type: string) => {
    const id = `${type}-${Date.now()}`;
    const next: AdminModifier = {
      productId,
      modifierId: id,
      modifierType: type,
      price: 0,
      sortOrder: modifiers.filter((m) => m.modifierType === type).length,
      isActive: true,
      labels: { tr: "", en: "", ru: "", de: "", fr: "", ar: "" },
    };
    onChange([...modifiers, next]);
  };

  const removeOption = (modifierId: string) => {
    if (!window.confirm("Bu seçeneği silmek istiyor musunuz?")) return;
    onChange(modifiers.filter((modifier) => modifier.modifierId !== modifierId));
  };

  const addGroup = () => {
    addOption(newGroupType);
  };

  return (
    <section className="admin-k-card admin-k-card-padded admin-options-panel">
      <div className="admin-k-card-head">
        <div>
          <h3 className="admin-k-section-title">Seçenekler</h3>
          <p className="admin-muted">Boyut, sos, ekstra malzeme, içecek vb.</p>
        </div>
        <div className="admin-header-actions">
          <select className="admin-input admin-select-inline" value={newGroupType} onChange={(e) => setNewGroupType(e.target.value)}>
            {MODIFIER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <button type="button" className="admin-button admin-button-sm" onClick={addGroup}>
            + Seçenek
          </button>
        </div>
      </div>

      <p className="admin-hint">
        Seçenek grupları mevcut menü tipine göre uygulanır. Zorunluluk ve seçim limitleri müşteri menüsündeki ürün
        tipine bağlıdır.
      </p>

      {groups.length === 0 ? (
        <p className="admin-muted">Bu üründe henüz seçenek yok.</p>
      ) : (
        groups.map((group) => (
          <div key={group.type} className="admin-option-group">
            <div className="admin-option-group-head">
              <h4>{group.label}</h4>
              <button type="button" className="admin-text-btn" onClick={() => addOption(group.type)}>
                + Ekle
              </button>
            </div>

            {group.items.map((modifier) => (
                <div key={modifier.modifierId} className="admin-option-item">
                  <div className="admin-option-item-top">
                    <strong className="admin-option-item-label">
                      {modifier.labels.tr || modifier.labels.en || modifier.modifierId || "Yeni seçenek"}
                    </strong>
                    <div className="admin-header-actions">
                      <label className="admin-checkbox-label admin-modifier-active">
                        <input
                          type="checkbox"
                          checked={modifier.isActive}
                          onChange={(e) => updateModifier(modifier.modifierId, { isActive: e.target.checked })}
                        />
                        Aktif
                      </label>
                      <button type="button" className="admin-text-btn admin-text-danger" onClick={() => removeOption(modifier.modifierId)}>
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="admin-form-grid">
                    <label>
                      Fiyat farkı (₺)
                      <input
                        className="admin-input"
                        type="number"
                        min="0"
                        step="0.01"
                        value={modifier.price}
                        onChange={(e) => updateModifier(modifier.modifierId, { price: Number(e.target.value) })}
                      />
                    </label>
                    <label>
                      Sıra
                      <input
                        className="admin-input"
                        type="number"
                        value={modifier.sortOrder}
                        onChange={(e) => updateModifier(modifier.modifierId, { sortOrder: Number(e.target.value) })}
                      />
                    </label>
                  </div>

                  <label>
                    Seçenek adı ({activeLang.toUpperCase()})
                    <input
                      className="admin-input"
                      value={modifier.labels[activeLang]}
                      onChange={(e) => updateModifierLabel(modifier.modifierId, activeLang, e.target.value)}
                    />
                  </label>
                </div>
            ))}
          </div>
        ))
      )}
    </section>
  );
}

export function normalizeNewModifierId(raw: string, type: string) {
  const base = slugifyId(raw) || `${type}-${Date.now()}`;
  return base.replace(/-/g, "_");
}
