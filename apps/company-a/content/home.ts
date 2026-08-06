import { services } from "@/content/services";

export type Stat = { value: string; label: string; countTo?: number };

export type DoArea = {
  name: string;
  summary: string;
  href: string;
  icon: "Handshake" | "TrendingUp" | "Building2" | "Users";
};

export const home = {
  hero: {
    eyebrow: "Operating group · Lagos, Nigeria",
    title: "An operating group built on trade, and on integrity.",
    lede: "GG BEARERS imports, exports and trades across borders, running partnerships, investment and corporate services in-house, and owning the GG FOODS and GG AUTOS businesses.",
    primary: { label: "Get in touch", href: "/contact" },
    secondary: { label: "Meet our companies", href: "/companies" },
  },

  stats: [
    { value: "2", label: "Companies we own and operate", countTo: 2 },
    { value: "3", label: "Service lines run in-house", countTo: 3 },
    { value: "Import & export", label: "Cross-border trade" },
    { value: "Integrity", label: "Our first priority" },
  ] satisfies Stat[],

  whatWeDo: {
    eyebrow: "What we do",
    title: "A working business, not a holding shell.",
    lede: "Two jobs, done at once: we run real trade services of our own, and we steward two operating companies underneath us.",
    areas: [
      ...services.map<DoArea>((s) => ({
        name: s.name,
        summary: s.summary,
        href: `/services/${s.slug}`,
        icon: s.icon,
      })),
      {
        name: "Careers & Talent",
        summary:
          "A single hiring hub for the whole group, open roles across GG BEARERS, GG FOODS and GG AUTOS, in one place.",
        href: "/careers",
        icon: "Users",
      },
    ],
  },

  companies: {
    eyebrow: "Our companies",
    title: "Two businesses. One group standard.",
    lede: "GG BEARERS owns and operates both companies below. Each runs its own market, visit their sites to go deeper.",
  },

  closing: {
    title: "Let's talk about working together.",
    lede: "Whether it's a partnership, an investment, a shipment to clear or a role to fill, start a conversation and we'll route you to the right person.",
    primary: { label: "Get in touch", href: "/contact" },
  },
} as const;
