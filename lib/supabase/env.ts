const projectRef = "cvpazdacfnkjussrydim";

export type SupabaseEnv = {
  url: string;
  anonKey: string;
};

function clean(value: string) {
  return value.replace(/^\uFEFF/, "").trim().replace(/^['"`]+|['"`]+$/g, "").trim();
}

export function normalizeSupabaseUrl(raw: string): string | null {
  const value = clean(raw);
  if (!value) return null;
  if (value.toLowerCase().includes(projectRef)) return `https://${projectRef}.supabase.co`;
  const embedded = value.match(/https?:\/\/[a-z0-9-]+\.supabase\.co/i);
  if (embedded) return embedded[0].toLowerCase();
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const anonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function supabaseEnvError(): string | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  if (!rawUrl.trim() || !rawKey.trim()) return null;
  if (normalizeSupabaseUrl(rawUrl)) return null;
  const shown = rawUrl.trim().replace(/\s+/g, " ");
  const preview = /^(eyJ|sb_)/.test(shown) ? `${shown.slice(0, 8)}… bu bir adres değil, anahtar` : shown.slice(0, 60);
  return `Yayın bu değeri okuyor: ${preview}. NEXT_PUBLIC_SUPABASE_URL alanına yalnızca https://${projectRef}.supabase.co yazın, tırnak eklemeyin. Production için kaydedip önbelleksiz yeniden yayınlayın.`;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ?? "";
}
