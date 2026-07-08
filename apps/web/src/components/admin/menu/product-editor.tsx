"use client";

import { useEffect, useRef, useState } from "react";
import {
  ADMIN_LANGS,
  ADMIN_LANG_LABELS,
  type AdminProduct,
  type LocalizedContents,
  type LocalizedFields,
} from "@/lib/admin/types";
import { saveProduct } from "@/lib/admin/menu-data";
import {
  translateLocalizedFromTr,
  translateProductFieldsToAllLangs,
  translateProductFieldsToLang,
} from "@/lib/admin/translate-api";
import { uploadProductImage } from "@/lib/admin/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  product: AdminProduct;
  categoryName: string;
  embedded?: boolean;
  modal?: boolean;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (product: AdminProduct) => void;
  onClose?: () => void;
  onCancel?: () => void;
};

const MODIFIER_TYPE_LABELS: Record<string, string> = {
  option: "Boyut / Seçenek",
  mainProduct: "Ana Ürün",
  sideProduct: "Yan Ürün",
  menuOption: "Menü Seçeneği",
  potatoOption: "Patates",
  drinkOption: "İçecek",
};

export default function ProductEditor({
  product,
  categoryName,
  embedded = false,
  modal = false,
  onDirtyChange,
  onSaved,
  onClose,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(product);
  const [activeLang, setActiveLang] = useState<(typeof ADMIN_LANGS)[number]>("tr");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(product);
  }, [product]);

  useEffect(() => {
    onDirtyChange(JSON.stringify(draft) !== JSON.stringify(product));
  }, [draft, product, onDirtyChange]);

  const updateNames = (lang: keyof LocalizedFields, value: string) => {
    setDraft({ ...draft, names: { ...draft.names, [lang]: value } });
  };

  const updateDescriptions = (lang: keyof LocalizedFields, value: string) => {
    setDraft({ ...draft, descriptions: { ...draft.descriptions, [lang]: value } });
  };

  const updateContents = (lang: keyof LocalizedContents, value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setDraft({ ...draft, contents: { ...draft.contents, [lang]: items } });
  };

  const handleAutoTranslateActive = async () => {
    if (activeLang === "tr") return;
    setTranslating(true);
    setError(null);
    try {
      const translated = await translateProductFieldsToLang(
        { names: draft.names, descriptions: draft.descriptions, contents: draft.contents },
        activeLang,
      );
      const modifiers = await Promise.all(
        draft.modifiers.map(async (modifier) => {
          if (!modifier.labels.tr.trim()) return modifier;
          const labels = await translateLocalizedFromTr(modifier.labels, [activeLang]);
          return { ...modifier, labels: { ...modifier.labels, [activeLang]: labels[activeLang] ?? modifier.labels[activeLang] } };
        }),
      );
      setDraft({ ...draft, ...translated, modifiers });
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : "Çeviri başarısız.");
    } finally {
      setTranslating(false);
    }
  };

  const handleAutoTranslateAll = async () => {
    setTranslating(true);
    setError(null);
    try {
      const translated = await translateProductFieldsToAllLangs({
        names: draft.names,
        descriptions: draft.descriptions,
        contents: draft.contents,
      });
      const modifiers = await Promise.all(
        draft.modifiers.map(async (modifier) => ({
          ...modifier,
          labels: modifier.labels.tr.trim() ? await translateLocalizedFromTr(modifier.labels) : modifier.labels,
        })),
      );
      setDraft({ ...draft, ...translated, modifiers });
    } catch (translateError) {
      setError(translateError instanceof Error ? translateError.message : "Çeviri başarısız.");
    } finally {
      setTranslating(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const url = await uploadProductImage(supabase, draft.id, file);
      setDraft({ ...draft, imageUrl: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await saveProduct(supabase, draft);
      onSaved(draft);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  const modifiersByType = draft.modifiers.reduce<Record<string, typeof draft.modifiers>>((acc, modifier) => {
    const list = acc[modifier.modifierType] ?? [];
    list.push(modifier);
    acc[modifier.modifierType] = list;
    return acc;
  }, {});

  const handleClose = onClose ?? onCancel;

  return (
    <section className={modal ? "admin-product-modal" : embedded ? "admin-product-detail" : "admin-section"}>
      <div className={modal || embedded ? "admin-menu-panel-head" : "admin-section-header"}>
        <div>
          {modal || embedded ? (
            <h2 id="product-editor-title">{draft.names.tr || draft.id}</h2>
          ) : (
            <h1>{draft.names.tr || draft.id}</h1>
          )}
          <p className="admin-muted">
            {categoryName} · {draft.id}
          </p>
        </div>
        <div className="admin-header-actions">
          {!modal && !embedded && handleClose ? (
            <button type="button" className="admin-button admin-button-secondary" onClick={handleClose}>
              ← Geri
            </button>
          ) : null}
          <button
            type="button"
            className="admin-button admin-button-secondary admin-button-sm"
            disabled={translating}
            onClick={() => void handleAutoTranslateAll()}
          >
            {translating ? "Çevriliyor…" : "Tüm dillere çevir"}
          </button>
          <button
            type="button"
            className={`admin-button ${modal || embedded ? "admin-button-sm" : ""}`}
            onClick={() => void handleSave()}
            disabled={saving}
          >
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className={modal || embedded ? "admin-product-detail-body" : "admin-editor-layout"}>
        <div className="admin-panel">
          <h3>Genel</h3>
          <div className="admin-form-grid">
            <label>
              Fiyat (₺)
              <input
                className="admin-input"
                type="number"
                min="0"
                step="0.01"
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
              />
            </label>
            <label>
              Sıra
              <input
                className="admin-input"
                type="number"
                value={draft.sortOrder}
                onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
              />
            </label>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(event) => setDraft({ ...draft, isActive: event.target.checked })}
              />
              Aktif ürün
            </label>
          </div>

          <h3>Görsel</h3>
          <div className="admin-image-block">
            <img src={draft.imageUrl || "/favicon.png"} alt="" className="admin-product-preview" />
            <div className="admin-image-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleImageUpload(file);
                }}
              />
              <button
                type="button"
                className="admin-button admin-button-secondary"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? "Yükleniyor…" : "Görsel Yükle"}
              </button>
              <input
                className="admin-input"
                placeholder="veya görsel URL"
                value={draft.imageUrl}
                onChange={(event) => setDraft({ ...draft, imageUrl: event.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="admin-panel admin-panel-wide">
          <div className="admin-lang-tabs">
            {ADMIN_LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`admin-lang-tab ${activeLang === lang ? "active" : ""}`}
                onClick={() => setActiveLang(lang)}
              >
                {ADMIN_LANG_LABELS[lang]}
              </button>
            ))}
            {activeLang !== "tr" ? (
              <button
                type="button"
                className="admin-lang-tab admin-lang-copy"
                disabled={translating}
                onClick={() => void handleAutoTranslateActive()}
              >
                {translating ? "Çevriliyor…" : "Otomatik çevir"}
              </button>
            ) : null}
          </div>

          <label>
            Ürün adı
            <input className="admin-input" value={draft.names[activeLang]} onChange={(e) => updateNames(activeLang, e.target.value)} />
          </label>

          <label>
            Açıklama
            <textarea
              className="admin-input admin-textarea"
              rows={3}
              value={draft.descriptions[activeLang]}
              onChange={(e) => updateDescriptions(activeLang, e.target.value)}
            />
          </label>

          <label>
            İçerikler (virgülle ayırın)
            <textarea
              className="admin-input admin-textarea"
              rows={3}
              value={draft.contents[activeLang].join(", ")}
              onChange={(e) => updateContents(activeLang, e.target.value)}
            />
          </label>

          {Object.keys(modifiersByType).length > 0 ? (
            <div className="admin-modifiers">
              <h3>Alt seçenekler</h3>
              {Object.entries(modifiersByType).map(([type, modifiers]) => (
                <div key={type} className="admin-modifier-group">
                  <h4>{MODIFIER_TYPE_LABELS[type] ?? type}</h4>
                  {modifiers.map((modifier) => (
                    <div key={modifier.modifierId} className="admin-modifier-row">
                      <div className="admin-modifier-meta">
                        <span className="admin-mono">{modifier.modifierId}</span>
                        <input
                          className="admin-input"
                          value={modifier.labels[activeLang]}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              modifiers: draft.modifiers.map((m) =>
                                m.modifierId === modifier.modifierId && m.productId === modifier.productId
                                  ? { ...m, labels: { ...m.labels, [activeLang]: event.target.value } }
                                  : m,
                              ),
                            })
                          }
                        />
                      </div>
                      <label className="admin-modifier-price">
                        ₺
                        <input
                          className="admin-input admin-input-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={modifier.price}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              modifiers: draft.modifiers.map((m) =>
                                m.modifierId === modifier.modifierId && m.productId === modifier.productId
                                  ? { ...m, price: Number(event.target.value) }
                                  : m,
                              ),
                            })
                          }
                        />
                      </label>
                      <label className="admin-checkbox-label admin-modifier-active">
                        <input
                          type="checkbox"
                          checked={modifier.isActive}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              modifiers: draft.modifiers.map((m) =>
                                m.modifierId === modifier.modifierId && m.productId === modifier.productId
                                  ? { ...m, isActive: event.target.checked }
                                  : m,
                              ),
                            })
                          }
                        />
                        Aktif
                      </label>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
