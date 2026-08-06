import type { Metadata } from "next";
import { Reveal } from "@repo/ui/reveal";
import { CtaButton } from "@repo/ui/cta-button";
import { site } from "@/content/site";
import { about } from "@/content/about";
import { Section, Eyebrow } from "@/components/section";
import { DrawnUnderline } from "@/components/drawn-underline";

export const metadata: Metadata = {
  title: "About",
  description:
    "The GG FOODS story: one Lagos kitchen cooking Nigerian classics and intercontinental dishes with the same seriousness. Part of the GG BEARERS group.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <Section
        tone="paper"
        space="tight"
        atmosphere
        backdrop={{ src: "/images/backdrops/about.jpg", video: "/videos/about.mp4" }}
      >
        <Reveal>
          <Eyebrow>{about.hero.eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(2.25rem,4vw+0.5rem,3.5rem)] font-semibold">
            {about.hero.title}
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-muted">
            {about.hero.lede}
          </p>
        </Reveal>

        <div className="mt-10 max-w-[65ch] space-y-5 text-lg leading-relaxed text-fg">
          {about.story.map((p, i) => (
            <Reveal key={i} delay={i * 70}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        tone="surface"
        space="tight"
        backdrop={{ src: "/images/backdrops/kitchen.jpg", video: "/videos/kitchen.mp4" }}
      >
        <Reveal>
          <div>
            <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
              {about.kitchen.title}
            </h2>
            <DrawnUnderline className="w-36" />
            <p className="mt-4 max-w-[58ch] leading-relaxed text-muted">
              {about.kitchen.lede} Roles are shown while we finalise team
              profiles, real names and photos will replace these.
            </p>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {about.kitchen.roles.map((r, i) => (
            <Reveal key={r.role} delay={i * 80}>
              <div className="h-full rounded-[var(--radius-lg)] border border-line bg-paper p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-heading">{r.role}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{r.focus}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="paper" space="tight">
        <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
          What makes the food special
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 80}>
              <div className="h-full rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold text-heading">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="ember" space="tight" atmosphere>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              {site.parent.label}.
            </h2>
            <p className="mt-2 max-w-prose text-muted">
              GG FOODS is one of the operating companies of GG BEARERS, the same
              integrity standard runs through the whole group.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <CtaButton href={site.parent.url} variant="outline" trailing="ArrowUpRight">
              Visit {site.parent.name}
            </CtaButton>
            <CtaButton href="/menu" trailing="ArrowRight">
              See the menu
            </CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}
