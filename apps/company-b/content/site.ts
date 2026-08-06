/**
 * GG FOODS global site data. Single source for identity, contact and
 * navigation, CMS-ready. Phone, WhatsApp and address currently REUSE THE
 * PARENT COMPANY'S details (user-approved) until the restaurant's own are
 * confirmed, swap them here only.
 */

const PHONE = "09018495507";
const WHATSAPP = "2348062891562"; // international format, no plus, for wa.me
const WHATSAPP_PREFILL = "Hi GG Foods, I'd like to place an order.";

export const site = {
  name: "GG FOODS",
  legalName: "GG Foods",
  motto: "Taste with a touch of excellence",
  tagline:
    "Intercontinental dishes and Nigerian classics, cooked fresh in Okota, Lagos.",
  description:
    "GG FOODS is a Lagos restaurant serving intercontinental dishes, Nigerian meals, fresh smoothies and natural fruit drinks. Part of the GG BEARERS group.",
  url: "https://b.ggbearers.com",
  email: "ggbearers@gmail.com",

  parent: {
    name: "GG BEARERS",
    url: "https://ggbearers.com",
    label: "Part of the GG BEARERS group",
  },
  siblings: [{ name: "GG AUTOS", url: "https://c.ggbearers.com" }],

  phone: { label: PHONE, tel: `tel:+234${PHONE.replace(/^0/, "")}` },
  whatsapp: {
    number: WHATSAPP,
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`,
  },

  address: {
    street: "13 Femi Killa Street, opp. Market Square, Ago Palace",
    locality: "Okota",
    region: "Lagos",
    country: "Nigeria",
    full: "13 Femi Killa Street, opp. Market Square, Ago Palace, Okota, Lagos",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("13 Femi Killa Street, Ago Palace, Okota, Lagos"),
  },

  hours: {
    display: "Monday to Sunday, 10:00am to 10:00pm",
    short: "Daily, 10am till 10pm",
    schemaDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    opens: "10:00",
    closes: "22:00",
  },

  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
    { label: "Visit", href: "/visit" },
  ],
  orderCta: { label: "Order Now", href: "/order" },
} as const;
