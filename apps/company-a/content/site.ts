/**
 * Global site data, single source for identity, contact + navigation.
 * Kept here (not inline in JSX) so it can move to a CMS later.
 */

export type NavItem = { label: string; href: string };

const PHONE_PRIMARY = "09018495507";
const PHONE_SECONDARY = "08062891562";

/** Nigerian local 0xxx number → +234 E.164 for tel: links. */
function toTelHref(local: string): string {
  return `tel:+234${local.replace(/^0/, "")}`;
}

export const site = {
  name: "GG BEARERS",
  legalName: "GG Bearers Limited",
  motto: "Integrity is our first priority",
  tagline: "A Lagos-based operating group in global trade, and the parent of GG FOODS and GG AUTOS.",
  description:
    "GG BEARERS is an operating holding company in Lagos, Nigeria. We run import and export, wholesale and retail trade, and offer partnerships, investment and corporate services, and we own the GG FOODS and GG AUTOS businesses.",
  url: "https://ggbearers.com",
  email: "ggbearers@gmail.com",

  phones: [
    { label: PHONE_PRIMARY, href: toTelHref(PHONE_PRIMARY) },
    { label: PHONE_SECONDARY, href: toTelHref(PHONE_SECONDARY) },
  ],

  address: {
    street: "13 Femi Killa Street, opp. Market Square, Ago Palace",
    locality: "Okota",
    region: "Lagos",
    country: "Nigeria",
    full: "13 Femi Killa Street, opp. Market Square, Ago Palace, Okota, Lagos, Nigeria",
  },

  hours: "Monday to Friday, 9:00am to 6:00pm WAT",

  /** Subsidiary sites, always linked via full absolute URLs. */
  subsidiaries: {
    foods: "https://b.ggbearers.com",
    autos: "https://c.ggbearers.com",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Our Companies", href: "/companies" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  /** Global primary call-to-action, consistent across header, footer + sections. */
  primaryCta: { label: "Get in touch", href: "/contact" },
} as const;

export type Site = typeof site;
