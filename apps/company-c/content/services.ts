/* ============================================================
   SERVICES COPY.
   Coupling, attachment and joining are the SAME service under
   three names the trade uses interchangeably. All three words
   appear here so a buyer searching any one of them finds us.
   Do not split them into separate services.
   ============================================================ */

export const service = {
  label: "Core capability",
  title: "Coupling, attachment & joining",
  standfirst:
    "Coupling, attachment and joining are three names for the same work: putting component parts together into a complete, functioning vehicle. It is what GG Autos does before a single bus reaches the yard.",
  intro:
    "A vehicle arrives with us as parts. Chassis and body sections, engine and drivetrain, glass, doors, seats, wiring and trim. Our fitters put those parts together into a finished mini bus or mini truck built for Nigerian roads, then we test it before anyone sees it. That is coupling. Some of the trade calls it attachment, others call it joining. There is no difference between the three, and anyone who tells you otherwise is selling something.",
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

/* What the vehicles are supplied for, and what comes with them.
   NOT a sequence, so these are deliberately not numbered: the uses are two
   parallel audiences and the rest are things included with any order. */
export const supply = {
  label: "Products & services",
  title: "What we supply, and who for",
  intro:
    "The same vehicles serve two very different buyers, and everything below comes with them either way.",
  uses: [
    {
      title: "Private use",
      body: "Schools and organisations running transport of their own.",
    },
    {
      title: "Commercial use",
      body: "Interstate transport, factories, logistics and delivery work of every kind.",
    },
  ],
  /* Makes supplied to order. Broader than the priced range in the inventory,
     which stays Suzuki, Hijet and Daihatsu. */
  makes: [
    "Hummer buses",
    "Toyota Hiace",
    "Dyna trucks",
    "Mazda Bongo trucks and buses",
    "Nissan Vanette",
  ],
  workshop: [
    "Full body painting, and servicing of the engine.",
    "Logistics upgrades: additional springs, burglary proofing, full container bodies, and a change from 12 rings to 14 rings for maximum support and balancing.",
    "Wheel balancing and alignment.",
  ],
  included: [
    "Maintenance and repair services, carried out on our own yard.",
    "Genuine vehicle spare parts, distributed across the globe.",
    "Delivery of the vehicle to your location.",
    "Certified joining experts on every build.",
  ],
  /* A real figure from the yard, stamped as a readout. */
  turnaround: { value: "2 to 3", unit: "days", label: "To couple a vehicle" },
} as const;

/* The full catalogue. Four services, no more.
   Importation and clearing was added on the owner's instruction: GG Autos
   handles it for its own yard AND for the wider GG Bearers group. */
export const catalogue = [
  {
    title: "Coupling, attachment & joining",
    body: "Component parts assembled into complete, road-ready mini buses and mini trucks on our own yard in Okota.",
  },
  {
    title: "Importation & clearing",
    body: "Vehicles and parts imported and cleared in-house, for our own yard and for the wider GG Bearers group.",
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
    question: "Is coupling the same thing as attachment and joining?",
    answer:
      "Yes. They are three words the trade uses for the same job, which is assembling component parts into a complete vehicle. We use all three because buyers ask for all three.",
  },
  {
    question: "Can I have a bus built to my own specification?",
    answer:
      "Within the limits of the platform, yes. Seating layout, roof height, interior finish and livery are the usual requests. Tell us the route and load and we will tell you what is sensible.",
  },
  {
    question: "How long does a build take?",
    answer:
      "Two to three days to couple a single vehicle. Larger orders, custom body work and parts availability move that, so call the yard with the model and quantity and we will give you a date rather than a guess.",
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
