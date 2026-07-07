"use client";

import type { LangCode } from "@/lib/menu/types";
import { ADMIN_LANGS, ADMIN_LANG_LABELS } from "@/lib/admin/types";

type Props = {
  active: LangCode;
  onChange: (lang: LangCode) => void;
  missingLangs?: LangCode[];
  onCopyFromTr?: () => void;
  compact?: boolean;
};

export default function LanguageTabs({ active, onChange, missingLangs = [], onCopyFromTr, compact }: Props) {
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
      {onCopyFromTr && active !== "tr" ? (
        <button type="button" className="admin-lang-tab admin-lang-copy" onClick={onCopyFromTr}>
          TR&apos;den kopyala
        </button>
      ) : null}
    </div>
  );
}
