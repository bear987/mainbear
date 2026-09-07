import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { REPO_BRANCH, REPO_NAME, REPO_OWNER, isHosted } from "./config";

/**
 * Reading and writing the repository, from either side of the fence.
 *
 * Locally that means the filesystem, and publishing is the separate deliberate
 * step it has always been. Hosted there is no disk, so a save IS a commit: the
 * change goes straight to the branch and the site rebuilds. That is the
 * difference the screens have to explain, and it is why hosted saving says
 * "save and publish" rather than "save".
 */

const REPO_ROOT_LOCAL = path.resolve(process.cwd(), "..", "..");

export type WriteResult = { commit?: string };

function api(pathname: string): string {
  return `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}${pathname}`;
}

async function github(
  token: string,
  pathname: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(api(pathname), {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });
}

/** The file's current contents and the sha a write has to be based on. */
async function currentFile(
  token: string,
  repoPath: string,
): Promise<{ text: string; sha: string } | null> {
  const res = await github(
    token,
    `/contents/${encodeURI(repoPath)}?ref=${encodeURIComponent(REPO_BRANCH)}`,
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub would not read ${repoPath} (${res.status}).`);

  const body = (await res.json()) as { content?: string; sha: string; encoding?: string };
  const text = body.content
    ? Buffer.from(body.content, "base64").toString("utf8")
    : "";
  return { text, sha: body.sha };
}

export async function readText(repoPath: string, token?: string): Promise<string> {
  if (!isHosted) {
    return readFile(path.join(REPO_ROOT_LOCAL, repoPath), "utf8");
  }
  if (!token) throw new Error("Not signed in.");
  const file = await currentFile(token, repoPath);
  if (!file) throw new Error(`${repoPath} is not in the repository.`);
  return file.text;
}

export async function exists(repoPath: string, token?: string): Promise<boolean> {
  if (!isHosted) {
    try {
      await readFile(path.join(REPO_ROOT_LOCAL, repoPath));
      return true;
    } catch {
      return false;
    }
  }
  if (!token) return false;
  return (await currentFile(token, repoPath)) !== null;
}

/**
 * Write one file. Hosted, this commits it, which is what makes it live.
 *
 * The write is based on the sha the file has right now, so if the owner has
 * changed the same file from another device since this page was loaded,
 * GitHub refuses rather than quietly overwriting their edit.
 */
export async function writeBytes(
  repoPath: string,
  data: Buffer,
  message: string,
  token?: string,
): Promise<WriteResult> {
  if (!isHosted) {
    await writeFile(path.join(REPO_ROOT_LOCAL, repoPath), new Uint8Array(data));
    return {};
  }
  if (!token) throw new Error("Not signed in.");

  const existing = await currentFile(token, repoPath);

  const res = await github(token, `/contents/${encodeURI(repoPath)}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: data.toString("base64"),
      branch: REPO_BRANCH,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  if (res.status === 409 || res.status === 422) {
    throw new Error(
      "Someone changed this since you opened it. Reload the page and make the change again, so you do not overwrite it.",
    );
  }
  if (!res.ok) {
    const detail = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(detail.message ?? `GitHub refused the change (${res.status}).`);
  }

  const body = (await res.json()) as { commit?: { sha?: string } };
  return { commit: body.commit?.sha?.slice(0, 7) };
}

export async function writeText(
  repoPath: string,
  text: string,
  message: string,
  token?: string,
): Promise<WriteResult> {
  return writeBytes(repoPath, Buffer.from(text, "utf8"), message, token);
}
