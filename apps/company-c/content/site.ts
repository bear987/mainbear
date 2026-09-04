/* ============================================================
   GG AUTOS — site-wide constants.
   Contact details are INHERITED FROM THE PARENT, GG BEARERS
   (confirmed by the owner). Swap any value in the admin app and
   it updates everywhere on the site.

   Editable values live in data/site.json. The Group footer
   column is built from `group` below, so the parent and sibling
   URLs have exactly one source of truth.
   ============================================================ */
import data from "./data/site.json";

export const site = data.site;

/** The parent holding company and its other subsidiary. Absolute URLs only. */
export const group = data.group;

/* ------------------------------------------------------------
   CONTACT — inherited from GG Bearers.
   The owner confirmed GG Autos trades under the parent's
   address, phone lines and email until it has its own.
   ------------------------------------------------------------ */
export const contact = data.contact;

/** Six top-level items, matching the brief. */
export const navLinks = data.navLinks;

/** The header CTA. Enquiry-driven, never "Get Started". */
export const navCta = data.navCta;

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

export const footerColumns: FooterColumn[] = [
  ...(data.footerColumns as FooterColumn[]),
  {
    title: data.groupColumnTitle,
    links: [
      { label: group.parent.name, href: group.parent.href, external: true },
      { label: group.sibling.name, href: group.sibling.href, external: true },
    ],
  },
];

/** The four real services. Invent no others. */
export const capabilities = data.capabilities;

/** Monospace hero ticker. Vocabulary from the yard, not marketing. */
export const tickerItems = data.tickerItems;
