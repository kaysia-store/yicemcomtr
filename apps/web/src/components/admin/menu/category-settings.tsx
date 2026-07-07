"use client";

import { useEffect, useState } from "react";
import { ADMIN_LANGS, ADMIN_LANG_LABELS, type AdminCategory } from "@/lib/admin/types";
import { saveCategory } from "@/lib/admin/menu-data";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Props = {
  category: AdminCategory;
  onDirtyChange: (dirty: boolean) => void;
  onSaved: (category: AdminCategory) => void;
};

export default function CategorySettings({ category, onDirtyChange, onSaved }: Props) {
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
    <section className="admin-k-card admin-k-card-padded admin-settings-panel">
      <div className="admin-k-card-head">
        <div>
          <h3 className="admin-k-section-title">Kategori ayarları</h3>
          <p className="admin-muted admin-mono">{category.id}</p>
        </div>
        <button type="button" className="admin-button admin-button-sm" onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      <div className="admin-settings-grid">
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

      <div className="admin-lang-tabs admin-lang-tabs-compact">
        {ADMIN_LANGS.map((lang) => (
          <button
            key={lang}
            type="button"
            className={`admin-lang-tab ${activeLang === lang ? "active" : ""}`}
            onClick={() => setActiveLang(lang)}
          >
            {lang.toUpperCase()}
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
