/* ============================================================
   PLACEHOLDER SPECIFICATIONS — REPLACE WITH YOUR REAL FIGURES.

   This is a MODEL CATALOGUE, not a stock list. Each entry is a
   model, with its specification and its own set of photographs.
   Customers pick a model on the spec side and the carousel shows
   that model's images.

   THE DATA NOW LIVES IN data/vehicles.json, and the admin app is
   the way to edit it. This file keeps the vocabulary the site is
   typed against (brands, body types, statuses) and everything
   that is COUNTED from the catalogue rather than typed in.

   WHAT IS AVAILABLE
   Suzuki, Hijet and Daihatsu are the kei-class range, each as a
   mini bus and a mini truck, with full specifications. Toyota,
   Mazda, Nissan and Hummer are also supplied. Their detailed
   specifications are NOT yet confirmed by the owner, so those
   fields are deliberately left out and the site shows
   "to be confirmed" rather than a guess.

   TO MAKE A COMING SOON MODEL AVAILABLE
   Change its `status` to "available" and fill in its
   specification. Nothing else needs editing.

   TO ADD A MODEL
   1. Copy any entry and change the values.
   2. `slug` must be unique, lowercase, hyphenated. It becomes
      the web address AND the name of every image file for that
      model:
        /public/images/inventory/<slug>.jpg      (first slide)
        /public/images/inventory/<slug>-1.jpg    (second slide)
        /public/images/inventory/<slug>-2.jpg    ... and so on
      Set `imageCount` to how many slides to look for. Files that
      are not there yet are skipped automatically, so you can add
      photographs one at a time and just refresh the page.
   3. PRICES ARE NOT SHOWN ANYWHERE ON THIS SITE, by the owner's
      decision. Buyers contact the yard for a price, so there is
      deliberately no price field. Do not add one back.
   4. Passenger vehicles (mini bus, full-size bus) use `seats`.
      Mini trucks use `payloadKg` and `bedLength`. Leave the
      other one out. Every MINI bus is a 7 seater; a full-size
      bus carries more and has its own seat count.
   ============================================================ */
import data from "./data/vehicles.json";

/** Brands stocked or supplied to order. */
export type Brand =
  | "Suzuki"
  | "Hijet"
  | "Daihatsu"
  | "Toyota"
  | "Mazda"
  | "Nissan"
  | "Hummer";
export type BodyType = "mini-bus" | "full-size-bus" | "mini-truck";
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

export const vehicles: Vehicle[] = data.vehicles as Vehicle[];

export const specifications = data.specifications;

/* ---------- Helpers. Do not edit below unless you write code. ---------- */

export const bodyTypeLabels: Record<BodyType, string> = {
  "mini-bus": "Mini bus",
  "full-size-bus": "Full-size bus",
  "mini-truck": "Mini truck",
};

export const statusLabels: Record<Status, string> = {
  available: "Available",
  "coming-soon": "Coming soon",
};

export const brands: Brand[] = [
  "Suzuki",
  "Hijet",
  "Daihatsu",
  "Toyota",
  "Mazda",
  "Nissan",
  "Hummer",
];
export const bodyTypes: BodyType[] = ["mini-bus", "full-size-bus", "mini-truck"];

export function getVehicle(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function isAvailable(vehicle: Vehicle): boolean {
  return vehicle.status === "available";
}

/** The capacity line: seats for a bus, payload for a truck. */
export function capacityOf(vehicle: Vehicle): string {
  if (vehicle.bodyType === "mini-truck") {
    return vehicle.payloadKg ? `${vehicle.payloadKg} kg payload` : "Payload to be confirmed";
  }
  return vehicle.seats ? `${vehicle.seats} seats` : "Seats to be confirmed";
}

/** Featured on the homepage: stocked models only, cheapest first. */
export function featuredVehicles(count = 6): Vehicle[] {
  return vehicles
    .filter(isAvailable)
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
  fullSizeBuses: availableVehicles.filter((v) => v.bodyType === "full-size-bus").length,
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
