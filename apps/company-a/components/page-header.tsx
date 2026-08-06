import Link from "next/link";
import { Container } from "@/components/container";
import { Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { PhotoBackdrop } from "@/components/photo-backdrop";
import { breadcrumbSchema } from "@/lib/jsonld";
import { cn } from "@/lib/cn";

export type Crumb = { name: string; path: string };

/** Interior-page header: breadcrumb + heading, optionally over a graded photo. */
export function PageHeader({
  eyebrow,
  title,
  lede,
  breadcrumb,
  backdrop,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  breadcrumb: Crumb[];
  backdrop?: { src: string };
}) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...breadcrumb];

  return (
    <header
      className={cn(
        "relative isolate overflow-hidden border-b border-line",
        backdrop
          ? "force-dark pb-16 pt-24 sm:pb-20 sm:pt-28"
          : "bg-paper pb-12 pt-16 sm:pb-16 sm:pt-20",
      )}
    >
      <JsonLd data={breadcrumbSchema(trail)} />
      {backdrop && (
        <PhotoBackdrop src={backdrop.src} dim="bg-ink-900/78" fadeBottom />
      )}
      <Container className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
            {trail.map((crumb, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={crumb.path} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="text-ink-200">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-action-300">
                      {crumb.name}
                    </Link>
                  )}
                  {!last && <span aria-hidden>/</span>}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-8 max-w-3xl">
          {eyebrow && (
            <Reveal>
              <Eyebrow>{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <Reveal delay={eyebrow ? 80 : 0}>
            <h1 className="mt-4 text-[clamp(2.25rem,4vw+0.5rem,3.5rem)] font-semibold">
              {title}
            </h1>
          </Reveal>
          {lede && (
            <Reveal delay={160}>
              <p className="mt-5 text-lg leading-relaxed text-ink-200">{lede}</p>
            </Reveal>
          )}
        </div>
      </Container>
    </header>
  );
}
