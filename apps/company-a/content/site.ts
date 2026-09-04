/**
 * Global site data, single source for identity, contact + navigation.
 *
 * The editable values live in data/site.json so the admin app can rewrite
 * them. Everything derived from those values stays here in TypeScript, so
 * changing a phone number in one place still updates its tel: link.
 */
import data from "./data/site.json";

export type NavItem = { label: string; href: string };

/** Nigerian local 0xxx number → +234 E.164 for tel: links. */
function toTelHref(local: string): string {
  return `tel:+234${local.replace(/^0/, "")}`;
}

const { phoneNumbers, nav, ...rest } = data.site;

export const site = {
  ...rest,
  phones: phoneNumbers.map((local) => ({ label: local, href: toTelHref(local) })),
  nav: nav as NavItem[],
  subsidiaries: rest.subsidiaries as { foods: string; autos: string },
};

export type Site = typeof site;
