/**
 * ============================================================
 * PLACEHOLDER — replace with real menu.
 * ============================================================
 * Realistic seed data so the site works end to end. The STRUCTURE is the
 * contract: swap items freely, keep the fields. Each item's photo is read
 * from /public/images/menu/<slug>.jpg, so dropping a file with the matching
 * name makes it appear with no code change. A styled fallback renders until
 * the photo exists.
 */

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

export const categories: { id: MenuCategory; label: string; blurb: string }[] = [
  {
    id: "nigerian",
    label: "Nigerian Meals",
    blurb: "The classics, cooked the way they should be: slow, generous and full of fire.",
  },
  {
    id: "intercontinental",
    label: "Intercontinental",
    blurb: "Dishes from further afield, made fresh with the same kitchen discipline.",
  },
  {
    id: "sides-drinks",
    label: "Sides & Drinks",
    blurb: "Small plates, fresh smoothies and natural fruit drinks made in-house.",
  },
];

export const menu: MenuItem[] = [
  // ---- Nigerian Meals ----
  {
    slug: "smoky-party-jollof-rice",
    name: "Smoky Party Jollof Rice",
    description:
      "Long-grain rice cooked down in a smoky pepper base, served with fried plantain and your choice of chicken, beef or fish.",
    priceNGN: 4500,
    category: "nigerian",
    tags: ["spicy"],
    signature: true,
  },
  {
    slug: "egusi-soup-pounded-yam",
    name: "Egusi Soup with Pounded Yam",
    description:
      "Rich melon-seed soup loaded with assorted meat and stockfish, served with soft, freshly pounded yam.",
    priceNGN: 6500,
    category: "nigerian",
    signature: true,
  },
  {
    slug: "suya-beef-platter",
    name: "Suya Beef Platter",
    description:
      "Thin-cut beef grilled over open flame, dusted with yaji spice, served with fresh onions and tomatoes.",
    priceNGN: 8500,
    category: "nigerian",
    tags: ["spicy"],
    signature: true,
  },
  {
    slug: "catfish-pepper-soup",
    name: "Catfish Pepper Soup",
    description:
      "Fresh catfish simmered in a hot, aromatic broth of scent leaves and native spice. Clears the head.",
    priceNGN: 7000,
    category: "nigerian",
    tags: ["spicy"],
  },
  {
    slug: "ofada-rice-ayamase",
    name: "Ofada Rice with Ayamase",
    description:
      "Local ofada rice with the famous green-pepper designer stew, assorted meat and boiled egg.",
    priceNGN: 5500,
    category: "nigerian",
    tags: ["spicy"],
  },
  {
    slug: "moi-moi-deluxe",
    name: "Moi Moi Deluxe",
    description:
      "Steamed bean pudding with egg and fish, wrapped and cooked in leaves for that unmistakable aroma.",
    priceNGN: 2000,
    category: "nigerian",
  },
  {
    slug: "village-fried-rice-grilled-chicken",
    name: "Village Fried Rice with Grilled Chicken",
    description:
      "Wok-fried rice with liver, green peas and sweet peppers, served with a charred quarter chicken.",
    priceNGN: 6000,
    category: "nigerian",
  },

  // ---- Intercontinental ----
  {
    slug: "grilled-salmon-lemon-butter",
    name: "Grilled Salmon in Lemon Butter",
    description:
      "Atlantic salmon fillet grilled to flake, finished with a lemon butter sauce, served with herbed potatoes.",
    priceNGN: 15500,
    category: "intercontinental",
    signature: true,
  },
  {
    slug: "creamy-chicken-alfredo",
    name: "Creamy Chicken Alfredo",
    description:
      "Fettuccine tossed in a parmesan cream sauce with strips of grilled chicken breast.",
    priceNGN: 7500,
    category: "intercontinental",
  },
  {
    slug: "gg-smash-burger-fries",
    name: "GG Smash Burger and Fries",
    description:
      "Double-smashed beef patties, melted cheese and house sauce in a toasted brioche bun, with crispy fries.",
    priceNGN: 7000,
    category: "intercontinental",
  },
  {
    slug: "chicken-shawarma-wrap",
    name: "Chicken Shawarma Wrap",
    description:
      "Marinated chicken, crunchy vegetables and garlic cream rolled tight and toasted on the grill.",
    priceNGN: 4500,
    category: "intercontinental",
  },
  {
    slug: "beef-stir-fry-noodles",
    name: "Beef Stir-Fry Noodles",
    description:
      "Egg noodles flash-fried with strips of beef, spring onions and a glossy soy-ginger glaze.",
    priceNGN: 5000,
    category: "intercontinental",
    tags: ["spicy"],
  },
  {
    slug: "club-sandwich-triple-stack",
    name: "Triple-Stack Club Sandwich",
    description:
      "Three layers of toasted bread with grilled chicken, egg, cheese and fresh salad, served with fries.",
    priceNGN: 5500,
    category: "intercontinental",
  },
  {
    slug: "barbecue-beef-short-ribs",
    name: "Barbecue Beef Short Ribs",
    description:
      "Slow-cooked short ribs brushed with a sticky barbecue glaze until they fall off the bone.",
    priceNGN: 12500,
    category: "intercontinental",
  },

  // ---- Sides & Drinks ----
  {
    slug: "dodo-fried-plantain",
    name: "Dodo (Fried Plantain)",
    description: "Sweet ripe plantain, deep-fried golden at the edges.",
    priceNGN: 1500,
    category: "sides-drinks",
    tags: ["vegetarian"],
  },
  {
    slug: "golden-spring-rolls",
    name: "Golden Spring Rolls",
    description: "Crisp vegetable spring rolls with a sweet-chilli dip.",
    priceNGN: 2500,
    category: "sides-drinks",
    tags: ["vegetarian"],
  },
  {
    slug: "chapman-classic",
    name: "Classic Chapman",
    description:
      "The Lagos favourite: a tall, ice-cold mix of citrus, grenadine and bitters, finished with cucumber.",
    priceNGN: 2500,
    category: "sides-drinks",
  },
  {
    slug: "mango-pineapple-smoothie",
    name: "Mango Pineapple Smoothie",
    description: "Fresh mango and pineapple blended in-house, nothing artificial.",
    priceNGN: 3000,
    category: "sides-drinks",
    tags: ["vegetarian"],
  },
  {
    slug: "zobo-iced-hibiscus",
    name: "Iced Zobo",
    description: "Chilled hibiscus drink brewed with ginger and pineapple peel.",
    priceNGN: 1500,
    category: "sides-drinks",
    tags: ["vegetarian"],
  },
];

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
