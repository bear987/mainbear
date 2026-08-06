import type { Metadata } from "next";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Reveal } from "@repo/ui/reveal";
import { Container } from "@repo/ui/container";
import { site } from "@/content/site";
import { categories, byCategory } from "@/content/menu";
import { Section, Eyebrow } from "@/components/section";
import { DrawnUnderline } from "@/components/drawn-underline";
import { DishCard } from "@/components/dish-card";
import { EmberBackdrop } from "@/components/ember-backdrop";
import { PhotoBackdrop } from "@/components/photo-backdrop";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "The GG FOODS menu: Nigerian meals, intercontinental dishes, sides, fresh smoothies and natural drinks. Realistic Lagos prices in naira. Order by call or WhatsApp.",
  alternates: { canonical: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <header className="relative isolate overflow-hidden border-b border-line bg-paper pb-10 pt-16 sm:pb-14 sm:pt-20">
        <PhotoBackdrop src="/images/backdrops/menu-header.jpg" />
        <EmberBackdrop variant="hero" />
        <Container className="relative z-[1]">
          <Reveal>
            <Eyebrow>Our menu</Eyebrow>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 max-w-[20ch] text-[clamp(2.25rem,4vw+0.5rem,3.5rem)] font-semibold">
              Cooked fresh, priced honestly.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-5 max-w-[58ch] text-lg leading-relaxed text-muted">
              Everything is made to order. Tell us how spicy you like it when you
              order, and ask about the smoothie of the day.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <nav aria-label="Menu categories" className="mt-8 flex flex-wrap gap-2">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:text-heading"
                >
                  {c.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </Container>
      </header>

      {categories.map((cat, ci) => (
        <Section key={cat.id} id={cat.id} tone={ci % 2 ? "surface" : "paper"} space="tight">
          <Reveal>
            <div>
              <h2 className="text-[clamp(1.75rem,2.5vw+0.5rem,2.5rem)] font-semibold">
                {cat.label}
              </h2>
              <DrawnUnderline className="w-40" />
              <p className="mt-4 max-w-[60ch] leading-relaxed text-muted">{cat.blurb}</p>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {byCategory(cat.id).map((item, i) => (
              <Reveal key={item.slug} delay={(i % 3) * 80}>
                <DishCard item={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      <Section
        tone="ember"
        space="tight"
        atmosphere
        backdrop={{ src: "/images/backdrops/order.jpg", video: "/videos/order.mp4" }}
      >
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Ready to order?</h2>
            <p className="mt-2 text-muted">
              Call the kitchen or send your order on WhatsApp, it starts cooking right away.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={site.phone.tel}
              className="inline-flex items-center gap-2 rounded-full bg-action-500 px-6 py-3 font-medium text-white shadow-glow transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:bg-action-400 active:scale-[0.98]"
            >
              <Phone aria-hidden size={16} />
              Call to order
            </a>
            <Link
              href="/order"
              className="inline-flex items-center rounded-full border border-line px-6 py-3 font-medium text-heading transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface active:scale-[0.98]"
            >
              All ordering options
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
