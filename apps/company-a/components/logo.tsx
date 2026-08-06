"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * Brand lockup: the GG BEARERS crest (from /brand/logo.png) beside the wordmark.
 * If the image file isn't present yet, it falls back to a monogram tile so the
 * header/footer never break. Drop the real logo at:
 *   apps/company-a/public/brand/logo.png
 */
export function Logo({ className }: { className?: string }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      {imgOk ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/brand/logo.jpg"
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
