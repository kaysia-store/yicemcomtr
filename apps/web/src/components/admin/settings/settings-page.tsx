"use client";

import { useCallback, useEffect, useState } from "react";
import LanguageTabs from "@/components/admin/ui/language-tabs";
import LoadingBlock from "@/components/admin/ui/loading-block";
import { loadRestaurantSettings, saveRestaurantSettings } from "@/lib/admin/settings-data";
import { translateLocalizedFieldToLang } from "@/lib/admin/translate-api";
import type { LangCode } from "@/lib/menu/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [names, setNames] = useState({ tr: "", en: "", ru: "", de: "", fr: "", ar: "" });
  const [activeLang, setActiveLang] = useState<LangCode>("tr");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const settings = await loadRestaurantSettings(supabase);
      setNames(settings.names);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Ayarlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const supabase = getSupabaseBrowserClient();
      await saveRestaurantSettings(supabase, { names });
      setSuccess("Ayarlar kaydedildi.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kayıt başarısız. Yazma izni gerekebilir.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <LoadingBlock label="Ayarlar yükleniyor…" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-toolbar">
        <div>
          <h2 className="admin-page-section-title">Ayarlar</h2>
          <p className="admin-muted">Restoran adı ve genel site ayarları</p>
        </div>
        <button type="button" className="admin-button admin-button-sm" onClick={() => void handleSave()} disabled={saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </button>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}
      {success ? <p className="admin-success">{success}</p> : null}

      <section className="admin-k-card admin-k-card-padded">
        <h3 className="admin-k-section-title">Restoran adı</h3>
        <LanguageTabs
          active={activeLang}
          onChange={setActiveLang}
          translating={translating}
          onAutoTranslate={async () => {
            if (activeLang === "tr" || !names.tr.trim()) return;
            setTranslating(true);
            setError(null);
            try {
              setNames(await translateLocalizedFieldToLang(names, activeLang));
            } catch (translateError) {
              setError(translateError instanceof Error ? translateError.message : "Çeviri başarısız.");
            } finally {
              setTranslating(false);
            }
          }}
        />
        <label>
          Görünen ad
          <input
            className="admin-input"
            value={names[activeLang]}
            onChange={(e) => setNames({ ...names, [activeLang]: e.target.value })}
          />
        </label>
      </section>

      <section className="admin-cta-card admin-settings-note">
        <p>
          Menü kategorileri ve ürünler <strong>Kategoriler</strong> ve <strong>Ürünler</strong> bölümlerinden yönetilir.
          Canlı site: <strong>yicem.com.tr</strong>
        </p>
      </section>
    </div>
  );
}
