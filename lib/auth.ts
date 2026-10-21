import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!getSupabaseEnv()) {
    return { ok: false as const, message: "Supabase ayarları eksik." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { ok: false as const, message: "Oturum gerekli. Tekrar giriş yapın." };
  }

  return { ok: true as const, supabase, user };
}
