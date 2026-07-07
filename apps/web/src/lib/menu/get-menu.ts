import "server-only";
import { loadMenuFromJson } from "./load-json";
import { loadMenuFromSupabase } from "./load-supabase";
import type { MenuData } from "./types";

export async function getMenu(): Promise<MenuData> {
  const fromDb = await loadMenuFromSupabase();
  if (fromDb) return fromDb;
  return loadMenuFromJson();
}
