import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./repo";
import { getSite } from "./sites";

/**
 * Which sections a page shows, and in what order.
 *
 * The sections themselves live in the page's own code. This file only carries
 * the order and the on/off switch, so moving one is a content change rather
 * than a code change.
 */

export type SectionEntry = {
  id: string;
  label: string;
  note?: string;
  enabled: boolean;
  /** Cannot be turned off: the page would lose its heading. */
  required?: boolean;
};

export type PageLayout = { label: string; sections: SectionEntry[] };
export type LayoutFile = Record<string, PageLayout>;

function layoutPath(siteId: string): string {
  if (!getSite(siteId)) throw new Error(`Unknown site: ${siteId}`);
  return path.join(REPO_ROOT, "apps", siteId, "content", "data", "layout.json");
}

export async function readLayout(siteId: string): Promise<LayoutFile> {
  return JSON.parse(await readFile(layoutPath(siteId), "utf8")) as LayoutFile;
}

/**
 * Save a new order. Only the order and the enabled flags are taken from the
 * request: labels, notes and which sections exist come from the file on disk,
 * so the admin can never invent a section the page cannot render, or drop one
 * it needs.
 */
export async function writeLayout(
  siteId: string,
  page: string,
  order: { id: string; enabled: boolean }[],
): Promise<SectionEntry[]> {
  const layout = await readLayout(siteId);
  const current = layout[page];
  if (!current) throw new Error(`${page} is not a page with an editable layout.`);

  const known = new Map(current.sections.map((s) => [s.id, s]));

  if (order.length !== current.sections.length) {
    throw new Error("Every section has to be listed, even the ones switched off.");
  }

  const next: SectionEntry[] = [];
  for (const item of order) {
    const section = known.get(item.id);
    if (!section) throw new Error(`${item.id} is not a section of this page.`);
    if (next.some((s) => s.id === item.id)) throw new Error(`${item.id} is listed twice.`);
    if (section.required && !item.enabled) {
      throw new Error(`${section.label} cannot be switched off.`);
    }
    next.push({ ...section, enabled: item.enabled });
  }

  layout[page] = { ...current, sections: next };
  await writeFile(layoutPath(siteId), JSON.stringify(layout, null, 2) + "\n", "utf8");
  return next;
}
