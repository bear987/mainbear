import Link from "next/link";
import { Reveal } from "@repo/ui/reveal";
import { Container } from "@repo/ui/container";
import { Hero } from "../components/hero";
import { Ticker } from "../components/ticker";
import { Section, SectionHead, RegistrationMarks } from "../components/section";
import { ManifestTable } from "../components/manifest-table";
import { FaqList, faqSchema } from "../components/faq";
import { assembly, faqs, paths, trust } from "../content/home";
import { featuredVehicles } from "../content/vehicles";
import { contact } from "../content/site";
import { whatsappGeneral } from "../lib/contact";
import { sequence } from "../lib/format";

export default function HomePage() {
  const featured = featuredVehicles(4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(faqs)) }}
      />

      <Hero />
      <Ticker />

      {/* The differentiator leads, because it is the strongest thing a
          buyer can know about us. Type-led, no image. */}
      <Section rules space="loose">
        <Reveal>
          <SectionHead
            label={assembly.label}
            title={assembly.title}
            intro={assembly.body}
            align="split"
            size="xl"
          />
        </Reveal>

        <div className="mt-16 grid gap-px bg-line md:grid-cols-3">
          {assembly.points.map((point, index) => (
            <Reveal key={point.title} delay={index * 90}>
              <div className="h-full bg-paper p-7">
                <span className="stamp tnum text-action-600">{sequence(index)}</span>
                <h3 className="mt-4 text-[1.3rem] leading-tight">{point.title}</h3>
                <p className="mt-3 text-fg">{point.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <Link
            href={assembly.cta.href}
            data-cta
            data-cta-section="assembly"
            className="mt-10 inline-flex items-center gap-3 border-b-2 border-action-500 pb-1 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-transform duration-150 ease-[var(--ease-quint)] hover:translate-x-1"
          >
            {assembly.cta.label}
            <span aria-hidden className="text-action-600">
              &rarr;
            </span>
          </Link>
        </Reveal>
      </Section>

      {/* The manifest. The real range, on the homepage. */}
      <Section tone="tint">
        <Reveal>
          <SectionHead
            label="The range"
            title="What we supply"
            align="split"
            intro="Passenger and load-carrying bodies across every make we supply. Call the yard for a price on any of them."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12">
            <ManifestTable vehicles={featured} />
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/inventory"
              data-cta
              data-cta-section="manifest"
              className="border border-ink bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-all duration-150 ease-[var(--ease-quint)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift"
            >
              See the full range
            </Link>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-line px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
            >
              Ask about a model
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Two audiences, equal weight and equal space. */}
      <Section tone="ink" space="loose" bleed>
        <Container>
          <Reveal>
            <SectionHead label="Two ways to buy" title="One vehicle, or twenty" size="lg" />
          </Reveal>

          <div className="mt-14 grid gap-px bg-[#f3f1ec]/20 md:grid-cols-2">
            {paths.map((path, index) => (
              <Reveal key={path.key} delay={index * 100}>
                <div className="relative h-full bg-[#111110] p-8 sm:p-10">
                  <RegistrationMarks className="m-3" />
                  <span className="stamp">{path.label}</span>
                  <h3 className="mt-5 text-[clamp(2rem,4vw,3rem)]">{path.title}</h3>
                  <p className="mt-4 max-w-[42ch] text-[#cfcdc7]">{path.body}</p>
                  <Link
                    href={path.cta.href}
                    data-cta
                    data-cta-section={`path_${path.key}`}
                    className="mt-8 inline-flex items-center gap-3 border border-[#f3f1ec]/50 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
                  >
                    {path.cta.label}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trust, as a ledger rather than three centred icon cards. */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHead label={trust.label} title={trust.title} />
            </Reveal>

            <Reveal delay={120}>
              {/* Deliberately a labelled placeholder, not a fabricated quote. */}
              <figure className="mt-10 border border-dashed border-line-strong p-6">
                <span className="stamp text-action-600">Placeholder</span>
                <blockquote className="mt-3 text-[1.05rem] leading-relaxed text-muted">
                  [ADD A REAL CUSTOMER TESTIMONIAL, with the buyer name, their company or
                  route, and what they bought.]
                </blockquote>
              </figure>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="border-t border-line">
              {trust.points.map((point, index) => (
                <Reveal key={point.title} delay={index * 70}>
                  <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                    <dt className="stamp tnum pt-1">{sequence(index)}</dt>
                    <dd>
                      <h3 className="text-[1.15rem] leading-tight">{point.title}</h3>
                      <p className="mt-2 max-w-[58ch] text-fg">{point.body}</p>
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* Objections, then the ask. */}
      <Section tone="tint">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHead label="Before you call" title="Questions we get asked" />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <FaqList faqs={faqs} />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="ink" space="tight">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <span className="stamp">Talk to the yard</span>
            <h2 className="mt-4 text-[clamp(1.9rem,4vw,3.2rem)]">
              Tell us the load, we will tell you the vehicle
            </h2>
            <p className="mt-4 max-w-[52ch] text-[#cfcdc7]">{contact.responseTime}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <a
              href={contact.phoneHref}
              className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
            >
              Call {contact.phoneDisplay}
            </a>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
            >
              Enquire on WhatsApp
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
