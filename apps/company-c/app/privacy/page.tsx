import type { Metadata } from "next";
import { PageHeader } from "../../components/page-header";
import { Section } from "../../components/section";
import { privacy } from "../../content/privacy";
import { contact, site } from "../../content/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What GG Autos does with your information when you use this site, in plain words. No tracking cookies, no advertising, no selling your details.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: `Privacy policy, ${site.name}`,
    description: "What we do with your information, in plain words.",
    url: `${site.url}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        label="Legal"
        title={privacy.title}
        intro={privacy.intro}
        crumbs={[{ label: "Privacy policy", href: "/privacy" }]}
      />

      <Section>
        <div className="max-w-[68ch]">
          <p className="stamp">Last updated {privacy.updated}</p>

          {privacy.sections.map((section) => (
            <section key={section.heading} className="mt-12 first:mt-8">
              <h2 className="text-[clamp(1.25rem,2vw,1.75rem)]">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-fg">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-12 border-2 border-ink p-6">
            <h2 className="text-[clamp(1.15rem,2vw,1.5rem)]">{privacy.contactHeading}</h2>
            <p className="mt-3 leading-relaxed text-fg">{privacy.contactBody}</p>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 inline-block text-sm font-medium text-action-600 underline"
            >
              {contact.email}
            </a>
          </section>
        </div>
      </Section>
    </>
  );
}
