import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "./cn";

type Variant = "primary" | "dark" | "outline" | "ghost";
type Size = "md" | "lg";
type Trailing = "ArrowRight" | "ArrowUpRight";

const base =
  "group inline-flex items-center justify-center gap-2 font-medium " +
  "transition-all duration-300 ease-[var(--ease-quint)] active:scale-[0.98] " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-500 will-change-transform";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-action-500 text-white shadow-glow hover:-translate-y-0.5 hover:bg-action-400 hover:shadow-lift",
  dark: "border border-line bg-elevated text-heading hover:-translate-y-0.5 hover:border-line-strong hover:bg-elevated",
  outline:
    "border border-line text-heading hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface",
  ghost: "text-action-300 hover:text-action-200",
};

// Nested icon-chip background per variant.
const chipClass: Record<Variant, string> = {
  primary: "bg-white/20",
  dark: "bg-elevated",
  outline: "bg-elevated",
  ghost: "bg-action-500/15",
};

const sizeClass: Record<Size, string> = {
  md: "pl-5 pr-2 py-2 text-[0.95rem]",
  lg: "pl-7 pr-2.5 py-2.5 text-base",
};

const sizeClassNoChip: Record<Size, string> = {
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Conversion button, token-driven so each app's theme supplies the palette.
 * Pass `trailing` for the "button-in-button" arrow chip, and `shape="square"`
 * for hard-edged themes that reject pill radii. Internal links use next/link;
 * absolute URLs render a plain anchor with safe rel attributes.
 */
export function CtaButton({
  href,
  children,
  variant = "primary",
  size = "md",
  shape = "pill",
  trailing,
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  shape?: "pill" | "square";
  trailing?: Trailing;
  className?: string;
}) {
  const round = shape === "square" ? "rounded-none" : "rounded-full";
  const classes = cn(
    base,
    round,
    variantClass[variant],
    trailing ? sizeClass[size] : sizeClassNoChip[size],
    className,
  );

  const TrailingIcon = trailing === "ArrowUpRight" ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      <span>{children}</span>
      {trailing && (
        <span
          className={cn(
            "grid place-items-center transition-transform duration-300 ease-[var(--ease-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105",
            round,
            chipClass[variant],
            size === "lg" ? "h-8 w-8" : "h-7 w-7",
          )}
        >
          <TrailingIcon aria-hidden size={size === "lg" ? 17 : 15} />
        </span>
      )}
    </>
  );

  const isExternal = /^https?:\/\//.test(href);
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}
