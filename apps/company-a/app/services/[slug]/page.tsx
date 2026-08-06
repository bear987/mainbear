import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { services, getService } from "@/content/services";
import { serviceSchema, faqSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Section, Eyebrow } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CtaButton } from "@/components/cta-button";
import { Icon, type IconName } from "@/components/icon";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return buildMetadata({
    title: service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const path = `/services/${service.slug}`;
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <JsonLd data={serviceSchema({ name: service.name, description: service.summary, path })} />
      <JsonLd data={faqSchema(service.faqs.map((f) => ({ q: f.q, a: f.a })))} />

      <PageHeader
        eyebrow="Service"
        title={service.name}
        lede={service.intro}
        breadcrumb={[
          { name: "Services", path: "/services" },
          { name: service.name, path },
        ]}
      />

      {/* WHAT IT COVERS + BENEFITS */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
                What it covers
              </h2>
            </Reveal>
            <ul className="mt-8 space-y-5">
              {service.what.map((item, i) => (
                <Reveal key={i} delay={i * 70}>
                  <li className="flex gap-4">
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-highlight text-action-300">
                      <Icon name="Check" size={15} />
                    </span>
                    <p className="text-lg leading-relaxed text-fg">{item}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={120}>
            <aside className="rounded-[var(--radius-xl)] border border-line bg-highlight/40 p-7">
              <Eyebrow>Why it works</Eyebrow>
              <ul className="mt-5 space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="flex gap-3 text-heading">
                    <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-action-300" />
                    <span className="leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </Section>

      {/* HOW IT WORKS, real sequence, numbered */}
      <Section tone="tint">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>How it works</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
              A clear path from first call to delivery
            </h2>
          </Reveal>
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {service.how.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="h-full rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
                <span className="font-display text-sm font-semibold tabular-nums text-action-300">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-heading">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
              {service.name}, answered
            </h2>
            <p className="mt-4 text-muted">
              Still unsure?{" "}
              <Link
                href={`/contact?subject=${service.cta.subject}`}
                className="font-medium text-action-300 hover:text-action-200"
              >
                Ask us directly
              </Link>
              .
            </p>
          </div>
          <div>
            {service.faqs.map((faq) => (
              <details key={faq.q} className="group border-b border-line py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-heading">
                  {faq.q}
                  <span
                    aria-hidden
                    className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-line text-action-300 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-[62ch] leading-relaxed text-muted">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* RELATED */}
      <Section tone="tint" space="tight">
        <h2 className="text-xl font-semibold text-heading">Other services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {others.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name={s.icon as IconName} size={22} />
                </span>
                <span>
                  <span className="block font-display font-semibold text-heading">
                    {s.name}
                  </span>
                  <span className="block text-sm text-muted">{s.tagline}</span>
                </span>
              </span>
              <Icon
                name="ArrowRight"
                size={18}
                className="shrink-0 text-action-300 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section tone="ink" space="loose" globe>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold text-heading">
            {service.tagline}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">
            Start the conversation and we'll route your {service.name.toLowerCase()}{" "}
            enquiry to the right person.
          </p>
          <div className="mt-9 flex justify-center">
            <CtaButton
              href={`/contact?subject=${service.cta.subject}`}
              variant="primary"
              size="lg"
              trailing="ArrowRight"
            >
              {service.cta.label}
            </CtaButton>
          </div>
        </div>
      </Section>
    </>
  );
}
