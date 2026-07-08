import type { LangCode } from "@/lib/menu/types";

const DEEPL_TARGET_LANG: Record<Exclude<LangCode, "tr">, string> = {
  en: "EN-US",
  ru: "RU",
  de: "DE",
  fr: "FR",
  ar: "AR",
};

export function getDeepLApiBaseUrl(apiKey: string) {
  if (process.env.DEEPL_API_URL) return process.env.DEEPL_API_URL.replace(/\/$/, "");
  return apiKey.endsWith(":fx") ? "https://api-free.deepl.com" : "https://api.deepl.com";
}

export function toDeepLTargetLang(lang: LangCode): string | null {
  if (lang === "tr") return null;
  return DEEPL_TARGET_LANG[lang];
}

type DeepLTranslateResponse = {
  translations: Array<{ text: string }>;
};

export async function translateWithDeepL(texts: string[], targetLang: LangCode): Promise<string[]> {
  const apiKey = process.env.DEEPL_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DeepL API anahtarı tanımlı değil (DEEPL_API_KEY).");
  }

  const deeplTarget = toDeepLTargetLang(targetLang);
  if (!deeplTarget) {
    throw new Error("Türkçe hedef dil olarak kullanılamaz.");
  }

  const cleaned = texts.map((text) => text.trim());
  if (cleaned.every((text) => !text)) {
    return texts;
  }

  const baseUrl = getDeepLApiBaseUrl(apiKey);
  const response = await fetch(`${baseUrl}/v2/translate`, {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: cleaned.map((text) => text || " "),
      source_lang: "TR",
      target_lang: deeplTarget,
    }),
  });

  const payload = (await response.json()) as DeepLTranslateResponse & { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? `DeepL hatası (${response.status})`);
  }

  return payload.translations.map((item, index) => {
    const original = texts[index]?.trim() ?? "";
    if (!original) return "";
    return item.text.trim();
  });
}
