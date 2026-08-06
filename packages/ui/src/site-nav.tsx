"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "./cn";

export type NavLink = { label: string; href: string };

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Prop-driven site nav. Two shells:
 * - `variant="island"` (default) — a detached rounded pill centred under the
 *   top edge, blurred over whatever scrolls beneath it.
 * - `variant="bar"` — a full-bleed sticky bar with a hairline bottom rule, for
 *   apps whose design system rejects floating glass.
 * `shape="square"` drops every radius to zero for hard-edged themes.
 * Configure with `links`, a `logo` node, a standout `cta`, and an optional
 * `end` slot (e.g. a theme toggle). Mobile: morphing hamburger + full-screen
 * overlay with staggered link reveal. Consumes theme tokens
 * (paper/surface/elevated/line/action).
 */
export function SiteNav({
  links,
  logo,
  cta,
  end,
  homeAriaLabel = "Home",
  variant = "island",
  shape = "pill",
}: {
  links: NavLink[];
  logo: ReactNode;
  cta: NavLink;
  end?: ReactNode;
  homeAriaLabel?: string;
  variant?: "island" | "bar";
  shape?: "pill" | "square";
}) {
  const isBar = variant === "bar";
  const round = shape === "square" ? "rounded-none" : "rounded-full";
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-50 flex",
          isBar ? "" : "justify-center px-4 pt-4",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 backdrop-blur-xl transition-all duration-300 ease-[var(--ease-quint)]",
            isBar
              ? "w-full border-b border-line px-4 py-3 sm:px-6"
              : cn("border border-line px-2.5 py-2", round),
            scrolled || open
              ? cn("bg-paper/95", isBar ? "" : "shadow-lift")
              : cn(isBar ? "bg-paper/80" : "bg-paper/85 shadow-card"),
          )}
        >
          <Link
            href="/"
            className={cn("shrink-0 pl-1 pr-2", round)}
            aria-label={homeAriaLabel}
          >
            {logo}
          </Link>

          <nav
            aria-label="Primary"
            className={cn("hidden lg:block", isBar && "ml-6 mr-auto")}
          >
            <ul className="flex items-center">
              {links.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "block px-3.5 py-2 text-sm transition-colors duration-200",
                      round,
                      isActive(pathname, item.href)
                        ? "bg-elevated font-medium text-heading"
                        : "text-fg hover:bg-surface hover:text-heading",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {end}

          <Link
            href={cta.href}
            className={cn(
              "ml-1 hidden items-center bg-action-500 px-4 py-2 text-sm font-medium text-white shadow-glow transition-all duration-200 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:bg-action-400 active:scale-[0.98] lg:inline-flex",
              round,
            )}
          >
            {cta.label}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center text-heading transition-colors hover:bg-surface lg:hidden",
              round,
              isBar && "ml-auto",
            )}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 top-0 h-[2px] w-5 bg-current transition-transform duration-300 ease-[var(--ease-quint)]",
                  round,
                  open && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-[2px] w-5 bg-current transition-transform duration-300 ease-[var(--ease-quint)]",
                  round,
                  open && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen glass overlay with staggered link reveal */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 bg-paper/95 backdrop-blur-2xl transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <div className="mx-auto flex h-full w-full max-w-[1240px] flex-col px-6 pb-10 pt-28 sm:px-8">
          <nav aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {links.map((item, i) => (
                <li
                  key={item.href}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
                  className={cn(
                    "transition-all duration-500 ease-[var(--ease-quint)]",
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                  )}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "block border-b border-line py-4 text-2xl",
                      isActive(pathname, item.href) ? "font-medium text-heading" : "text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            href={cta.href}
            style={{ transitionDelay: open ? `${120 + links.length * 55}ms` : "0ms" }}
            className={cn(
              "mt-8 inline-flex items-center justify-center bg-action-500 px-6 py-4 text-lg font-medium text-white shadow-glow transition-all duration-500 ease-[var(--ease-quint)] active:scale-[0.98]",
              round,
              open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
            )}
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </>
  );
}
