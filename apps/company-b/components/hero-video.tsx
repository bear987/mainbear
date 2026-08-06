"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui/cn";

/**
 * Full-bleed hero background: a looping cooking video (flaming wok, steam,
 * embers) over the same still used as its poster.
 *
 * - The poster <Image> is always rendered as the base layer, so it carries the
 *   LCP paint and survives if the video is missing, still downloading, or its
 *   autoplay is blocked (low-power mode, data saver).
 * - The <video> is layered on top and only mounts when motion is allowed, so
 *   prefers-reduced-motion users get the calm still, never a moving background.
 * - object-cover on both keeps the framing identical, so the swap from poster
 *   to first video frame is invisible.
 */
export function HeroVideo({
  poster = "/images/menu/hero.jpg",
  src = "/videos/hero.mp4",
  alt,
  className,
}: {
  poster?: string;
  src?: string;
  alt: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionOk(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={cn("overflow-hidden bg-paper", className)}>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />
      {motionOk && (
        <video
          ref={videoRef}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
