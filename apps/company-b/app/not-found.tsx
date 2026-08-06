import Link from "next/link";
import { CtaButton } from "@repo/ui/cta-button";
import { site } from "@/content/site";
import { Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section tone="paper" space="loose">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-7xl font-semibold text-heading tnum">404</p>
        <h1 className="mt-6 text-[clamp(1.875rem,3vw+0.5rem,2.75rem)] font-semibold">
          That plate isn&rsquo;t on the menu.
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          The page you&rsquo;re looking for moved or never existed. The food, however,
          is very real.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <CtaButton href="/menu" trailing="ArrowRight">
            See the menu
          </CtaButton>
          <CtaButton href="/" variant="outline">
            Back to home
          </CtaButton>
        </div>
        <nav aria-label="Helpful links" className="mt-12 border-t border-line pt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[...site.nav, site.orderCta].map((item) => (
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
