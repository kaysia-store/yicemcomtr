/** İstanbul günü (UTC+3) için tarih yardımcıları */

export function todayIstanbul() {
  return formatIstanbulDay(new Date());
}

export function formatIstanbulDay(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function parseDayParam(raw: string | undefined | null) {
  if (raw && /^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return todayIstanbul();
}

export function shiftDay(day: string, delta: number) {
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + delta);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** Gün başı / ertesi gün başı (ISO), İstanbul takvim gününe göre */
export function istanbulDayBounds(day: string) {
  const start = new Date(`${day}T00:00:00+03:00`);
  const end = new Date(start);
  end.setTime(end.getTime() + 24 * 60 * 60 * 1000);
  return { start: start.toISOString(), end: end.toISOString() };
}

export function formatDayLabel(day: string) {
  const today = todayIstanbul();
  if (day === today) return "Bugün";
  if (day === shiftDay(today, -1)) return "Dün";
  if (day === shiftDay(today, 1)) return "Yarın";
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
