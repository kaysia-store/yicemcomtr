"use client";

import { useState } from "react";
import { createProduct } from "@/lib/admin/menu-data";
import type { AdminProduct } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  categoryId: string;
  existingIds: string[];
  nextSortOrder: number;
  onCreated: (product: AdminProduct) => void;
  onClose: () => void;
};

export default function CreateProductDialog({
  categoryId,
  existingIds,
  nextSortOrder,
  onCreated,
  onClose,
}: Props) {
  const [id, setId] = useState("");
  const [nameTr, setNameTr] = useState("");
  const [price, setPrice] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const normalizedId = id.trim().toLowerCase().replace(/\s+/g, "");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!normalizedId) {
      setError("Geçerli bir ürün ID girin.");
      return;
    }

    if (existingIds.includes(normalizedId)) {
      setError("Bu ID zaten kullanılıyor.");
      return;
    }

    if (!nameTr.trim()) {
      setError("Türkçe ürün adı zorunludur.");
      return;
    }

    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Geçerli bir fiyat girin.");
      return;
    }

    const product: AdminProduct = {
      id: normalizedId,
      categoryId,
      price: parsedPrice,
      imageUrl: "",
      sortOrder: nextSortOrder,
      isActive: true,
      names: { tr: nameTr.trim(), en: "", ru: "", de: "", fr: "", ar: "" },
      descriptions: { tr: "", en: "", ru: "", de: "", fr: "", ar: "" },
      contents: { tr: [], en: [], ru: [], de: [], fr: [], ar: [] },
      modifiers: [],
    };

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await createProduct(supabase, product);
      onCreated(product);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Ürün eklenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-dialog-backdrop" onClick={onClose} role="presentation">
      <div className="admin-dialog" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <h2>Yeni Ürün</h2>
        <p className="admin-muted">Ürün detaylarını daha sonra düzenleyebilirsiniz.</p>

        <form onSubmit={(event) => void handleSubmit(event)} className="admin-form">
          <label>
            Ürün ID
            <input
              className="admin-input"
              value={id}
              onChange={(event) => setId(event.target.value)}
              placeholder="p99"
              autoFocus
            />
          </label>

          <label>
            Türkçe Ad
            <input
              className="admin-input"
              value={nameTr}
              onChange={(event) => setNameTr(event.target.value)}
              placeholder="Örn. Margarita"
              required
            />
          </label>

          <label>
            Fiyat (₺)
            <input
              className="admin-input"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              required
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-dialog-actions">
            <button type="button" className="admin-button admin-button-secondary" onClick={onClose} disabled={saving}>
              İptal
            </button>
            <button type="submit" className="admin-button" disabled={saving}>
              {saving ? "Ekleniyor…" : "Ürün Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
