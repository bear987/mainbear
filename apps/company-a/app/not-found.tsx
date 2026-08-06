import Link from "next/link";
import { site } from "@/content/site";
import { Section } from "@/components/section";
import { CtaButton } from "@/components/cta-button";

const quickLinks = site.nav.filter((item) => item.href !== "/");

export default function NotFound() {
  return (
    <Section tone="paper" space="loose" globe>
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-7xl font-semibold tabular-nums text-heading">
          404
        </p>
        <h1 className="mt-6 text-[clamp(1.875rem,3vw+0.5rem,2.75rem)] font-semibold">
          We can't find that page.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          The link may be broken or the page may have moved. Here's the way back
          to the parts of {site.name} that matter.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <CtaButton href="/" variant="dark" trailing="ArrowRight">
            Back to home
          </CtaButton>
          <CtaButton href="/contact" variant="outline">
            Contact us
          </CtaButton>
        </div>

        <nav aria-label="Helpful links" className="mt-12 border-t border-line pt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-action-300 hover:text-action-200">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Section>
  );
}
