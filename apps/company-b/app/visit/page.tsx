import type { Metadata } from "next";
import { MapPin, Clock, Phone } from "lucide-react";
import { Reveal } from "@repo/ui/reveal";
import { site } from "@/content/site";
import { Section, Eyebrow } from "@/components/section";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Visit us",
  description:
    "Find GG FOODS at 13 Femi Killa Street, Ago Palace, Okota, Lagos. Open daily 10am to 10pm. Call, message on WhatsApp, or send an inquiry.",
  alternates: { canonical: "/visit" },
};

export default function VisitPage() {
  return (
    <Section
      tone="paper"
      space="tight"
      atmosphere
      backdrop={{ src: "/images/backdrops/interior.jpg", video: "/videos/interior.mp4" }}
    >
      <Reveal>
        <Eyebrow>Visit us</Eyebrow>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="mt-4 max-w-[18ch] text-[clamp(2.25rem,4vw+0.5rem,3.5rem)] font-semibold">
          Come hungry. Leave planning your next visit.
        </h1>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div className="space-y-8">
          {/* Map slot: swap this panel for a Google Maps embed when ready
              (frame-src for google.com is already allowed in the CSP). */}
          <Reveal>
            <a
              href={site.address.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open our location in Google Maps"
              className="group relative block aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)] border border-line bg-highlight shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-1 hover:shadow-glow"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.14]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(245,237,224,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,237,224,0.5) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-action-500 text-white shadow-glow">
                    <MapPin aria-hidden size={24} />
                  </span>
                  <p className="mt-4 font-display text-lg font-semibold text-heading">
                    Open in Google Maps
                  </p>
                  <p className="mt-1 text-sm text-muted">{site.address.full}</p>
                </div>
              </div>
            </a>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
                <Clock aria-hidden size={20} className="text-action-300" />
                <h2 className="mt-4 font-display text-lg font-semibold text-heading">
                  Opening hours
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {site.hours.display}
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
                <Phone aria-hidden size={20} className="text-action-300" />
                <h2 className="mt-4 font-display text-lg font-semibold text-heading">
                  Call or WhatsApp
                </h2>
                <p className="mt-2 text-sm text-muted">
                  <a href={site.phone.tel} className="hover:text-heading">
                    {site.phone.label}
                  </a>
                </p>
                <p className="mt-1 text-sm text-muted">
                  <a
                    href={site.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-action-300 hover:text-action-200"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div>
          <Reveal delay={120}>
            <div>
              <h2 className="font-display text-xl font-semibold text-heading">
                Send an inquiry
              </h2>
              <p className="mt-2 mb-6 text-sm leading-relaxed text-muted">
                Events, bulk orders or feedback. We reply within a business day.
              </p>
              <InquiryForm />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
