import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@repo/ui/container";
import { contact, site } from "../../../content/site";
import { whatsappGeneral } from "../../../lib/contact";

export const metadata: Metadata = {
  title: "Enquiry received",
  description: "Your enquiry has reached GG Autos. Here is what happens next.",
  alternates: { canonical: "/contact/thank-you" },
  robots: { index: false, follow: true },
};

const next = [
  {
    title: "We read it the same working day",
    body: "Enquiries that arrive after hours are answered first thing the next working morning.",
  },
  {
    title: "We reply with what fits",
    body: "You get the models that match your budget and seating, with the specification and a real price against each one.",
  },
  {
    title: "You come and inspect",
    body: "Nothing is agreed until you have seen the bus on the yard in Okota, or sent someone you trust to see it.",
  },
];

export default function ThankYouPage() {
  return (
    <div className="on-ink relative overflow-hidden pb-24 pt-[calc(var(--header-h)+5rem)]">
      <div
        aria-hidden
        className="grid-rules pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
      />
      <Container className="relative">
        <p className="stamp border-l-2 border-action-500 pl-3">Enquiry received</p>

        <h1 className="mt-6 max-w-[16ch] text-[clamp(2.4rem,6.5vw,5rem)] leading-[0.95]">
          Got it. We will come back to you
        </h1>

        <p className="mt-6 max-w-[54ch] text-[1.05rem] leading-relaxed">
          {contact.responseTime} If it is urgent, call the yard directly instead of waiting on
          the reply.
        </p>

        <ol className="mt-14 grid gap-px bg-[#f3f1ec]/20 md:grid-cols-3">
          {next.map((step, index) => (
            <li key={step.title} className="bg-[#111110] p-7">
              <span className="stamp tnum text-action-600">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-4 text-[1.2rem] leading-tight">{step.title}</h2>
              <p className="mt-3 text-[#cfcdc7]">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href={contact.phoneHref}
            className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
          >
            Call {contact.phoneDisplay}
          </a>
          <a
            href={whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
          >
            Message us on WhatsApp
          </a>
          <Link
            href="/inventory"
            data-cta
            data-cta-section="thank_you"
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
          >
            Keep browsing buses
          </Link>
        </div>

        <p className="stamp mt-16 border-t border-line pt-3">
          {site.name} / {site.coordinates}
        </p>
      </Container>
    </div>
  );
}
