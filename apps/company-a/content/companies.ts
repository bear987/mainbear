import { site } from "@/content/site";

/**
 * The two subsidiaries GG BEARERS routes visitors to.
 * `href` is always a full absolute URL (cross-subdomain).
 */
export type Company = {
  id: "foods" | "autos";
  name: string;
  /** A→B→C tag used across the site (e.g. Careers filter). */
  tag: "B" | "C";
  oneLiner: string;
  blurb: string;
  href: string;
  /** Initials shown in the logo placeholder until a real logo is supplied. */
  logoText: string;
};

export const companies: Company[] = [
  {
    id: "foods",
    name: "GG FOODS",
    tag: "B",
    oneLiner: "Food importation, wholesale supply and retail distribution.",
    blurb:
      "GG FOODS sources and moves quality food products at scale, handling importation, wholesale supply and retail distribution for partners and households across Nigeria.",
    href: site.subsidiaries.foods,
    logoText: "GF",
  },
  {
    id: "autos",
    name: "GG AUTOS",
    tag: "C",
    oneLiner: "Vehicle sourcing, parts importation and automotive trade.",
    blurb:
      "GG AUTOS handles vehicle sourcing, spare-parts importation and automotive trade, connecting trusted supply to dealers, fleets and individual buyers.",
    href: site.subsidiaries.autos,
    logoText: "GA",
  },
];
