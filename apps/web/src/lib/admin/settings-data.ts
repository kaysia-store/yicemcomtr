import type { LocalizedFields } from "./types";
import type { LangCode } from "@/lib/menu/types";
import { LANG_CODES } from "@/lib/menu/types";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type RestaurantSettings = {
  names: LocalizedFields;
};

function emptyNames(): LocalizedFields {
  return { tr: "", en: "", ru: "", de: "", fr: "", ar: "" };
}

export async function loadRestaurantSettings(supabase: SupabaseClient): Promise<RestaurantSettings> {
  const { data, error } = await supabase.from("site_settings").select("value").eq("key", "restaurant").maybeSingle();

  if (error) throw error;

  const value = (data?.value ?? {}) as Record<string, string>;
  const names = emptyNames();
  for (const lang of LANG_CODES) {
    names[lang] = value[lang] ?? "";
  }

  return { names };
}

export async function saveRestaurantSettings(supabase: SupabaseClient, settings: RestaurantSettings) {
  const value: Record<string, string> = {};
  for (const lang of LANG_CODES) {
    value[lang] = settings.names[lang] ?? "";
  }

  const { error } = await supabase.from("site_settings").upsert({
    key: "restaurant",
    value,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}
