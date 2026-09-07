import type { Metadata } from "next";
import { Reveal } from "@repo/ui/reveal";
import { privacy } from "@/content/privacy";
import { site } from "@/content/site";
import { Section, Eyebrow } from "@/components/section";
import { DrawnUnderline } from "@/components/drawn-underline";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What GG FOODS does with your information when you use this site, in plain words. No tracking cookies, no advertising, no selling your details.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Section tone="paper">
        <Reveal>
          <Eyebrow>Legal</Eyebrow>
        </Reveal>
        <Reveal delay={90}>
          <div>
            <h1 className="mt-5 text-[clamp(2.25rem,4vw+1rem,3.5rem)] font-semibold leading-[1.06] text-heading">
              {privacy.title}
            </h1>
            <DrawnUnderline className="w-40" />
          </div>
        </Reveal>
        <Reveal delay={180}>
          <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-fg">{privacy.intro}</p>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-3 text-sm text-muted">Last updated {privacy.updated}.</p>
        </Reveal>
      </Section>

      <Section tone="paper" space="tight">
        <div className="max-w-[68ch]">
          {privacy.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 40}>
              <section className="mt-12 first:mt-0">
                <h2 className="font-display text-xl font-semibold text-heading sm:text-2xl">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-muted">
                    {paragraph}
                  </p>
                ))}
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section className="mt-12 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-heading">
                {privacy.contactHeading}
              </h2>
              <p className="mt-3 leading-relaxed text-muted">{privacy.contactBody}</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 inline-block text-sm font-medium text-action-300 hover:text-action-200"
              >
                {site.email}
              </a>
            </section>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
