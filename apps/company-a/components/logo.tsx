"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * Brand lockup: the GG BEARERS crest beside the wordmark.
 *
 * Which file to use is content, not a guess: site.logoFile names it, and the
 * admin updates that when a logo is uploaded. This is why the component does
 * not try one extension and then another, which would 404 on every page load
 * for whichever one is not there. A monogram tile still covers the case where
 * the file is missing entirely, so the header and footer never break.
 */
export function Logo({ className }: { className?: string }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/${site.logoFile}`}
          alt={`${site.name} logo`}
          width={40}
          height={40}
          className="h-10 w-10 rounded-[7px] object-contain"
          onError={() => setImgOk(false)}
        />
      ) : (
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-[7px] border border-line bg-surface text-heading"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="10" cy="10" r="2.4" fill="currentColor" />
          </svg>
        </span>
      )}
      <span className="font-display text-[1.05rem] font-semibold leading-none tracking-tight text-heading">
        {site.name}
      </span>
    </span>
  );
}
