/* ============================================================
   GG AUTOS — site-wide constants.
   Contact details are INHERITED FROM THE PARENT, GG BEARERS
   (confirmed by the owner). Swap any value here and it updates
   everywhere on the site.
   ============================================================ */

export const site = {
  name: "GG Autos",
  legalName: "GG Autos",
  /** One line, used in metadata and the footer brand block. */
  tagline: "Suzuki and Daihatsu mini buses and mini trucks, coupled and sold in Lagos.",
  description:
    "GG Autos couples and sells Suzuki and Daihatsu mini buses and mini trucks in Lagos, Nigeria. Retail sales for drivers and owners, wholesale supply for dealers, fleets and transport companies.",
  url: "https://c.ggbearers.com",
  locale: "en_NG",
  region: "Lagos, Nigeria",
  /** Stamped into page margins as a coordinate readout. */
  coordinates: "6.5244° N, 3.3792° E",
} as const;

/** The parent holding company and its other subsidiary. Absolute URLs only. */
export const group = {
  parent: {
    name: "GG Bearers",
    href: "https://ggbearers.com",
    label: "Part of the GG Bearers group",
  },
  sibling: {
    name: "GG Foods",
    href: "https://b.ggbearers.com",
    description: "Restaurant, catering and food service",
  },
} as const;

/* ------------------------------------------------------------
   CONTACT — inherited from GG Bearers.
   The owner confirmed GG Autos trades under the parent's
   address, phone lines and email until it has its own.
   ------------------------------------------------------------ */
export const contact = {
  /** Display form, used in visible text. */
  phoneDisplay: "0901 849 5507",
  /** E.164, used in tel: links. */
  phoneHref: "tel:+2349018495507",
  phoneAltDisplay: "0806 289 1562",
  phoneAltHref: "tel:+2348062891562",
  /** wa.me requires the international number with no + or spaces. */
  whatsappNumber: "2348062891562",
  email: "ggbearers@gmail.com",
  address: {
    street: "13 Femi Killa Street",
    landmark: "Opposite Market Square, Ago Palace",
    area: "Okota",
    city: "Lagos",
    country: "Nigeria",
    /** Single-line form for schema.org and copy blocks. */
    full: "13 Femi Killa Street, opposite Market Square, Ago Palace, Okota, Lagos, Nigeria",
  },
  /* PLACEHOLDER HOURS — these are assumed trading hours, not
     confirmed by the owner. Correct them here before launch. */
  hours: [
    { days: "Monday to Friday", opens: "08:00", closes: "18:00" },
    { days: "Saturday", opens: "09:00", closes: "16:00" },
    { days: "Sunday", opens: null, closes: null },
  ],
  /** Shown on the contact page so buyers know what to expect. */
  responseTime: "We reply to WhatsApp enquiries the same working day.",
} as const;

/** Six top-level items, matching the brief. */
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Inventory", href: "/inventory" },
  { label: "Services", href: "/services" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

/** The header CTA. Enquiry-driven, never "Get Started". */
export const navCta = { label: "Check Availability", href: "/inventory" } as const;

export const footerColumns = [
  {
    title: "Vehicles",
    links: [
      { label: "The full range", href: "/inventory" },
      { label: "Mini buses", href: "/inventory?type=mini-bus" },
      { label: "Mini trucks", href: "/inventory?type=mini-truck" },
      { label: "Suzuki", href: "/inventory?brand=Suzuki" },
      { label: "Daihatsu", href: "/inventory?brand=Daihatsu" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Coupling & attachment", href: "/services" },
      { label: "Wholesale & fleet", href: "/wholesale" },
      { label: "About GG Autos", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Group",
    links: [
      { label: group.parent.name, href: group.parent.href, external: true },
      { label: group.sibling.name, href: group.sibling.href, external: true },
    ],
  },
];

/** The three real services. Invent no others. */
export const capabilities = [
  "Coupling & attachment",
  "Retail sales",
  "Wholesale distribution",
] as const;

/** Monospace hero ticker. Vocabulary from the yard, not marketing. */
export const tickerItems = [
  "COUPLING & ATTACHMENT",
  "SUZUKI",
  "DAIHATSU",
  "MINI BUSES",
  "MINI TRUCKS",
  "HIJET",
  "GRAN MAX",
  "CARRY",
  "RETAIL SALES",
  "WHOLESALE SUPPLY",
  "IN-HOUSE ASSEMBLY",
  "LAGOS, NIGERIA",
  "PART OF GG BEARERS",
] as const;
