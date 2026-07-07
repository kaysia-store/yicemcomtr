import type { LocalizedString } from "./types";

export function tLocalized(obj: LocalizedString, lang: string): string {
  const code = lang as keyof LocalizedString;
  return obj[code] || obj.tr || obj.en || "";
}

/** Boş çeviri alanları için yedek metin (ör. seçenek kodu). */
export function tLocalizedOrFallback(obj: LocalizedString, lang: string, fallback: string): string {
  const value = tLocalized(obj, lang).trim();
  return value || fallback;
}
