import { cn } from "@/lib/cn";

const grade = "grayscale(0.4) brightness(0.5) contrast(1.05)";

/**
 * Two photos dissolving into each other across ONE continuous region. Both
 * layers span the entire wrapper (identical geometry), and the second is
 * masked in mid-way, so a visible seam is impossible. Wrap the participating
 * Sections in a `relative isolate` container, give them tone="none", and place
 * this behind them.
 */
export function PhotoDuo({
  from,
  to,
  dim = "bg-ink-900/78",
  className,
}: {
  from: string;
  to: string;
  dim?: string;
  className?: string;
}) {
  const srcA = from;
  const srcB = to;
  const mask = "linear-gradient(to bottom, transparent 34%, black 62%)";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${srcA}')`, filter: grade }}
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('${srcB}')`,
          filter: grade,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
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
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
