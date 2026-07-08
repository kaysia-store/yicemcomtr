"use client";

import { useEffect, useState } from "react";
import LanguageTabs from "@/components/admin/ui/language-tabs";
import type { AdminCategory } from "@/lib/admin/types";
import type { LangCode } from "@/lib/menu/types";
import { missingLangsForNames } from "@/lib/admin/translation-utils";
import { createCategory, saveCategory, slugifyId } from "@/lib/admin/menu-data";
import { translateLocalizedFieldToLang } from "@/lib/admin/translate-api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  category: AdminCategory | null;
  isNew?: boolean;
  onSaved: (category: AdminCategory) => void;
  onCancel: () => void;
};

export default function CategoryForm({ category, isNew = false, onSaved, onCancel }: Props) {
  const [draft, setDraft] = useState<AdminCategory>(
    category ?? {
      id: "",
      slug: "",
      sortOrder: 0,
      isVisible: true,
      names: { tr: "", en: "", ru: "", de: "", fr: "", ar: "" },
      productCount: 0,
    },
  );
  const [activeLang, setActiveLang] = useState<LangCode>("tr");
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) setDraft(category);
  }, [category]);

  const missingLangs = missingLangsForNames(draft.names);

  const handleSave = async () => {
    setError(null);
    const normalizedId = isNew ? slugifyId(draft.names.tr) : draft.id;
    if (!normalizedId) {
      setError("Kategori adından geçerli bir kayıt oluşturulamadı.");
      return;
    }
    if (!draft.names.tr.trim()) {
      setError("Türkçe kategori adı zorunludur.");
      return;
    }

    const payload: AdminCategory = {
      ...draft,
      id: normalizedId,
      slug: normalizedId,
    };

    setSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      if (isNew) await createCategory(supabase, payload);
      else await saveCategory(supabase, payload);
      onSaved(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form-panel">
      <div className="admin-k-card-head">
        <h3 className="admin-k-section-title">{isNew ? "Yeni Kategori" : "Kategori Düzenle"}</h3>
        <div className="admin-header-actions">
          <button type="button" className="admin-button admin-button-secondary admin-button-sm" onClick={onCancel}>
            İptal
          </button>
          <button type="button" className="admin-button admin-button-sm" onClick={() => void handleSave()} disabled={saving}>
            {saving ? "Kaydediliyor…" : "Kaydet"}
          </button>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-form-grid">
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
            checked={draft.isVisible}
            onChange={(e) => setDraft({ ...draft, isVisible: e.target.checked })}
          />
          Menüde görünür (aktif)
        </label>
      </div>

      <LanguageTabs
        active={activeLang}
        onChange={setActiveLang}
        missingLangs={missingLangs}
        translating={translating}
        onAutoTranslate={async () => {
          if (activeLang === "tr" || !draft.names.tr.trim()) return;
          setTranslating(true);
          setError(null);
          try {
            const names = await translateLocalizedFieldToLang(draft.names, activeLang);
            setDraft({ ...draft, names });
          } catch (translateError) {
            setError(translateError instanceof Error ? translateError.message : "Çeviri başarısız.");
          } finally {
            setTranslating(false);
          }
        }}
      />

      <label>
        Kategori adı
        <input
          className="admin-input"
          value={draft.names[activeLang]}
          onChange={(e) => setDraft({ ...draft, names: { ...draft.names, [activeLang]: e.target.value } })}
        />
      </label>
    </div>
  );
}
