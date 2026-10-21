import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadRestaurantSettings(supabase: SupabaseClient) {
  const full = await supabase.from("restaurant_settings").select("name, default_locale, show_title").eq("id", 1).maybeSingle();
  if (!full.error) {
    return {
      error: null,
      data: full.data
        ? {
            name: String(full.data.name ?? ""),
            default_locale: String(full.data.default_locale ?? "tr"),
            show_title: full.data.show_title === true,
          }
        : null,
    };
  }

  const message = full.error.message ?? "";
  const missingColumn = full.error.code === "PGRST204" || /show_title/i.test(message);
  if (!missingColumn) return { error: full.error, data: null };

  const basic = await supabase.from("restaurant_settings").select("name, default_locale").eq("id", 1).maybeSingle();
  if (basic.error || !basic.data) return { error: basic.error, data: null };
  return {
    error: null,
    data: {
      name: String(basic.data.name ?? ""),
      default_locale: String(basic.data.default_locale ?? "tr"),
      show_title: false,
    },
  };
}
