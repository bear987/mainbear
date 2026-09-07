"use client";

import { useState } from "react";
import { site } from "../content/site";

/**
 * Brand mark.
 *
 * Which file to use is content, not a guess: `site.logoFile` names it, and the
 * admin sets that when a logo is uploaded. While it is empty the styled
 * wordmark stands in and NO request is made, which is why the site does not
 * ask for a logo.svg that is not there. No fake logo is ever drawn.
 */
export function Logo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (site.logoFile && !failed) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={`/${site.logoFile}`}
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
