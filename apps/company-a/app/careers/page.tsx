import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { companyLabels } from "@/content/roles";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { RolesList } from "@/components/roles-list";
import { CtaButton } from "@/components/cta-button";

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  description:
    "Open roles across the GG BEARERS group, GG BEARERS, GG FOODS and GG AUTOS. Filter by company and apply. Trade operations, sales, finance and more, in Lagos.",
  path: "/careers",
});
import { sectionsFor } from "@/lib/layout";

export default function CareersPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        eyebrow="Careers"
        title="One hiring hub for the whole group."
        lede={`Roles across ${companyLabels.A}, ${companyLabels.B} and ${companyLabels.C}, in one place. Filter by company, then apply through a single routed form.`}
        breadcrumb={[{ name: "Careers", path: "/careers" }]}
        backdrop={{ src: "/images/header-careers.jpg" }}
      />
    ),

    section2: (
      <Section tone="paper">
        <RolesList />
      </Section>
    ),

    section3: (
      <Section tone="tint" space="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Don&rsquo;t see your role?
            </h2>
            <p className="mt-2 text-muted">
              We hire for character and trade sense first. If you&rsquo;d add value to
              the group, introduce yourself, we keep good people in mind.
            </p>
          </div>
          <CtaButton href="/contact?subject=careers" variant="primary" trailing="ArrowRight">
            Introduce yourself
          </CtaButton>
        </div>
      </Section>
    ),
  };

  return (
    <>
      {sectionsFor("careers").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
