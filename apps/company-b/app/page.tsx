import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, Phone } from "lucide-react";
import { Reveal } from "@repo/ui/reveal";
import { CtaButton } from "@repo/ui/cta-button";
import { Container } from "@repo/ui/container";
import { sectionsFor } from "@/lib/layout";
import { site } from "@/content/site";
import { signatureDishes } from "@/content/menu";
import { Section, Eyebrow } from "@/components/section";
import { DrawnUnderline } from "@/components/drawn-underline";
import { DishCard } from "@/components/dish-card";
import { HeroVideo } from "@/components/hero-video";
import { EmberBackdrop } from "@/components/ember-backdrop";

export const metadata: Metadata = {
  title: { absolute: `${site.name}, intercontinental dishes and Nigerian meals in Okota, Lagos` },
  description:
    "Smoky party jollof, egusi with pounded yam, grilled salmon, fresh smoothies and more. Cooked fresh daily in Okota, Lagos. View the menu or order by call or WhatsApp.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  /* Which of these appear, and in what order, is content: see
     content/data/layout.json. Turning one off or moving it is done in the
     admin, not here. */
  const sections: Record<string, ReactNode> = {
    /* HERO — appetizing, address and hours visible without scrolling */
    hero: (
      <section className="relative isolate flex min-h-[min(92dvh,52rem)] flex-col overflow-hidden">
        <HeroVideo
          alt="A flaming wok of grilled beef and peppers cooking in the GG FOODS kitchen"
          className="absolute inset-0"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-paper via-paper/70 to-paper/35"
        />
        <EmberBackdrop variant="hero" />

        <Container className="relative z-[1] flex flex-1 flex-col items-start justify-center py-24">
          <Reveal>
            <Eyebrow>Okota, Lagos · Nigerian and intercontinental kitchen</Eyebrow>
          </Reveal>
          <Reveal delay={90}>
            <h1 className="mt-5 max-w-[16ch] text-[clamp(2.75rem,5vw+1rem,4.75rem)] font-semibold leading-[1.05] text-heading">
              {site.motto}.
            </h1>
          </Reveal>
          <Reveal delay={180}>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fg">
              {site.tagline} Fresh smoothies and natural fruit drinks, made in-house daily.
            </p>
          </Reveal>
          <Reveal delay={270}>
            <div className="mt-9 flex flex-wrap gap-3">
              <CtaButton href="/menu" size="lg" trailing="ArrowRight">
                View Menu
              </CtaButton>
              <CtaButton href="/order" variant="outline" size="lg">
                Order Now
              </CtaButton>
            </div>
          </Reveal>
        </Container>

        {/* location + hours strip, inside the hero viewport */}
        <div className="relative z-[1] border-t border-line bg-paper/70 backdrop-blur-sm">
          <Container className="flex flex-col gap-2 py-4 text-sm text-fg sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden size={15} className="text-action-300" />
              {site.address.full}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock aria-hidden size={15} className="text-action-300" />
              {site.hours.display}
            </span>
            <a href={site.phone.tel} className="inline-flex items-center gap-2 hover:text-heading">
              <Phone aria-hidden size={15} className="text-action-300" />
              {site.phone.label}
            </a>
          </Container>
        </div>
      </section>
    ),

    /* SIGNATURE DISHES */
    signatureDishes: (
      <Section tone="paper">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <div>
              <h2 className="text-[clamp(1.875rem,3vw+0.5rem,3rem)] font-semibold">
                Signature dishes
              </h2>
              <DrawnUnderline className="w-44" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <CtaButton href="/menu" variant="ghost" trailing="ArrowRight">
              See the full menu
            </CtaButton>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {signatureDishes().map((item, i) => (
            <Reveal key={item.slug} delay={i * 80}>
              <DishCard item={item} />
            </Reveal>
          ))}
        </div>
      </Section>
    ),

    /* ORDER TWO WAYS */
    orderTwoWays: (
      <Section
        tone="ember"
        space="tight"
        atmosphere
        backdrop={{ src: "/images/backdrops/order.jpg", video: "/videos/order.mp4" }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
                Hungry now? Order in two taps.
              </h2>
              <p className="mt-3 max-w-prose leading-relaxed text-muted">
                Call the kitchen or message us on WhatsApp and your food starts
                cooking. Online ordering and delivery are coming as we grow.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href={site.phone.tel}
                className="inline-flex items-center gap-2 rounded-full bg-action-500 px-6 py-3.5 font-medium text-white shadow-glow transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:bg-action-400 active:scale-[0.98]"
              >
                <Phone aria-hidden size={17} />
                Call {site.phone.label}
              </a>
              <a
                href={site.whatsapp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 font-medium text-heading transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface active:scale-[0.98]"
              >
                <svg aria-hidden width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.9 1.3-.5.1-1.1.2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 .9-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4.1.1.1.6-.2 1.1z" />
                </svg>
                Order on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    ),

    /* VISIT STRIP */
    visitStrip: (
      <Section
        tone="paper"
        space="tight"
        backdrop={{ src: "/images/backdrops/interior.jpg", video: "/videos/interior.mp4" }}
      >
        <div className="grid gap-8 sm:grid-cols-3">
          <Reveal>
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
              <MapPin aria-hidden size={20} className="text-action-300" />
              <h3 className="mt-4 font-display text-lg font-semibold text-heading">
                Find us
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{site.address.full}</p>
              <Link href="/visit" className="mt-4 inline-block text-sm font-medium text-action-300 hover:text-action-200">
                Directions and details
              </Link>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
              <Clock aria-hidden size={20} className="text-action-300" />
              <h3 className="mt-4 font-display text-lg font-semibold text-heading">
                Opening hours
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{site.hours.display}</p>
              <p className="mt-4 text-sm text-muted">Kitchen closes 9:30pm.</p>
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card">
              <Phone aria-hidden size={20} className="text-action-300" />
              <h3 className="mt-4 font-display text-lg font-semibold text-heading">
                Talk to us
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Orders, reservations or questions, one line for everything.
              </p>
              <a href={site.phone.tel} className="mt-4 inline-block text-sm font-medium text-action-300 hover:text-action-200">
                {site.phone.label}
              </a>
            </div>
          </Reveal>
        </div>
      </Section>
    ),
  };

  return (
    <>
      {sectionsFor("home").map((id) => (
        <Fragment key={id}>{sections[id]}</Fragment>
      ))}
    </>
  );
}
