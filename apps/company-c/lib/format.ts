/** Formatting helpers. Every figure on this site is tabular (see .tnum). */

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** ₦46,500,000 — or the fallback when a unit is priced on request. */
export function formatNaira(value: number | null, fallback = "Price on request"): string {
  if (value === null) return fallback;
  return naira.format(value);
}

/** Short form for dense cells: ₦46.5M */
export function formatNairaShort(value: number | null, fallback = "ON REQUEST"): string {
  if (value === null) return fallback;
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const rounded = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `₦${rounded}M`;
  }
  return naira.format(value);
}

export function formatKm(value?: number): string {
  if (value === undefined) return "0 km";
  return `${new Intl.NumberFormat("en-NG").format(value)} km`;
}

/** 2026-07-28 -> 28 JUL 2026, for stamped mono metadata. */
export function formatStampDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
    .toUpperCase();
}

/** 01, 02, 03 — sequence markers. Only used where content is a real sequence. */
export function sequence(index: number): string {
  return String(index + 1).padStart(2, "0");
}
