"use client";

import { useState } from "react";
import { createCategory, uniqueSlugId } from "@/lib/admin/menu-data";
import type { AdminCategory } from "@/lib/admin/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  existingIds: string[];
  nextSortOrder: number;
  onCreated: (category: AdminCategory) => void;
  onClose: () => void;
};

export default function CreateCategoryDialog({ existingIds, nextSortOrder, onCreated, onClose }: Props) {
  const [nameTr, setNameTr] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const normalizedId = uniqueSlugId(nameTr, existingIds);
    if (!normalizedId) {
      setError("Geçerli bir kategori adı girin.");
      return;
    }

    if (!nameTr.trim()) {
      setError("Türkçe kategori adı zorunludur.");
      return;
    }

    const category: AdminCategory = {
      id: normalizedId,
      slug: normalizedId,
      sortOrder: nextSortOrder,
      isVisible: true,
      names: { tr: nameTr.trim(), en: "", ru: "", de: "", fr: "", ar: "" },
      productCount: 0,
    };

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      await createCategory(supabase, category);
      onCreated(category);
      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Kategori eklenemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-dialog-backdrop" onClick={onClose} role="presentation">
      <div className="admin-dialog" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <h2>Yeni Kategori</h2>
        <p className="admin-muted">Kategori adı menüde görünür.</p>

        <form onSubmit={(event) => void handleSubmit(event)} className="admin-form">
          <label>
            Türkçe Ad
            <input
              className="admin-input"
              value={nameTr}
              onChange={(event) => setNameTr(event.target.value)}
              placeholder="Örn. Pizzalar"
              autoFocus
              required
            />
          </label>

          {error ? <p className="admin-error">{error}</p> : null}

          <div className="admin-dialog-actions">
            <button type="button" className="admin-button admin-button-secondary" onClick={onClose} disabled={saving}>
              İptal
            </button>
            <button type="submit" className="admin-button" disabled={saving}>
              {saving ? "Ekleniyor…" : "Kategori Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
