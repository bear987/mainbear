"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import type { BodyType, Brand, Vehicle } from "../content/vehicles";
import { bodyTypeLabels, bodyTypes, brands, capacityOf, statusLabels } from "../content/vehicles";
import { contact } from "../content/site";
import {
  whatsappForVehicle,
  whatsappWhenAvailable,
  whatsappWholesaleForVehicle,
} from "../lib/contact";
import { VehicleCarousel } from "./vehicle-carousel";

function chip(active: boolean): string {
  return `stamp border px-3 py-2 transition-colors duration-150 ${
    active
      ? "border-ink bg-ink text-paper"
      : "border-line bg-surface text-fg hover:border-line-strong hover:text-heading"
  }`;
}

/**
 * The catalogue: a specification side on the left where a buyer picks a
 * model, and the photographs of that model on the right. Choosing a model
 * swaps the carousel. Filtering happens in the browser against data already
 * on the page, so it is instant on a slow connection.
 */
export function VehicleBrowser({ vehicles }: { vehicles: Vehicle[] }) {
  const [bodyFilter, setBodyFilter] = useState<BodyType | "all">("all");
  const [brandFilter, setBrandFilter] = useState<Brand | "all">("all");
  const [wholesaleOnly, setWholesaleOnly] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  /* Deep links like /inventory?type=mini-truck are applied once after mount.
     Reading location directly rather than useSearchParams keeps this out of
     a Suspense boundary: on a prerendered page that boundary stayed pending
     on the client and the whole panel never hydrated, so nothing clicked. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get("type");
    const brand = params.get("brand");
    if (bodyTypes.includes(type as BodyType)) setBodyFilter(type as BodyType);
    if (brands.includes(brand as Brand)) setBrandFilter(brand as Brand);
    if (params.get("wholesale") === "yes") setWholesaleOnly(true);
    const model = params.get("model");
    if (model) setSelectedSlug(model);
  }, []);

  const shown = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        if (bodyFilter !== "all" && vehicle.bodyType !== bodyFilter) return false;
        if (brandFilter !== "all" && vehicle.brand !== brandFilter) return false;
        if (wholesaleOnly && !vehicle.wholesaleAvailable) return false;
        return true;
      }),
    [vehicles, bodyFilter, brandFilter, wholesaleOnly],
  );

  /* Keep a valid selection: if filters hide the chosen model, fall back
     to the first one still on screen. */
  const selected = shown.find((vehicle) => vehicle.slug === selectedSlug) ?? shown[0];

  const reset = () => {
    setBodyFilter("all");
    setBrandFilter("all");
    setWholesaleOnly(false);
  };

  const filtersActive = bodyFilter !== "all" || brandFilter !== "all" || wholesaleOnly;

  return (
    <div>
      {/* Filters */}
      <div className="border border-line bg-surface">
        <div className="flex flex-wrap items-center gap-2 border-b border-line p-4">
          <span className="stamp mr-1 w-full sm:w-auto">Vehicle type</span>
          <button type="button" onClick={() => setBodyFilter("all")} className={chip(bodyFilter === "all")}>
            All
          </button>
          {bodyTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setBodyFilter(type)}
              aria-pressed={bodyFilter === type}
              className={chip(bodyFilter === type)}
            >
              {bodyTypeLabels[type]}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 p-4">
          <span className="stamp mr-1 w-full sm:w-auto">Brand</span>
          <button type="button" onClick={() => setBrandFilter("all")} className={chip(brandFilter === "all")}>
            All
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => setBrandFilter(brand)}
              aria-pressed={brandFilter === brand}
              className={chip(brandFilter === brand)}
            >
              {brand}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setWholesaleOnly((value) => !value)}
            aria-pressed={wholesaleOnly}
            className={`${chip(wholesaleOnly)} sm:ml-4`}
          >
            Wholesale available
          </button>
          {filtersActive && (
            <button type="button" onClick={reset} className="stamp ml-auto underline hover:text-heading">
              Clear
            </button>
          )}
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-8 border border-line bg-surface p-10 text-center">
          <p className="stamp text-line-strong">No models match</p>
          <h3 className="mt-3 text-2xl">Nothing in the range fits that</h3>
          <p className="mx-auto mt-3 max-w-[46ch] text-fg">
            Clear the filters to see the full range, or tell us what the vehicle has to carry and
            we will tell you which one to put on it.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 border border-ink bg-ink px-5 py-3 text-sm font-medium uppercase tracking-[0.08em] text-paper transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          {/* SPEC SIDE */}
          <div className="lg:col-span-5">
            <h2 className="stamp border-b border-line pb-3">
              Choose a model
              <span className="tnum ml-2 text-action-600">
                {String(shown.length).padStart(2, "0")}
              </span>
            </h2>

            <ul className="mt-px grid gap-px bg-line">
              {shown.map((vehicle) => {
                const active = selected?.slug === vehicle.slug;
                return (
                  <li key={vehicle.slug}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(vehicle.slug)}
                      aria-pressed={active}
                      className={`flex w-full items-baseline justify-between gap-3 px-4 py-3.5 text-left transition-colors duration-150 ${
                        active
                          ? "bg-ink text-paper"
                          : "bg-surface text-fg hover:bg-elevated"
                      }`}
                    >
                      <span className="min-w-0">
                        <span
                          className={`stamp block ${active ? "text-action-500" : "text-muted"}`}
                        >
                          {vehicle.brand} / {bodyTypeLabels[vehicle.bodyType]}
                        </span>
                        <span
                          className={`mt-1 block truncate text-[1.05rem] font-medium uppercase tracking-[-0.02em] ${
                            active ? "text-paper" : "text-heading"
                          }`}
                        >
                          {vehicle.name}
                        </span>
                      </span>
                      <span
                        className={`tnum shrink-0 font-mono text-[0.8rem] ${
                          vehicle.status !== "available"
                            ? active
                              ? "text-paper/70"
                              : "text-muted"
                            : active
                              ? "text-paper"
                              : "text-action-600"
                        }`}
                      >
                        {vehicle.status === "available" ? capacityOf(vehicle) : "Coming soon"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {selected && (
              <div className="mt-8 border border-line bg-surface">
                <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3">
                  <span className="stamp">Specification</span>
                  <span
                    className={`stamp px-2 py-1 ${
                      selected.status === "available"
                        ? "border border-line text-ink"
                        : "bg-elevated text-muted"
                    }`}
                  >
                    {statusLabels[selected.status]}
                  </span>
                </div>

                <dl className="px-5 py-4 font-mono text-[0.78rem] uppercase tracking-[0.06em]">
                  {(
                    [
                      ["Brand", selected.brand],
                      ["Type", bodyTypeLabels[selected.bodyType]],
                      ["Body", selected.variant],
                      [
                        selected.bodyType === "mini-bus" ? "Seats" : "Payload",
                        selected.bodyType === "mini-bus"
                          ? (selected.seats?.toString() ?? "To be confirmed")
                          : selected.payloadKg
                            ? `${selected.payloadKg} kg`
                            : "To be confirmed",
                      ],
                      ...(selected.bedLength
                        ? ([["Load bed", selected.bedLength]] as [string, string][])
                        : []),
                      /* Coming soon models carry no invented specification. */
                      ...((selected.engine
                        ? [
                            ["Engine", selected.engine],
                            ["Fuel", selected.fuel],
                            ["Gearbox", selected.transmission],
                            ["Drive", selected.drive],
                            ["Fuel use", selected.fuelUse],
                            ["Dimensions", selected.dimensions],
                          ]
                        : [["Full specification", "Confirmed on arrival"]]) as [string, string][]),
                      [
                        "Coupled by us",
                        selected.coupledInHouse ? "Yes" : "No, supplied complete",
                      ],
                    ] as [string, string][]
                  ).map(([term, value]) => (
                    <div
                      key={term}
                      className="flex justify-between gap-4 border-b border-line py-2 last:border-b-0"
                    >
                      <dt className="text-muted">{term}</dt>
                      <dd className="tnum text-right text-heading">{value}</dd>
                    </div>
                  ))}
                </dl>

                {selected.status === "available" ? (
                  <>
                    {/* No prices anywhere by the owner's decision: buyers call
                        the yard for a figure. */}
                    <div className="border-t border-line px-5 py-4">
                      <span className="stamp">Price</span>
                      <p className="mt-1 text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-action-600">
                        On enquiry
                      </p>
                      <p className="stamp mt-2">
                        Call or message the yard for a figure on this model
                        {selected.wholesaleAvailable
                          ? `, or for wholesale from ${selected.minWholesaleQty ?? 2} units.`
                          : "."}
                      </p>
                    </div>

                    <div className="border-t border-line px-5 py-5">
                      <a
                        href={whatsappForVehicle(selected)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-action-500 px-5 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
                      >
                        <MessageCircle size={16} aria-hidden />
                        Enquire on WhatsApp
                      </a>
                      <a
                        href={contact.phoneHref}
                        className="mt-3 flex items-center justify-center gap-3 border border-ink px-5 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:bg-elevated"
                      >
                        <Phone size={16} aria-hidden className="text-action-600" />
                        Call {contact.phoneDisplay}
                      </a>
                      {selected.wholesaleAvailable && (
                        <a
                          href={whatsappWholesaleForVehicle(selected)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 flex items-center justify-center gap-3 border border-line px-5 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
                        >
                          Ask for wholesale pricing
                        </a>
                      )}
                    </div>
                  </>
                ) : (
                  /* Not stocked yet: no price, and the only action is to be
                     told when it lands. */
                  <div className="border-t border-line px-5 py-5">
                    <div className="hazard-hatch h-1.5 w-full opacity-60" aria-hidden />
                    <p className="stamp mt-4 text-ink">Not on the yard yet</p>
                    <p className="mt-2 text-fg">
                      This one is not in stock. Tell us you want it and we will call you the
                      week it lands.
                    </p>
                    <a
                      href={whatsappWhenAvailable(selected)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center justify-center gap-3 border border-ink px-5 py-3.5 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:bg-elevated"
                    >
                      <MessageCircle size={16} aria-hidden className="text-action-600" />
                      Tell me when it lands
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* IMAGE SIDE */}
          <div className="lg:col-span-7">
            {selected && (
              <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
                <VehicleCarousel
                  key={selected.slug}
                  slug={selected.slug}
                  name={selected.name}
                  count={selected.imageCount}
                  priority
                />

                <div className="mt-6">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <h2 className="text-[clamp(1.6rem,3vw,2.4rem)]">{selected.name}</h2>
                    <span className="stamp">{selected.variant}</span>
                  </div>

                  <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed text-fg">
                    {selected.summary}
                  </p>

                  <h3 className="stamp mt-7 border-b border-line pb-2">Best for</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {selected.bestFor.map((use) => (
                      <li key={use} className="stamp border border-line px-3 py-1.5 text-ink">
                        {use}
                      </li>
                    ))}
                  </ul>

                  <h3 className="stamp mt-7 border-b border-line pb-2">Fitted with</h3>
                  <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                    {selected.features.map((feature) => (
                      <li key={feature} className="flex items-baseline gap-3 text-fg">
                        <span aria-hidden className="text-action-600">
                          +
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/inventory/${selected.slug}`}
                    data-cta
                    data-cta-section="catalogue"
                    className="mt-8 inline-flex items-center gap-3 border-b-2 border-action-500 pb-1 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-transform duration-150 ease-[var(--ease-quint)] hover:translate-x-1"
                  >
                    Full page for this model
                    <span aria-hidden className="text-action-600">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
