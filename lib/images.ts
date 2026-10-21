import type { SupabaseClient } from "@supabase/supabase-js";

const extensions = ["jpg", "png", "webp"];

const mimeToExt: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function removeProductImages(supabase: SupabaseClient, id: string) {
  await supabase.storage.from("menu-images").remove(extensions.map((ext) => `${id}.${ext}`));
}

export async function uploadProductImage(supabase: SupabaseClient, id: string, file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, message: "Görsel 5 MB sınırını aşıyor." };
  }

  const ext = mimeToExt[file.type];
  if (!ext) {
    return { ok: false as const, message: "Yalnızca JPEG, PNG veya WebP yüklenebilir." };
  }

  await removeProductImages(supabase, id);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const path = `${id}.${ext}`;
  const { error } = await supabase.storage.from("menu-images").upload(path, bytes, {
    contentType: file.type,
    upsert: true,
    cacheControl: "3600",
  });

  if (error) {
    const missingBucket = /bucket not found/i.test(error.message);
    return {
      ok: false as const,
      message: missingBucket
        ? "menu-images kovası bulunamadı. SQL dosyasını çalıştırın."
        : "Görsel yüklenemedi.",
    };
  }

  return { ok: true as const, path };
}
