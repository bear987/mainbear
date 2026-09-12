import { analyticsProviderName } from "@/components/web-analytics";
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
 * dropped while no provider is configured, and it names whichever provider is
 * actually running. A privacy policy that describes something the site is not
 * doing, or names the wrong company, is worse than one that is silent.
 */
const provider = analyticsProviderName();

export const privacy: Privacy = {
  ...all,
  sections: all.sections
    .filter((s) => s.heading !== "Visitor numbers" || provider !== null)
    .map((s) =>
      s.heading === "Visitor numbers" && provider
        ? { ...s, body: s.body.map((p) => p.replaceAll("ANALYTICS_PROVIDER", provider)) }
        : s,
    ),
};
