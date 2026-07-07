/** Admin kaydı sonrası canlı menü önbelleğini yeniler (client). */
export async function notifyPublicMenuUpdated(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    await fetch("/api/revalidate-menu", { method: "POST", cache: "no-store" });
  } catch {
    // Canlı menü yine de bir sonraki istekte Supabase'den okunur.
  }
}
