/**
 * Homepage content.
 *
 * The "what we do" cards are the three services plus any extra cards held in
 * data/home.json, so adding or renaming a service updates the homepage without
 * a second edit. Only the extra cards are stored as data here.
 */
import { services } from "@/content/services";
import data from "./data/home.json";

export type Stat = { value: string; label: string; countTo?: number };

export type DoArea = {
  name: string;
  summary: string;
  href: string;
  icon: "Handshake" | "TrendingUp" | "Building2" | "Users";
};

type Cta = { label: string; href: string };

export type Home = {
  hero: {
    eyebrow: string;
    title: string;
    standfirst: { lead: string; body: string };
    lede: string;
    primary: Cta;
    secondary: Cta;
  };
  stats: Stat[];
  whatWeDo: { eyebrow: string; title: string; lede: string; areas: DoArea[] };
  companies: { eyebrow: string; title: string; lede: string };
  closing: { title: string; lede: string; primary: Cta };
};

const { extraAreas, ...whatWeDo } = data.home.whatWeDo;

export const home: Home = {
  ...data.home,
  stats: data.home.stats as Stat[],
  whatWeDo: {
    ...whatWeDo,
    areas: [
      ...services.map<DoArea>((s) => ({
        name: s.name,
        summary: s.summary,
        href: `/services/${s.slug}`,
        icon: s.icon,
      })),
      ...(extraAreas as DoArea[]),
    ],
  },
};
