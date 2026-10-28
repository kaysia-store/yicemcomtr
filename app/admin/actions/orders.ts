"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import {
  cartTotal,
  customerFullName,
  isMealCardBrandId,
  isValidPhone,
  normalizePhone,
  type CartLine,
  type MealCardBrandId,
  type PaymentMethod,
} from "@/lib/cart";
import { linesToOrderItems, mapOrderSettings, type OrderStatus } from "@/lib/orders";
import { revalidateMenu } from "@/lib/revalidate";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export type PlaceOrderState = { ok: true; id: string } | { ok: false; message: string };

export async function placeOrder(input: {
  firstName: string;
  lastName: string;
  phone: string;
  paymentMethod: PaymentMethod;
  mealCardBrand?: string;
  address: string;
  note: string;
  locale: string;
  lines: CartLine[];
}): Promise<PlaceOrderState> {
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const phone = normalizePhone(input.phone);
  const address = input.address.trim();
  const note = input.note.trim();
  const mealCardBrand: MealCardBrandId | "" =
    input.paymentMethod === "meal_card" && isMealCardBrandId(input.mealCardBrand) ? input.mealCardBrand : "";

  if (!firstName || firstName.length > 40) return { ok: false, message: "Ad gerekli." };
  if (!lastName || lastName.length > 40) return { ok: false, message: "Soyad gerekli." };
  if (!isValidPhone(phone)) return { ok: false, message: "Geçerli bir telefon girin." };
  if (!["cash", "card", "meal_card"].includes(input.paymentMethod)) {
    return { ok: false, message: "Ödeme şekli geçersiz." };
  }
  if (input.paymentMethod === "meal_card" && !mealCardBrand) {
    return { ok: false, message: "Yemek kartı markası seçin." };
  }
  if (address.length < 5 || address.length > 240) return { ok: false, message: "Açık adres gerekli." };
  if (note.length > 400) return { ok: false, message: "Not çok uzun." };
  if (!input.lines.length) return { ok: false, message: "Sepet boş." };

  const supabase = createPublicClient();
  if (!supabase) return { ok: false, message: "Supabase bağlantısı yok." };

  const { data: settingsRow, error: settingsError } = await supabase
    .from("order_settings")
    .select("menu_order_enabled")
    .eq("id", 1)
    .maybeSingle();
  if (!settingsError && settingsRow && mapOrderSettings(settingsRow as Record<string, unknown>).menuOrderEnabled !== true) {
    return { ok: false, message: "Online sipariş kapalı. Admin → Ayarlar’dan açın." };
  }

  const fullName = customerFullName({ firstName, lastName });
  const items = linesToOrderItems(input.lines);
  const total = cartTotal({
    lines: input.lines,
    firstName,
    lastName,
    phone,
    paymentMethod: input.paymentMethod,
    mealCardBrand,
    address,
    note,
  });

  // id'yi istemci üretiriz: insert sonrası .select() anon SELECT politikası ister
  // ve tüm siparişleri herkese açmak zorunda kalırız.
  const id = crypto.randomUUID();
  const { error } = await supabase.from("orders").insert({
    id,
    customer_name: fullName,
    customer_first_name: firstName,
    customer_last_name: lastName,
    phone,
    payment_method: input.paymentMethod,
    meal_card_brand: mealCardBrand,
    address,
    note,
    items,
    total,
    locale: input.locale || "tr",
    status: "new",
  });

  if (error) {
    if (/row-level security|42501/i.test(error.message)) {
      return {
        ok: false,
        message: "Sipariş yazma izni yok. supabase/migrations/0010_orders_anon_insert_rls.sql dosyasını çalıştırın.",
      };
    }
    if (/orders|schema cache|does not exist|customer_first|phone|meal_card|payment_method/i.test(error.message)) {
      return {
        ok: false,
        message: "Sipariş tablosu eksik veya eski. 0008, 0009 ve 0010 migration dosyalarını çalıştırın.",
      };
    }
    return { ok: false, message: `Sipariş gönderilemedi: ${error.message}` };
  }

  revalidatePath("/admin/orders");
  return { ok: true, id };
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

export async function deleteOrder(id: string) {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false as const, message: admin.message };

  const { error } = await admin.supabase.from("orders").delete().eq("id", id);
  if (error) return { ok: false as const, message: "Sipariş silinemedi." };
  revalidatePath("/admin/orders");
  return { ok: true as const };
}
