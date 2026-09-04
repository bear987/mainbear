/**
 * About / Our Story content. Leadership is presented as role-title cards with
 * styled monogram placeholders (no invented individuals), swap in real names,
 * bios and photos later without touching the layout.
 *
 * Editable values live in data/about.json.
 */
import data from "./data/about.json";

export type Value = { title: string; body: string };
export type Milestone = { phase: string; body: string };
export type Leader = { role: string; focus: string; initials: string };

export type About = {
  hero: { eyebrow: string; title: string; lede: string };
  story: { title: string; paragraphs: string[] };
  vision: { title: string; body: string };
  values: Value[];
  milestones: Milestone[];
  leadership: { title: string; lede: string; roles: Leader[] };
};

export const about: About = data.about;
