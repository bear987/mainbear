"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A single vehicle photograph, for cards and thumbnails. The file is
 * derived from the model slug, so dropping <slug>.jpg into
 * /public/images/inventory and refreshing publishes it.
 *
 * Until the file exists a designed panel stands in, so the page is never
 * showing a broken or empty grey image. Vehicle photography is never
 * grained or dithered: the product stays clean.
 */
export function VehicleImage({
  slug,
  alt,
  index,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 33vw",
  className = "",
}: {
  slug: string;
  alt: string;
  index?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const file = index ? `${slug}-${index}.jpg` : `${slug}.jpg`;
  const src = `/images/inventory/${file}`;

  if (failed) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden border border-line bg-elevated ${className}`}
      >
        <div aria-hidden className="grid-rules-fine pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative px-4 text-center">
          <span className="stamp block text-line-strong">Photograph pending</span>
          <span className="stamp mt-1 block break-all text-muted">{file}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-elevated ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
