import Image from "next/image";
import type { CSSProperties } from "react";
import { GlobeBackdrop } from "@/components/globe-backdrop";

/**
 * Cinematic hero for the Obsidian theme.
 *
 * A real photograph of the port carries the frame, graded down into the
 * Obsidian palette so it reads as part of the brand rather than a stock
 * image dropped behind text. The wireframe globe and shipping-lane arcs
 * survive as a lighter layer on top: they say "trade reach" without
 * competing with the photograph for attention.
 *
 * Legibility comes from ONE directional scrim, heavy on the left where the
 * headline sits and clearing to nothing on the right so the picture is
 * actually visible. (It previously used two stacked full-frame vignettes at
 * 45% and 55%, which muted everything behind them.)
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
      {/* The photograph. Carries LCP, so it is eager and full-width. */}
      <Image
        src="/images/home-port.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center brightness-[0.42] saturate-[0.75]"
      />

      {/* Navy grade: ties the photograph to the Obsidian palette. A flat
          tint rather than a blend mode, which keeps scrolling cheap. */}
      <div className="absolute inset-0 bg-ink-900/55" />

      {/* Accent bloom, tying the blue action colour into the image. */}
      <div
        className="glow-breathe absolute right-[4%] top-1/2 h-[62vh] w-[62vh] -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,91,219,0.34), rgba(59,91,219,0) 62%)",
        }}
      />

      {/* Blueprint grid, barely there, for texture over the photograph. */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "58px 58px",
        }}
      />

      {/* Rotating wireframe globe, now a supporting layer over the photo. */}
      <div className="absolute right-[-30%] top-1/2 h-[62vh] w-[62vh] -translate-y-1/2 opacity-45 sm:right-[-8%] sm:h-[94vh] sm:max-h-[880px] sm:w-[94vh] sm:max-w-[880px]">
        <GlobeBackdrop />
      </div>

      {/* Shipping-lane arcs. */}
      <svg
        className="absolute inset-0 h-full w-full opacity-80"
        viewBox="0 0 1200 700"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke="rgba(151,169,247,0.45)" strokeWidth="1.5" strokeLinecap="round">
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

      {/* ONE directional scrim: opaque behind the headline, clear over the
          picture on the right. */}
      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-transparent" />

      {/* Short bottom fade so the band hands off to the next section. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-paper to-transparent" />
    </div>
  );
}
