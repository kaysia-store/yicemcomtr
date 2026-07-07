import type { LocalizedString } from "./types";

export function tLocalized(obj: LocalizedString, lang: string): string {
  const code = lang as keyof LocalizedString;
  return obj[code] || obj.tr || obj.en || "";
}
