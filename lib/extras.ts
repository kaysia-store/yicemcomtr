import { readPrice, uuidPattern } from "@/lib/validators";
import type { ExtraOptionKind } from "@/lib/types";

export type ExtraChoiceDraft = {
  id: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export type ExtraOptionDraft = {
  id: string;
  name: string;
  kind: ExtraOptionKind;
  selection: "single" | "multiple";
  required: boolean;
  price: number;
  menuCategoryId: string | null;
  choices: ExtraChoiceDraft[];
};

export function readExtraOptionDraft(formData: FormData): { ok: true; draft: ExtraOptionDraft } | { ok: false; message: string } {
  const id = typeof formData.get("id") === "string" ? String(formData.get("id")).trim() : "";
  if (id && !uuidPattern.test(id)) return { ok: false, message: "Ek seçenek bulunamadı." };

  const name = typeof formData.get("name") === "string" ? String(formData.get("name")).trim() : "";
  if (!name || name.length > 80) return { ok: false, message: "Ad 1 ile 80 karakter arasında olmalı." };

  const kindRaw = typeof formData.get("kind") === "string" ? String(formData.get("kind")) : "";
  if (kindRaw !== "fixed" && kindRaw !== "menu" && kindRaw !== "list") {
    return { ok: false, message: "Tür geçersiz." };
  }
  const kind = kindRaw as ExtraOptionKind;

  const selection = formData.get("selection") === "multiple" ? "multiple" : "single";
  const required = formData.get("isRequired") === "true";

  const priceResult = readPrice(typeof formData.get("price") === "string" ? String(formData.get("price")) : "0");
  if (!priceResult.ok) return { ok: false, message: "Fiyat 0 veya daha büyük olmalı." };

  let menuCategoryId: string | null = null;
  if (kind === "menu") {
    const raw = typeof formData.get("menuCategoryId") === "string" ? String(formData.get("menuCategoryId")).trim() : "";
    if (!uuidPattern.test(raw)) return { ok: false, message: "Menü kategorisi seçin." };
    menuCategoryId = raw;
  }

  let choices: ExtraChoiceDraft[] = [];
  if (kind === "list") {
    const raw = typeof formData.get("choicesJson") === "string" ? String(formData.get("choicesJson")) : "[]";
    const parsed = readChoiceDrafts(raw, selection);
    if (!parsed.ok) return parsed;
    if (parsed.choices.length === 0) return { ok: false, message: "Liste tipinde en az bir seçenek olmalı." };
    choices = parsed.choices;
  }

  return {
    ok: true,
    draft: {
      id,
      name,
      kind,
      selection,
      required,
      price: kind === "list" ? 0 : priceResult.price,
      menuCategoryId,
      choices,
    },
  };
}

export function readChoiceDrafts(
  raw: string,
  selection: "single" | "multiple",
): { ok: true; choices: ExtraChoiceDraft[] } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, message: "Seçenek listesi okunamadı." };
  }
  if (!Array.isArray(parsed)) return { ok: false, message: "Seçenek listesi okunamadı." };
  if (parsed.length > 40) return { ok: false, message: "En fazla 40 seçenek olabilir." };

  const choices: ExtraChoiceDraft[] = [];
  let seenDefault = false;
  for (const item of parsed) {
    if (!item || typeof item !== "object") return { ok: false, message: "Seçenek listesi okunamadı." };
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : "";
    if (id && !uuidPattern.test(id)) return { ok: false, message: "Seçenek kaydı geçersiz." };
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const priceText =
      typeof row.priceDelta === "number" ? String(row.priceDelta) : typeof row.priceDelta === "string" ? row.priceDelta : "";
    if (!name && !priceText.trim()) continue;
    if (!name || name.length > 80) return { ok: false, message: "Seçenek adı 1 ile 80 karakter arasında olmalı." };
    const price = readPrice(priceText || "0");
    if (!price.ok) return { ok: false, message: "Ek ücret 0 veya daha büyük olmalı." };
    let isDefault = row.isDefault === true;
    if (isDefault && selection === "single" && seenDefault) isDefault = false;
    if (isDefault) seenDefault = true;
    choices.push({ id, name, priceDelta: price.price, isDefault });
  }
  return { ok: true, choices };
}

export function readBoundExtraIds(raw: string): { ok: true; ids: string[] } | { ok: false; message: string } {
  return readUuidList(raw, "Ek seçenek bağları okunamadı.", "Ek seçenek bağı geçersiz.");
}

export function readBoundProductIds(raw: string): { ok: true; ids: string[] } | { ok: false; message: string } {
  return readUuidList(raw, "Ürün bağları okunamadı.", "Ürün bağı geçersiz.");
}

function readUuidList(
  raw: string,
  parseMessage: string,
  invalidMessage: string,
): { ok: true; ids: string[] } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, message: parseMessage };
  }
  if (!Array.isArray(parsed)) return { ok: false, message: parseMessage };
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const item of parsed) {
    if (typeof item !== "string" || !uuidPattern.test(item)) {
      return { ok: false, message: invalidMessage };
    }
    if (seen.has(item)) continue;
    seen.add(item);
    ids.push(item);
  }
  return { ok: true, ids };
}
