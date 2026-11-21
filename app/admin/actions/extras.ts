"use server";

import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDefaultLocale, nextSortOrder } from "@/lib/admin-data";
import { readExtraOptionDraft, type ExtraChoiceDraft } from "@/lib/extras";
import { revalidateMenu } from "@/lib/revalidate";
import type { ActionState } from "@/lib/types";
import { readText, uuidPattern } from "@/lib/validators";
import { getSupabaseEnv } from "@/lib/supabase/env";
import type { SupabaseClient } from "@supabase/supabase-js";

function schemaHint(message: string) {
  if (/extra_option|category_extra/i.test(message)) {
    return "Ek seçenek tabloları eksik. supabase/migrations/0014_extra_options.sql dosyasını çalıştırın.";
  }
  return null;
}

export async function saveExtraOption(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return { status: "error", message: "İnceleme modunda ek seçenek kaydı yok." };
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };

  const parsed = readExtraOptionDraft(formData);
  if (!parsed.ok) return { status: "error", message: parsed.message };
  const { draft } = parsed;
  const locale = await getDefaultLocale(auth.supabase);

  let optionId = draft.id;
  if (!optionId) {
    optionId = randomUUID();
    const sortOrder = await nextExtraSortOrder(auth.supabase);
    const { error } = await auth.supabase.from("extra_options").insert({
      id: optionId,
      kind: draft.kind,
      selection: draft.selection,
      is_required: draft.required,
      price: draft.price,
      menu_category_id: draft.menuCategoryId,
      sort_order: sortOrder,
    });
    if (error) return { status: "error", message: schemaHint(error.message) ?? "Ek seçenek eklenemedi." };
  } else {
    const { error } = await auth.supabase
      .from("extra_options")
      .update({
        kind: draft.kind,
        selection: draft.selection,
        is_required: draft.required,
        price: draft.price,
        menu_category_id: draft.menuCategoryId,
      })
      .eq("id", optionId);
    if (error) return { status: "error", message: schemaHint(error.message) ?? "Ek seçenek güncellenemedi." };
  }

  const { error: nameError } = await auth.supabase.from("extra_option_translations").upsert({
    extra_option_id: optionId,
    locale,
    name: draft.name,
  });
  if (nameError) return { status: "error", message: "Ad kaydedilemedi." };

  const choiceError = await syncChoices(auth.supabase, optionId, locale, draft.kind === "list" ? draft.choices : []);
  if (choiceError) return { status: "error", message: choiceError };

  revalidateMenu();
  redirect("/admin/extras");
}

async function nextExtraSortOrder(supabase: SupabaseClient) {
  const { data } = await supabase.from("extra_options").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const top = (data?.[0] as { sort_order: number } | undefined)?.sort_order;
  return typeof top === "number" ? top + 1 : 0;
}

async function syncChoices(
  supabase: SupabaseClient,
  extraOptionId: string,
  locale: string,
  drafts: ExtraChoiceDraft[],
) {
  const { data, error } = await supabase.from("extra_option_choices").select("id").eq("extra_option_id", extraOptionId);
  if (error) return schemaHint(error.message) ?? "Seçenekler yüklenemedi.";
  const existing = new Set(((data ?? []) as { id: string }[]).map((row) => row.id));
  const kept = new Set<string>();

  for (let index = 0; index < drafts.length; index += 1) {
    const draft = drafts[index];
    const choiceId = draft.id && existing.has(draft.id) ? draft.id : randomUUID();
    kept.add(choiceId);
    const { error: upsertError } = await supabase.from("extra_option_choices").upsert({
      id: choiceId,
      extra_option_id: extraOptionId,
      price_delta: draft.priceDelta,
      is_default: draft.isDefault,
      sort_order: index,
    });
    if (upsertError) return "Seçenek kaydedilemedi.";
    const { error: textError } = await supabase.from("extra_option_choice_translations").upsert({
      choice_id: choiceId,
      locale,
      name: draft.name,
    });
    if (textError) return "Seçenek adı kaydedilemedi.";
  }

  const removed = [...existing].filter((id) => !kept.has(id));
  if (removed.length > 0) {
    const { error: deleteError } = await supabase.from("extra_option_choices").delete().in("id", removed);
    if (deleteError) return "Seçenek silinemedi.";
  }
  return null;
}

export async function deleteExtraOption(id: string, _prev: ActionState, _formData: FormData): Promise<ActionState> {
  if (!getSupabaseEnv()) return { status: "error", message: "İnceleme modunda silinemez." };
  const auth = await requireAdmin();
  if (!auth.ok) return { status: "error", message: auth.message };
  if (!uuidPattern.test(id)) return { status: "error", message: "Ek seçenek bulunamadı." };
  const { error } = await auth.supabase.from("extra_options").delete().eq("id", id);
  if (error) return { status: "error", message: schemaHint(error.message) ?? "Ek seçenek silinemedi." };
  revalidateMenu();
  redirect("/admin/extras");
}

export async function moveExtraOption(formData: FormData) {
  if (!getSupabaseEnv()) return;
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");

  const id = readText(formData, "id");
  if (!uuidPattern.test(id)) return;
  const direction = formData.get("direction") === "down" ? "down" : "up";
  const { data, error } = await auth.supabase.from("extra_options").select("id, sort_order").order("sort_order");
  if (error || !data) return;

  const rows = data as { id: string; sort_order: number }[];
  const index = rows.findIndex((row) => row.id === id);
  if (index < 0) return;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= rows.length) return;

  const a = rows[index];
  const b = rows[target];
  await Promise.all([
    auth.supabase.from("extra_options").update({ sort_order: b.sort_order }).eq("id", a.id),
    auth.supabase.from("extra_options").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);
  revalidateMenu();
  redirect("/admin/extras");
}
