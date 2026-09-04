import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { REPO_ROOT } from "./repo";
import { SITES, type SiteId } from "./sites";

const run = promisify(execFile);

/**
 * Git, run with argument arrays rather than a shell string, so nothing typed
 * into the admin can be interpreted as a command.
 */
async function git(args: string[]): Promise<string> {
  const { stdout } = await run("git", args, {
    cwd: REPO_ROOT,
    maxBuffer: 20 * 1024 * 1024,
    windowsHide: true,
  });
  return stdout;
}

export type ChangedFile = {
  path: string;
  site: SiteId | null;
  /** Human name of what changed, e.g. "GG FOODS, the menu". */
  label: string;
  added: number;
  removed: number;
};

function describe(filePath: string): { site: SiteId | null; label: string } {
  const match = /^apps\/(company-[abc])\/content\/data\/([a-z-]+)\.json$/.exec(filePath);
  if (match) {
    const siteId = match[1] as SiteId;
    const fileId = match[2] as string;
    const site = SITES.find((s) => s.id === siteId);
    const file = site?.files.find((f) => f.id === fileId);
    if (site && file) return { site: siteId, label: `${site.name}, ${file.label.toLowerCase()}` };
  }
  const media = /^apps\/(company-[abc])\/public\/(.+)$/.exec(filePath);
  if (media) {
    const siteId = media[1] as SiteId;
    const site = SITES.find((s) => s.id === siteId);
    if (site) return { site: siteId, label: `${site.name}, the file ${media[2]}` };
  }
  return { site: null, label: filePath };
}

/** Everything currently uncommitted, with a line count and a plain name. */
export async function changedFiles(): Promise<ChangedFile[]> {
  const numstat = await git(["diff", "HEAD", "--numstat"]);
  const untracked = await git(["ls-files", "--others", "--exclude-standard"]);

  const files: ChangedFile[] = [];

  for (const line of numstat.split("\n")) {
    if (!line.trim()) continue;
    const [added, removed, filePath] = line.split("\t");
    if (!filePath) continue;
    files.push({
      path: filePath,
      added: Number(added) || 0,
      removed: Number(removed) || 0,
      ...describe(filePath),
    });
  }

  for (const line of untracked.split("\n")) {
    const filePath = line.trim();
    if (!filePath) continue;
    files.push({ path: filePath, added: 0, removed: 0, ...describe(filePath) });
  }

  return files;
}

/** The unified diff for one file, so a change can be read before it ships. */
export async function fileDiff(filePath: string): Promise<string> {
  try {
    return await git(["diff", "HEAD", "--", filePath]);
  } catch {
    return "";
  }
}

/**
 * Which Netlify sites a push of these files would actually rebuild. This
 * mirrors scripts/netlify-ignore.sh: a site builds when its own app changed,
 * or when anything shared changed.
 */
const SHARED_PREFIXES = [
  "packages/",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
  "package.json",
  "turbo.json",
  ".nvmrc",
  "netlify.toml",
  "scripts/",
];

export function sitesThatWouldRebuild(paths: string[]): SiteId[] {
  const shared = paths.some((p) => SHARED_PREFIXES.some((prefix) => p.startsWith(prefix)));
  if (shared) return SITES.map((s) => s.id);
  return SITES.filter((s) => paths.some((p) => p.startsWith(`apps/${s.id}/`))).map((s) => s.id);
}

export async function currentBranch(): Promise<string> {
  return (await git(["rev-parse", "--abbrev-ref", "HEAD"])).trim();
}

export async function aheadOfRemote(): Promise<number> {
  try {
    const out = await git(["rev-list", "--count", "@{upstream}..HEAD"]);
    return Number(out.trim()) || 0;
  } catch {
    return 0;
  }
}

/** Stage the given paths, commit with the given message, and push. */
export async function commitAndPush(
  paths: string[],
  message: string,
): Promise<{ commit: string; pushed: string }> {
  if (paths.length === 0) throw new Error("Nothing to publish.");

  await git(["add", "--", ...paths]);
  await git(["commit", "-m", message]);
  const commit = (await git(["rev-parse", "--short", "HEAD"])).trim();
  const branch = await currentBranch();
  const pushed = await git(["push", "origin", branch]);
  return { commit, pushed };
}
