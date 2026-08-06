"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@repo/ui/cn";

/**
 * Photo slot for a dish: renders /images/menu/<slug>.jpg via next/image and,
 * until that file exists, an intentional-looking ember fallback (warm gradient,
 * flame ring, serif initial), so the site reads as designed, not broken.
 */
export function MenuImage({
  slug,
  alt,
  className,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
}: {
  slug: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [missing, setMissing] = useState(false);
  const initial = alt.trim().charAt(0).toUpperCase() || "G";

  return (
    <div className={cn("relative overflow-hidden bg-highlight", className)}>
      {missing ? (
        <div
          aria-hidden
          className="absolute inset-0 grid place-items-center"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 110%, rgba(217,98,43,0.28), rgba(26,23,20,0) 60%), linear-gradient(160deg, #241d16, #1a1714)",
          }}
        >
          <span className="grid h-16 w-16 place-items-center rounded-full border border-action-500/40 font-display text-2xl text-action-300">
            {initial}
          </span>
        </div>
      ) : (
        <Image
          src={`/images/menu/${slug}.jpg`}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          onError={() => setMissing(true)}
        />
      )}
    </div>
  );
}
