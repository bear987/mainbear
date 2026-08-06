/* ============================================================
   HOMEPAGE COPY. Edit the words here, not in the page file.
   ============================================================ */

export const hero = {
  eyebrow: "GG Autos / Subsidiary of GG Bearers / Lagos, NG",
  /** Answers what we do, who it is for, and why it matters. */
  headline: "We couple and sell mini buses and mini trucks",
  sub: "Suzuki and Daihatsu, built in our own Okota workshop from component parts, then sold one at a time to drivers and traders and by the fleet to dealers and transport companies.",
  primaryCta: { label: "See the range", href: "/inventory" },
  secondaryCta: { label: "Wholesale enquiry", href: "/wholesale" },
  posterAlt: "A row of mini buses on the GG Autos yard in Okota, Lagos, ready for delivery",
} as const;

/* The strongest thing a buyer can know about GG Autos, so it leads. */
export const assembly = {
  label: "What makes us different",
  title: "We build the vehicles we sell",
  body: "Most dealers buy a finished vehicle and mark it up. We couple ours. Component parts come into the Okota workshop and leave as a complete, road-ready mini bus or mini truck, which means we know exactly how every unit was put together, and we can fix it when something goes wrong.",
  points: [
    {
      title: "Coupling and attachment",
      body: "Chassis, body, cabin and interior assembled in-house, and load bodies built to the work the vehicle will do.",
    },
    {
      title: "Checked before it leaves",
      body: "Every unit is inspected and road-tested on our own yard before it is handed over.",
    },
    {
      title: "We answer for the work",
      body: "The people who coupled your vehicle are the people you call. Nothing is subcontracted out of sight.",
    },
  ],
  cta: { label: "How coupling works", href: "/services" },
} as const;

/* Two audiences, neither secondary. */
export const paths = [
  {
    key: "retail",
    label: "Buying one vehicle",
    title: "Retail",
    body: "For drivers, traders and owners buying a single unit. Compare the models side by side, see the full specification and the price in naira, then call us.",
    cta: { label: "See the range", href: "/inventory" },
  },
  {
    key: "wholesale",
    label: "Buying in volume",
    title: "Wholesale",
    body: "For dealers, fleet operators and transport companies. Volume pricing, batch assembly to your specification, and delivery scheduled around your route start date.",
    cta: { label: "Wholesale enquiry", href: "/wholesale" },
  },
] as const;

export const trust = {
  label: "Why buyers choose us",
  title: "A vehicle is a business, not a purchase",
  points: [
    {
      title: "The specification is stated plainly",
      body: "Seats, payload, engine, fuel use and dimensions against every model, so you can work out what it will carry and what it will cost you to run before you call.",
    },
    {
      title: "Papers complete",
      body: "Customs duty, registration and ownership documents are in order before a unit is handed over.",
    },
    {
      title: "Parts you can actually get",
      body: "Suzuki and Daihatsu are the models Lagos mechanics know, so a repair is a market run and not a six week import.",
    },
    {
      title: "Backed by a group",
      body: "GG Autos is part of GG Bearers, an operating holding company trading in import, export, retail and wholesale.",
    },
  ],
} as const;

/* Answers the objections a buyer raises before they call. */
export const faqs = [
  {
    question: "Can I inspect the vehicle before I pay?",
    answer:
      "Yes. Come to the yard in Okota and inspect any unit yourself, or bring your own mechanic. We would rather you check it than take our word for it.",
  },
  {
    question: "Should I buy a mini bus or a mini truck?",
    answer:
      "If you are carrying people, a bus. If you are carrying goods, a truck, and then it is a question of whether the load needs to stay dry. Tell us the route and the load and we will tell you which one to put on it.",
  },
  {
    question: "What is the difference between the Suzuki and the Daihatsu?",
    answer:
      "They are close competitors and both are well supported here. In broad terms the Suzuki Every is the most economical on fuel, the Daihatsu Gran Max carries the most, and the Hijet sits in the middle at the lowest price.",
  },
  {
    question: "Do you sell to dealers and fleets?",
    answer:
      "Yes, and it is a large part of what we do. Wholesale pricing starts from the minimum quantity shown against each model, and we assemble to order in batches for fleet buyers.",
  },
  {
    question: "Can you build to my specification?",
    answer:
      "Within reason. Seating layout, roof height, load body and interior finish are the usual requests. Tell us the work the vehicle will do and we will tell you what we can build.",
  },
  {
    question: "Is the price on the site the final price?",
    answer:
      "It is the price the model starts from today. Options and body work move it up, and a wholesale order moves it down with quantity.",
  },
];
