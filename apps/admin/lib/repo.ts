import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isAllowed } from "./sites";

/**
 * Filesystem access, scoped to the content data of the three sites.
 *
 * The repo root is derived from this app's own location rather than an
 * environment variable, so the admin cannot be pointed somewhere else by
 * accident.
 */
export const REPO_ROOT = path.resolve(process.cwd(), "..", "..");

export function dataPath(siteId: string, fileId: string): string {
  if (!isAllowed(siteId, fileId)) {
    throw new Error(`Not an editable file: ${siteId}/${fileId}`);
  }
  return path.join(REPO_ROOT, "apps", siteId, "content", "data", `${fileId}.json`);
}

/** Path relative to the repo root, for git commands and for display. */
export function relativeDataPath(siteId: string, fileId: string): string {
  return `apps/${siteId}/content/data/${fileId}.json`;
}

export async function readContent(siteId: string, fileId: string): Promise<unknown> {
  const raw = await readFile(dataPath(siteId, fileId), "utf8");
  return JSON.parse(raw);
}

/**
 * Write content back, formatted exactly the way the migration wrote it, so a
 * save with no edits produces no diff at all.
 */
export async function writeContent(
  siteId: string,
  fileId: string,
  value: unknown,
): Promise<void> {
  const json = JSON.stringify(value, null, 2) + "\n";
  await writeFile(dataPath(siteId, fileId), json, "utf8");
}
