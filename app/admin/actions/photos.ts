"use server";

import { requireAdmin } from "@/lib/auth";
import { uploadProductImage } from "@/lib/images";
import { revalidateMenu } from "@/lib/revalidate";
import { uuidPattern } from "@/lib/validators";

export async function saveProductImage(formData: FormData): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, message: auth.message };

  const rawId = formData.get("id");
  const id = typeof rawId === "string" ? rawId.trim() : "";
  if (!uuidPattern.test(id)) return { ok: false, message: "Ürün bulunamadı." };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Görsel seçilmedi." };

  const { data: product, error } = await auth.supabase.from("products").select("id").eq("id", id).maybeSingle();
  if (error || !product) return { ok: false, message: "Ürün bulunamadı." };

  const uploaded = await uploadProductImage(auth.supabase, id, file);
  if (!uploaded.ok) return { ok: false, message: uploaded.message };

  const { error: updateError } = await auth.supabase.from("products").update({ image_path: uploaded.path }).eq("id", id);
  if (updateError) return { ok: false, message: "Görsel yüklendi ama ürüne bağlanamadı." };

  revalidateMenu();
  return { ok: true };
}
