"use client";

import type { LangCode } from "@/lib/menu/types";
import { ADMIN_LANGS, ADMIN_LANG_LABELS } from "@/lib/admin/types";

type Props = {
  active: LangCode;
  onChange: (lang: LangCode) => void;
  missingLangs?: LangCode[];
  onAutoTranslate?: () => void | Promise<void>;
  translating?: boolean;
  compact?: boolean;
};

export default function LanguageTabs({
  active,
  onChange,
  missingLangs = [],
  onAutoTranslate,
  translating = false,
  compact,
}: Props) {
  return (
    <div className={`admin-lang-tabs ${compact ? "admin-lang-tabs-compact" : ""}`}>
      {ADMIN_LANGS.map((lang) => {
        const missing = missingLangs.includes(lang);
        return (
          <button
            key={lang}
            type="button"
            className={`admin-lang-tab ${active === lang ? "active" : ""} ${missing ? "missing" : ""}`}
            onClick={() => onChange(lang)}
            title={ADMIN_LANG_LABELS[lang]}
          >
            {lang.toUpperCase()}
            {missing ? <span className="admin-lang-missing-dot" aria-label="Eksik çeviri" /> : null}
          </button>
        );
      })}
      {onAutoTranslate && active !== "tr" ? (
        <button
          type="button"
          className="admin-lang-tab admin-lang-copy"
          disabled={translating}
          onClick={() => void onAutoTranslate()}
        >
          {translating ? "Çevriliyor…" : "Otomatik çevir"}
        </button>
      ) : null}
    </div>
  );
}
