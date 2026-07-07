"use client";

import { useEffect } from "react";
import type { LangCode } from "@/lib/menu/types";
import { LANGUAGE_OPTIONS } from "@/lib/i18n/languages";
import { tUi } from "@/lib/i18n/ui";

type Props = {
  open: boolean;
  lang: LangCode;
  onSelect: (lang: LangCode) => void;
  onClose: () => void;
};

export default function LanguageModal({ open, lang, onSelect, onClose }: Props) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="languageModalTitle"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="languageModalTitle">{tUi(lang, "select_language")}</h2>
          <button className="modal-close" type="button" aria-label={tUi(lang, "close")} onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="language-options">
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              className={`language-btn ${lang === option.code ? "active" : ""}`}
              onClick={() => onSelect(option.code)}
            >
              <span className="flag">{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
