"use client";

import { useState } from "react";
import { site } from "../content/site";

/**
 * Brand mark. Drop a file at /public/logo.svg (or logo.png and change the
 * src below) and it appears everywhere automatically. Until then the styled
 * wordmark stands in — no fake logo is drawn.
 */
export function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src="/logo.svg"
        alt={`${site.name} logo`}
        width={132}
        height={28}
        className={`h-7 w-auto ${className}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <span className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="border-2 border-ink px-1.5 py-0.5 text-sm font-bold leading-none tracking-[-0.04em] text-ink">
        GG
      </span>
      <span className="text-sm font-bold uppercase leading-none tracking-[-0.02em] text-heading">
        Autos
      </span>
    </span>
  );
}
