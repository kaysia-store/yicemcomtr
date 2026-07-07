"use client";

import { useEffect, useState } from "react";
import { ADMIN_LANGS, ADMIN_LANG_LABELS, type AdminCategory } from "@/lib/admin/types";
import { saveCategory } from "@/lib/admin/menu-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  category: AdminCategory;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (category: AdminCategory) => void;
  onCancel: () => void;
};

export default function CategoryEditor({ category, onDirtyChange, onSaved, onCancel }: Props) {
  const [draft, setDraft] = useState(category);
  const [activeLang, setActiveLang] = useState<(typeof ADMIN_LANGS)[number]>("tr");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(category);
  }, [category]);

  useEffect(() => {
    onDirtyChange(JSON.stringify(draft) !== JSON.stringify(category));
  }, [draft, category, onDirtyChange]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await saveCategory(supabase, draft);
      onSaved(draft);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt başarısız.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <div>
          <h1>Kategori Düzenle</h1>
          <p className="admin-muted">{category.id}</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-button admin-button-secondary" onClick={onCancel}>
            İptal
          </button>
          <button type="button" className="admin-button" onClick={() => void handleSave()} disabled={saving}>
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
            onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) })}
          />
        </label>
        <label className="admin-checkbox-label">
          <input
            type="checkbox"
            checked={draft.isVisible}
            onChange={(event) => setDraft({ ...draft, isVisible: event.target.checked })}
          />
          Menüde görünür
        </label>
      </div>

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
      </div>

      <label>
        Kategori adı ({ADMIN_LANG_LABELS[activeLang]})
        <input
          className="admin-input"
          value={draft.names[activeLang]}
          onChange={(event) =>
            setDraft({ ...draft, names: { ...draft.names, [activeLang]: event.target.value } })
          }
        />
      </label>
    </section>
  );
}
