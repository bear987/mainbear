/* ============================================================
   ABOUT COPY.
   Everything factual here comes from what the owner has told us:
   GG Autos couples, retails and distributes mini buses from
   Okota, Lagos, as a subsidiary of GG Bearers.

   Anything NOT confirmed is a [BRACKETED PLACEHOLDER]. No years
   in business, unit counts, staff numbers, awards or client
   names have been invented. Fill the brackets and delete them.
   ============================================================ */

export const about = {
  label: "About GG Autos",
  title: "The yard behind the buses",
  standfirst:
    "GG Autos assembles, sells and distributes mini buses from Okota, Lagos. We are the automotive arm of GG Bearers, an operating holding company trading in import, export, retail and wholesale.",
} as const;

export const story = {
  label: "How we work",
  title: "A workshop first, a showroom second",
  paragraphs: [
    "Most people in this trade buy finished vehicles and resell them. We started from the other end. Component parts come into the workshop in Okota and leave as complete passenger buses, coupled, wired, trimmed and road-tested by the people who work here.",
    "That order matters. Because we build, we know what is inside every unit we sell, we can specify a bus around the route it will actually run, and we can put a fault right instead of passing a buyer down a chain of suppliers.",
    "The rest of the business follows from the workshop. Retail sales for drivers and owners buying one bus. Wholesale distribution for dealers, fleet operators and transport companies buying in volume. Both are served from the same yard, to the same standard.",
  ],
} as const;

/* Real numbers only once the owner supplies them. */
export const stats = [
  { label: "Years assembling buses", value: "[ADD YOUR STAT]" },
  { label: "Units delivered", value: "[ADD YOUR STAT]" },
  { label: "Fleet clients supplied", value: "[ADD YOUR STAT]" },
  { label: "Seating capacities built", value: "7 to 18" },
];

export const values = [
  {
    title: "Say the condition out loud",
    body: "New, foreign used and locally used mean different things and carry different risks. Every listing states which it is, the mileage, and where the unit shows its age.",
  },
  {
    title: "Papers before price",
    body: "Duty, registration and ownership documents are in order before a unit goes on the yard. A cheap bus with incomplete papers is not a cheap bus.",
  },
  {
    title: "Inspection is welcome",
    body: "Bring your own mechanic. Put it on a lift. We would rather lose a sale to an honest inspection than win one that comes back.",
  },
  {
    title: "The builder answers the phone",
    body: "Nothing is subcontracted out of sight. The yard that coupled your bus is the yard you call when you need something.",
  },
];

/* Leadership: role titles only. No invented names or photographs. */
export const team = [
  {
    role: "Managing Director",
    remit: "Group direction, commercial partnerships and wholesale relationships.",
  },
  {
    role: "Workshop Manager",
    remit: "Coupling and attachment, build quality and the inspection sign-off.",
  },
  {
    role: "Sales Lead",
    remit: "Retail buyers, unit enquiries and the handover process.",
  },
  {
    role: "Fleet & Distribution",
    remit: "Volume orders, batch scheduling and delivery.",
  },
];

export const groupBand = {
  label: "Part of a group",
  title: "GG Bearers",
  body: "GG Autos is one of two subsidiaries of GG Bearers, alongside GG Foods. The group trades in import, export, retail and wholesale, and its motto, integrity is our first priority, is the standard the yard is held to.",
} as const;
