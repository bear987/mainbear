import type { ReactNode } from "react";
import { Container } from "@repo/ui/container";
import { site } from "../content/site";

type Tone = "paper" | "tint" | "ink";
type Space = "tight" | "normal" | "loose";

const toneClass: Record<Tone, string> = {
  paper: "bg-paper",
  tint: "bg-highlight",
  ink: "on-ink",
};

const spaceClass: Record<Space, string> = {
  tight: "py-14 sm:py-16",
  normal: "py-20 sm:py-28",
  loose: "py-24 sm:py-36",
};

/**
 * A boxed section on the exposed grid. Every section is separated by a
 * hairline rule rather than by shadow or radius. `rules` paints the visible
 * column grid behind the content — the structure is the decoration.
 */
export function Section({
  id,
  children,
  tone = "paper",
  space = "normal",
  rules = false,
  bleed = false,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  tone?: Tone;
  space?: Space;
  rules?: boolean;
  /** Skip the Container for full-bleed content. */
  bleed?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-t border-line ${toneClass[tone]} ${spaceClass[space]} ${className}`}
    >
      {rules && (
        <div
          aria-hidden
          className="grid-rules pointer-events-none absolute inset-0 hidden opacity-70 sm:block"
        />
      )}
      {bleed ? children : <Container className="relative">{children}</Container>}
    </section>
  );
}

/**
 * Stamped section header: a sequence marker and mono label ruled off above a
 * grotesque headline. `index` is only passed where the content is genuinely
 * a numbered sequence — decorative numbering is a tell.
 */
export function SectionHead({
  index,
  label,
  title,
  intro,
  align = "left",
  size = "lg",
  aside,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  intro?: string;
  align?: "left" | "split";
  size?: "sm" | "lg" | "xl";
  aside?: ReactNode;
}) {
  const titleSize =
    size === "xl"
      ? "text-[clamp(2.6rem,7vw,5.5rem)]"
      : size === "lg"
        ? "text-[clamp(2rem,4.6vw,3.6rem)]"
        : "text-[clamp(1.5rem,2.6vw,2.1rem)]";

  return (
    <header className={align === "split" ? "grid gap-8 lg:grid-cols-12" : ""}>
      <div className={align === "split" ? "lg:col-span-7" : "max-w-[22ch]"}>
        <div className="flex items-center gap-3 border-b border-line pb-3">
          {index && <span className="stamp tnum text-action-600">{index}</span>}
          <span className="stamp">{label}</span>
          <span className="stamp ml-auto hidden sm:block">{site.coordinates}</span>
        </div>
        <h2 className={`mt-6 ${titleSize}`}>{title}</h2>
      </div>

      {(intro || aside) && (
        <div className={align === "split" ? "lg:col-span-5 lg:pt-16" : "mt-6"}>
          {intro && <p className="max-w-[58ch] text-lg leading-relaxed text-fg">{intro}</p>}
          {aside}
        </div>
      )}
    </header>
  );
}

/** Corner crop marks — the printed-document tell, used sparingly. */
export function RegistrationMarks({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-line-strong" />
      <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-line-strong" />
      <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-line-strong" />
      <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-line-strong" />
    </div>
  );
}
