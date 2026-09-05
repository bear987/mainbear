import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@repo/ui/reveal";
import { EnquiryForm } from "../../components/enquiry-form";
import { FaqList, faqSchema } from "../../components/faq";
import { ManifestTable } from "../../components/manifest-table";
import { PageHeader, breadcrumbSchema } from "../../components/page-header";
import { Section, SectionHead } from "../../components/section";
import { catalogueStats, vehicles } from "../../content/vehicles";
import { contact, site } from "../../content/site";
import { audiences, faqs, howItWorks, terms, wholesale } from "../../content/wholesale";
import { whatsappWholesale } from "../../lib/contact";
import { sequence } from "../../lib/format";

export const metadata: Metadata = {
  title: "Wholesale Mini Buses for Dealers & Fleets",
  description:
    "Wholesale mini buses from GG Autos Lagos: volume pricing for dealers, fleet operators and transport companies, with batch assembly to one specification. Request a written quote.",
  alternates: { canonical: "/wholesale" },
  openGraph: {
    title: `Wholesale Mini Buses | ${site.name}`,
    description:
      "Volume pricing and batch assembly for dealers, fleet operators and transport companies in Nigeria.",
    url: `${site.url}/wholesale`,
  },
};

const crumbs = [{ label: "Wholesale", href: "/wholesale" }];
import { sectionsFor } from "../../lib/layout";

export default function WholesalePage() {
  const wholesaleRange = vehicles.filter((vehicle) => vehicle.wholesaleAvailable);

  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        label={wholesale.label}
        title={wholesale.title}
        crumbs={crumbs}
        intro={wholesale.intro}
        rail={[
          { label: "Models available", value: String(catalogueStats.wholesale) },
          { label: "From", value: "2 units" },
          { label: "Batch built", value: String(catalogueStats.coupled) },
        ]}
      />
    ),

    section2: (
      <Section>
        <Reveal>
          <SectionHead label="Who buys this way" title="Built for three kinds of buyer" />
        </Reveal>
        <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
          {audiences.map((audience, index) => (
            <Reveal key={audience.title} delay={index * 80}>
              <div className="h-full bg-surface p-7">
                <h3 className="text-[1.2rem] leading-tight">{audience.title}</h3>
                <p className="mt-3 text-fg">{audience.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    section3: (
      <Section tone="tint" rules>
        <Reveal>
          <SectionHead
            label="How an order runs"
            title="From enquiry to handover"
            align="split"
            intro="Five stages. Nothing is assembled before the terms and the schedule are agreed in writing."
          />
        </Reveal>
        <ol className="mt-14 border-t border-line">
          {howItWorks.map((step, index) => (
            <Reveal key={step.title} delay={index * 60}>
              <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[6rem_minmax(0,24rem)_1fr] md:gap-8">
                <span className="stamp tnum pt-1 text-action-600">{sequence(index)}</span>
                <h3 className="text-[1.2rem] leading-tight">{step.title}</h3>
                <p className="max-w-[58ch] text-fg">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>
    ),

    /* Terms as a ledger. Unconfirmed values are visibly bracketed. */
    section4: (
      <Section>
        <Reveal>
          <SectionHead
            label="Terms"
            title="What you can expect"
            align="split"
            intro="Anything in square brackets is not yet confirmed for publication. Ask us and you will get the real answer in writing."
          />
        </Reveal>

        <dl className="mt-12 border-t border-line">
          {terms.map((row) => {
            const pending = row.value.startsWith("[");
            return (
              <div
                key={row.term}
                className="grid gap-2 border-b border-line py-5 md:grid-cols-[14rem_1fr] md:gap-8"
              >
                <dt className="stamp pt-1">{row.term}</dt>
                <dd>
                  <p
                    className={`text-[1.05rem] ${
                      pending ? "text-muted" : "font-medium text-heading"
                    }`}
                  >
                    {row.value}
                  </p>
                  <p className="stamp mt-1">{row.note}</p>
                </dd>
              </div>
            );
          })}
        </dl>
      </Section>
    ),

    section5: (
      <Section tone="ink">
        <Reveal>
          <SectionHead
            label="Available in volume"
            title="Models offered wholesale"
            align="split"
            intro="Minimum quantity is shown against each model. Mixed batches count toward the same volume."
          />
        </Reveal>
        <div className="mt-12">
          <ManifestTable vehicles={wholesaleRange} />
        </div>
        <Link
          href="/inventory?wholesale=yes"
          data-cta
          data-cta-section="wholesale_manifest"
          className="mt-8 inline-flex items-center gap-3 border border-[#f3f1ec]/50 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
        >
          Filter the full range
        </Link>
      </Section>
    ),

    section6: (
      <Section tone="tint" id="quote">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHead
                label="Request a quote"
                title="Send us your numbers"
                intro="Company name, quantity and preferred models are all we need to price it. Quotes come back in writing."
              />
            </Reveal>

            <div className="mt-8 border border-line p-6">
              <span className="stamp">Prefer to talk</span>
              <ul className="mt-3 space-y-2">
                <li>
                  <a
                    href={contact.phoneHref}
                    className="tnum font-mono text-lg text-heading underline-offset-4 hover:underline"
                  >
                    {contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={whatsappWholesale}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-heading underline-offset-4 hover:underline"
                  >
                    Wholesale enquiry on WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm variant="wholesale" />
          </div>
        </div>
      </Section>
    ),

    section7: (
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead label="Questions" title="About buying in volume" />
          </div>
          <div className="lg:col-span-7">
            <FaqList faqs={faqs} />
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
          __html: JSON.stringify([breadcrumbSchema(crumbs), faqSchema(faqs)]),
        }}
      />

      {sectionsFor("wholesale").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
