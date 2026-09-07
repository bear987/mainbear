import path from "node:path";
import { isAllowed } from "./sites";
import { readText, writeText } from "./store";

/**
 * The content files, read and written through the storage layer so the same
 * screens work whether the admin is running on the owner's machine or hosted.
 *
 * Everything the admin may touch is enumerated in sites.ts. Nothing else can
 * be addressed, which is what keeps a stray request from reaching the rest of
 * the repository.
 */
export const REPO_ROOT = path.resolve(process.cwd(), "..", "..");

/** Path relative to the repository root, which is what both backends speak. */
export function relativeDataPath(siteId: string, fileId: string): string {
  return `apps/${siteId}/content/data/${fileId}.json`;
}

export function dataPath(siteId: string, fileId: string): string {
  if (!isAllowed(siteId, fileId)) {
    throw new Error(`Not an editable file: ${siteId}/${fileId}`);
  }
  return relativeDataPath(siteId, fileId);
}

export async function readContent(
  siteId: string,
  fileId: string,
  token?: string,
): Promise<unknown> {
  return JSON.parse(await readText(dataPath(siteId, fileId), token));
}

/**
 * Write content back, formatted exactly the way the migration wrote it, so a
 * save with no edits produces no diff at all.
 */
export async function writeContent(
  siteId: string,
  fileId: string,
  value: unknown,
  message: string,
  token?: string,
): Promise<{ commit?: string }> {
  const json = JSON.stringify(value, null, 2) + "\n";
  return writeText(dataPath(siteId, fileId), json, message, token);
}
