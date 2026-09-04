/**
 * Turning raw JSON into something worth editing.
 *
 * There is no hand-written schema per file. The editor reads the shape of the
 * data and picks a control for each value, with a small set of overrides for
 * the fields where the plain guess would be wrong or unsafe.
 */

/** Fields that set a web address or must match code elsewhere. */
const READ_ONLY = new Set(["id", "value", "tag"]);

/** Fields that are long-form prose and deserve a box, whatever their length. */
const ALWAYS_LONG = new Set([
  "description",
  "blurb",
  "summary",
  "body",
  "lede",
  "intro",
  "focus",
  "a",
  "tagline",
  "paragraphs",
  "story",
]);

/** Keys that carry a note in the editor, because getting them wrong shows. */
export const FIELD_NOTES: Record<string, string> = {
  slug: "Sets the web address and the name of this item's image files. Changing it breaks existing links.",
  imageCount: "How many photographs to look for. Missing files are skipped automatically.",
  priceNGN: "In naira, digits only, no symbol or commas.",
  phoneNumber: "Local format starting 0. The tel: link is built from this.",
  phoneNumbers: "Local format starting 0. The tel: links are built from these.",
  whatsappNumber: "International format with no plus and no spaces, for example 2348062891562.",
  mapsQuery: "The address the Google Maps link searches for.",
  countTo: "Leave empty for a word. Set a number and the figure counts up.",
  signature: "Featured on the home page strip. Keep three or four.",
  status: "available or coming-soon.",
  icon: "Must be one of the icon names the site knows.",
};

export type Control = "text" | "textarea" | "number" | "boolean" | "null";

export function controlFor(key: string, value: unknown): Control {
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (value === null) return "null";
  if (typeof value === "string") {
    if (ALWAYS_LONG.has(key)) return "textarea";
    return value.length > 90 || value.includes("\n") ? "textarea" : "text";
  }
  return "text";
}

export function isReadOnly(key: string): boolean {
  return READ_ONLY.has(key);
}

/** "whatWeDo" -> "What we do", "priceNGN" -> "Price NGN". */
export function humanise(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * A blank item shaped like the ones already in a list, so "add" produces
 * something the site can render rather than an empty object.
 */
export function blankLike(template: unknown): unknown {
  if (Array.isArray(template)) return [];
  if (template === null) return null;
  if (typeof template === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(template as Record<string, unknown>)) {
      out[key] = blankLike(value);
    }
    return out;
  }
  if (typeof template === "number") return 0;
  if (typeof template === "boolean") return false;
  return "";
}

/** A short, readable name for one item in a list. */
export function itemTitle(item: unknown, index: number): string {
  if (item && typeof item === "object" && !Array.isArray(item)) {
    const record = item as Record<string, unknown>;
    for (const key of ["name", "title", "label", "role", "phase", "q", "days", "id", "slug"]) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value;
    }
  }
  if (typeof item === "string" && item.trim()) {
    return item.length > 60 ? `${item.slice(0, 60)}...` : item;
  }
  return `Item ${index + 1}`;
}
