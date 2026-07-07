import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "menu-images";

export async function uploadProductImage(
  supabase: SupabaseClient,
  productId: string,
  file: File,
): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `products/${productId}-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
