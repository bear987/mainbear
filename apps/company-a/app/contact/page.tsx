import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/content/site";
import { contactCopy } from "@/content/contact";
import { localBusinessSchema } from "@/lib/jsonld";
import { JsonLd } from "@/components/json-ld";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { ContactForm } from "@/components/contact-form";
import { Icon } from "@/components/icon";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with GG BEARERS in Lagos. Routed enquiries for partnerships, investment, corporate services and careers. Call, email or send a message.",
  path: "/contact",
});
import { sectionsFor } from "@/lib/layout";

export default function ContactPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    header: (
      <PageHeader
        eyebrow={contactCopy.eyebrow}
        title={contactCopy.title}
        lede={contactCopy.lede}
        breadcrumb={[{ name: "Contact", path: "/contact" }]}
        backdrop={{ src: "/images/header-contact.jpg" }}
      />
    ),

    section2: (
      <Section tone="paper" globe>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="text-2xl font-semibold">Reach us directly</h2>
            <p className="mt-3 text-muted">{contactCopy.responseTime}.</p>

            <ul className="mt-8 space-y-6">
              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name="Phone" size={20} />
                </span>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted">
                    Phone
                  </h3>
                  <p className="mt-1 space-x-2">
                    {site.phones.map((p, i) => (
                      <span key={p.href}>
                        {i > 0 && <span className="text-muted">·</span>}{" "}
                        <a href={p.href} className="text-heading hover:text-action-300">
                          {p.label}
                        </a>
                      </span>
                    ))}
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name="Mail" size={20} />
                </span>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted">
                    Email
                  </h3>
                  <p className="mt-1">
                    <a
                      href={`mailto:${site.email}`}
                      className="text-heading hover:text-action-300"
                    >
                      {site.email}
                    </a>
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name="MapPin" size={20} />
                </span>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted">
                    Office
                  </h3>
                  <address className="mt-1 not-italic leading-relaxed text-heading">
                    {site.address.full}
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-action-300 hover:text-action-200"
                  >
                    Open in Google Maps
                    <Icon name="ArrowUpRight" size={15} />
                  </a>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-highlight text-action-300">
                  <Icon name="Clock" size={20} />
                </span>
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wide text-muted">
                    Office hours
                  </h3>
                  <p className="mt-1 text-heading">{site.hours}</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-line">
              <iframe
                title={`Map showing ${site.name} office location`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.address.full)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full"
              />
            </div>
          </div>

          {/* Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </Section>
    ),
  };

  return (
    <>
      <JsonLd data={localBusinessSchema()} />

      {sectionsFor("contact").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
