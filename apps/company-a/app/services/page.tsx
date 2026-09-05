import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { services } from "@/content/services";
import { Section } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { ServiceCard } from "@/components/service-card";
import { CtaButton } from "@/components/cta-button";
import { Icon } from "@/components/icon";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "The services GG BEARERS runs in-house: trade partnerships, investment, and corporate services (importation, clearing, warehousing and distribution).",
  path: "/services",
});
import { sectionsFor } from "@/lib/layout";

export default function ServicesPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        eyebrow="Services"
        title="The trade services we run ourselves."
        lede="Beyond owning GG FOODS and GG AUTOS, GG BEARERS operates three service lines directly, each a way to work with the group's trade infrastructure and capital."
        breadcrumb={[{ name: "Services", path: "/services" }]}
        backdrop={{ src: "/images/header-services.jpg" }}
      />
    ),

    section2: (
      <Section tone="paper">
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 90}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    section3: (
      <Section tone="ink" space="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-heading sm:text-3xl">
              Not sure which fits?
            </h2>
            <p className="mt-2 text-ink-200">
              Tell us what you're trying to do and we'll point you to the right
              service, or a mix of them.
            </p>
          </div>
          <CtaButton href="/contact" variant="primary" size="lg" trailing="ArrowRight">
            Get in touch
          </CtaButton>
        </div>
      </Section>
    ),
  };

  return (
    <>
      {sectionsFor("services").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
