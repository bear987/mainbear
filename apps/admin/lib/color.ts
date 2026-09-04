/**
 * Just enough colour handling to show a swatch and warn about unreadable
 * combinations. Only the notations these three sites actually use are
 * supported: hex with 3, 6 or 8 digits, and rgb() with or without an alpha.
 */

export type Rgba = { r: number; g: number; b: number; a: number };

export function parseColor(input: string): Rgba | null {
  const value = input.trim();

  const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
  if (hex?.[1]) {
    const digits = hex[1];
    const expand = (s: string) => parseInt(s.length === 1 ? s + s : s, 16);
    if (digits.length === 3 || digits.length === 4) {
      return {
        r: expand(digits[0]!),
        g: expand(digits[1]!),
        b: expand(digits[2]!),
        a: digits.length === 4 ? expand(digits[3]!) / 255 : 1,
      };
    }
    if (digits.length === 6 || digits.length === 8) {
      return {
        r: expand(digits.slice(0, 2)),
        g: expand(digits.slice(2, 4)),
        b: expand(digits.slice(4, 6)),
        a: digits.length === 8 ? expand(digits.slice(6, 8)) / 255 : 1,
      };
    }
    return null;
  }

  // rgb(255 255 255 / 0.045) and rgb(255, 255, 255)
  const rgb = /^rgba?\(\s*([^)]+)\)$/i.exec(value);
  if (rgb?.[1]) {
    const [channels, alpha] = rgb[1].split("/");
    const parts = (channels ?? "").split(/[\s,]+/).filter(Boolean).map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
    let a = 1;
    if (alpha !== undefined) a = Number(alpha.trim());
    else if (parts.length === 4) a = parts[3]!;
    if (Number.isNaN(a)) a = 1;
    return { r: parts[0]!, g: parts[1]!, b: parts[2]!, a };
  }

  return null;
}

export function toCss(c: Rgba): string {
  return c.a >= 1
    ? `rgb(${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)})`
    : `rgb(${Math.round(c.r)} ${Math.round(c.g)} ${Math.round(c.b)} / ${c.a})`;
}

/** A translucent panel over a page colour, which is what the glass cards are. */
export function over(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a + bottom.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

function channel(v: number): number {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(c: Rgba): number {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

/** WCAG contrast ratio, 1 to 21. */
export function contrast(fg: Rgba, bg: Rgba): number {
  const f = luminance(fg.a >= 1 ? fg : over(fg, bg));
  const b = luminance(bg);
  const [hi, lo] = f > b ? [f, b] : [b, f];
  return (hi + 0.05) / (lo + 0.05);
}

export type Grade = "pass" | "large" | "fail";

/**
 * 4.5:1 is the AA threshold for normal text, 3:1 for large text. Below 3:1 is
 * a problem at any size.
 */
export function grade(ratio: number): Grade {
  if (ratio >= 4.5) return "pass";
  if (ratio >= 3) return "large";
  return "fail";
}
