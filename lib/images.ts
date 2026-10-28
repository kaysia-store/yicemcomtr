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

export async function uploadInboxImage(supabase: SupabaseClient, file: File) {
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, message: "Görsel 5 MB sınırını aşıyor." };
  }

  const ext = mimeToExt[file.type];
  if (!ext) {
    return { ok: false as const, message: "Yalnızca JPEG, PNG veya WebP yüklenebilir." };
  }

  const id = crypto.randomUUID();
  const path = `inbox/${id}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("menu-images").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
    cacheControl: "3600",
  });

  if (error) {
    const missingBucket = /bucket not found/i.test(error.message);
    return {
      ok: false as const,
      message: missingBucket
        ? "menu-images kovası bulunamadı. SQL dosyasını çalıştırın."
        : "Görsel havuza yüklenemedi.",
    };
  }

  const { data, error: insertError } = await supabase
    .from("image_inbox")
    .insert({
      id,
      storage_path: path,
      original_name: file.name.slice(0, 180),
      content_type: file.type,
      size_bytes: file.size,
    })
    .select("id, storage_path, original_name, created_at")
    .maybeSingle();

  if (insertError || !data) {
    await supabase.storage.from("menu-images").remove([path]);
    if (/image_inbox|schema cache|does not exist/i.test(insertError?.message ?? "")) {
      return {
        ok: false as const,
        message: "Bekleyen görseller tablosu yok. supabase/migrations/0011_image_inbox.sql dosyasını çalıştırın.",
      };
    }
    return { ok: false as const, message: "Görsel havuza kaydedilemedi." };
  }

  return {
    ok: true as const,
    item: {
      id: String(data.id),
      storagePath: String(data.storage_path),
      originalName: String(data.original_name),
      createdAt: String(data.created_at),
    },
  };
}

export async function removeInboxImage(supabase: SupabaseClient, id: string, storagePath: string) {
  await supabase.storage.from("menu-images").remove([storagePath]);
  await supabase.from("image_inbox").delete().eq("id", id);
}
