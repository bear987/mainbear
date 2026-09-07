import data from "./data/privacy.json";

/**
 * Privacy policy content.
 *
 * Every statement in it describes what this site actually does: the fields the
 * form takes, who delivers the email, who serves the pages. Keep it that way.
 * If the site starts doing something new with people's information, this file
 * is part of that change, not an afterthought.
 */

export type PrivacySection = { heading: string; body: string[] };

export type Privacy = {
  title: string;
  updated: string;
  intro: string;
  sections: PrivacySection[];
  contactHeading: string;
  contactBody: string;
};

const all: Privacy = data.privacy;

/**
 * The analytics section is only true once analytics is switched on, so it is
 * dropped while NEXT_PUBLIC_CF_BEACON is unset. A privacy policy that
 * describes something the site is not doing is worse than one that is silent.
 */
export const privacy: Privacy = {
  ...all,
  sections: all.sections.filter(
    (s) => s.heading !== "Visitor numbers" || Boolean(process.env.NEXT_PUBLIC_CF_BEACON),
  ),
};
