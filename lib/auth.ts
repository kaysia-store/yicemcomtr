import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  if (!getSupabaseEnv()) {
    return { ok: false as const, message: "Supabase ayarları eksik." };
  }

  const supabase = await createClient();
  return { ok: true as const, supabase, user: null };
}
