import { getSupabaseEnv } from "@/lib/supabase/env";

export function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(value);
}

export const menuLogoPath = "/yicem-logo.png";

export function menuImageUrl(path: string | null) {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("/")) {
    return path
      .split("/")
      .map((part, index) => (index === 0 ? part : encodeURIComponent(part)))
      .join("/");
  }
  const env = getSupabaseEnv();
  if (!env) return null;
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `${env.url}/storage/v1/object/public/menu-images/${encoded}`;
}

export function menuImageFit(url: string | null) {
  return url?.includes("yicem-logo.png") ? "object-contain bg-black p-1.5" : "object-cover";
}

export function asPrice(value: number | string) {
  const price = typeof value === "number" ? value : Number(value);
  return Number.isFinite(price) ? price : 0;
}
