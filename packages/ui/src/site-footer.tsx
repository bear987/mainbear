import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "./container";

export type FooterLink = { label: string; href: string; external?: boolean };
export type FooterColumn = { title: string; links: FooterLink[] };

/**
 * Prop-driven site footer: a brand block, link columns, an optional aside
 * (e.g. contact/address), and a bottom bar. No hardcoded company content.
 */
export function SiteFooter({
  brand,
  columns,
  aside,
  bottomLeft,
  bottomRight,
}: {
  brand: ReactNode;
  columns: FooterColumn[];
  aside?: ReactNode;
  bottomLeft?: ReactNode;
  bottomRight?: ReactNode;
}) {
  return (
    <footer className="border-t border-line bg-surface text-fg">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs">{brand}</div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={`Footer, ${col.title}`}>
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-fg transition-colors hover:text-heading"
                      >
                        {link.label} <span aria-hidden>↗</span>
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-fg transition-colors hover:text-heading"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}

          {aside}
        </div>

        {(bottomLeft || bottomRight) && (
          <div className="mt-14 flex flex-col gap-2 border-t border-line pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <div>{bottomLeft}</div>
            <div>{bottomRight}</div>
          </div>
        )}
      </Container>
    </footer>
  );
}
