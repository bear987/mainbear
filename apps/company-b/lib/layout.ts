import layout from "@/content/data/layout.json";

/**
 * Which sections a page shows, and in what order.
 *
 * The page holds the sections themselves; this file only says which of them
 * appear and in which order, so the owner can turn one off or move it in the
 * admin without touching code.
 */

export type SectionEntry = {
  id: string;
  label: string;
  note?: string;
  enabled: boolean;
  /** Cannot be turned off, because the page would lose its heading. */
  required?: boolean;
};

type Layout = Record<string, { label: string; sections: SectionEntry[] }>;

export function sectionsFor(page: string): string[] {
  const entry = (layout as Layout)[page];
  if (!entry) return [];
  return entry.sections.filter((s) => s.enabled).map((s) => s.id);
}
