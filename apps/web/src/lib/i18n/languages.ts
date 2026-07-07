import type { LangCode } from "@/lib/menu/types";

export type LanguageOption = {
  code: LangCode;
  flag: string;
  label: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "tr", flag: "🇹🇷", label: "Türkçe" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "ar", flag: "🇸🇦", label: "العربية" },
];

export const LANG_CODES = LANGUAGE_OPTIONS.map((option) => option.code);

export function isValidLang(value: string): value is LangCode {
  return LANG_CODES.includes(value as LangCode);
}

export function getLanguageFlag(lang: LangCode): string {
  return LANGUAGE_OPTIONS.find((option) => option.code === lang)?.flag ?? "🇹🇷";
}
