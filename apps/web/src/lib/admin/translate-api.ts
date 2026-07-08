import type { LocalizedContents, LocalizedFields } from "@/lib/admin/types";
import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type TranslateResponse = {
  byLang: Partial<Record<LangCode, string[]>>;
};

async function callTranslateApi(texts: string[], targetLangs: LangCode[]): Promise<TranslateResponse["byLang"]> {
  const supabase = getSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Çeviri için admin oturumu gerekli.");
  }

  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ texts, targetLangs }),
  });

  const payload = (await response.json()) as TranslateResponse & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Çeviri başarısız.");
  }

  return payload.byLang;
}

export async function translateTextsToLang(texts: string[], targetLang: LangCode): Promise<string[]> {
  const byLang = await callTranslateApi(texts, [targetLang]);
  return byLang[targetLang] ?? texts.map(() => "");
}

export async function translateTextToLangs(text: string, targetLangs: LangCode[]): Promise<Partial<Record<LangCode, string>>> {
  if (!text.trim() || targetLangs.length === 0) return {};
  const byLang = await callTranslateApi([text], targetLangs);
  const out: Partial<Record<LangCode, string>> = {};
  for (const lang of targetLangs) {
    out[lang] = byLang[lang]?.[0] ?? "";
  }
  return out;
}

export async function translateLocalizedFromTr(
  fields: LocalizedFields,
  targetLangs: LangCode[] = LANG_CODES.filter((lang) => lang !== "tr"),
): Promise<LocalizedFields> {
  const trText = fields.tr.trim();
  if (!trText) return { ...fields };

  const translated = await translateTextToLangs(trText, targetLangs);
  const out = { ...fields };
  for (const lang of targetLangs) {
    if (translated[lang]) out[lang] = translated[lang]!;
  }
  return out;
}

export async function translateLocalizedFieldToLang(
  fields: LocalizedFields,
  targetLang: LangCode,
): Promise<LocalizedFields> {
  if (targetLang === "tr") return fields;
  const trText = fields.tr.trim();
  if (!trText) return fields;

  const [translated] = await translateTextsToLang([trText], targetLang);
  return { ...fields, [targetLang]: translated || fields[targetLang] };
}

export async function translateContentsFromTr(
  contents: LocalizedContents,
  targetLangs: LangCode[] = LANG_CODES.filter((lang) => lang !== "tr"),
): Promise<LocalizedContents> {
  const trItems = contents.tr.filter(Boolean);
  if (trItems.length === 0) return { ...contents };

  const out = { ...contents };
  for (const lang of targetLangs) {
    const translated = await translateTextsToLang(trItems, lang);
    out[lang] = translated.filter(Boolean);
  }
  return out;
}

export async function translateContentsToLang(
  contents: LocalizedContents,
  targetLang: LangCode,
): Promise<LocalizedContents> {
  if (targetLang === "tr") return contents;
  const trItems = contents.tr.filter(Boolean);
  if (trItems.length === 0) return contents;

  const translated = await translateTextsToLang(trItems, targetLang);
  return { ...contents, [targetLang]: translated.filter(Boolean) };
}

export async function translateProductFieldsToLang(
  draft: {
    names: LocalizedFields;
    descriptions: LocalizedFields;
    contents: LocalizedContents;
  },
  targetLang: LangCode,
) {
  const [names, descriptions, contents] = await Promise.all([
    translateLocalizedFieldToLang(draft.names, targetLang),
    translateLocalizedFieldToLang(draft.descriptions, targetLang),
    translateContentsToLang(draft.contents, targetLang),
  ]);
  return { names, descriptions, contents };
}

export async function translateProductFieldsToAllLangs(draft: {
  names: LocalizedFields;
  descriptions: LocalizedFields;
  contents: LocalizedContents;
}) {
  const targetLangs = LANG_CODES.filter((lang) => lang !== "tr");
  const [names, descriptions, contents] = await Promise.all([
    translateLocalizedFromTr(draft.names, targetLangs),
    translateLocalizedFromTr(draft.descriptions, targetLangs),
    translateContentsFromTr(draft.contents, targetLangs),
  ]);
  return { names, descriptions, contents };
}
