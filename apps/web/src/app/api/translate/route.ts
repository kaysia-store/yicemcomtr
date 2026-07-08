import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { translateWithDeepL } from "@/lib/admin/deepl-server";
import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";

type TranslateBody = {
  texts?: string[];
  targetLang?: LangCode;
  targetLangs?: LangCode[];
};

function isLangCode(value: string): value is LangCode {
  return LANG_CODES.includes(value as LangCode);
}

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Yetkisiz istek." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase yapılandırması eksik." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return NextResponse.json({ error: "Geçersiz oturum." }, { status: 401 });
  }

  let body: TranslateBody;
  try {
    body = (await request.json()) as TranslateBody;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const texts = Array.isArray(body.texts) ? body.texts.map(String) : [];
  const langs = [
    ...(body.targetLang ? [body.targetLang] : []),
    ...(Array.isArray(body.targetLangs) ? body.targetLangs : []),
  ].filter((lang, index, all) => isLangCode(lang) && lang !== "tr" && all.indexOf(lang) === index);

  if (texts.length === 0 || langs.length === 0) {
    return NextResponse.json({ error: "Metin ve hedef dil gerekli." }, { status: 400 });
  }

  try {
    const byLang: Partial<Record<LangCode, string[]>> = {};
    for (const lang of langs) {
      byLang[lang] = await translateWithDeepL(texts, lang);
    }
    return NextResponse.json({ byLang });
  } catch (translateError) {
    const message = translateError instanceof Error ? translateError.message : "Çeviri başarısız.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
