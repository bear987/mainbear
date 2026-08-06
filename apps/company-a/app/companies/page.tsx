import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { companies } from "@/content/companies";
import { site } from "@/content/site";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { CompanyCard } from "@/components/company-card";
import { CtaButton } from "@/components/cta-button";
import { Icon } from "@/components/icon";

export const metadata: Metadata = buildMetadata({
  title: "Our Companies",
  description:
    "GG BEARERS owns and operates two businesses, GG FOODS (food trade) and GG AUTOS (automotive trade). Visit each company's site.",
  path: "/companies",
});

export default function CompaniesPage() {
  return (
    <>
      <PageHeader
        eyebrow="The group"
        title="Two companies, owned and operated by GG BEARERS."
        lede="We are an operating holding company: alongside our own trade services, we own and run the two businesses below. Each leads its own market and keeps its own site."
        breadcrumb={[{ name: "Our Companies", path: "/companies" }]}
        backdrop={{ src: "/images/header-companies.jpg" }}
      />

      <Section tone="paper">
        <div className="grid gap-6 md:grid-cols-2">
          {companies.map((company, i) => (
            <Reveal key={company.id} delay={i * 90}>
              <CompanyCard company={company} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="tint" space="tight">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
              How the group fits together
            </h2>
            <p className="mt-4 max-w-prose text-lg leading-relaxed text-muted">
              GG BEARERS sits at the centre as the operating parent. We provide
              the trade backbone, importation, clearing, warehousing and
              distribution, and the partnerships, investment and corporate
              services that support growth. GG FOODS and GG AUTOS run as
              dedicated businesses within that structure, each focused on its own
              sector.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
              <p className="font-display text-lg font-semibold text-heading">
                {site.name}
              </p>
              <p className="mt-1 text-sm text-muted">
                Operating parent, trade services, partnerships, investment and
                corporate services.
              </p>
            </li>
            {companies.map((c) => (
              <li
                key={c.id}
                className="ml-6 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card"
              >
                <p className="font-display text-lg font-semibold text-heading">
                  {c.name}
                </p>
                <p className="mt-1 text-sm text-muted">{c.oneLiner}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="ink" space="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-heading sm:text-3xl">
              Want to work with the group?
            </h2>
            <p className="mt-2 text-ink-200">
              Partnerships, supply, investment or a role, we'll point you the
              right way.
            </p>
          </div>
          <CtaButton href="/contact" variant="primary" size="lg" trailing="ArrowRight">
            Get in touch
          </CtaButton>
        </div>
      </Section>
    </>
  );
}
