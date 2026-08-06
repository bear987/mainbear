"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@repo/ui/container";
import { contact, site } from "../content/site";
import { whatsappGeneral } from "../lib/contact";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="on-ink relative overflow-hidden pb-24 pt-[calc(var(--header-h)+5rem)]">
      <div
        aria-hidden
        className="grid-rules pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
      />
      <Container className="relative">
        <p className="stamp border-l-2 border-action-500 pl-3">Error 500 / Something broke</p>

        <h1 className="mt-8 max-w-[16ch] text-[clamp(2.4rem,7vw,5rem)] leading-[0.95]">
          That is on us, not on you
        </h1>

        <p className="mt-6 max-w-[50ch] text-[1.05rem] leading-relaxed">
          Something on our side failed while loading this page. Try it again, and if it keeps
          happening, call the yard. We would rather answer the phone than lose the enquiry.
        </p>

        {error.digest && (
          <p className="stamp mt-6 border border-line px-3 py-2">Reference {error.digest}</p>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
          >
            Try again
          </button>
          <a
            href={contact.phoneHref}
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
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
            href="/"
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
          >
            Back to home
          </Link>
        </div>

        <p className="stamp mt-16 border-t border-line pt-3">
          {site.name} / {site.coordinates}
        </p>
      </Container>
    </div>
  );
}
