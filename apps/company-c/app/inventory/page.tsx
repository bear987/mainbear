import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, breadcrumbSchema } from "../../components/page-header";
import { Section, SectionHead } from "../../components/section";
import { VehicleBrowser } from "../../components/vehicle-browser";
import { catalogueStats, specifications, vehicles } from "../../content/vehicles";
import { contact, site } from "../../content/site";
import { whatsappGeneral } from "../../lib/contact";

export const metadata: Metadata = {
  title: "Mini Buses & Mini Trucks for Sale in Lagos",
  description:
    "Mini buses and mini trucks from GG Autos Lagos: Suzuki, Hijet, Daihatsu, Toyota, Mazda, Nissan and Hummer. Compare specifications, then call or WhatsApp for a price.",
  alternates: { canonical: "/inventory" },
  openGraph: {
    title: `Mini Buses & Mini Trucks | ${site.name}`,
    description:
      "Suzuki, Hijet, Daihatsu, Toyota, Mazda, Nissan and Hummer. Compare specifications side by side, retail and wholesale.",
    url: `${site.url}/inventory`,
  },
};

const crumbs = [{ label: "Inventory", href: "/inventory" }];

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Mini buses and mini trucks supplied by GG Autos",
  numberOfItems: vehicles.length,
  itemListElement: vehicles.map((vehicle, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${site.url}/inventory/${vehicle.slug}`,
    name: `${vehicle.brand} ${vehicle.name}`,
  })),
};
import { sectionsFor } from "../../lib/layout";

export default function InventoryPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        label="The range"
        title="Mini buses and mini trucks"
        crumbs={crumbs}
        intro="Every make we supply, in passenger and load-carrying bodies. Pick a model on the left to see its specification and its photographs, then call the yard for a price."
        rail={[
          { label: "Models", value: String(catalogueStats.models) },
          { label: "Mini buses", value: String(catalogueStats.buses) },
          { label: "Full-size", value: String(catalogueStats.fullSizeBuses) },
          { label: "Mini trucks", value: String(catalogueStats.trucks) },
        ]}
      />
    ),

    section2: (
      <Section space="normal">
        <VehicleBrowser vehicles={vehicles} />
      </Section>
    ),

    /* Build options offered across the whole range, rather than figures belonging to any one model. */
    section3: (
      <Section tone="tint" rules>
        <SectionHead
          label={specifications.label}
          title={specifications.title}
          align="split"
          intro={specifications.intro}
        />

        <dl className="mt-14 border-t border-line">
          {specifications.options.map((option) => (
            <div
              key={option.title}
              className="grid gap-2 border-b border-line py-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-8"
            >
              <dt className="text-[1.15rem] leading-tight text-heading">{option.title}</dt>
              <dd className="max-w-[58ch] text-fg">{option.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
    ),

    section4: (
      <Section tone="ink" space="tight">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="stamp">Not in the range</span>
            <h2 className="mt-4 text-[clamp(1.8rem,3.6vw,2.8rem)]">
              Tell us the load and we will tell you the vehicle
            </h2>
            <p className="mt-4 max-w-[52ch] text-[#cfcdc7]">
              We couple to order, and bodies are built to the work the vehicle will do. If what
              you need is not on this page, it is usually a phone call away.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a
              href={contact.phoneHref}
              className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
            >
              Call now
            </a>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
            >
              Enquire on WhatsApp
            </a>
            <Link
              href="/wholesale"
              data-cta
              data-cta-section="inventory_footer"
              className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
            >
              Wholesale
            </Link>
          </div>
        </div>
      </Section>
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema(crumbs), itemListSchema]),
        }}
      />

      {sectionsFor("inventory").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
