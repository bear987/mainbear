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
} from "../../content/services";
import { contact, site } from "../../content/site";
import { whatsappAssembly } from "../../lib/contact";
import { sequence } from "../../lib/format";

export const metadata: Metadata = {
  title: "Mini Bus Coupling & Attachment in Lagos",
  description:
    "GG Autos couples and attaches mini buses in Okota, Lagos: component parts assembled into complete, road-tested passenger vehicles. See the process and talk to the builder.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: `Mini Bus Coupling & Attachment | ${site.name}`,
    description:
      "Component parts assembled into complete, road-tested mini buses on our own yard in Lagos.",
    url: `${site.url}/services`,
  },
};

const crumbs = [{ label: "Services", href: "/services" }];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Mini bus coupling and attachment",
  alternateName: ["Mini bus attachment", "Mini bus assembly"],
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

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema(crumbs), serviceSchema, faqSchema(faqs)]),
        }}
      />

      <PageHeader
        label={service.label}
        title={service.title}
        crumbs={crumbs}
        intro={service.standfirst}
      />

      {/* The proof sits high: footage of the work itself. */}
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

      {/* A genuine sequence, so it is genuinely numbered. */}
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

      <Section tone="tint">
        <Reveal>
          <SectionHead
            label="Everything we do"
            title="Three services, no padding"
            align="split"
            intro="Coupling is the technical core. The other two are how a finished bus reaches its owner."
          />
        </Reveal>
        <div className="mt-12 grid gap-px bg-line md:grid-cols-3">
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
    </>
  );
}
