/* ============================================================
   SERVICES COPY.
   Coupling and attachment are the SAME service under two names
   the trade uses interchangeably. Both words appear here so a
   buyer searching either one finds us. Do not split them into
   two services.
   ============================================================ */

export const service = {
  label: "Core capability",
  title: "Coupling & attachment",
  standfirst:
    "Coupling and attachment are two names for the same work: putting component parts together into a complete, functioning vehicle. It is what GG Autos does before a single bus reaches the yard.",
  intro:
    "A vehicle arrives with us as parts. Chassis and body sections, engine and drivetrain, glass, doors, seats, wiring and trim. Our fitters put those parts together into a finished mini bus or mini truck built for Nigerian roads, then we test it before anyone sees it. That is coupling. Some of the trade calls it attachment. There is no difference between the two, and anyone who tells you otherwise is selling something.",
} as const;

/* A real sequence, so it is genuinely numbered. */
export const process = [
  {
    title: "Parts intake and inspection",
    body: "Every component is checked against the order before anything is joined. Parts that arrive damaged or out of specification go back rather than into a bus.",
  },
  {
    title: "Chassis and body coupling",
    body: "The body is mated to the chassis and squared to the frame. This is the joint that decides whether a vehicle tracks straight and whether the doors still shut in two years.",
  },
  {
    title: "Drivetrain and electrical",
    body: "Engine, gearbox and driveline are mounted and aligned, then the loom is run, terminated and tested circuit by circuit.",
  },
  {
    title: "Cabin, interior or load body",
    body: "A bus gets flooring, seating frames, seats, glass, trim and air conditioning to the plan the buyer ordered. A truck gets its dropside, flatbed or enclosed box built and mounted instead.",
  },
  {
    title: "Road test and sign-off",
    body: "The finished unit is road-tested off the yard, faults are corrected, and it is only listed for sale once it passes. The fitter who built it signs it off.",
  },
];

export const quality = {
  label: "Workmanship",
  title: "Why the joins matter",
  body: "Anyone can bolt a body to a frame. The difference shows up eighteen months later, on a road that was not built for the load. Torque figures, alignment and weld quality are checked at the point of assembly rather than after a complaint, because a vehicle that comes apart on a route costs its owner the route.",
  points: [
    {
      title: "Checked at the joint, not after the sale",
      body: "Inspection happens at each stage of the build. A fault found at the chassis stage costs an hour. The same fault found after delivery costs a week off the road.",
    },
    {
      title: "Built for the work it will do",
      body: "Seating plan, load body, roof height and suspension are set against the route and the payload, not against a showroom brochure.",
    },
    {
      title: "The same people answer for it",
      body: "Nothing is subcontracted out of sight. When you call about a vehicle we coupled, you are talking to the yard that coupled it.",
    },
  ],
} as const;

export const buyerMeaning = {
  label: "What this means for you",
  title: "Buying from the builder, not the middleman",
  points: [
    "You are buying from the people who put the vehicle together, so the answer to any question about it exists in this building.",
    "Specification is negotiable before the build. Seating layout, roof height and interior finish are set to your route rather than to whatever shipped.",
    "Faults have a named owner. There is no chain of suppliers to work through when something needs correcting.",
    "Fleet orders are assembled in batches to one identical specification, so your drivers and your mechanics learn one vehicle.",
  ],
} as const;

/* The full catalogue. Three services, no more. */
export const catalogue = [
  {
    title: "Coupling & attachment",
    body: "Component parts assembled into complete, road-ready mini buses and mini trucks on our own yard in Okota.",
  },
  {
    title: "Mini bus and mini truck sales",
    body: "Retail sales to drivers, traders and owners across the Suzuki and Daihatsu range.",
  },
  {
    title: "Distribution",
    body: "Wholesale supply to dealers, fleet operators and transport companies, assembled to order in volume.",
  },
] as const;

export const faqs = [
  {
    question: "Is coupling the same thing as attachment?",
    answer:
      "Yes. They are two words the trade uses for the same job, which is assembling component parts into a complete vehicle. We use both because buyers ask for both.",
  },
  {
    question: "Can I have a bus built to my own specification?",
    answer:
      "Within the limits of the platform, yes. Seating layout, roof height, interior finish and livery are the usual requests. Tell us the route and load and we will tell you what is sensible.",
  },
  {
    question: "How long does a build take?",
    answer:
      "It depends on the platform and on parts availability, and it changes with the size of the order. Call the yard with the model and quantity and we will give you a date rather than a guess.",
  },
  {
    question: "Do you couple buses for other dealers?",
    answer:
      "Yes. Batch assembly for dealers and fleet operators is a significant part of the work. Wholesale pricing and delivery scheduling are handled on the wholesale page.",
  },
  {
    question: "What happens if something goes wrong after I take delivery?",
    answer:
      "Bring it back to Okota and talk to us. [ADD YOUR WARRANTY OR AFTER SALES TERMS HERE, for example the period covered and what it includes.]",
  },
];
