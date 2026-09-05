import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { companies } from "@/content/companies";
import { Section, Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { PageHeader } from "@/components/page-header";
import { TeamCard } from "@/components/team-card";
import { CtaButton } from "@/components/cta-button";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "The GG BEARERS story, a Lagos trade group built on integrity, running its own services and parent to GG FOODS and GG AUTOS. Vision, values and leadership.",
  path: "/about",
});
import { sectionsFor } from "@/lib/layout";

export default function AboutPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        lede={about.hero.lede}
        breadcrumb={[{ name: "About", path: "/about" }]}
        backdrop={{ src: "/images/header-about.jpg" }}
      />
    ),

    /* STORY + VISION */
    section2: (
      <Section
        tone="paper"
        backdrop={{ src: "/images/about-story.jpg", fadeTop: true, fadeBottom: true }}
      >
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
                {about.story.title}
              </h2>
            </Reveal>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-fg">
              {about.story.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 70}>
                  <p className="max-w-[65ch]">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120}>
            <aside className="rounded-[var(--radius-xl)] border border-line bg-highlight/40 p-7">
              <Eyebrow>{about.vision.title}</Eyebrow>
              <p className="mt-4 font-display text-xl leading-snug text-heading">
                {about.vision.body}
              </p>
              <p className="mt-6 border-t border-line pt-5 text-sm text-muted">
                “{site.motto}.”
              </p>
            </aside>
          </Reveal>
        </div>
      </Section>
    ),

    /* VALUES */
    section3: (
      <Section tone="tint">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>What we hold to</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              Values with evidence behind them
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {about.values.map((value, i) => (
            <Reveal key={value.title} delay={i * 80}>
              <div className="h-full rounded-[var(--radius-lg)] border border-line bg-surface p-7 shadow-card">
                <h3 className="font-display text-lg font-semibold text-heading">
                  {value.title}
                </h3>
                <p className="mt-2 leading-relaxed text-muted">{value.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    /* MILESTONES, a real sequence, so numbered */
    section4: (
      <Section tone="paper">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>How we got here</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              From a trade desk to an operating group
            </h2>
          </Reveal>
        </div>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {about.milestones.map((m, i) => (
            <li key={m.phase} className="bg-surface p-7">
              <span className="font-display text-sm font-semibold tabular-nums text-action-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold text-heading">
                {m.phase}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{m.body}</p>
            </li>
          ))}
        </ol>
      </Section>
    ),

    /* LEADERSHIP */
    section5: (
      <Section tone="tint">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Leadership</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              {about.leadership.title}
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {about.leadership.lede}
            </p>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.leadership.roles.map((leader, i) => (
            <Reveal key={leader.role} delay={i * 70}>
              <TeamCard leader={leader} />
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    /* CTA */
    section6: (
      <Section tone="ink" space="tight">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-heading sm:text-3xl">
              Two companies carry the same standard.
            </h2>
            <p className="mt-2 text-ink-200">
              Meet {companies.map((c) => c.name).join(" and ")}, or start a
              conversation with the group.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton href="/companies" variant="primary" trailing="ArrowRight">
              Our companies
            </CtaButton>
            <CtaButton
              href="/contact"
              variant="ghost"
              className="border border-line-strong text-heading hover:-translate-y-0.5 hover:border-line-strong hover:bg-elevated"
            >
              Get in touch
            </CtaButton>
          </div>
        </div>
      </Section>
    ),
  };

  return (
    <>
      {sectionsFor("about").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
