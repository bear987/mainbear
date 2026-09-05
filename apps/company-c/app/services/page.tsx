import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@repo/ui/reveal";
import { FaqList, faqSchema } from "../../components/faq";
import { PageHeader, breadcrumbSchema } from "../../components/page-header";
import { Section, SectionHead } from "../../components/section";
import { VideoSlot } from "../../components/video-slot";
import {
  buyerMeaning,
  catalogue,
  faqs,
  process,
  quality,
  service,
  supply,
} from "../../content/services";
import { contact, site } from "../../content/site";
import { whatsappAssembly } from "../../lib/contact";
import { sequence } from "../../lib/format";

export const metadata: Metadata = {
  title: "Mini Bus Coupling, Attachment & Joining in Lagos",
  description:
    "GG Autos couples, attaches and joins mini buses and mini trucks in Okota, Lagos: component parts assembled into complete, road-tested vehicles. See the process and talk to the builder.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Mini Bus Coupling, Attachment & Joining | ${site.name}`,
    description:
      "Component parts assembled into complete, road-tested mini buses on our own yard in Lagos.",
    url: `${site.url}/services`,
  },
};

const crumbs = [{ label: "Services", href: "/services" }];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mini bus coupling, attachment and joining",
  alternateName: ["Mini bus attachment", "Mini bus joining", "Mini bus assembly"],
  serviceType: "Vehicle assembly",
  description: service.standfirst,
  url: `${site.url}/services`,
  areaServed: { "@type": "Country", name: "Nigeria" },
  provider: { "@type": "AutoDealer", name: site.name, url: site.url },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "GG Autos services",
    itemListElement: catalogue.map((item) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: item.title, description: item.body },
    })),
  },
};
import { sectionsFor } from "../../lib/layout";

export default function ServicesPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        label={service.label}
        title={service.title}
        crumbs={crumbs}
        intro={service.standfirst}
      />
    ),

    /* The proof sits high: footage of the work itself. */
    section2: (
      <Section space="normal">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[1.05rem] leading-relaxed text-fg">{service.intro}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={whatsappAssembly}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-ink bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-all duration-150 ease-[var(--ease-quint)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift"
                >
                  Talk about a build
                </a>
                <a
                  href={contact.phoneHref}
                  className="border border-line px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
                >
                  Call the yard
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <VideoSlot
                src="/video/assembly.mp4"
                poster="/images/assembly-poster.jpg"
                label="assembly footage"
                caption="Coupling in progress, Okota workshop"
              />
            </Reveal>
          </div>
        </div>
      </Section>
    ),

    /* Products & services. The two uses sit as paired cells, the rest as a ruled ledger. No 01/02 markers: this is a list, not a sequence. */
    section3: (
      <Section tone="ink">
        <Reveal>
          <SectionHead
            label={supply.label}
            title={supply.title}
            align="split"
            intro={supply.intro}
          />
        </Reveal>

        <div className="mt-14 grid gap-px bg-[#f3f1ec]/20 md:grid-cols-2">
          {supply.uses.map((use, index) => (
            <Reveal key={use.title} delay={index * 90}>
              <div className="h-full bg-[#111110] p-8">
                <span className="stamp">{`Use 0${index + 1}`}</span>
                <h3 className="mt-4 text-[clamp(1.5rem,3vw,2.1rem)]">{use.title}</h3>
                <p className="mt-3 max-w-[42ch] text-[#cfcdc7]">{use.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={130}>
          <h3 className="stamp mt-12 border-b border-line pb-3">Vehicles we supply</h3>
          <ul className="mt-4 flex flex-wrap gap-2">
            {supply.makes.map((make) => (
              <li
                key={make}
                className="stamp border border-line px-3 py-1.5 text-[#f3f1ec]"
              >
                {make}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <h3 className="stamp mt-12 border-b border-line pb-3">Workshop services</h3>
          <ul>
            {supply.workshop.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-4 border-b border-line py-4 text-[1.05rem] text-[#cfcdc7]"
              >
                <span aria-hidden className="text-action-600">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={170}>
          <h3 className="stamp mt-12 border-b border-line pb-3">Included either way</h3>
          <ul>
            {supply.included.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-4 border-b border-line py-4 text-[1.05rem] text-[#cfcdc7]"
              >
                <span aria-hidden className="text-action-600">
                  +
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Turnaround as a stamped readout rather than a sentence. */}
        <Reveal delay={190}>
          <div className="mt-12 flex flex-wrap items-baseline gap-x-5 gap-y-2 border border-line px-6 py-5">
            <span className="stamp">Turnaround</span>
            <span className="tnum text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em] text-action-500">
              {supply.turnaround.value}
            </span>
            <span className="stamp text-[#f3f1ec]">{supply.turnaround.unit}</span>
            <span className="stamp ml-auto">{supply.turnaround.label}</span>
          </div>
        </Reveal>
      </Section>
    ),

    /* A genuine sequence, so it is genuinely numbered. */
    section4: (
      <Section tone="tint" rules>
        <Reveal>
          <SectionHead
            label="The process"
            title="Parts in, bus out"
            align="split"
            intro="Five stages, in order. Nothing moves to the next stage until the one before it passes."
          />
        </Reveal>

        <ol className="mt-14 border-t border-line">
          {process.map((step, index) => (
            <Reveal key={step.title} delay={index * 60}>
              <li className="grid gap-3 border-b border-line py-7 md:grid-cols-[6rem_minmax(0,22rem)_1fr] md:gap-8">
                <span className="stamp tnum pt-1 text-action-600">{sequence(index)}</span>
                <h3 className="text-[1.25rem] leading-tight">{step.title}</h3>
                <p className="max-w-[58ch] text-fg">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>
    ),

    section5: (
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHead label={quality.label} title={quality.title} intro={quality.body} />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <div className="grid gap-px bg-line">
              {quality.points.map((point, index) => (
                <Reveal key={point.title} delay={index * 70}>
                  <div className="bg-paper p-7">
                    <h3 className="text-[1.15rem] leading-tight">{point.title}</h3>
                    <p className="mt-3 max-w-[58ch] text-fg">{point.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>
    ),

    section6: (
      <Section tone="ink" space="loose">
        <Reveal>
          <SectionHead label={buyerMeaning.label} title={buyerMeaning.title} size="lg" />
        </Reveal>
        <ul className="mt-12 grid gap-px bg-[#f3f1ec]/20 md:grid-cols-2">
          {buyerMeaning.points.map((point, index) => (
            <Reveal key={point} delay={index * 70}>
              <li className="h-full bg-[#111110] p-7">
                <span className="stamp tnum text-action-600">{sequence(index)}</span>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-[#cfcdc7]">{point}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>
    ),

    section7: (
      <Section tone="tint">
        <Reveal>
          <SectionHead
            label="Everything we do"
            title="Four services, no padding"
            align="split"
            intro="Coupling, attachment and joining are the technical core. Importation and clearing get the parts here, and the last two are how a finished vehicle reaches its owner."
          />
        </Reveal>
        <div className="mt-12 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {catalogue.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <div className="h-full bg-highlight p-7">
                <h3 className="text-[1.2rem] leading-tight">{item.title}</h3>
                <p className="mt-3 text-fg">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    section8: (
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead label="Questions" title="About the build" />
          </div>
          <div className="lg:col-span-7">
            <FaqList faqs={faqs} />
          </div>
        </div>
      </Section>
    ),

    section9: (
      <Section tone="ink" space="tight">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="stamp">Start a build</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)]">
              Tell us what the bus has to do
            </h2>
            <p className="mt-4 max-w-[52ch] text-[#cfcdc7]">
              Route, load and seat count are enough to start the conversation. We will tell you
              what we can build and what it will take.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a
              href={whatsappAssembly}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
            >
              Enquire on WhatsApp
            </a>
            <Link
              href="/wholesale"
              data-cta
              data-cta-section="services_footer"
              className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
            >
              Wholesale orders
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
          __html: JSON.stringify([breadcrumbSchema(crumbs), serviceSchema, faqSchema(faqs)]),
        }}
      />

      {sectionsFor("services").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
