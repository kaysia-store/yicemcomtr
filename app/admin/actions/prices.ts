"use server";

import { previewSavePrices } from "@/lib/preview";
import { roundLira } from "@/lib/prices";
import { revalidateMenu } from "@/lib/revalidate";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { ActionState } from "@/lib/types";
import { readPrice, uuidPattern } from "@/lib/validators";
import { redirect } from "next/navigation";

export async function savePrices(_state: ActionState, formData: FormData): Promise<ActionState> {
  const ids = formData.getAll("id").map(String);
  const prices = formData.getAll("price").map(String);
  const optionIds = formData.getAll("optionId").map(String);
  const optionPrices = formData.getAll("optionPrice").map(String);
  if (ids.length === 0 && optionIds.length === 0) {
    return { status: "error", message: "Kaydedilecek fiyat değişikliği yok." };
  }

  const updates: { id: string; price: number }[] = [];
  for (let index = 0; index < ids.length; index += 1) {
    const id = ids[index];
    if (!uuidPattern.test(id)) return { status: "error", message: "Ürün kaydı geçersiz." };
    const parsed = readPrice(prices[index] ?? "");
    if (!parsed.ok) return { status: "error", message: parsed.message };
    const price = roundLira(parsed.price);
    if (price < 0) return { status: "error", message: "Fiyat 0 TL'nin altına inemez." };
    updates.push({ id, price });
  }

  const options: { id: string; price: number }[] = [];
  for (let index = 0; index < optionIds.length; index += 1) {
    const id = optionIds[index];
    if (!uuidPattern.test(id)) return { status: "error", message: "Seçenek kaydı geçersiz." };
    const parsed = readPrice(optionPrices[index] ?? "");
    if (!parsed.ok) return { status: "error", message: parsed.message };
    const price = roundLira(parsed.price);
    if (price < 0) return { status: "error", message: "Ek ücret 0 TL'nin altına inemez." };
    options.push({ id, price });
  }

  if (!getSupabaseEnv()) return previewSavePrices(updates, options);

  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  for (const update of updates) {
    const { error } = await auth.supabase.from("products").update({ price: update.price }).eq("id", update.id);
    if (error) return { status: "error", message: "Fiyatlar kaydedilemedi." };
  }
  for (const update of options) {
    const { error } = await auth.supabase.from("product_options").update({ price_delta: update.price }).eq("id", update.id);
    if (error) return { status: "error", message: "Ek ücretler kaydedilemedi." };
  }

  revalidateMenu();
  redirect("/admin/prices?saved=1");
}
