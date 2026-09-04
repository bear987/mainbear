/**
 * About page content. PLACEHOLDER copy in the brand's voice, swap freely.
 * The kitchen lead is presented by role (no invented named individuals);
 * replace with the real chef's name, photo and bio when available.
 *
 * Editable values live in data/about.json.
 */
import data from "./data/about.json";

export type KitchenRole = { role: string; focus: string };
export type Value = { title: string; body: string };

export type About = {
  hero: { eyebrow: string; title: string; lede: string };
  story: string[];
  kitchen: { title: string; lede: string; roles: KitchenRole[] };
  values: Value[];
};

export const about: About = data.about;
