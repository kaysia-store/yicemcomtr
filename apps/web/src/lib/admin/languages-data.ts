import type { LangCode } from "@/lib/menu/types";
import { ADMIN_LANG_LABELS } from "./types";

type SupabaseClient = ReturnType<typeof import("@/lib/supabase/client").getSupabaseBrowserClient>;

export type AdminLanguage = {
  code: LangCode;
  name: string;
  flag: string;
  isActive: boolean;
  isRtl: boolean;
  sortOrder: number;
};

export async function loadAdminLanguages(supabase: SupabaseClient): Promise<AdminLanguage[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("code, name, flag, is_active, is_rtl, sort_order")
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((row) => ({
    code: row.code as LangCode,
    name: row.name,
    flag: row.flag ?? "",
    isActive: row.is_active ?? true,
    isRtl: row.is_rtl ?? false,
    sortOrder: row.sort_order ?? 0,
  }));
}

export function languageDisplayName(code: LangCode) {
  return ADMIN_LANG_LABELS[code] ?? code.toUpperCase();
}
