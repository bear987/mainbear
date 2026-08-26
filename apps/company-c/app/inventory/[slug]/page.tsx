import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { Container } from "@repo/ui/container";
import { Section, SectionHead } from "../../../components/section";
import { VehicleCard } from "../../../components/vehicle-card";
import { VehicleCarousel } from "../../../components/vehicle-carousel";
import { VideoSlot } from "../../../components/video-slot";
import { breadcrumbSchema } from "../../../components/page-header";
import {
  bodyTypeLabels,
  capacityOf,
  getVehicle,
  relatedVehicles,
  statusLabels,
  vehicles,
} from "../../../content/vehicles";
import { contact, site } from "../../../content/site";
import {
  whatsappForVehicle,
  whatsappWhenAvailable,
  whatsappWholesaleForVehicle,
} from "../../../lib/contact";
import { formatStampDate } from "../../../lib/format";

export function generateStaticParams() {
  return vehicles.map((vehicle) => ({ slug: vehicle.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) return { title: "Model not found" };

  const coming = vehicle.status !== "available";
  const title = coming
    ? `${vehicle.name}, coming soon`
    : `${vehicle.name} in Lagos, Nigeria`;
  const spec = vehicle.engine
    ? `${capacityOf(vehicle)}, ${vehicle.engine} ${vehicle.fuel}, ${vehicle.transmission}. `
    : "";
  const description = coming
    ? `The ${vehicle.name} is not yet stocked at GG Autos Lagos. Tell us you want one and we will call you when it lands.`
    : `${vehicle.name} ${vehicle.variant}, ${spec}Call or WhatsApp GG Autos in Okota, Lagos for a price.`;

  return {
    title,
    description: description.slice(0, 158),
    alternates: { canonical: `/inventory/${vehicle.slug}` },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: description.slice(0, 158),
      url: `${site.url}/inventory/${vehicle.slug}`,
      images: [`/images/inventory/${vehicle.slug}.jpg`],
    },
  };
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = getVehicle(slug);
  if (!vehicle) notFound();

  const related = relatedVehicles(vehicle);
  const isBus = vehicle.bodyType === "mini-bus";
  const available = vehicle.status === "available";
  const crumbs = [
    { label: "Inventory", href: "/inventory" },
    { label: vehicle.name, href: `/inventory/${vehicle.slug}` },
  ];

  const specs: [string, string][] = [
    ["Brand", vehicle.brand],
    ["Type", bodyTypeLabels[vehicle.bodyType]],
    ["Body", vehicle.variant],
    [
      isBus ? "Seats" : "Payload",
      isBus
        ? (vehicle.seats?.toString() ?? "To be confirmed")
        : vehicle.payloadKg
          ? `${vehicle.payloadKg} kg`
          : "To be confirmed",
    ],
    ...((vehicle.bedLength ? [["Load bed", vehicle.bedLength]] : []) as [string, string][]),
    /* Coming soon models carry no invented specification. */
    ...((vehicle.engine
      ? [
          ["Engine", vehicle.engine],
          ["Fuel", vehicle.fuel],
          ["Gearbox", vehicle.transmission],
          ["Drive", vehicle.drive],
          ["Fuel use", vehicle.fuelUse],
          ["Dimensions", vehicle.dimensions],
        ]
      : [["Full specification", "Confirmed on arrival"]]) as [string, string][]),
    ["Coupled in-house", vehicle.coupledInHouse ? "Yes, by GG Autos" : "No, supplied complete"],
    ["Status", statusLabels[vehicle.status]],
    ["Specification checked", formatStampDate(vehicle.updated)],
  ];

  const vehicleSchema = {
    "@context": "https://schema.org",
    /* schema.org has a bus type but no truck type; trucks fall back to Vehicle. */
    "@type": isBus ? "BusOrCoach" : "Vehicle",
    name: vehicle.name,
    description: vehicle.summary,
    url: `${site.url}/inventory/${vehicle.slug}`,
    image: `${site.url}/images/inventory/${vehicle.slug}.jpg`,
    brand: { "@type": "Brand", name: vehicle.brand },
    bodyType: vehicle.variant,
    itemCondition: "https://schema.org/NewCondition",
    /* Only publish specification we actually have. */
    ...(vehicle.transmission ? { vehicleTransmission: vehicle.transmission } : {}),
    ...(vehicle.fuel ? { fuelType: vehicle.fuel } : {}),
    ...(vehicle.drive ? { driveWheelConfiguration: vehicle.drive } : {}),
    ...(vehicle.engine
      ? { vehicleEngine: { "@type": "EngineSpecification", name: vehicle.engine } }
      : {}),
    ...(isBus
      ? vehicle.seats
        ? { vehicleSeatingCapacity: vehicle.seats }
        : {}
      : vehicle.payloadKg
        ? {
            payload: {
              "@type": "QuantitativeValue",
              value: vehicle.payloadKg,
              unitCode: "KGM",
            },
          }
        : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      availability: available
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      url: `${site.url}/inventory/${vehicle.slug}`,
      seller: { "@type": "AutoDealer", name: site.name, url: site.url },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema(crumbs), vehicleSchema]),
        }}
      />

      <div className="on-ink relative overflow-hidden pb-12 pt-[calc(var(--header-h)+2.5rem)]">
        <div
          aria-hidden
          className="grid-rules pointer-events-none absolute inset-0 hidden opacity-40 sm:block"
        />
        <Container className="relative">
          <nav aria-label="Breadcrumb">
            <ol className="stamp flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-heading">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href="/inventory" className="hover:text-heading">
                  Inventory
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <span aria-current="page" className="text-heading">
                  {vehicle.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="stamp border-l-2 border-action-500 pl-3">
              {vehicle.brand} / {bodyTypeLabels[vehicle.bodyType]}
              {available ? ` / ${capacityOf(vehicle)}` : ""}
            </span>
            <span
              className={`stamp px-2 py-1 ${
                available ? "border border-line text-heading" : "bg-action-500 text-white"
              }`}
            >
              {statusLabels[vehicle.status]}
            </span>
            {vehicle.coupledInHouse && (
              <span className="stamp border border-line px-2 py-1 text-heading">
                Coupled by GG Autos
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-[18ch] text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.95]">
            {vehicle.name}
          </h1>
        </Container>
      </div>

      <Section space="normal">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <VehicleCarousel
              slug={vehicle.slug}
              name={vehicle.name}
              count={vehicle.imageCount}
              priority
            />

            {/* Walkaround footage only appears for models that have it. */}
            <VideoSlot
              className="mt-10"
              src={`/video/inventory/${vehicle.slug}.mp4`}
              poster={`/images/inventory/${vehicle.slug}.jpg`}
              label="walkaround"
              caption={`Walkaround, ${vehicle.name}`}
              probe
            />

            <div className="mt-10">
              <h2 className="text-[1.5rem]">About this model</h2>
              <p className="mt-4 max-w-[62ch] text-[1.05rem] leading-relaxed text-fg">
                {vehicle.summary}
              </p>

              <h3 className="stamp mt-8 border-b border-line pb-2">Best for</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {vehicle.bestFor.map((use) => (
                  <li key={use} className="stamp border border-line px-3 py-1.5 text-ink">
                    {use}
                  </li>
                ))}
              </ul>

              <h3 className="stamp mt-8 border-b border-line pb-2">Fitted with</h3>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                {vehicle.features.map((feature) => (
                  <li key={feature} className="flex items-baseline gap-3 text-fg">
                    <span aria-hidden className="text-action-600">
                      +
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* The buying panel stays beside the photographs on desktop. */}
          <div className="lg:col-span-5">
            <div className="border border-line bg-surface lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <div className="border-b border-line p-6">
                {available ? (
                  <>
                    {/* No prices on this site by the owner's decision: a buyer
                        calls the yard for a figure. */}
                    <span className="stamp">Price</span>
                    <p className="mt-2 text-[clamp(1.6rem,3vw,2.2rem)] font-semibold leading-tight tracking-[-0.02em] text-action-600">
                      On enquiry
                    </p>
                    <p className="stamp mt-3">
                      Call or message the yard for a figure on this model
                      {vehicle.wholesaleAvailable
                        ? `, or for wholesale from ${vehicle.minWholesaleQty ?? 2} units.`
                        : "."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="hazard-hatch h-1.5 w-full opacity-60" aria-hidden />
                    <span className="stamp mt-4 block text-ink">Not on the yard yet</span>
                    <p className="mt-2 text-fg">
                      This model is not in stock yet. Tell us you want one and we will call you when it lands.
                    </p>
                  </>
                )}
              </div>

              <dl className="p-6 font-mono text-[0.78rem] uppercase tracking-[0.06em]">
                {specs.map(([term, value]) => (
                  <div
                    key={term}
                    className="flex justify-between gap-4 border-b border-line py-2 last:border-b-0"
                  >
                    <dt className="text-muted">{term}</dt>
                    <dd className="tnum text-right text-heading">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-line p-6">
                {available ? (
                  <>
                    <a
                      href={whatsappForVehicle(vehicle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 bg-action-500 px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-white transition-transform duration-150 ease-[var(--ease-quint)] hover:-translate-y-0.5"
                    >
                      <MessageCircle size={16} aria-hidden />
                      Enquire on WhatsApp
                    </a>
                    <a
                      href={contact.phoneHref}
                      className="mt-3 flex items-center justify-center gap-3 border border-ink px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:bg-elevated"
                    >
                      <Phone size={16} aria-hidden className="text-action-600" />
                      Call {contact.phoneDisplay}
                    </a>
                    {vehicle.wholesaleAvailable && (
                      <a
                        href={whatsappWholesaleForVehicle(vehicle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-3 border border-line px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:border-line-strong"
                      >
                        Ask for wholesale pricing
                      </a>
                    )}
                  </>
                ) : (
                  <a
                    href={whatsappWhenAvailable(vehicle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 border border-ink px-6 py-4 text-sm font-medium uppercase tracking-[0.08em] text-heading transition-colors duration-150 hover:bg-elevated"
                  >
                    <MessageCircle size={16} aria-hidden className="text-action-600" />
                    Tell me when it lands
                  </a>
                )}
                <p className="stamp mt-4">{contact.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="tint">
          <SectionHead label="Also in the range" title="Comparable models" />
          <div className="mt-10 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <VehicleCard key={item.slug} vehicle={item} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
