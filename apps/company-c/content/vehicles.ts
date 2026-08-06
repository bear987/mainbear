/* ============================================================
   PLACEHOLDER SPECIFICATIONS — REPLACE WITH YOUR REAL FIGURES.

   This is a MODEL CATALOGUE, not a stock list. Each entry is a
   model, with its specification and its own set of photographs.
   Customers pick a model on the spec side and the carousel shows
   that model's images.

   WHAT IS AVAILABLE
   Only three names are stocked today: Suzuki, Hijet and
   Daihatsu, each as a mini bus and as a mini truck. Anything
   else in this file is marked `status: "coming-soon"` and shows
   on the site as coming soon, with no price and no order CTA.

   TO MAKE A COMING SOON MODEL AVAILABLE
   Change its `status` to "available" and fill in its price and
   specification. Nothing else needs editing.

   TO ADD A MODEL
   1. Copy any block below and change the values.
   2. `slug` must be unique, lowercase, hyphenated. It becomes
      the web address AND the name of every image file for that
      model:
        /public/images/inventory/<slug>.jpg      (first slide)
        /public/images/inventory/<slug>-1.jpg    (second slide)
        /public/images/inventory/<slug>-2.jpg    ... and so on
      Set `imageCount` to how many slides to look for. Files that
      are not there yet are skipped automatically, so you can add
      photographs one at a time and just refresh the page.
   3. `priceFromNGN` is a plain number of naira, no commas.
      Use `null` to show "Price on request" instead.
   4. Mini buses use `seats`. Mini trucks use `payloadKg` and
      `bedLength`. Leave the other one out.
   ============================================================ */

/** The only names stocked today. Do not add others as available. */
export type Brand = "Suzuki" | "Hijet" | "Daihatsu";
export type BodyType = "mini-bus" | "mini-truck";
export type Status = "available" | "coming-soon";

export type Vehicle = {
  slug: string;
  /** Model name as a buyer would ask for it. */
  name: string;
  brand: Brand;
  bodyType: BodyType;
  /** On the yard now, or announced but not yet stocked. */
  status: Status;
  /** Body style in plain words, e.g. "passenger van", "dropside truck". */
  variant: string;

  /** Mini buses only. */
  seats?: number;
  /** Mini trucks only. */
  payloadKg?: number;
  bedLength?: string;

  /* Specification. Left out entirely on coming soon models rather
     than guessed at. */
  engine?: string;
  fuel?: "petrol" | "diesel";
  transmission?: "manual" | "automatic";
  drive?: string;
  dimensions?: string;
  fuelUse?: string;

  /** Naira. `null` renders "Price on request". Always null when coming soon. */
  priceFromNGN: number | null;
  wholesaleAvailable: boolean;
  minWholesaleQty?: number;
  /** TRUE when GG Autos couples this model in-house from parts. */
  coupledInHouse: boolean;

  summary: string;
  /** What this model is actually good for. Keep it concrete. */
  bestFor: string[];
  features: string[];
  /** How many carousel slides to look for. Missing files are skipped. */
  imageCount: number;
  updated: string;
};

export const vehicles: Vehicle[] = [
  /* ---------------- AVAILABLE NOW ---------------- */
  {
    slug: "suzuki-mini-bus",
    name: "Suzuki Mini Bus",
    brand: "Suzuki",
    bodyType: "mini-bus",
    status: "available",
    variant: "passenger van",
    seats: 7,
    engine: "1.0L 3-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "3.40 m long, 1.48 m wide, 1.90 m high",
    fuelUse: "About 16 km per litre in town",
    priceFromNGN: 13900000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "A small, economical passenger bus for estate roads and inner streets where a full size bus cannot turn. Cheap enough to run every day, and every mechanic in the market knows it.",
    bestFor: ["Short estate and street routes", "School runs", "Staff shuttles"],
    features: [
      "7 seat layout",
      "Sliding side door",
      "High roof cabin",
      "Air conditioning",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },
  {
    slug: "suzuki-mini-truck",
    name: "Suzuki Mini Truck",
    brand: "Suzuki",
    bodyType: "mini-truck",
    status: "available",
    variant: "dropside truck",
    payloadKg: 800,
    bedLength: "1.94 m bed",
    engine: "1.0L 3-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "3.80 m long, 1.55 m wide, 1.79 m high",
    fuelUse: "About 14 km per litre loaded",
    priceFromNGN: 13400000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "Three sides that drop flat, which is why traders buy it. Loading and offloading a market run takes minutes instead of lifting everything over a fixed tailgate.",
    bestFor: ["Market and trade deliveries", "Building materials", "Water and gas distribution"],
    features: [
      "Three-side dropside body",
      "800 kg payload",
      "Reinforced bed floor",
      "Body built to order",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },
  {
    slug: "hijet-mini-bus",
    name: "Hijet Mini Bus",
    brand: "Hijet",
    bodyType: "mini-bus",
    status: "available",
    variant: "passenger van",
    seats: 7,
    engine: "1.0L 3-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "3.40 m long, 1.48 m wide, 1.90 m high",
    fuelUse: "About 15 km per litre in town",
    priceFromNGN: 14500000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "The bus most Lagos operators start with. It holds its value, parts are on every market street, and a driver can put it straight onto a route the day he takes delivery.",
    bestFor: ["Daily commercial routes", "Church and group transport", "Staff shuttles"],
    features: [
      "7 seat layout",
      "Sliding side door",
      "High roof cabin",
      "Air conditioning",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },
  {
    slug: "hijet-mini-truck",
    name: "Hijet Mini Truck",
    brand: "Hijet",
    bodyType: "mini-truck",
    status: "available",
    variant: "dropside truck",
    payloadKg: 850,
    bedLength: "2.03 m bed",
    engine: "1.0L 3-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "3.40 m long, 1.48 m wide, 1.78 m high",
    fuelUse: "About 15 km per litre loaded",
    priceFromNGN: 13200000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "The workhorse of the small trade fleet. Enough bed to take a real load, small enough to get down a street the bigger trucks give up on.",
    bestFor: ["Distribution rounds", "Market deliveries", "Owner-driver businesses"],
    features: [
      "Three-side dropside body",
      "850 kg payload",
      "Reinforced bed floor",
      "Body built to order",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },
  {
    slug: "daihatsu-mini-bus",
    name: "Daihatsu Mini Bus",
    brand: "Daihatsu",
    bodyType: "mini-bus",
    status: "available",
    variant: "passenger van",
    seats: 9,
    engine: "1.5L 4-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "4.19 m long, 1.66 m wide, 1.90 m high",
    fuelUse: "About 12 km per litre in town",
    priceFromNGN: 19800000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "More rows and a bigger engine to carry them. The step up for an operator who wants more fares per trip without moving to a full size bus and its running costs.",
    bestFor: ["Longer commercial routes", "Hotel and airport transfers", "Group transport"],
    features: [
      "9 seat layout",
      "1.5L engine",
      "Sliding side door",
      "Air conditioning",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },
  {
    slug: "daihatsu-mini-truck",
    name: "Daihatsu Mini Truck",
    brand: "Daihatsu",
    bodyType: "mini-truck",
    status: "available",
    variant: "flatbed pickup",
    payloadKg: 1000,
    bedLength: "2.35 m bed",
    engine: "1.5L 4-cylinder",
    fuel: "petrol",
    transmission: "manual",
    drive: "Rear wheel",
    dimensions: "4.19 m long, 1.66 m wide, 1.80 m high",
    fuelUse: "About 11 km per litre loaded",
    priceFromNGN: 18400000,
    wholesaleAvailable: true,
    minWholesaleQty: 5,
    coupledInHouse: true,
    summary:
      "A full tonne of payload on the longest bed we build. The unit distributors move to when the smaller trucks are filling up before the round is finished.",
    bestFor: ["Distribution rounds", "Heavier trade loads", "Fleet delivery work"],
    features: [
      "1000 kg payload",
      "2.35 m flatbed",
      "1.5L engine",
      "Fleet livery on request",
      "Coupled in-house",
    ],
    imageCount: 4,
    updated: "2026-08-04",
  },

  /* ---------------- COMING SOON ----------------
     Not stocked yet. No price, no specification and no order CTA
     until the owner confirms them. Change `status` to "available"
     and fill in the figures when they land. */
  {
    slug: "enclosed-box-body-truck",
    name: "Enclosed Box Body",
    brand: "Hijet",
    bodyType: "mini-truck",
    status: "coming-soon",
    variant: "enclosed box body",
    priceFromNGN: null,
    wholesaleAvailable: false,
    coupledInHouse: true,
    summary:
      "A mini truck with a fully enclosed box built onto it in our workshop, so goods stay dry in the rain and out of sight in traffic. Not on the yard yet. Ask us when it lands.",
    bestFor: ["Courier and parcel work", "Pharmaceutical delivery", "Anything that must stay dry"],
    features: ["Enclosed box body", "Rear roller shutter", "Signwriting on request"],
    imageCount: 3,
    updated: "2026-08-04",
  },
  {
    slug: "long-wheelbase-mini-bus",
    name: "Long Wheelbase Mini Bus",
    brand: "Daihatsu",
    bodyType: "mini-bus",
    status: "coming-soon",
    variant: "extended passenger van",
    priceFromNGN: null,
    wholesaleAvailable: false,
    coupledInHouse: true,
    summary:
      "An extended body carrying more rows than the standard mini bus, for operators running longer routes. Not on the yard yet. Ask us when it lands.",
    bestFor: ["High capacity routes", "Staff transport contracts"],
    features: ["Extended body", "Additional seat row", "Air conditioning"],
    imageCount: 3,
    updated: "2026-08-04",
  },
];

/* ---------- Helpers. Do not edit below unless you write code. ---------- */

export const bodyTypeLabels: Record<BodyType, string> = {
  "mini-bus": "Mini bus",
  "mini-truck": "Mini truck",
};

export const statusLabels: Record<Status, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
};

export const brands: Brand[] = ["Suzuki", "Hijet", "Daihatsu"];
export const bodyTypes: BodyType[] = ["mini-bus", "mini-truck"];

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function isAvailable(vehicle: Vehicle): boolean {
  return vehicle.status === "available";
}

/** The capacity line: seats for a bus, payload for a truck. */
export function capacityOf(vehicle: Vehicle): string {
  if (vehicle.bodyType === "mini-bus") {
    return vehicle.seats ? `${vehicle.seats} seats` : "Seats to be confirmed";
  }
  return vehicle.payloadKg ? `${vehicle.payloadKg} kg payload` : "Payload to be confirmed";
}

/** Featured on the homepage: stocked models only, cheapest first. */
export function featuredVehicles(count = 6): Vehicle[] {
  return vehicles
    .filter(isAvailable)
    .sort((a, b) => (a.priceFromNGN ?? 0) - (b.priceFromNGN ?? 0))
    .slice(0, count);
}

export function relatedVehicles(vehicle: Vehicle, count = 3): Vehicle[] {
  return vehicles
    .filter((other) => other.slug !== vehicle.slug && isAvailable(other))
    .sort((a, b) => {
      const score = (item: Vehicle) =>
        (item.bodyType === vehicle.bodyType ? 2 : 0) + (item.brand === vehicle.brand ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, count);
}

const availableVehicles = vehicles.filter(isAvailable);

export const catalogueStats = {
  models: availableVehicles.length,
  buses: availableVehicles.filter((vehicle) => vehicle.bodyType === "mini-bus").length,
  trucks: availableVehicles.filter((vehicle) => vehicle.bodyType === "mini-truck").length,
  comingSoon: vehicles.length - availableVehicles.length,
  coupled: availableVehicles.filter((vehicle) => vehicle.coupledInHouse).length,
  wholesale: availableVehicles.filter((vehicle) => vehicle.wholesaleAvailable).length,
  minSeats: Math.min(
    ...availableVehicles.filter((v) => v.seats !== undefined).map((v) => v.seats as number),
  ),
  maxSeats: Math.max(
    ...availableVehicles.filter((v) => v.seats !== undefined).map((v) => v.seats as number),
  ),
  maxPayload: Math.max(
    ...availableVehicles.filter((v) => v.payloadKg !== undefined).map((v) => v.payloadKg as number),
  ),
};
