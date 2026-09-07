/**
 * Where the admin is running, and whether it is allowed to run at all.
 *
 * The admin writes content for three live businesses. Hosted, the only thing
 * between the internet and that is the sign-in, so this module FAILS CLOSED:
 * if the hosted mode is missing anything it needs, the app refuses to serve
 * rather than falling open and letting a stranger edit the sites.
 */

export type Mode = "local" | "hosted";

/**
 * Local is the default. Hosted is switched on deliberately by setting
 * ADMIN_MODE=hosted in the environment, which only the deployed site does.
 */
export const MODE: Mode = process.env.ADMIN_MODE === "hosted" ? "hosted" : "local";

export const isHosted = MODE === "hosted";

/** The repository the hosted admin commits to. */
export const REPO_OWNER = process.env.GITHUB_REPO_OWNER ?? "bear987";
export const REPO_NAME = process.env.GITHUB_REPO_NAME ?? "mainbear";
export const REPO_BRANCH = process.env.GITHUB_REPO_BRANCH ?? "main";

export type ConfigProblem = { key: string; why: string };

/**
 * Everything hosted mode needs. Missing any of it is a configuration mistake,
 * and the honest response is to stop, not to guess.
 */
export function hostedProblems(): ConfigProblem[] {
  if (!isHosted) return [];
  const problems: ConfigProblem[] = [];

  const required: [string, string | undefined, string][] = [
    ["GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID, "the GitHub sign-in would not start"],
    ["GITHUB_CLIENT_SECRET", process.env.GITHUB_CLIENT_SECRET, "the sign-in could not be completed"],
    ["SESSION_SECRET", process.env.SESSION_SECRET, "sessions could not be signed, so anyone could forge one"],
    ["ALLOWED_GITHUB_USERS", process.env.ALLOWED_GITHUB_USERS, "any GitHub account on earth could sign in"],
  ];

  for (const [key, value, why] of required) {
    if (!value || !value.trim()) problems.push({ key, why });
  }

  const secret = process.env.SESSION_SECRET ?? "";
  if (secret && secret.length < 32) {
    problems.push({
      key: "SESSION_SECRET",
      why: "it is shorter than 32 characters, which is too short to be safe",
    });
  }

  return problems;
}

/** The GitHub usernames allowed in. Everyone else is refused by name. */
export function allowedUsers(): string[] {
  return (process.env.ALLOWED_GITHUB_USERS ?? "")
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedUser(login: string): boolean {
  return allowedUsers().includes(login.trim().toLowerCase());
}

/**
 * The site's own address, used to build the OAuth callback. Netlify sets URL
 * on the deployed site; locally there is nothing to build.
 */
export function siteUrl(): string {
  return (process.env.ADMIN_URL ?? process.env.URL ?? "").replace(/\/$/, "");
}
