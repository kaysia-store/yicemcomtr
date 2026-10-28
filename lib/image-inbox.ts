import { menuImageUrl } from "@/lib/format";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { isSchemaError } from "@/lib/schema-error";

export type InboxImage = {
  id: string;
  storagePath: string;
  originalName: string;
  url: string;
  createdAt: string;
};

export async function listImageInbox(): Promise<
  { ok: true; items: InboxImage[] } | { ok: false; reason: "setup" | "schema" | "error"; message?: string; items: InboxImage[] }
> {
  if (!getSupabaseEnv()) return { ok: false, reason: "setup", items: [] };
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("image_inbox")
      .select("id, storage_path, original_name, created_at")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      if (isSchemaError(error) || /image_inbox|does not exist/i.test(error.message)) {
        return {
          ok: false,
          reason: "schema",
          message: "Bekleyen görseller tablosu yok. 0011_image_inbox.sql dosyasını çalıştırın.",
          items: [],
        };
      }
      return { ok: false, reason: "error", message: "Bekleyen görseller yüklenemedi.", items: [] };
    }

    const items: InboxImage[] = (data ?? [])
      .map((row) => {
        const storagePath = String(row.storage_path ?? "");
        const url = menuImageUrl(storagePath);
        if (!url) return null;
        return {
          id: String(row.id),
          storagePath,
          originalName: String(row.original_name ?? "görsel"),
          url,
          createdAt: String(row.created_at ?? ""),
        };
      })
      .filter((item): item is InboxImage => item !== null);

    return { ok: true, items };
  } catch {
    return { ok: false, reason: "error", message: "Bekleyen görseller yüklenemedi.", items: [] };
  }
}
