import { cn } from "@repo/ui/cn";
import { Container } from "@repo/ui/container";
import { EmberBackdrop } from "@/components/ember-backdrop";
import { PhotoBackdrop } from "@/components/photo-backdrop";
import { VideoBackdrop } from "@/components/video-backdrop";

/** `src` is the still (also the video poster); pass `video` to animate it. */
type Backdrop = { src: string; video?: string };

type Tone = "paper" | "surface" | "ember" | "none";
type Space = "default" | "tight" | "loose";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-fg",
  surface: "bg-surface text-fg",
  // warm wine-tinted band for emphatic moments
  ember: "border-y border-line bg-wine/15 text-fg",
  none: "relative z-[1] text-fg",
};

const spaceClass: Record<Space, string> = {
  tight: "py-20 sm:py-28",
  default: "py-24 sm:py-36",
  loose: "py-28 sm:py-44",
};

export function Section({
  id,
  tone = "paper",
  space = "default",
  atmosphere = false,
  backdrop,
  className,
  containerClassName,
  children,
}: {
  id?: string;
  tone?: Tone;
  space?: Space;
  /** Adds the ambient ember/steam animation behind the content. */
  atmosphere?: boolean;
  /** Adds a warm-graded photo behind the content (under the embers). */
  backdrop?: Backdrop;
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
}) {
  const layered = atmosphere || backdrop;
  return (
    <section
      id={id}
      className={cn(
        toneClass[tone],
        spaceClass[space],
        layered && "relative isolate overflow-hidden",
        className,
      )}
    >
      {backdrop &&
        (backdrop.video ? (
          <VideoBackdrop src={backdrop.video} poster={backdrop.src} />
        ) : (
          <PhotoBackdrop src={backdrop.src} />
        ))}
      {atmosphere && <EmberBackdrop />}
      {/* content must create a stacking context above absolute backdrops */}
      <Container className={cn(layered && "relative z-[1]", containerClassName)}>
        {children}
      </Container>
    </section>
  );
}

/** Pill label preceding a heading. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-action-300",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-action-500" />
      {children}
    </span>
  );
}
