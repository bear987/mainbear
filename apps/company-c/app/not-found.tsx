import Link from "next/link";
import { Container } from "@repo/ui/container";
import { contact, navLinks, site } from "../content/site";
import { whatsappGeneral } from "../lib/contact";

export default function NotFound() {
  return (
    <div className="on-ink relative overflow-hidden pb-24 pt-[calc(var(--header-h)+5rem)]">
      <div
        aria-hidden
        className="grid-rules pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
      />
      <Container className="relative">
        <p className="stamp border-l-2 border-action-500 pl-3">Error 404 / Page not found</p>

        <h1 className="tnum mt-8 text-[clamp(4rem,18vw,12rem)] leading-[0.85] text-action-500">
          404
        </h1>

        <p className="mt-6 max-w-[48ch] text-[1.05rem] leading-relaxed">
          That page is not here. A unit that has been sold gets taken down, and the address may
          have changed since you saved it. Everything still on the yard is one link away.
        </p>

        <nav aria-label="Site" className="mt-12 border-t border-line">
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
            {navLinks.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-4 py-4 pr-2 transition-colors duration-150 hover:text-heading"
                >
                  <span className="text-lg">{link.label}</span>
                  <span
                    aria-hidden
                    className="text-action-600 transition-transform duration-150 ease-[var(--ease-quint)] group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/inventory"
            data-cta
            data-cta-section="not_found"
            className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
          >
            See every bus
          </Link>
          <a
            href={whatsappGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
          >
            Ask us what you were looking for
          </a>
        </div>

        <p className="stamp mt-16 border-t border-line pt-3">
          {site.name} / {contact.address.area}, {contact.address.city} / {site.coordinates}
        </p>
      </Container>
    </div>
  );
}
