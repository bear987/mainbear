"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat as StatData } from "@/content/home";

/**
 * Trust-bar figure.
 *
 * Every stat animates, not just the numeric ones: the value rises out from
 * behind a mask when the row scrolls into view, and stats with `countTo`
 * additionally count up from zero. Text values like "Import & export"
 * previously sat static beside animating numbers, which read as unfinished.
 *
 * `delay` staggers the row so the four cascade left to right. Under reduced
 * motion nothing moves and the real values render immediately.
 */
export function Stat({ stat, delay = 0 }: { stat: StatData; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  // Render the real value server-side / pre-hydration (correct with JS off);
  // the count-up from 0 is a progressive enhancement applied on the client.
  const [display, setDisplay] = useState<string>(stat.value);
  // Starts true so a no-JS or reduced-motion visitor never sees a hidden value.
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const el = ref.current;
    if (!el) return;

    // Arm the mask only once we know motion is both wanted and possible.
    setShown(false);

    let raf = 0;
    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        timer = window.setTimeout(() => {
          setShown(true);

          if (stat.countTo == null) return;
          const target = stat.countTo;
          const duration = 1100;
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 4); // ease-out-quart
            setDisplay(String(Math.round(eased * target)));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, delay);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [stat.countTo, delay]);

  return (
    <div ref={ref}>
      {/* The mask: overflow-hidden clips the value while it rises into place. */}
      <div className="overflow-hidden">
        <div
          className={`font-display text-3xl font-semibold tracking-tight text-heading tnum transition-transform duration-700 ease-[var(--ease-quint)] sm:text-4xl ${
            shown ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {display}
        </div>
      </div>
      <div
        className={`mt-1.5 text-sm text-muted transition-all duration-700 ease-[var(--ease-quint)] ${
          shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ transitionDelay: shown ? "120ms" : "0ms" }}
      >
        {stat.label}
      </div>
    </div>
  );
}
