import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { home } from "@/content/home";
import { companies } from "@/content/companies";
import { site } from "@/content/site";
import { Container } from "@/components/container";
import { Section, Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaButton } from "@/components/cta-button";
import { HeroMedia } from "@/components/hero-media";
import { PhotoDuo } from "@/components/photo-duo";
import { TradeMarquee } from "@/components/trade-marquee";
import { Stat } from "@/components/stat";
import { CompanyCard } from "@/components/company-card";
import { Icon, type IconName } from "@/components/icon";

export const metadata: Metadata = buildMetadata({
  title: "operating group in global trade",
  description:
    "GG BEARERS is a Lagos-based operating group: import/export, partnerships, investment and corporate services, and parent of GG FOODS and GG AUTOS.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      {/* HERO, cinematic band (stays dark in light mode) */}
      <section className="force-dark relative isolate overflow-hidden">
        <HeroMedia />
        {/* Tighter vertical padding on phones: the statement adds ~7 lines
            there, and without this the primary CTA falls below the fold. */}
        <Container className="relative grid min-h-[clamp(32rem,82dvh,46rem)] grid-cols-1 items-center gap-12 py-8 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-heading backdrop-blur-sm">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-action-400" />
                {home.hero.eyebrow}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 max-w-[22ch] text-[clamp(2.5rem,4vw+1rem,4.1rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-heading">
                {home.hero.title}
              </h1>
            </Reveal>
            {/* Company statement. Display font at a size between the headline
                and the lede, on a brighter step of the ink scale, so the hero
                reads as three tiers rather than two grey paragraphs. */}
            <Reveal delay={140}>
              <p className="mt-4 max-w-[46ch] font-display text-[clamp(1.25rem,0.6vw+1.1rem,1.55rem)] font-normal leading-[1.45] tracking-[-0.01em] text-ink-100 sm:mt-6 sm:leading-[1.5]">
                <span className="font-medium text-heading">{home.hero.standfirst.lead}</span>
                {home.hero.standfirst.body}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-ink-200 sm:text-lg">
                {home.hero.lede}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-9">
                <CtaButton
                  href={home.hero.primary.href}
                  variant="primary"
                  size="lg"
                  trailing="ArrowRight"
                >
                  {home.hero.primary.label}
                </CtaButton>
                <CtaButton
                  href={home.hero.secondary.href}
                  variant="ghost"
                  size="lg"
                  className="border border-line-strong text-heading hover:-translate-y-0.5 hover:border-line-strong hover:bg-elevated"
                >
                  {home.hero.secondary.label}
                </CtaButton>
              </div>
            </Reveal>
          </div>

          {/* offset glass card */}
          <div className="lg:col-span-5">
            <Reveal delay={320}>
              <div className="ml-auto max-w-sm rounded-[var(--radius-xl)] border border-line bg-elevated p-7 shadow-glow backdrop-blur-md">
                <p className="font-display text-xl font-medium leading-snug text-heading">
                  “{site.motto}.”
                </p>
                <p className="mt-3 text-sm text-ink-200">
                  The standard every shipment, partnership and hire is held to.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {companies.map((c) => (
                    <span
                      key={c.id}
                      className="rounded-full border border-line-strong px-3 py-1 text-xs font-medium text-heading"
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* CAPABILITIES TICKER */}
      <TradeMarquee />

      {/* TRUST BAR */}
      <Section tone="surface" space="tight" className="border-b border-line">
        <dl className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          {home.stats.map((stat, i) => (
            <Stat key={stat.label} stat={stat} delay={i * 110} />
          ))}
        </dl>
      </Section>

      {/* WHAT WE DO */}
      <Section tone="paper" globe>
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{home.whatWeDo.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              {home.whatWeDo.title}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {home.whatWeDo.lede}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {home.whatWeDo.areas.map((area, i) => (
            <Reveal key={area.name} delay={i * 80}>
              <a
                href={area.href}
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="grid h-11 w-11 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name={area.icon as IconName} size={22} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-heading">
                  {area.name}
                </h3>
                <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted">
                  {area.summary}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-action-300">
                  Learn more
                  <Icon
                    name="ArrowRight"
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* OUR COMPANIES */}
      {/* ONE continuous photo region: the port photo dissolves into the sea
          photo across both bands, so no seam can exist between them. */}
      <div className="force-dark relative isolate">
      <PhotoDuo from="/images/home-port.jpg" to="/images/home-sea.jpg" />
      <Section tone="none" id="companies" space="tight">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>{home.companies.eyebrow}</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              {home.companies.title}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {home.companies.lede}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {companies.map((company, i) => (
            <Reveal key={company.id} delay={i * 90}>
              <CompanyCard company={company} />
            </Reveal>
          ))}
        </div>

        <div className="mt-8">
          <CtaButton href="/companies" variant="ghost" trailing="ArrowRight">
            More about the group structure
          </CtaButton>
        </div>
      </Section>

      {/* CLOSING CTA */}
      <Section tone="none" space="tight">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h2 className="text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold text-heading">
              {home.closing.title}
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-5 text-lg leading-relaxed text-ink-200">
              {home.closing.lede}
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-9 flex justify-center">
              <CtaButton
                href={home.closing.primary.href}
                variant="primary"
                size="lg"
                trailing="ArrowRight"
              >
                {home.closing.primary.label}
              </CtaButton>
            </div>
          </Reveal>
        </div>
      </Section>
      </div>
    </>
  );
}
