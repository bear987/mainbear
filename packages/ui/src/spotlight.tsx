"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "./cn";

/**
 * Cursor spotlight: a soft accent glow follows the pointer across the wrapped
 * surface, fading in on hover. `color` sets the glow to the app's accent.
 */
export function Spotlight({
  className,
  children,
  color = "rgba(107,130,240,0.14)",
}: {
  className?: string;
  children: ReactNode;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("group/spot relative", className)}>
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[var(--radius-xl)] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background: `radial-gradient(260px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 65%)`,
        }}
      />
    </div>
  );
}
