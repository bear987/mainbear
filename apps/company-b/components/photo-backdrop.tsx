import { cn } from "@repo/ui/cn";
import {
  backdropMaskStyle,
  BACKDROP_GRADE,
  BACKDROP_CAST,
  BACKDROP_DIM,
} from "@/components/backdrop-fx";

/**
 * Warm photographic backdrop that dissolves seamlessly into the page.
 *
 * The photo layer carries the shared backdrop mask, so its edges fade to
 * transparent (top/bottom fully, sides gently) and whatever shows through is the
 * section's own charcoal — never a black scrim, and never a hard seam against
 * the neighbouring section. Self-hosted src, so a missing file degrades to
 * charcoal.
 *
 * The moving-image sibling is <VideoBackdrop>; both share backdrop-fx so a
 * section's poster and its video look identical.
 */
export function PhotoBackdrop({
  src,
  dim = BACKDROP_DIM,
  grade = BACKDROP_GRADE,
  className,
}: {
  src: string;
  dim?: string;
  grade?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* masked visual layer: photo + subtle flame cast, edges fade to nothing */}
      <div className="absolute inset-0" style={backdropMaskStyle}>
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${src}')`, filter: grade }}
        />
        <div className="absolute inset-0" style={{ background: BACKDROP_CAST }} />
      </div>
      {/* flat paper-tinted dim (charcoal on dark, cream on light) for legibility */}
      <div className="absolute inset-0" style={{ background: dim }} />
    </div>
  );
}
