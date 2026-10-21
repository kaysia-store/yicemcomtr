"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { revalidateMenu } from "@/lib/revalidate";
import { isSchemaError } from "@/lib/schema-error";
import type { ActionState } from "@/lib/types";
import { readText } from "@/lib/validators";
import { previewSaveRestaurantName } from "@/lib/preview";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = readText(formData, "email");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { status: "error", message: "E-posta ve şifre gerekli." };
  if (!getSupabaseEnv()) {
    return { status: "error", message: "Supabase ayarları eksik. .env.local dosyasını doldurun." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { status: "error", message: "E-posta veya şifre hatalı." };
  redirect("/admin");
}

export async function logout() {
  if (getSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

export async function saveRestaurantName(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return previewSaveRestaurantName(formData);
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const name = readText(formData, "name");
  if (name.length < 2 || name.length > 80) {
    return { status: "error", message: "Restoran adı 2 ile 80 karakter arasında olmalı." };
  }

  const showTitle = formData.get("showTitle") === "true";
  const { error } = await auth.supabase.from("restaurant_settings").update({ name, show_title: showTitle }).eq("id", 1);
  if (error) {
    if (isSchemaError(error)) {
      return {
        status: "error",
        message: "Başlık ayarı kaydedilemedi. supabase/migrations/0004_show_title.sql dosyasını SQL Editor'da çalıştırın.",
      };
    }
    return { status: "error", message: "Ayarlar kaydedilemedi." };
  }

  revalidateMenu();
  redirect("/admin?saved=1");
}
