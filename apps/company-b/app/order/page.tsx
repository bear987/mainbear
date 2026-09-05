import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { Reveal } from "@repo/ui/reveal";
import { site } from "@/content/site";
import { Section, Eyebrow } from "@/components/section";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Order from GG FOODS in Okota, Lagos: call the kitchen or send your order on WhatsApp. Online ordering and delivery are coming soon.",
  alternates: { canonical: "/order" },
};

// v1 ordering: two direct paths. Structured so a real ordering flow
// (cart, checkout, delivery) can replace this page later without redesign.
const steps = [
  {
    title: "Pick from the menu",
    body: "Browse the menu and note the dishes you want, plus how spicy you like it.",
  },
  {
    title: "Call or message us",
    body: "Phone the kitchen or send your list on WhatsApp. We confirm price and timing on the spot.",
  },
  {
    title: "Pick up hot",
    body: "Your order is cooked fresh and ready for pickup at the restaurant. Delivery options are coming.",
  },
];
import { sectionsFor } from "@/lib/layout";

export default function OrderPage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in
     the admin, not here. */
  const sections: Record<string, ReactNode> = {
    section1: (
      <Section
        tone="paper"
        space="tight"
        atmosphere
        backdrop={{ src: "/images/backdrops/order-hero.jpg" }}
      >
        <Reveal>
          <Eyebrow>Order</Eyebrow>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-[18ch] text-[clamp(2.25rem,4vw+0.5rem,3.5rem)] font-semibold">
            Order in two taps.
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-muted">
            No apps, no accounts. Call us or message on WhatsApp and your food
            starts cooking.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <Reveal>
            <a
              href={site.phone.tel}
              className="group flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-surface p-8 shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-1 hover:border-line-strong hover:shadow-glow"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-action-500/15 text-action-300">
                <Phone aria-hidden size={22} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-heading">
                Call the kitchen
              </h2>
              <p className="mt-2 flex-1 leading-relaxed text-muted">
                Fastest for short orders. Speak to us directly and confirm timing.
              </p>
              <span className="mt-6 font-display text-xl text-action-300 tnum">
                {site.phone.label}
              </span>
            </a>
          </Reveal>
          <Reveal delay={100}>
            <a
              href={site.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col rounded-[var(--radius-xl)] border border-line bg-surface p-8 shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-1 hover:border-line-strong hover:shadow-glow"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-action-500/15 text-action-300">
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.9 1.3-.5.1-1.1.2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4.1.1.1.6-.2 1.1z" />
                </svg>
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-heading">
                Order on WhatsApp
              </h2>
              <p className="mt-2 flex-1 leading-relaxed text-muted">
                Best for longer orders. Send your list, we reply with total and
                pickup time.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-medium text-action-300">
                Start a chat
                <ArrowRight aria-hidden size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </a>
          </Reveal>
        </div>
      </Section>
    ),

    /* real sequence, so numbered */
    section2: (
      <Section tone="surface" space="tight">
        <h2 className="text-2xl font-semibold sm:text-3xl">How it works</h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <li className="h-full rounded-[var(--radius-lg)] border border-line bg-paper p-6 shadow-card">
                <span className="font-display text-sm font-semibold text-action-300 tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold text-heading">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mt-8 max-w-[62ch] text-sm leading-relaxed text-muted">
          Online ordering and nationwide delivery are on our roadmap. For now,
          every order goes person to person, which also means you can ask for
          exactly what you want.{" "}
          <Link href="/menu" className="font-medium text-action-300 hover:text-action-200">
            Browse the menu
          </Link>{" "}
          before you call.
        </p>
      </Section>
    ),
  };

  return (
    <>
      {sectionsFor("order").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
