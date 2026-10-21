"use server";

import { requireAdmin } from "@/lib/auth";
import { getSupabaseEnv } from "@/lib/supabase/env";
import {
  getTranslationProvider,
  TranslationNotConnectedError,
} from "@/lib/translate/provider";

export type TranslationResult =
  | { ok: true; text: string }
  | { ok: false; message: string };

export async function requestTranslation(input: {
  text: string;
  sourceLocale: string;
  targetLocale: string;
}): Promise<TranslationResult> {
  if (getSupabaseEnv()) {
    const auth = await requireAdmin();
    if (!auth.ok) return { ok: false, message: auth.message };
  }

  const text = input.text.trim();
  if (!text) return { ok: false, message: "Çevrilecek metin yok." };
  if (input.sourceLocale === input.targetLocale) {
    return { ok: true, text };
  }

  try {
    const translated = await getTranslationProvider().translate({
      text,
      sourceLocale: input.sourceLocale,
      targetLocale: input.targetLocale,
    });
    return { ok: true, text: translated };
  } catch (error) {
    if (error instanceof TranslationNotConnectedError) {
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "Çeviri tamamlanamadı." };
  }
}
