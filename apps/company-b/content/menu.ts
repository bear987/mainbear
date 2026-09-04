/**
 * ============================================================
 * PLACEHOLDER — replace with the real menu.
 * ============================================================
 * Realistic seed data so the site works end to end. The STRUCTURE is the
 * contract: swap items freely, keep the fields. Each item's photo is read
 * from /public/images/menu/<slug>.jpg, so dropping a file with the matching
 * name makes it appear with no code change. A styled fallback renders until
 * the photo exists.
 *
 * Editable values live in data/menu.json.
 */
import data from "./data/menu.json";

export type MenuCategory = "nigerian" | "intercontinental" | "sides-drinks";
export type MenuTag = "spicy" | "vegetarian";

export type MenuItem = {
  slug: string;
  name: string;
  description: string;
  priceNGN: number;
  category: MenuCategory;
  tags?: MenuTag[];
  /** Featured on the home page strip (keep 3 or 4 true). */
  signature?: boolean;
};

export const categories: { id: MenuCategory; label: string; blurb: string }[] =
  data.categories as { id: MenuCategory; label: string; blurb: string }[];

export const menu: MenuItem[] = data.menu as MenuItem[];

/** Image convention: drop /public/images/menu/<slug>.jpg and it appears. */
export function menuImage(slug: string): string {
  return `/images/menu/${slug}.jpg`;
}

export function formatNaira(n: number): string {
  return `₦${n.toLocaleString("en-NG")}`;
}

export function signatureDishes(): MenuItem[] {
  return menu.filter((m) => m.signature);
}

export function byCategory(id: MenuCategory): MenuItem[] {
  return menu.filter((m) => m.category === id);
}
