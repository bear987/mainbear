/**
 * The two subsidiaries GG BEARERS routes visitors to.
 * `href` is always a full absolute URL (cross-subdomain), and is taken from
 * site.subsidiaries rather than stored here, so the group's URLs have exactly
 * one source of truth.
 *
 * Editable values live in data/companies.json.
 */
import { site } from "@/content/site";
import data from "./data/companies.json";

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

type CompanyData = Omit<Company, "href">;

export const companies: Company[] = (data.companies as CompanyData[]).map((company) => ({
  ...company,
  href: site.subsidiaries[company.id],
}));
