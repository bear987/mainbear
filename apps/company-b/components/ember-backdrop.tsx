import type { CSSProperties } from "react";
import { cn } from "@repo/ui/cn";

type EmberStyle = CSSProperties & { "--ember-x": string };

/**
 * Ambient kitchen atmosphere: a breathing hearth glow rising from the bottom,
 * a few embers drifting up, and soft steam wisps. Pure CSS (compositor-only
 * transform/opacity), no blend modes, no canvas, so it costs almost nothing
 * and freezes under prefers-reduced-motion via the global rule.
 */

const EMBERS = [
  { left: "10%", delay: 0, dur: 9, x: 14, size: 3 },
  { left: "26%", delay: 2.2, dur: 11, x: -10, size: 2 },
  { left: "44%", delay: 4.1, dur: 8, x: 8, size: 2.5 },
  { left: "61%", delay: 1.3, dur: 10, x: -14, size: 2 },
  { left: "76%", delay: 3.4, dur: 12, x: 12, size: 3 },
  { left: "89%", delay: 5.2, dur: 9, x: -8, size: 2 },
];

export function EmberBackdrop({ variant = "band" }: { variant?: "hero" | "band" }) {
  const hero = variant === "hero";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ opacity: "var(--atmosphere-opacity, 1)" }}
    >
      {/* breathing hearth glow */}
      <div
        className={cn(
          "ember-breathe absolute left-1/2 blur-3xl",
          hero ? "-bottom-[28%] h-[60vh] w-[130%]" : "-bottom-[45%] h-[42vh] w-[120%]",
        )}
        style={{
          background: `radial-gradient(50% 62% at 50% 100%, rgba(217,98,43,${hero ? 0.26 : 0.16}), rgba(26,23,20,0) 70%)`,
        }}
      />
      {/* faint wine warmth in one upper corner (depth, not symmetry) */}
      <div
        className="absolute -right-[12%] -top-[20%] h-[45vh] w-[45vh] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle at center, rgba(114,47,55,0.18), rgba(26,23,20,0) 65%)",
        }}
      />
      {/* rising embers */}
      {EMBERS.slice(0, hero ? 6 : 4).map((e, i) => (
        <span
          key={i}
          className="absolute bottom-[8%] rounded-full bg-action-400 blur-[1px]"
          style={
            {
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
              opacity: 0,
              animation: `ember-float ${e.dur}s linear ${e.delay}s infinite`,
              "--ember-x": `${e.x}px`,
            } as EmberStyle
          }
        />
      ))}
      {/* steam wisps */}
      <div
        className="absolute bottom-[10%] left-[18%] h-40 w-24 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(closest-side, rgba(245,237,224,0.07), transparent)",
          animation: "steam-drift 7.5s ease-in-out 0.8s infinite",
        }}
      />
      <div
        className="absolute bottom-[14%] right-[22%] h-32 w-20 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(closest-side, rgba(245,237,224,0.06), transparent)",
          animation: "steam-drift 9s ease-in-out 3s infinite",
        }}
      />
    </div>
  );
}
