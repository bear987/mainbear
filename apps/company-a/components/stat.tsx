"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat as StatData } from "@/content/home";

/**
 * Trust-bar figure. Numeric stats (those with `countTo`) animate up once when
 * scrolled into view; text stats render as-is. Respects reduced motion.
 */
export function Stat({ stat }: { stat: StatData }) {
  const ref = useRef<HTMLDivElement>(null);
  // Render the real value server-side / pre-hydration (correct with JS off);
  // the count-up from 0 is a progressive enhancement applied on the client.
  const [display, setDisplay] = useState<string>(stat.value);

  useEffect(() => {
    if (stat.countTo == null) return;
    const target = stat.countTo;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
          setDisplay(String(Math.round(eased * target)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [stat.countTo]);

  return (
    <div ref={ref}>
      <div className="font-display text-3xl font-semibold tracking-tight text-heading tnum sm:text-4xl">
        {display}
      </div>
      <div className="mt-1.5 text-sm text-muted">{stat.label}</div>
    </div>
  );
}
