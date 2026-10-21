export type PriceChange = {
  kind: "percent" | "fixed";
  direction: "up" | "down";
  value: number;
};

function roundHalfUp(numerator: number, denominator: number): number {
  if (numerator < 0) return -roundHalfUp(-numerator, denominator);
  return Math.floor((numerator + denominator / 2) / denominator);
}

export function roundLira(value: number) {
  return roundHalfUp(Math.round(value * 100), 100);
}

export function nextPrice(current: number, change: PriceChange) {
  const kurus = Math.round(current * 100);
  const signed = change.direction === "up" ? 1 : -1;
  const nextKurus =
    change.kind === "percent"
      ? roundHalfUp(kurus * (10000 + signed * Math.round(change.value * 100)), 10000)
      : kurus + signed * Math.round(change.value * 100);
  const price = roundHalfUp(nextKurus, 100);
  if (price < 0) return { ok: false as const, price };
  return { ok: true as const, price };
}

export function parseLira(value: string) {
  const raw = value.trim().replace(/\s/g, "").replace(",", ".");
  if (!raw) return null;
  const price = Number(raw);
  if (!Number.isFinite(price)) return null;
  return roundLira(price);
}
