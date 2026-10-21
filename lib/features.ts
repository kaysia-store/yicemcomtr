import { readPrice, uuidPattern } from "@/lib/validators";

export type FeatureSelection = "single" | "multiple";

export type FeatureDraft = {
  id: string;
  name: string;
  selection: FeatureSelection;
  required: boolean;
};

export type OptionDraft = {
  id: string;
  featureId: string;
  name: string;
  priceDelta: number;
  isDefault: boolean;
};

export function readFeatureDrafts(raw: string): { ok: true; features: FeatureDraft[] } | { ok: false; message: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, message: "Ürün özellikleri okunamadı." };
  }
  if (!Array.isArray(parsed)) return { ok: false, message: "Ürün özellikleri okunamadı." };
  if (parsed.length > 20) return { ok: false, message: "Bir kategoride en fazla 20 özellik olabilir." };

  const features: FeatureDraft[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") return { ok: false, message: "Ürün özellikleri okunamadı." };
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : "";
    if (id && !uuidPattern.test(id)) return { ok: false, message: "Özellik kaydı geçersiz." };
    const name = typeof row.name === "string" ? row.name.trim() : "";
    if (!name) continue;
    if (name.length > 80) return { ok: false, message: "Özellik adı 80 karakteri aşamaz." };
    if (row.selection !== "single" && row.selection !== "multiple") {
      return { ok: false, message: "Seçim türü geçersiz." };
    }
    features.push({
      id,
      name,
      selection: row.selection,
      required: row.required === true,
    });
  }
  return { ok: true, features };
}

export function readOptionDrafts(
  raw: string,
  features: { id: string; selection: FeatureSelection; required: boolean }[],
): { ok: true; options: OptionDraft[] } | { ok: false; message: string } {
  const allowed = new Map(features.map((feature) => [feature.id, feature]));
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "[]");
  } catch {
    return { ok: false, message: "Ürün seçenekleri okunamadı." };
  }
  if (!Array.isArray(parsed)) return { ok: false, message: "Ürün seçenekleri okunamadı." };
  if (parsed.length > 80) return { ok: false, message: "Bir üründe en fazla 80 seçenek olabilir." };

  const options: OptionDraft[] = [];
  const seenDefault = new Set<string>();
  for (const item of parsed) {
    if (!item || typeof item !== "object") return { ok: false, message: "Ürün seçenekleri okunamadı." };
    const row = item as Record<string, unknown>;
    const id = typeof row.id === "string" ? row.id : "";
    const featureId = typeof row.featureId === "string" ? row.featureId : "";
    if (id && !uuidPattern.test(id)) return { ok: false, message: "Seçenek kaydı geçersiz." };
    if (!uuidPattern.test(featureId) || !allowed.has(featureId)) continue;
    const name = typeof row.name === "string" ? row.name.trim() : "";
    const priceText = typeof row.priceDelta === "number" ? String(row.priceDelta) : typeof row.priceDelta === "string" ? row.priceDelta : "";
    if (!name && !priceText.trim()) continue;
    if (!name || name.length > 80) return { ok: false, message: "Seçenek adı 1 ile 80 karakter arasında olmalı." };
    const price = readPrice(priceText || "0");
    if (!price.ok) return { ok: false, message: "Ek ücret 0 veya daha büyük bir tutar olmalı." };
    const feature = allowed.get(featureId);
    if (!feature) continue;
    let isDefault = row.isDefault === true;
    if (isDefault && feature.selection === "single" && seenDefault.has(featureId)) isDefault = false;
    if (isDefault) seenDefault.add(featureId);
    options.push({ id, featureId, name, priceDelta: price.price, isDefault });
  }

  const byFeature = new Map<string, OptionDraft[]>();
  for (const option of options) {
    const list = byFeature.get(option.featureId) ?? [];
    list.push(option);
    byFeature.set(option.featureId, list);
  }
  for (const [featureId, list] of byFeature) {
    const feature = allowed.get(featureId);
    if (!feature || feature.selection !== "single" || !feature.required) continue;
    if (list.some((option) => option.isDefault)) continue;
    const first = list[0];
    if (first) first.isDefault = true;
  }

  return { ok: true, options };
}
