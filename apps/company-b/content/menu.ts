/**
 * The GG FOODS menu, edited by the owner in the admin.
 *
 * The STRUCTURE is the contract: swap items freely, keep the fields. Each
 * item's photo is read from /public/images/menu/<slug>.jpg, so dropping a file
 * with the matching name makes it appear with no code change. A styled
 * fallback renders until the photo exists.
 *
 * The slug is only the photo's file name. The owner renames dishes freely, so
 * a slug that no longer matches its dish's name is expected, not a mistake.
 *
 * Editable values live in data/menu.json.
 */
import data from "./data/menu.json";

/**
 * A category id from `categories` in menu.json. A plain string rather than a
 * union, because categories are added in the admin, and a list written out
 * here would go stale the first time one was.
 */
export type MenuCategory = string;
export type MenuTag = "spicy" | "vegetarian";

export type MenuItem = {
  slug: string;
  name: string;
  /** May be empty, and then the card shows no description at all. */
  description: string;
  /** null until the owner sets a price; the card then shows none. */
  priceNGN: number | null;
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
