import Link from "next/link";
import { Container } from "@repo/ui/container";
import { hero } from "../content/home";
import { catalogueStats } from "../content/vehicles";
import { Counter } from "./counter";
import { HeroMedia } from "./hero-media";

/**
 * "Plant floor" hero: full-bleed footage of the yard with the headline
 * stamped into the bottom-left and a monospace data rail ruled along the
 * bottom edge. The exposed column grid is drawn faintly over the media so
 * the structure still reads through the image.
 */
export function Hero() {
  const rail = [
    { label: "Mini buses", value: <Counter value={catalogueStats.buses} />, suffix: "models" },
    { label: "Mini trucks", value: <Counter value={catalogueStats.trucks} />, suffix: "models" },
    {
      label: "Carries",
      value: (
        <span className="tnum">
          {catalogueStats.minSeats} to {catalogueStats.maxSeats}
        </span>
      ),
      suffix: `seats / ${catalogueStats.maxPayload} kg`,
    },
    { label: "Location", value: <span>Okota</span>, suffix: "Lagos, NG" },
  ];

  return (
    <section className="on-ink relative isolate flex min-h-[clamp(580px,90svh,920px)] flex-col justify-end overflow-hidden">
      <HeroMedia alt={hero.posterAlt} />

      {/* Legibility scrim. Flat gradient, no mesh or glow. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#111110] via-[#111110]/75 to-[#111110]/25"
      />
      <div
        aria-hidden
        className="grid-rules pointer-events-none absolute inset-0 hidden opacity-25 sm:block"
      />

      <Container className="relative z-10 pb-10 pt-[calc(var(--header-h)+3rem)]">
        <p className="stamp border-l-2 border-action-500 pl-3">{hero.eyebrow}</p>

        <h1 className="mt-6 max-w-[15ch] text-[clamp(2.75rem,8.5vw,7rem)] leading-[0.92]">
          {hero.headline}
        </h1>

        <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-relaxed text-[#cfcdc7] sm:text-lg">
          {hero.sub}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href={hero.primaryCta.href}
            data-cta
            data-cta-section="hero"
            className="bg-action-500 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            data-cta
            data-cta-section="hero"
            className="border border-[#f3f1ec]/50 px-7 py-4 text-sm font-medium uppercase tracking-[0.08em] text-[#f3f1ec] transition-colors duration-150 hover:border-[#f3f1ec] hover:bg-[#f3f1ec]/10"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </Container>

      {/* Data rail: the readout pinned to the bottom edge. */}
      <div className="relative z-10 border-t border-[#f3f1ec]/25 bg-[#111110]/70 backdrop-blur-sm">
        <Container>
          <dl className="grid grid-cols-2 md:grid-cols-4">
            {rail.map((cell, index) => (
              <div
                key={cell.label}
                className={`px-1 py-4 sm:px-4 ${
                  index > 0 ? "md:border-l md:border-[#f3f1ec]/20" : ""
                } ${index % 2 === 1 ? "border-l border-[#f3f1ec]/20 pl-4 md:pl-4" : ""} ${
                  index < 2 ? "border-b border-[#f3f1ec]/20 md:border-b-0" : ""
                }`}
              >
                <dt className="stamp">{cell.label}</dt>
                <dd className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold leading-none tracking-[-0.03em] text-[#f3f1ec] sm:text-3xl">
                    {cell.value}
                  </span>
                  {cell.suffix && <span className="stamp">{cell.suffix}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </div>
    </section>
  );
}
