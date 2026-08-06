import { cn } from "@/lib/cn";
import { Container } from "@/components/container";
import { PhotoBackdrop } from "@/components/photo-backdrop";
import { GlobeBackdrop } from "@/components/globe-backdrop";

type Tone = "paper" | "surface" | "tint" | "ink" | "none";
type Space = "default" | "tight" | "loose";
type Backdrop = {
  src: string;
  dim?: string;
  fadeTop?: boolean;
  fadeBottom?: boolean;
};

const toneClass: Record<Tone, string> = {
  paper: "bg-paper text-fg",
  surface: "bg-surface text-fg",
  tint: "bg-highlight/50 text-fg",
  ink: "force-dark border-y border-line bg-ink-900/50 text-ink-100",
  // relative creates a stacking context so content paints ABOVE sibling
  // absolute photo layers (otherwise revealed text drops behind the overlay).
  none: "relative z-[1] text-fg",
};

const spaceClass: Record<Space, string> = {
  tight: "py-20 sm:py-28",
  default: "py-28 sm:py-40",
  loose: "py-32 sm:py-48",
};

/**
 * Page section with deliberate vertical rhythm + tone. Alternate tones across
 * a page so two identical surfaces never stack (avoids the templated feel).
 */
export function Section({
  id,
  tone = "paper",
  space = "default",
  className,
  containerClassName,
  backdrop,
  globe,
  children,
}: {
  id?: string;
  tone?: Tone;
  space?: Space;
  className?: string;
  containerClassName?: string;
  backdrop?: Backdrop;
  globe?: boolean;
  children: React.ReactNode;
}) {
  const layered = backdrop || globe;
  return (
    <section
      id={id}
      className={cn(
        toneClass[tone],
        spaceClass[space],
        layered && "relative isolate overflow-hidden",
        backdrop && "force-dark",
        className,
      )}
    >
      {backdrop && (
        <PhotoBackdrop
          src={backdrop.src}
          dim={backdrop.dim ?? "bg-ink-900/82"}
          fadeTop={backdrop.fadeTop}
          fadeBottom={backdrop.fadeBottom}
        />
      )}
      {globe && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-[28%] top-1/2 aspect-square h-[110%] -translate-y-1/2 opacity-60 md:-right-[16%] md:h-[150%] md:max-h-[760px]"
        >
          <GlobeBackdrop opacity={0.85} />
        </div>
      )}
      <Container className={cn(layered && "relative", containerClassName)}>
        {children}
      </Container>
    </section>
  );
}

/**
 * Pill-badge label that precedes a heading. A live dot + micro tracking gives it
 * a crafted, hardware-like feel. Encodes a real section name (not decoration).
 */
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
