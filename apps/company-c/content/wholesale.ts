/* ============================================================
   WHOLESALE COPY.
   Commercial terms the owner has not confirmed are marked with
   [SQUARE BRACKETS]. Replace those with the real terms before
   launch. Do not invent figures to fill them.
   ============================================================ */

export const wholesale = {
  label: "Dealers, fleets and transport companies",
  title: "Buying in volume",
  intro:
    "Wholesale is not a discount on the retail page. It is a different way of buying: units assembled to one specification, priced against quantity, and delivered against your route start date rather than whenever they happen to be ready.",
} as const;

export const audiences = [
  {
    title: "Dealers",
    body: "Stock for your own lot, in the models that move fastest in your market. Consistent specification across a batch so your listings and your pricing stay simple.",
  },
  {
    title: "Fleet operators",
    body: "Identical units so your drivers learn one vehicle and your mechanics stock one set of parts. Livery and seating fitted before delivery.",
  },
  {
    title: "Transport companies",
    body: "Buses built for the route they will run, delivered in batches timed to when you actually put them on the road.",
  },
];

/* A real sequence: this is how an order actually proceeds. */
export const howItWorks = [
  {
    title: "Tell us the quantity and the specification",
    body: "Model, seat count, fuel and how many. If you are not sure which platform suits the route, tell us the route instead and we will advise.",
  },
  {
    title: "We quote against the volume",
    body: "Price per unit moves with quantity and with how much of the build is to your specification. You get a written quote, not a number over the phone.",
  },
  {
    title: "Terms and schedule agreed",
    body: "Payment terms and a delivery schedule are agreed before assembly starts, so both sides know what lands when.",
  },
  {
    title: "Batch assembly",
    body: "Units are coupled to one identical specification in the Okota workshop, and inspected at each stage of the build.",
  },
  {
    title: "Delivery and handover",
    body: "Units are road-tested, documented and handed over together, with papers complete for every unit in the batch.",
  },
];

export const terms = [
  {
    term: "Minimum order",
    value: "From 2 units on most models, from 5 on new coupled units",
    note: "Per-unit minimums are shown against each listing in the inventory.",
  },
  {
    term: "Volume pricing",
    value: "Quoted per order",
    note: "Price per unit falls with quantity. Ask for a written quote with your numbers.",
  },
  {
    term: "Payment terms",
    value: "[ADD YOUR PAYMENT TERMS, for example deposit percentage and balance on delivery]",
    note: "Agreed in writing before assembly begins.",
  },
  {
    term: "Lead time",
    value: "[ADD YOUR TYPICAL LEAD TIME for a batch order]",
    note: "Depends on platform, specification and parts availability.",
  },
  {
    term: "Delivery",
    value: "[ADD YOUR DELIVERY COVERAGE, for example Lagos only or nationwide]",
    note: "Collection from Okota is always available.",
  },
  {
    term: "After sales",
    value: "[ADD YOUR WARRANTY OR AFTER SALES TERMS]",
    note: "Units we coupled are supported by the yard that coupled them.",
  },
];

export const faqs = [
  {
    question: "What counts as a wholesale order?",
    answer:
      "Two units or more on most models, and five or more on new coupled units. The minimum for each unit is shown on its listing in the inventory.",
  },
  {
    question: "Can I mix models in one order?",
    answer:
      "Yes. Volume is counted across the order, not per model, so a mixed batch still qualifies. Delivery may be staged if the platforms have different lead times.",
  },
  {
    question: "Do you deliver outside Lagos?",
    answer:
      "Tell us where the units need to land and we will price it into the quote. [CONFIRM YOUR DELIVERY COVERAGE HERE.]",
  },
  {
    question: "Can you fit our livery and seating before delivery?",
    answer:
      "Yes. Livery, seating layout and interior finish are fitted during assembly, which is cheaper and cleaner than retrofitting after handover.",
  },
  {
    question: "How do I get a quote?",
    answer:
      "Send the form on this page with your company name, quantity and preferred models, or message the wholesale line on WhatsApp. Quotes are written, not verbal.",
  },
];
