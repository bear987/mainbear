import { contrast, grade, over, parseColor, type Grade } from "./color";

/**
 * The combinations that actually appear on these sites. Checked so that a
 * colour change cannot quietly make text unreadable.
 *
 * These are warnings, never corrections. GG Autos deliberately remaps
 * action-200 and 300 to dark reds because the ghost button uses them as text
 * on concrete, and that is exactly the kind of decision an automatic fix
 * would undo.
 */

export type Pair = {
  label: string;
  /**
   * The shades to consider. Where more than one is listed, the most readable
   * is the one reported, because each site uses whichever of the accent
   * shades works on its own background: the dark sites put a light accent on
   * near-black, GG Autos puts a dark one on concrete. Checking a fixed shade
   * would warn about a combination that never appears.
   */
  foreground: string[];
  background: string;
  /** Body text needs 4.5:1. Something only used large can pass at 3:1. */
  large?: boolean;
  note?: string;
};

const PAIRS: Pair[] = [
  { label: "Headings on the page", foreground: ["--color-heading"], background: "--color-paper" },
  { label: "Body text on the page", foreground: ["--color-fg"], background: "--color-paper" },
  { label: "Quieter text on the page", foreground: ["--color-muted"], background: "--color-paper" },
  { label: "Headings on a card", foreground: ["--color-heading"], background: "--color-surface" },
  { label: "Body text on a card", foreground: ["--color-fg"], background: "--color-surface" },
  {
    label: "Accent text on the page",
    foreground: ["--color-action-200", "--color-action-300", "--color-action-600"],
    background: "--color-paper",
    note: "The most readable accent shade, which is the one each site uses for links and ghost buttons.",
  },
  {
    label: "Button text on the accent",
    /* White only. The filled buttons hardcode white text in both themes, so
       reporting a more flattering shade the site never uses would be a lie. */
    foreground: ["--color-white"],
    background: "--color-action-500",
    note: "The filled buttons use white text in both themes.",
  },
  {
    label: "Large headline on the page",
    foreground: ["--color-heading"],
    background: "--color-paper",
    large: true,
  },
];

export type ContrastResult = {
  label: string;
  /** The shade actually reported, which for a multi-shade pair is the best. */
  foreground: string;
  background: string;
  ratio: number;
  grade: Grade;
  /** True when the pair only needs to clear the large-text threshold. */
  large: boolean;
  note?: string;
};

/**
 * `values` is the resolved token map for one theme. A translucent surface is
 * composited over the page colour first, because that is what a visitor sees.
 */
export function checkContrast(values: Record<string, string>): ContrastResult[] {
  const paper = parseColor(values["--color-paper"] ?? "");
  const results: ContrastResult[] = [];

  for (const pair of PAIRS) {
    const rawBg = values[pair.background];
    if (!rawBg) continue;
    let bg = parseColor(rawBg);
    if (!bg) continue;
    if (bg.a < 1 && paper) bg = over(bg, paper);

    // Plain white is not a token on these sites, but it is what sits on the
    // filled buttons, so it is offered as a candidate by name.
    let best: { name: string; ratio: number } | null = null;
    for (const name of pair.foreground) {
      const raw = name === "--color-white" ? "#ffffff" : values[name];
      if (!raw) continue;
      const fg = parseColor(raw);
      if (!fg) continue;
      const ratio = contrast(fg, bg);
      if (!best || ratio > best.ratio) best = { name, ratio };
    }
    if (!best) continue;

    const threshold = pair.large ? 3 : 4.5;

    results.push({
      label: pair.label,
      foreground: best.name === "--color-white" ? "white" : best.name,
      background: pair.background,
      ratio: Math.round(best.ratio * 100) / 100,
      grade: pair.large ? (best.ratio >= threshold ? "pass" : "fail") : grade(best.ratio),
      large: Boolean(pair.large),
      note: pair.note,
    });
  }

  return results;
}
