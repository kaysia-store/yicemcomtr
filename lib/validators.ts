export const localePattern = /^[a-z]{2}(-[a-z]{2})?$/;
export const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function readPrice(value: string) {
  const raw = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return { ok: false as const, message: "Fiyat gerekli." };
  const price = Number(raw);
  if (!Number.isFinite(price) || price < 0 || price > 99999999) {
    return { ok: false as const, message: "Geçerli bir fiyat girin." };
  }
  return { ok: true as const, price: Math.round(price * 100) / 100 };
}
