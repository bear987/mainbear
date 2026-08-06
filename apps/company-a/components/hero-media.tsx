import type { CSSProperties } from "react";
import { GlobeBackdrop } from "@/components/globe-backdrop";

/**
 * Cinematic hero for the Obsidian theme: a rotating wireframe globe (global
 * trade reach) with luminous shipping-lane arcs and a breathing glow layered on
 * top. Pure canvas/SVG, no external asset, and it pauses under reduced motion.
 */

type RouteStyle = CSSProperties & { "--route-len": number };

const routes: { d: string; len: number; delay: number }[] = [
  { d: "M60,250 C300,208 480,250 720,188 S1020,80 1190,44", len: 820, delay: 300 },
  { d: "M120,430 C360,320 520,280 760,230 S1050,140 1170,96", len: 900, delay: 620 },
  { d: "M200,540 C420,470 640,430 820,360 S1085,270 1180,238", len: 760, delay: 940 },
];

const nodes: { cx: number; cy: number; delay: number }[] = [
  { cx: 60, cy: 250, delay: 0 },
  { cx: 720, cy: 188, delay: 400 },
  { cx: 1190, cy: 44, delay: 800 },
  { cx: 760, cy: 230, delay: 600 },
  { cx: 1180, cy: 238, delay: 500 },
];

export function HeroMedia() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-paper" aria-hidden>
      {/* bloom behind the globe */}
      <div
        className="glow-breathe absolute right-[4%] top-1/2 h-[62vh] w-[62vh] -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,91,219,0.42), rgba(59,91,219,0) 62%)",
        }}
      />
      {/* blueprint grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />

      {/* rotating wireframe globe — smaller canvas on phones */}
      <div className="absolute right-[-30%] top-1/2 h-[62vh] w-[62vh] -translate-y-1/2 sm:right-[-8%] sm:h-[94vh] sm:max-h-[880px] sm:w-[94vh] sm:max-w-[880px]">
        <GlobeBackdrop />
      </div>

      {/* shipping-lane arcs */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="rgba(151,169,247,0.4)" strokeWidth="1.5" strokeLinecap="round">
          {routes.map((r, i) => (
            <path
              key={i}
              className="route-line"
              d={r.d}
              style={{ "--route-len": r.len, animationDelay: `${r.delay}ms` } as RouteStyle}
            />
          ))}
        </g>
        <g fill="#c0ccfb">
          {nodes.map((n, i) => (
            <circle
              key={i}
              className="route-node"
              cx={n.cx}
              cy={n.cy}
              r="3.5"
              style={{ animationDelay: `${n.delay}ms` }}
            />
          ))}
        </g>
      </svg>

      {/* legibility vignettes for light text */}
      <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/45 to-paper/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/55 to-transparent" />
    </div>
  );
}
