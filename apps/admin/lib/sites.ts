/**
 * The three sites this admin edits, and where their editable data lives.
 *
 * Everything the admin is allowed to touch is enumerated here. Nothing
 * outside this registry can be read or written, which is what keeps a stray
 * request from reaching the rest of the repo.
 */

export type SiteId = "company-a" | "company-b" | "company-c";

export type ContentFile = {
  /** File name inside <app>/content/data, without the extension. */
  id: string;
  /** What the owner calls it. */
  label: string;
  /** One line explaining what editing this changes. */
  hint: string;
};

export type SiteDefinition = {
  id: SiteId;
  /** Trading name, as it appears on the site itself. */
  name: string;
  /** What the business does, for the picker. */
  blurb: string;
  /** Live address. */
  url: string;
  /** Netlify site name, used to explain which builds a push triggers. */
  netlifyName: string;
  /** Local dev server port. */
  port: number;
  /** Accent used to tell the three apart at a glance. */
  accent: string;
  files: ContentFile[];
};

export const SITES: SiteDefinition[] = [
  {
    id: "company-a",
    name: "GG BEARERS",
    blurb: "The parent group. Trade, partnerships, investment and corporate services.",
    url: "https://ggbearers.com",
    netlifyName: "gg-bearers",
    port: 3000,
    accent: "#3B5BDB",
    files: [
      { id: "site", label: "Site details", hint: "Name, phone numbers, address, hours and the menu bar." },
      { id: "home", label: "Home page", hint: "The hero, the statement, the statistics and the closing band." },
      { id: "about", label: "About page", hint: "The story, vision, values, milestones and leadership roles." },
      { id: "services", label: "Services", hint: "Partnerships, investments and corporate services, and their pages." },
      { id: "companies", label: "Our companies", hint: "How GG FOODS and GG AUTOS are described on the parent site." },
      { id: "roles", label: "Careers", hint: "Open roles listed across the whole group." },
      { id: "contact", label: "Contact page", hint: "Contact wording and the enquiry categories." },
    ],
  },
  {
    id: "company-b",
    name: "GG FOODS",
    blurb: "The restaurant. Nigerian classics, intercontinental dishes and fresh smoothies.",
    url: "https://foods.ggbearers.com",
    netlifyName: "gg-food",
    port: 3001,
    accent: "#d9622b",
    files: [
      { id: "site", label: "Site details", hint: "Name, phone, WhatsApp, address, opening hours and the menu bar." },
      { id: "menu", label: "The menu", hint: "Every dish, its description, price and category." },
      { id: "about", label: "About page", hint: "The story, the kitchen roles and what the restaurant stands for." },
    ],
  },
  {
    id: "company-c",
    name: "GG AUTOS",
    blurb: "The yard. Mini buses and mini trucks, coupling, importation and wholesale.",
    url: "https://autos.ggbearers.com",
    netlifyName: "gg-autos",
    port: 3002,
    accent: "#d6231c",
    files: [
      { id: "site", label: "Site details", hint: "Name, contact details, trading hours, menu bar and footer." },
      { id: "home", label: "Home page", hint: "The hero, the assembly section, trust points and questions." },
      { id: "vehicles", label: "Vehicles", hint: "Every model in the catalogue and its specification." },
      { id: "services", label: "Services", hint: "Coupling and joining, quality, supply and the catalogue band." },
      { id: "wholesale", label: "Wholesale", hint: "Who it is for, how it works and the trading terms." },
      { id: "about", label: "About page", hint: "Story, mission, what we do, statistics, values and team roles." },
    ],
  },
];

export function getSite(id: string): SiteDefinition | undefined {
  return SITES.find((s) => s.id === id);
}

export function getFile(siteId: string, fileId: string): ContentFile | undefined {
  return getSite(siteId)?.files.find((f) => f.id === fileId);
}

/** True only for a site and file that appear in the registry above. */
export function isAllowed(siteId: string, fileId: string): boolean {
  return getFile(siteId, fileId) !== undefined;
}
