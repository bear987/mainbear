import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./repo";
import { getSite } from "./sites";

/**
 * Reading and rewriting the design tokens in each site's globals.css.
 *
 * The file is never regenerated. Only the value of a declaration the admin
 * recognises is replaced, in place, so comments, ordering and everything the
 * admin does not understand survive untouched.
 */

export type TokenKind = "color" | "length" | "font" | "shadow" | "other";

export type Token = {
  name: string;
  value: string;
  kind: TokenKind;
  /** Where the value sits in the file, so it can be replaced exactly. */
  start: number;
  end: number;
  /** The trailing comment on the same line, which usually says what it is for. */
  note?: string;
  /** Fonts are loaded in code, so their stacks are shown but not editable. */
  readOnly?: boolean;
};

export type TokenBlock = {
  /** The CSS selector, e.g. "@theme". */
  selector: string;
  label: string;
  hint: string;
  tokens: Token[];
};

export type ThemeFile = {
  blocks: TokenBlock[];
  /** Blocks that hold a second copy of the dark tokens, kept in step on save. */
  mirrors: string[];
};

function themePath(siteId: string): string {
  if (!getSite(siteId)) throw new Error(`Unknown site: ${siteId}`);
  return path.join(REPO_ROOT, "apps", siteId, "app", "globals.css");
}

/** Find a block by its opening selector and return the span inside the braces. */
function blockRange(css: string, selector: string): { from: number; to: number } | null {
  const at = css.indexOf(selector);
  if (at === -1) return null;
  const open = css.indexOf("{", at + selector.length - 1);
  if (open === -1) return null;

  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return { from: open + 1, to: i };
    }
  }
  return null;
}

function kindOf(name: string, value: string): TokenKind {
  if (name.startsWith("--color-")) return "color";
  if (name.startsWith("--radius-") || /^-?[\d.]+(px|rem|em|%)$/.test(value.trim())) return "length";
  if (name.startsWith("--font-")) return "font";
  if (name.startsWith("--shadow-")) return "shadow";
  return "other";
}

const DECLARATION = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;

function tokensIn(css: string, from: number, to: number): Token[] {
  const text = css.slice(from, to);
  const tokens: Token[] = [];

  for (const match of text.matchAll(DECLARATION)) {
    const [, name, rawValue] = match;
    if (!name || rawValue === undefined || match.index === undefined) continue;

    // Offsets of the value itself, so only the value is ever replaced.
    const valueStart = from + match.index + match[0].indexOf(rawValue);
    const value = rawValue.trim();
    const kind = kindOf(name, value);

    // The comment that follows on the same line, which is documentation the
    // owner should see rather than something to edit.
    const rest = css.slice(valueStart + rawValue.length, valueStart + rawValue.length + 120);
    const comment = /^\s*;?\s*\/\*([^*]*)\*\//.exec(rest);

    tokens.push({
      name,
      value,
      kind,
      start: valueStart,
      end: valueStart + rawValue.length,
      note: comment?.[1]?.trim(),
      readOnly: kind === "font",
    });
  }

  return tokens;
}

/** The blocks worth showing, per site. Others are left entirely alone. */
function blockPlan(siteId: string): { selector: string; label: string; hint: string }[] {
  const plan = [
    {
      selector: "@theme",
      label: "Main palette",
      hint: "The colours, corner radius and shadows the whole site is built from.",
    },
  ];

  if (siteId === "company-a") {
    plan.push({
      selector: ':root[data-theme="light"]',
      label: "Light mode",
      hint: "Only what changes when a visitor switches to the light theme. Anything not listed here is inherited from the main palette.",
    });
  }
  if (siteId === "company-b") {
    plan.push({
      selector: 'html[data-theme="light"]',
      label: "Light mode, the Cream Room",
      hint: "Only what changes in the light theme. Anything not listed here is inherited from the main palette.",
    });
  }

  return plan;
}

/**
 * Blocks that deliberately repeat the dark values so a region stays dark on a
 * light page. They are not edited directly, but a change to the main palette
 * is carried into them, otherwise the hero would keep an old colour.
 */
function mirrorsFor(siteId: string): string[] {
  if (siteId === "company-a") return [".force-dark"];
  if (siteId === "company-c") return [".on-ink"];
  return [];
}

export async function readTheme(siteId: string): Promise<ThemeFile> {
  const css = await readFile(themePath(siteId), "utf8");

  const blocks: TokenBlock[] = [];
  for (const entry of blockPlan(siteId)) {
    const range = blockRange(css, entry.selector);
    if (!range) continue;
    blocks.push({ ...entry, tokens: tokensIn(css, range.from, range.to) });
  }

  return { blocks, mirrors: mirrorsFor(siteId) };
}

export type Edit = { selector: string; name: string; value: string };

/** A value that would break the stylesheet must never reach the file. */
export function validateValue(kind: TokenKind, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "cannot be empty";
  if (/[;{}]/.test(trimmed)) return "cannot contain ; { or }";
  if (trimmed.includes("/*") || trimmed.includes("*/")) return "cannot contain a comment";
  if (kind === "length" && !/^-?[\d.]+(px|rem|em|%|vh|vw)$/.test(trimmed)) {
    return "should be a number with a unit, for example 12px";
  }
  return null;
}

/**
 * Apply edits to the stylesheet. Offsets are recomputed from a fresh read and
 * applied from the end backwards, so earlier replacements cannot shift the
 * position of later ones.
 */
export async function writeTheme(siteId: string, edits: Edit[]): Promise<number> {
  const file = themePath(siteId);
  let css = await readFile(file, "utf8");

  const plan = blockPlan(siteId);
  const mirrors = mirrorsFor(siteId);

  type Replacement = { start: number; end: number; value: string };
  const replacements: Replacement[] = [];

  for (const edit of edits) {
    const entry = plan.find((p) => p.selector === edit.selector);
    if (!entry) throw new Error(`Not an editable section: ${edit.selector}`);

    const range = blockRange(css, edit.selector);
    if (!range) throw new Error(`Could not find ${edit.selector} in the stylesheet.`);

    const token = tokensIn(css, range.from, range.to).find((t) => t.name === edit.name);
    if (!token) throw new Error(`${edit.name} is not in ${edit.selector}.`);
    if (token.readOnly) throw new Error(`${edit.name} cannot be changed here.`);

    const problem = validateValue(token.kind, edit.value);
    if (problem) throw new Error(`${edit.name} ${problem}.`);

    replacements.push({ start: token.start, end: token.end, value: edit.value.trim() });

    // Carry the change into any mirror that still holds the old value. A
    // mirror that has been deliberately set to something else is left alone.
    if (edit.selector === "@theme") {
      for (const mirror of mirrors) {
        const mirrorRange = blockRange(css, mirror);
        if (!mirrorRange) continue;
        const copy = tokensIn(css, mirrorRange.from, mirrorRange.to).find(
          (t) => t.name === edit.name && t.value === token.value,
        );
        if (copy) {
          replacements.push({ start: copy.start, end: copy.end, value: edit.value.trim() });
        }
      }
    }
  }

  replacements.sort((a, b) => b.start - a.start);
  for (const r of replacements) {
    css = css.slice(0, r.start) + r.value + css.slice(r.end);
  }

  await writeFile(file, css, "utf8");
  return replacements.length;
}
