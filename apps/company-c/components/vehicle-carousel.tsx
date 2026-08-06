"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

const ADVANCE_MS = 4000;

/**
 * Auto-advancing photograph carousel for one model.
 *
 * Slides are the files /images/inventory/<slug>.jpg, -1.jpg, -2.jpg …
 * Every candidate is rendered and any file that is not on the server
 * drops itself out of the rotation on its first error, so photographs
 * can be added one at a time and published with a refresh. If none
 * exist yet it becomes a designed panel rather than a broken frame.
 *
 * (Existence was originally probed with HEAD requests. Those came back
 * ERR_ABORTED under React's double-invoked development effects and the
 * carousel never left its loading state, so detection now rides on the
 * image load itself, which has no race to lose.)
 *
 * It advances on its own, but it stops for anyone who needs it to:
 * on hover, on keyboard focus, when the tab is hidden, when there is an
 * explicit pause, and entirely under prefers-reduced-motion. That pause
 * control is a WCAG requirement for auto-moving content, not a nicety.
 */
export function VehicleCarousel({
  slug,
  name,
  count,
  priority = false,
}: {
  slug: string;
  name: string;
  count: number;
  priority?: boolean;
}) {
  const candidates = [
    `/images/inventory/${slug}.jpg`,
    ...Array.from({ length: Math.max(0, count - 1) }, (_, i) => `/images/inventory/${slug}-${i + 1}.jpg`),
  ];

  const [failed, setFailed] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const slides = candidates.filter((src) => !failed.includes(src));
  /* Slides can disappear underneath the index when a file turns out to be
     missing, so the active slide is always derived, never assumed. */
  const current = slides.length > 0 ? index % slides.length : 0;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const go = useCallback(
    (step: number) => {
      setIndex((current) => {
        if (slides.length === 0) return 0;
        return (current + step + slides.length) % slides.length;
      });
    },
    [slides.length],
  );

  const running =
    slides.length > 1 && !hovered && !focused && !userPaused && !reduced && !tabHidden;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => go(1), ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [running, go]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
  };

  if (slides.length === 0) {
    return (
      <div className="relative flex aspect-[4/3] w-full items-center justify-center border border-line bg-elevated">
        <div aria-hidden className="grid-rules-fine absolute inset-0 opacity-60" />
        <div className="relative max-w-[38ch] px-6 text-center">
          <span className="stamp block text-line-strong">Photographs pending</span>
          <p className="mt-2 text-sm text-muted">
            Add {slug}.jpg to /public/images/inventory and refresh. Further slides are{" "}
            {slug}-1.jpg, {slug}-2.jpg and so on.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${name} photographs`}
      className="relative border border-line bg-elevated"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {slides.map((src, slideIndex) => {
          const active = slideIndex === current;

          return (
            <div
              key={src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${slideIndex + 1} of ${slides.length}`}
              aria-hidden={!active}
              className={`absolute inset-0 transition-opacity duration-150 ease-[var(--ease-quint)] ${
                active ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={
                  active ? `${name}, photograph ${slideIndex + 1} of ${slides.length}` : ""
                }
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority={priority && slideIndex === 0}
                /* Not lazy: the carousel will show every slide anyway, and
                   loading them up front means a file that is not there drops
                   out of the rotation immediately instead of surfacing as a
                   blank frame when the viewer reaches it. */
                fetchPriority={slideIndex === 0 ? "high" : "low"}
                className="object-cover"
                onError={() =>
                  setFailed((list) => (list.includes(src) ? list : [...list, src]))
                }
              />
            </div>
          );
        })}

        {/* Stamped readout, top left, like a frame counter. */}
        <div className="pointer-events-none absolute left-0 top-0 flex items-center gap-2 bg-[#111110]/80 px-3 py-2">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[#f3f1ec]">
            <span className="tnum text-action-500">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-[#918d85]"> / {String(slides.length).padStart(2, "0")}</span>
          </span>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photograph"
              className="absolute left-0 top-1/2 flex h-12 w-10 -translate-y-1/2 items-center justify-center border-y border-r border-[#f3f1ec]/30 bg-[#111110]/75 text-[#f3f1ec] transition-colors duration-150 hover:bg-[#111110]"
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photograph"
              className="absolute right-0 top-1/2 flex h-12 w-10 -translate-y-1/2 items-center justify-center border-y border-l border-[#f3f1ec]/30 bg-[#111110]/75 text-[#f3f1ec] transition-colors duration-150 hover:bg-[#111110]"
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </>
        )}
      </div>

      {/* Control rail: pause, then a dot per slide. */}
      {slides.length > 1 && (
        <div className="flex items-center gap-3 border-t border-line bg-surface px-3 py-2">
          <button
            type="button"
            onClick={() => setUserPaused((value) => !value)}
            aria-pressed={userPaused}
            className="flex items-center gap-2 border border-line px-2.5 py-1.5 transition-colors duration-150 hover:border-line-strong"
          >
            {userPaused || reduced ? (
              <Play size={12} aria-hidden className="text-action-600" />
            ) : (
              <Pause size={12} aria-hidden className="text-action-600" />
            )}
            <span className="stamp">{userPaused || reduced ? "Play" : "Pause"}</span>
          </button>

          <ul className="flex flex-1 items-center gap-1.5">
            {slides.map((src, slideIndex) => (
              <li key={src} className="flex-1">
                <button
                  type="button"
                  onClick={() => setIndex(slideIndex)}
                  aria-label={`Show photograph ${slideIndex + 1}`}
                  aria-current={slideIndex === current}
                  className={`block h-1.5 w-full transition-colors duration-150 ${
                    slideIndex === current ? "bg-action-500" : "bg-line hover:bg-line-strong"
                  }`}
                />
              </li>
            ))}
          </ul>

          <span className="stamp hidden sm:block">
            {running ? "Auto" : "Held"}
          </span>
        </div>
      )}
    </div>
  );
}
