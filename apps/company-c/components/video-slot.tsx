"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * A below-fold video cell. It NEVER autoplays and never downloads the file
 * until the visitor asks for it — on Nigerian mobile data that difference
 * is the whole page weight. Until then it is a poster image with a play
 * control, so the layout is complete either way.
 *
 * `probe` HEAD-checks the file first and renders nothing when it is absent
 * — used for the optional per-unit walkaround, which only some buses have.
 * Drop the file in and refresh; the slot appears on its own.
 */
export function VideoSlot({
  src,
  poster,
  label,
  caption,
  probe = false,
  className = "",
}: {
  src: string;
  poster: string;
  label: string;
  caption?: string;
  probe?: boolean;
  className?: string;
}) {
  const [exists, setExists] = useState(!probe);
  const [playing, setPlaying] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!probe) return;
    let cancelled = false;
    fetch(src, { method: "HEAD" })
      .then((response) => {
        if (!cancelled && response.ok) setExists(true);
      })
      .catch(() => {
        /* absent — the slot stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, [probe, src]);

  useEffect(() => {
    if (playing) videoRef.current?.play().catch(() => setVideoFailed(true));
  }, [playing]);

  if (!exists) return null;

  return (
    <figure className={`relative border border-line bg-ink ${className}`}>
      <div className="relative aspect-video overflow-hidden">
        {playing && !videoFailed ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={src}
            poster={posterFailed ? undefined : poster}
            controls
            playsInline
            preload="metadata"
            onError={() => setVideoFailed(true)}
          />
        ) : (
          <>
            {!posterFailed ? (
              <Image
                src={poster}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                loading="lazy"
                className="object-cover"
                onError={() => setPosterFailed(true)}
              />
            ) : (
              <div aria-hidden className="grid-rules-fine absolute inset-0 opacity-40" />
            )}

            {videoFailed ? (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/70">
                <span className="stamp text-[#cfcdc7]">Footage pending: {src}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex items-center justify-center bg-ink/35 transition-colors duration-200 hover:bg-ink/20"
              >
                <span className="flex items-center gap-3 border border-[#f3f1ec]/40 bg-ink/80 px-5 py-3 transition-transform duration-200 ease-[var(--ease-quint)] group-hover:-translate-y-0.5">
                  <Play size={16} className="text-action-500" aria-hidden />
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[#f3f1ec]">
                    Play {label}
                  </span>
                </span>
              </button>
            )}
          </>
        )}
      </div>

      {caption && (
        <figcaption className="border-t border-line px-4 py-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#918d85]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
