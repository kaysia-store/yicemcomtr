"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { removeInboxImage, uploadInboxImage, uploadProductImage } from "@/lib/images";
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
  revalidatePath("/admin/photos");
  return { ok: true };
}

export async function saveInboxImage(formData: FormData): Promise<{ ok: true; id: string } | { ok: false; message: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, message: auth.message };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Görsel seçilmedi." };

  const uploaded = await uploadInboxImage(auth.supabase, file);
  if (!uploaded.ok) return { ok: false, message: uploaded.message };

  revalidatePath("/admin/photos");
  return { ok: true, id: uploaded.item.id };
}

export async function deleteInboxImage(id: string): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, message: auth.message };
  if (!uuidPattern.test(id)) return { ok: false, message: "Görsel bulunamadı." };

  const { data, error } = await auth.supabase
    .from("image_inbox")
    .select("id, storage_path")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return { ok: false, message: "Görsel bulunamadı." };

  await removeInboxImage(auth.supabase, String(data.id), String(data.storage_path));
  revalidatePath("/admin/photos");
  return { ok: true };
}

export async function assignInboxToProducts(
  inboxId: string,
  productIds: string[],
): Promise<{ ok: true } | { ok: false; message: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return { ok: false, message: auth.message };
  if (!uuidPattern.test(inboxId)) return { ok: false, message: "Görsel bulunamadı." };

  const ids = [...new Set(productIds.map((id) => id.trim()).filter((id) => uuidPattern.test(id)))];
  if (ids.length === 0) return { ok: false, message: "Ürün seçilmedi." };

  const { data: inbox, error } = await auth.supabase
    .from("image_inbox")
    .select("id, storage_path, original_name, content_type")
    .eq("id", inboxId)
    .maybeSingle();
  if (error || !inbox) return { ok: false, message: "Bekleyen görsel bulunamadı." };

  const { data: blob, error: downloadError } = await auth.supabase.storage
    .from("menu-images")
    .download(String(inbox.storage_path));
  if (downloadError || !blob) return { ok: false, message: "Görsel dosyası okunamadı." };

  const contentType = String(inbox.content_type || blob.type || "image/jpeg");
  const file = new File([blob], String(inbox.original_name || "image"), { type: contentType });

  for (const productId of ids) {
    const { data: product, error: productError } = await auth.supabase
      .from("products")
      .select("id")
      .eq("id", productId)
      .maybeSingle();
    if (productError || !product) return { ok: false, message: "Ürün bulunamadı." };

    const uploaded = await uploadProductImage(auth.supabase, productId, file);
    if (!uploaded.ok) return { ok: false, message: uploaded.message };

    const { error: updateError } = await auth.supabase
      .from("products")
      .update({ image_path: uploaded.path })
      .eq("id", productId);
    if (updateError) return { ok: false, message: "Görsel ürüne bağlanamadı." };
  }

  await removeInboxImage(auth.supabase, String(inbox.id), String(inbox.storage_path));
  revalidateMenu();
  revalidatePath("/admin/photos");
  return { ok: true };
}
