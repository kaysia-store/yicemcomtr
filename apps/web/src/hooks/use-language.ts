"use client";

import { useCallback, useEffect, useState } from "react";
import type { LangCode } from "@/lib/menu/types";
import { getLanguageFlag, isValidLang } from "@/lib/i18n/languages";

const LANG_STORAGE_KEY = "restaurant_language";
const LANG_SELECTED_KEY = "language_selected";

export function useLanguage() {
  const [lang, setLang] = useState<LangCode>("tr");
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && isValidLang(saved)) {
      setLang(saved);
    }

    if (!localStorage.getItem(LANG_SELECTED_KEY)) {
      setLanguageModalOpen(true);
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang, hydrated]);

  const selectLanguage = useCallback((code: LangCode) => {
    setLang(code);
    localStorage.setItem(LANG_STORAGE_KEY, code);
    localStorage.setItem(LANG_SELECTED_KEY, "true");
    setLanguageModalOpen(false);
  }, []);

  const openLanguageModal = useCallback(() => {
    setLanguageModalOpen(true);
  }, []);

  const closeLanguageModal = useCallback(() => {
    localStorage.setItem(LANG_SELECTED_KEY, "true");
    setLanguageModalOpen(false);
  }, []);

  return {
    lang,
    flag: getLanguageFlag(lang),
    languageModalOpen: hydrated && languageModalOpen,
    selectLanguage,
    openLanguageModal,
    closeLanguageModal,
  };
}
