import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@repo/ui/container";
import { site } from "../content/site";

export type Crumb = { label: string; href: string };

/**
 * Interior page header: an ink block stamped with the breadcrumb trail, a
 * grotesque headline at scale, and an optional readout rail on the right.
 * The page number and coordinates sit in the margin like a document stamp.
 */
export function PageHeader({
  label,
  title,
  intro,
  crumbs,
  rail,
  children,
}: {
  label: string;
  title: string;
  intro?: string;
  crumbs: Crumb[];
  rail?: { label: string; value: string }[];
  children?: ReactNode;
}) {
  return (
    <header className="on-ink relative overflow-hidden pb-14 pt-[calc(var(--header-h)+3.5rem)]">
      <div
        aria-hidden
        className="grid-rules pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
      />
      <Container className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="stamp flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-heading">
                Home
              </Link>
            </li>
            {crumbs.map((crumb, index) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {index === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-heading">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-heading">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="stamp border-l-2 border-action-500 pl-3">{label}</p>
            <h1 className="mt-5 text-[clamp(2.4rem,6.5vw,5rem)] leading-[0.95]">{title}</h1>
          </div>

          <div className="lg:col-span-5 lg:pt-14">
            {intro && <p className="max-w-[52ch] text-[1.05rem] leading-relaxed">{intro}</p>}
            {rail && (
              <dl className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
                {rail.map((cell) => (
                  <div key={cell.label} className="bg-[#111110] px-4 py-3">
                    <dt className="stamp">{cell.label}</dt>
                    <dd className="tnum mt-1 text-xl font-semibold leading-none text-heading">
                      {cell.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
            {children}
          </div>
        </div>

        <p className="stamp mt-12 border-t border-line pt-3">{site.coordinates}</p>
      </Container>
    </header>
  );
}

/** BreadcrumbList structured data for the same trail. */
export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Home", href: "/" }, ...crumbs].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${site.url}${crumb.href}`,
    })),
  };
}
