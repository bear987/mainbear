import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { site } from "@/content/site";
import { Section } from "@/components/section";
import { CtaButton } from "@/components/cta-button";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Message received",
    description: "Thanks for contacting GG BEARERS. We'll be in touch shortly.",
    path: "/contact/thank-you",
  }),
  robots: { index: false, follow: true },
};

export default function ThankYouPage() {
  return (
    <Section tone="paper" space="loose" globe>
      <div className="mx-auto max-w-xl text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-highlight text-action-300">
          <Icon name="Check" size={30} />
        </span>
        <h1 className="mt-8 text-[clamp(2rem,3vw+1rem,3rem)] font-semibold">
          Thank you, your message is on its way.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          We've received your enquiry and routed it to the right team. You can
          expect a reply within two business days. If it's urgent, call us on{" "}
          <a href={site.phones[0]?.href} className="text-action-300 hover:text-action-200">
            {site.phones[0]?.label}
          </a>
          .
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <CtaButton href="/" variant="dark">
            Back to home
          </CtaButton>
          <CtaButton href="/companies" variant="outline">
            Explore our companies
          </CtaButton>
        </div>
      </div>
    </Section>
  );
}
