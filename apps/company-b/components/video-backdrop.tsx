"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@repo/ui/cn";
import {
  backdropMaskStyle,
  BACKDROP_GRADE,
  BACKDROP_CAST,
  BACKDROP_DIM,
} from "@/components/backdrop-fx";

/**
 * Moving-image sibling of <PhotoBackdrop>: a looping, muted section backdrop
 * video graded and masked identically, so it dissolves into the page charcoal
 * and blends with neighbouring sections exactly like the still does.
 *
 * - `poster` (the same still the video was generated from) paints first and is
 *   the fallback if the video is missing, still loading, or its autoplay is
 *   blocked (low-power / data-saver).
 * - The <video> only mounts when motion is allowed, so prefers-reduced-motion
 *   users keep the calm still — never a moving background.
 */
export function VideoBackdrop({
  src,
  poster,
  dim = BACKDROP_DIM,
  grade = BACKDROP_GRADE,
  className,
}: {
  src: string;
  poster: string;
  dim?: string;
  grade?: string;
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
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* masked visual layer: poster still + optional video on top + flame cast */}
      <div className="absolute inset-0" style={backdropMaskStyle}>
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${poster}')`, filter: grade }}
        />
        {motionOk && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            style={{ filter: grade } as CSSProperties}
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
        <div className="absolute inset-0" style={{ background: BACKDROP_CAST }} />
      </div>
      {/* flat paper-tinted dim (charcoal on dark, cream on light) for legibility */}
      <div className="absolute inset-0" style={{ background: dim }} />
    </div>
  );
}
