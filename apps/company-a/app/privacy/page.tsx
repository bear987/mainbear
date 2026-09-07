import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { privacy } from "@/content/privacy";
import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = buildMetadata({
  title: "Privacy policy",
  description:
    "What GG BEARERS does with your information when you use this site, in plain words. No tracking cookies, no advertising, no selling your details.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={privacy.title}
        lede={privacy.intro}
        breadcrumb={[{ name: "Privacy policy", path: "/privacy" }]}
      />

      <Section tone="paper">
        <div className="max-w-[68ch]">
          <p className="text-sm text-muted">Last updated {privacy.updated}.</p>

          {privacy.sections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 40}>
              <section className="mt-12 first:mt-10">
                <h2 className="text-xl font-semibold text-heading sm:text-2xl">
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
            <section className="mt-12 rounded-[var(--radius-lg)] border border-line bg-surface p-6">
              <h2 className="text-lg font-semibold text-heading">{privacy.contactHeading}</h2>
              <p className="mt-3 leading-relaxed text-muted">{privacy.contactBody}</p>
            </section>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
