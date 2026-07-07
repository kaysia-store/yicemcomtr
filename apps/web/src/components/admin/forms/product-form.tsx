"use client";

import { useEffect, useRef, useState } from "react";
import LanguageTabs from "@/components/admin/ui/language-tabs";
import OptionGroupsEditor from "@/components/admin/forms/option-groups-editor";
import type { AdminCategory, AdminProduct } from "@/lib/admin/types";
import type { LangCode } from "@/lib/menu/types";
import {
  copyContentsFromTr,
  copyLocalizedFromTr,
  createProduct,
  saveProduct,
} from "@/lib/admin/menu-data";
import { missingLangsForNames } from "@/lib/admin/translation-utils";
import { uploadProductImage } from "@/lib/admin/storage";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  product: AdminProduct;
  categories: AdminCategory[];
  isNew?: boolean;
  onSaved: (product: AdminProduct) => void;
  onCancel: () => void;
};

export default function ProductForm({ product, categories, isNew = false, onSaved, onCancel }: Props) {
  const [draft, setDraft] = useState(product);
  const [idInput, setIdInput] = useState(product.id);
  const [activeLang, setActiveLang] = useState<LangCode>("tr");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(product);
    setIdInput(product.id);
  }, [product]);

  const missingLangs = missingLangsForNames(draft.names);

  const handleCopyFromTr = () => {
    if (activeLang === "tr") return;
    setDraft({
      ...draft,
      names: { ...draft.names, [activeLang]: draft.names.tr },
      descriptions: { ...draft.descriptions, [activeLang]: draft.descriptions.tr },
      contents: { ...draft.contents, [activeLang]: [...draft.contents.tr] },
    });
  };

  const handleCopyAllFromTr = () => {
    setDraft({
      ...draft,
      names: copyLocalizedFromTr(draft.names),
      descriptions: copyLocalizedFromTr(draft.descriptions),
      contents: copyContentsFromTr(draft.contents),
    });
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const productId = isNew ? idInput.trim() || draft.id : draft.id;
      const url = await uploadProductImage(supabase, productId, file);
      setDraft({ ...draft, imageUrl: url });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    const productId = isNew ? idInput.trim().toLowerCase().replace(/\s+/g, "") : draft.id;
    if (!productId) {
      setError("Ürün ID gerekli.");
      return;
    }
    if (!draft.names.tr.trim()) {
      setError("Türkçe ürün adı zorunludur.");
      return;
    }
    if (!draft.categoryId) {
      setError("Kategori seçin.");
      return;
    }

    const payload: AdminProduct = {
      ...draft,
      id: productId,
      modifiers: draft.modifiers.map((modifier) => ({ ...modifier, productId })),
    };

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (isNew) await createProduct(supabase, payload);
      else await saveProduct(supabase, payload);
      onSaved(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-stack">
      <div className="admin-k-card admin-k-card-padded">
        <div className="admin-k-card-head">
          <h3 className="admin-k-section-title">{isNew ? "Yeni Ürün" : "Ürün Bilgileri"}</h3>
          <div className="admin-header-actions">
            <button type="button" className="admin-button admin-button-secondary admin-button-sm" onClick={onCancel}>
              İptal
            </button>
            <button type="button" className="admin-button admin-button-secondary admin-button-sm" onClick={handleCopyAllFromTr}>
              TR&apos;den kopyala
            </button>
            <button type="button" className="admin-button admin-button-sm" onClick={() => void handleSave()} disabled={saving}>
              {saving ? "Kaydediliyor…" : "Kaydet"}
            </button>
          </div>
        </div>

        {error ? <p className="admin-error">{error}</p> : null}

        <div className="admin-product-top-grid">
          <div className="admin-image-block">
            <img src={draft.imageUrl || "/favicon.png"} alt="" className="admin-product-preview" />
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
              className="admin-button admin-button-secondary admin-button-sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? "Yükleniyor…" : "Görsel Yükle"}
            </button>
            <input
              className="admin-input"
              placeholder="Görsel URL"
              value={draft.imageUrl}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
            />
          </div>

          <div className="admin-form-grid">
            {isNew ? (
              <label>
                Ürün ID
                <input className="admin-input" value={idInput} onChange={(e) => setIdInput(e.target.value)} placeholder="p99" />
              </label>
            ) : (
              <label>
                ID
                <input className="admin-input" value={draft.id} readOnly />
              </label>
            )}
            <label>
              Kategori
              <select
                className="admin-input"
                value={draft.categoryId}
                onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.names.tr || category.id}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Fiyat (₺)
              <input
                className="admin-input"
                type="number"
                min="0"
                step="0.01"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              />
            </label>
            <label>
              Sıra
              <input
                className="admin-input"
                type="number"
                value={draft.sortOrder}
                onChange={(e) => setDraft({ ...draft, sortOrder: Number(e.target.value) })}
              />
            </label>
            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={draft.isActive}
                onChange={(e) => setDraft({ ...draft, isActive: e.target.checked })}
              />
              Aktif ürün
            </label>
          </div>
        </div>
      </div>

      <div className="admin-k-card admin-k-card-padded">
        <h3 className="admin-k-section-title">Çeviriler</h3>
        <LanguageTabs
          active={activeLang}
          onChange={setActiveLang}
          missingLangs={missingLangs}
          onCopyFromTr={handleCopyFromTr}
        />

        <label>
          Ürün adı
          <input
            className="admin-input"
            value={draft.names[activeLang]}
            onChange={(e) => setDraft({ ...draft, names: { ...draft.names, [activeLang]: e.target.value } })}
          />
        </label>
        <label>
          Açıklama
          <textarea
            className="admin-input admin-textarea"
            rows={3}
            value={draft.descriptions[activeLang]}
            onChange={(e) => setDraft({ ...draft, descriptions: { ...draft.descriptions, [activeLang]: e.target.value } })}
          />
        </label>
        <label>
          İçerikler (virgülle)
          <textarea
            className="admin-input admin-textarea"
            rows={3}
            value={draft.contents[activeLang].join(", ")}
            onChange={(e) =>
              setDraft({
                ...draft,
                contents: {
                  ...draft.contents,
                  [activeLang]: e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                },
              })
            }
          />
        </label>
      </div>

      <OptionGroupsEditor
        productId={draft.id || idInput}
        modifiers={draft.modifiers}
        onChange={(modifiers) => setDraft({ ...draft, modifiers })}
      />
    </div>
  );
}
