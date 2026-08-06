"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Hero media: the poster image carries LCP and paints first, always. The
 * looping video mounts on top only after the client is interactive, only
 * when the file exists, and never when the visitor asks for reduced motion
 * or is on a metered connection. If /video/hero.mp4 is absent the hero is
 * still complete — it simply stays a photograph.
 *
 * Drop either file in and refresh; nothing else needs changing.
 */
export function HeroMedia({
  poster = "/images/hero-poster.jpg",
  video = "/video/hero.mp4",
  alt,
}: {
  poster?: string;
  video?: string;
  alt: string;
}) {
  const [posterFailed, setPosterFailed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Respect Data Saver and slow connections — Nigerian mobile data is
    // the default case here, not the edge case.
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    setShowVideo(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      {!posterFailed ? (
        <Image
          src={poster}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <div aria-hidden className="grid-rules-fine absolute inset-0 opacity-30" />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
          src={video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setShowVideo(false)}
        />
      )}
    </div>
  );
}
