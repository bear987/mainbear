import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { EnquiryForm } from "../../components/enquiry-form";
import { PageHeader, breadcrumbSchema } from "../../components/page-header";
import { Section, SectionHead } from "../../components/section";
import { contact, site } from "../../content/site";
import { whatsappGeneral } from "../../lib/contact";

export const metadata: Metadata = {
  title: "Contact GG Autos, Okota Lagos",
  description:
    "Call, WhatsApp or visit GG Autos in Okota, Lagos to ask about a mini bus. Address, opening hours and a direct enquiry form. We reply the same working day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact ${site.name}, Okota Lagos`,
    description: "Call, WhatsApp or visit the yard in Okota, Lagos.",
    url: `${site.url}/contact`,
  },
};

const crumbs = [{ label: "Contact", href: "/contact" }];

export default function ContactPage() {
  const openDays = contact.hours.filter((slot) => slot.opens !== null);
  const mapQuery = encodeURIComponent(contact.address.full);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(crumbs)) }}
      />

      <PageHeader
        label="Contact"
        title="Come to the yard"
        crumbs={crumbs}
        intro="The fastest answer is a phone call or a WhatsApp message. Use the form if you would rather write it out, and we will come back to you with the units that fit."
      />

      {/* Contact routes come first. Nothing is hidden behind the form. */}
      <Section space="normal">
        <div className="grid gap-px bg-line lg:grid-cols-3">
          <div className="bg-surface p-7">
            <span className="stamp text-action-600">Call</span>
            <h2 className="mt-3 text-[1.35rem]">Talk to us now</h2>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={contact.phoneHref}
                  className="tnum font-mono text-lg text-heading underline-offset-4 hover:underline"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={contact.phoneAltHref}
                  className="tnum font-mono text-lg text-heading underline-offset-4 hover:underline"
                >
                  {contact.phoneAltDisplay}
                </a>
              </li>
            </ul>
            <p className="stamp mt-4">{contact.responseTime}</p>
          </div>

          <div className="bg-surface p-7">
            <span className="stamp text-action-600">WhatsApp</span>
            <h2 className="mt-3 text-[1.35rem]">Send a message</h2>
            <p className="mt-4 text-fg">
              Ask about a specific unit, send a photo of what you are running now, or tell us
              your budget and we will send back what fits.
            </p>
            <a
              href={whatsappGeneral}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-block border border-ink bg-ink px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-all duration-150 ease-[var(--ease-quint)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-lift"
            >
              Open WhatsApp
            </a>
          </div>

          <div className="bg-surface p-7">
            <span className="stamp text-action-600">Email</span>
            <h2 className="mt-3 text-[1.35rem]">Write to us</h2>
            <a
              href={`mailto:${contact.email}`}
              className="mt-4 block break-all font-mono text-heading underline-offset-4 hover:underline"
            >
              {contact.email}
            </a>
            <p className="stamp mt-4">
              Shared with the GG Bearers group office. Mark wholesale enquiries in the subject
              line and they route straight through.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="tint">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead label="Visit" title="Where to find us" />

            <address className="mt-8 not-italic">
              <span className="block text-[1.15rem] leading-relaxed text-heading">
                {contact.address.street}
                <br />
                {contact.address.landmark}
                <br />
                {contact.address.area}, {contact.address.city}
                <br />
                {contact.address.country}
              </span>
            </address>

            <dl className="mt-8 border-t border-line">
              {openDays.map((slot) => (
                <div key={slot.days} className="flex justify-between border-b border-line py-3">
                  <dt className="stamp">{slot.days}</dt>
                  <dd className="tnum font-mono text-sm text-heading">
                    {slot.opens} to {slot.closes}
                  </dd>
                </div>
              ))}
              <div className="flex justify-between border-b border-line py-3">
                <dt className="stamp">Sunday</dt>
                <dd className="font-mono text-sm text-muted">Closed</dd>
              </div>
            </dl>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 border border-line px-6 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
            >
              <MapPin size={16} aria-hidden className="text-action-600" />
              Open in Google Maps
            </a>
          </div>

          <div className="lg:col-span-7">
            {/* Map slot. A live embed loads third-party JavaScript on every
                visit, so it stays a link until the owner asks for the embed. */}
            <div className="relative flex aspect-[4/3] items-center justify-center border border-line bg-elevated">
              <div aria-hidden className="grid-rules-fine absolute inset-0 opacity-60" />
              <div className="relative max-w-[34ch] px-6 text-center">
                <MapPin size={22} aria-hidden className="mx-auto text-action-600" />
                <p className="stamp mt-3">Map</p>
                <p className="mt-2 text-fg">{contact.address.full}</p>
                <p className="stamp mt-4 text-line-strong">
                  Use the Google Maps link for directions
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              label="Enquiry form"
              title="Send us the details"
              intro="Buying more than one unit? Use the wholesale form instead, so your enquiry reaches the right desk with the quantity attached."
            />
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
