import { cn } from "@/lib/cn";

/**
 * Atmospheric photographic backdrop, blue-graded + darkened to sit inside the
 * Obsidian theme. Serves self-hosted images from /public/images (deterministic,
 * fast, no external dependency). Rendered as a CSS background so a missing file
 * degrades to the dark base with no broken icon.
 *
 * `fadeTop` / `fadeBottom` control edge fades: keep an edge hard where two
 * photo regions meet (or use PhotoDuo for a true dissolve).
 */
export function PhotoBackdrop({
  src,
  className,
  dim = "bg-ink-900/72",
  grade = "grayscale(0.4) brightness(0.5) contrast(1.05)",
  fadeTop = false,
  fadeBottom = false,
}: {
  src: string;
  className?: string;
  dim?: string;
  grade?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: `url('${src}')`, filter: grade }}
      />
      <div className={cn("absolute inset-0", dim)} />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(120deg, rgba(59,91,219,0.22), rgba(8,11,20,0) 58%)",
          mixBlendMode: "screen",
        }}
      />
      {fadeTop && (
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-paper to-transparent" />
      )}
      {fadeBottom && (
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
      )}
    </div>
  );
}
