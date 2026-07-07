import "server-only";
import { unstable_noStore as noStore } from "next/cache";
import { loadMenuFromJson } from "./load-json";
import { loadMenuFromSupabase } from "./load-supabase";
import type { MenuData } from "./types";

function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export async function getMenu(): Promise<MenuData> {
  noStore();

  if (hasSupabaseConfig()) {
    const fromDb = await loadMenuFromSupabase();
    if (fromDb) return fromDb;

    console.error("Supabase menü yüklenemedi; yapılandırma mevcut ama veri alınamadı.");
    throw new Error("Canlı menü Supabase üzerinden yüklenemedi.");
  }

  return loadMenuFromJson();
}
