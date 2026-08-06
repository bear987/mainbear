"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A counter that TICKS to its value like a mechanical readout — stepped
 * increments on a fixed interval, not a smooth eased tween. Runs once when
 * scrolled into view. Renders the final value immediately for reduced
 * motion and for anyone without JavaScript.
 */
export function Counter({
  value,
  duration = 900,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;
    setShown(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const steps = Math.max(1, Math.min(value, 24));
        const interval = duration / steps;
        let step = 0;
        const timer = window.setInterval(() => {
          step += 1;
          if (step >= steps) {
            setShown(value);
            window.clearInterval(timer);
            return;
          }
          setShown(Math.round((value * step) / steps));
        }, interval);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [armed, value, duration]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {shown}
    </span>
  );
}
