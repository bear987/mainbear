import type { CSSProperties } from "react";

/**
 * Shared look for photo AND video section backdrops, so the two are
 * interchangeable and any two stacked backdrops blend instead of butting into a
 * hard horizontal seam.
 *
 * The mask intersects two layers:
 *  1. a vertical linear fade — the photo/video is fully transparent at the top
 *     and bottom edges and only opaque through the middle, so where two
 *     backdropped sections meet, each has already dissolved into the page's own
 *     charcoal. No visible cut.
 *  2. a gentle radial — softens the left/right edges and corners so the frame
 *     melts sideways too, never a rectangular block.
 *
 * Both `mask-composite` (standard) and `-webkit-mask-composite` (legacy WebKit)
 * are set so the intersect works across browsers.
 */
const MASK_LAYERS =
  "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%), " +
  "radial-gradient(ellipse 82% 100% at 50% 50%, #000 60%, rgba(0,0,0,0) 100%)";

export const backdropMaskStyle = {
  maskImage: MASK_LAYERS,
  WebkitMaskImage: MASK_LAYERS,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as CSSProperties;

/**
 * Warm cinematic colour grade applied to the backdrop pixels (image or video).
 * Driven by a CSS var so it flips per theme: darken-heavy on the Ember (dark)
 * palette, bright-and-cream-veiled on the Cream (light) palette.
 */
export const BACKDROP_GRADE = "var(--backdrop-grade)";

/** Flame cast laid over the graded pixels, under the flat dim. */
export const BACKDROP_CAST =
  "linear-gradient(160deg, rgba(217,98,43,0.12), rgba(26,23,20,0) 55%)";

/**
 * Flat paper-tinted dim for text legibility. A CSS var (not a Tailwind class)
 * so it, too, flips per theme — charcoal veil on dark, cream veil on light.
 */
export const BACKDROP_DIM = "var(--backdrop-dim)";
