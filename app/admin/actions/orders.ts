"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { cartTotal, type CartLine, type PaymentMethod } from "@/lib/cart";
import { linesToOrderItems, mapOrderSettings, type OrderStatus } from "@/lib/orders";
import { revalidateMenu } from "@/lib/revalidate";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type PlaceOrderState = { ok: true; id: string } | { ok: false; message: string };

export async function placeOrder(input: {
  customerName: string;
  paymentMethod: PaymentMethod;
  address: string;
  note: string;
  locale: string;
  lines: CartLine[];
}): Promise<PlaceOrderState> {
  const name = input.customerName.trim();
  if (!name || name.length > 80) return { ok: false, message: "İsim gerekli." };
  if (!["cash", "card", "online"].includes(input.paymentMethod)) {
    return { ok: false, message: "Ödeme şekli geçersiz." };
  }
  if (input.address.length > 240) return { ok: false, message: "Adres çok uzun." };
  if (input.note.length > 400) return { ok: false, message: "Not çok uzun." };
  if (!input.lines.length) return { ok: false, message: "Sepet boş." };

  const supabase = createPublicClient();
  if (!supabase) return { ok: false, message: "Supabase bağlantısı yok." };

  const { data: settingsRow } = await supabase.from("order_settings").select("menu_order_enabled").eq("id", 1).maybeSingle();
  if (mapOrderSettings(settingsRow as Record<string, unknown> | null).menuOrderEnabled !== true) {
    return { ok: false, message: "Online sipariş kapalı." };
  }

  const items = linesToOrderItems(input.lines);
  const total = cartTotal({
    lines: input.lines,
    customerName: name,
    paymentMethod: input.paymentMethod,
    address: input.address,
    note: input.note,
  });

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      payment_method: input.paymentMethod,
      address: input.address.trim(),
      note: input.note.trim(),
      items,
      total,
      locale: input.locale || "tr",
      status: "new",
    })
    .select("id")
    .single();

  if (error) {
    if (/orders|schema cache|does not exist/i.test(error.message)) {
      return {
        ok: false,
        message: "Sipariş tablosu yok. supabase/migrations/0005_orders.sql dosyasını çalıştırın.",
      };
    }
    return { ok: false, message: "Sipariş gönderilemedi." };
  }

  return { ok: true, id: String(data.id) };
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false as const, message: admin.message };

  const patch: Record<string, unknown> = { status };
  if (status === "accepted") patch.accepted_at = new Date().toISOString();
  if (status === "printed") patch.printed_at = new Date().toISOString();

  const { error } = await admin.supabase.from("orders").update(patch).eq("id", id);
  if (error) return { ok: false as const, message: "Durum güncellenemedi." };
  revalidatePath("/admin/orders");
  return { ok: true as const };
}

export async function saveOrderSettings(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false as const, message: admin.message };

  const payload = {
    sound_enabled: formData.get("soundEnabled") === "on",
    auto_print_on_accept: formData.get("autoPrintOnAccept") === "on",
    printer_name: String(formData.get("printerName") ?? "POS-80C").trim() || "POS-80C",
    paper_width_mm: Number(formData.get("paperWidthMm") ?? 72) || 72,
    paper_height_mm: Number(formData.get("paperHeightMm") ?? 297) || 297,
    open_cash_drawer: formData.get("openCashDrawer") === "on",
    cut_paper: formData.get("cutPaper") === "on",
    menu_order_enabled: formData.get("menuOrderEnabled") === "on",
    menu_whatsapp_enabled: formData.get("menuWhatsappEnabled") === "on",
  };

  const { error } = await admin.supabase.from("order_settings").upsert({ id: 1, ...payload });
  if (error) {
    if (/order_settings|schema cache|does not exist|menu_order|menu_whatsapp/i.test(error.message)) {
      return {
        ok: false as const,
        message: "Ayar tablosu eksik veya eski. supabase/migrations/0007_repair_orders.sql dosyasını çalıştırın.",
      };
    }
    return { ok: false as const, message: `Ayarlar kaydedilemedi: ${error.message}` };
  }
  revalidatePath("/admin/settings");
  revalidateMenu();
  return { ok: true as const };
}

export async function countNewOrders() {
  const supabase = await createClient();
  const { count } = await supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "new");
  return count ?? 0;
}
