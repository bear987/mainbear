/**
 * Service offerings GG BEARERS runs directly. Careers/talent is a fourth area
 * but lives on the Careers page, so it is summarised here only for the
 * homepage "what we do" overview, it has no standalone /services entry.
 */

export type ServiceStep = { title: string; description: string };
export type ServiceFaq = { q: string; a: string };

export type Service = {
  slug: "partnerships" | "investments" | "corporate-services";
  name: string;
  /** lucide-react icon name, mapped in the UI. */
  icon: "Handshake" | "TrendingUp" | "Building2";
  tagline: string;
  summary: string;
  intro: string;
  what: string[];
  how: ServiceStep[];
  benefits: string[];
  faqs: ServiceFaq[];
  cta: { label: string; subject: string };
};

export const services: Service[] = [
  {
    slug: "partnerships",
    name: "Partnerships",
    icon: "Handshake",
    tagline: "Trade partnerships built to last.",
    summary:
      "Co-import, distribution and supply partnerships with manufacturers, exporters and traders who want a dependable Nigerian counterpart.",
    intro:
      "We partner with manufacturers, exporters, distributors and fellow traders who need a credible, well-connected counterpart in Nigeria and across the region. A GG BEARERS partnership is a working relationship, shared logistics, shared market access and a single accountable point of contact, not a one-off transaction.",
    what: [
      "Co-importation arrangements where we share sourcing, clearing and last-mile distribution so partners reach the Nigerian market without standing up their own operation.",
      "Distribution partnerships that put your product into our wholesale and retail channels, with transparent terms and honest reporting on what actually moves.",
      "Supply agreements where we become the reliable buyer or off-taker your planning depends on, predictable volumes, predictable payment.",
    ],
    how: [
      {
        title: "Introductory call",
        description:
          "We learn what you make or move, the volumes involved and the market you are trying to reach. No obligation.",
      },
      {
        title: "Fit & terms",
        description:
          "We agree scope, responsibilities, pricing and logistics in writing, clear on who handles sourcing, clearing, storage and distribution.",
      },
      {
        title: "Pilot shipment",
        description:
          "We prove the relationship on a controlled first consignment before scaling, so both sides see real performance, not promises.",
      },
      {
        title: "Scale & review",
        description:
          "We grow volumes on what works and review quarterly, adjusting terms openly as the partnership matures.",
      },
    ],
    benefits: [
      "A single accountable counterpart for sourcing, clearing and distribution",
      "Established wholesale and retail channels across Lagos and beyond",
      "Transparent terms and plain-spoken reporting",
      "Pilot-first approach that de-risks the relationship",
    ],
    faqs: [
      {
        q: "What kinds of partners do you work with?",
        a: "Manufacturers, exporters, distributors and traders, in food, automotive and general goods, who want a reliable Nigerian partner for importation, supply or distribution.",
      },
      {
        q: "Do I need to commit to large volumes to start?",
        a: "No. We almost always begin with a pilot consignment so both sides can judge the relationship on real performance before scaling.",
      },
      {
        q: "Which markets can you reach?",
        a: "Our core market is Nigeria, anchored in Lagos, with established import and export routes. Tell us your target and we will be candid about where we can and cannot help.",
      },
    ],
    cta: { label: "Discuss a partnership", subject: "partnership" },
  },
  {
    slug: "investments",
    name: "Investments",
    icon: "TrendingUp",
    tagline: "Capital placed with operators who deliver.",
    summary:
      "We invest in and alongside trade-driven ventures, backing operators in import/export, food and automotive with capital and operating know-how.",
    intro:
      "GG BEARERS deploys its own capital into trade-driven opportunities, businesses and consignments in importation, exportation, food and automotive where we understand the operating reality, not just the spreadsheet. We invest as operators, bringing logistics, market access and discipline alongside the cheque.",
    what: [
      "Direct investment into import and export consignments and the working capital that finances them.",
      "Stakes in trade-led ventures in food, automotive and general merchandise where our channels and clearing expertise add real value.",
      "Co-investment with partners who bring the deal and want an operator, not a passive financier, beside them.",
    ],
    how: [
      {
        title: "Opportunity review",
        description:
          "Share the opportunity. We assess the goods, the route, the margins and the operating risk with a trader's eye.",
      },
      {
        title: "Diligence",
        description:
          "We verify suppliers, costs, clearing exposure and demand before any capital is committed.",
      },
      {
        title: "Structure",
        description:
          "We agree the structure, consignment finance, equity, or a profit-share, and document it clearly.",
      },
      {
        title: "Operate & report",
        description:
          "We stay close to execution and report honestly on performance, returns and lessons.",
      },
    ],
    benefits: [
      "Capital from an operator who understands trade, not just finance",
      "Access to clearing, logistics and distribution muscle",
      "Honest diligence that protects both sides",
      "Structures that match the deal, consignment, equity or profit-share",
    ],
    faqs: [
      {
        q: "What do you invest in?",
        a: "Trade-driven opportunities we understand operationally, import/export consignments, and ventures in food, automotive and general merchandise.",
      },
      {
        q: "Do you take equity or finance individual deals?",
        a: "Both. Depending on the opportunity we will finance a specific consignment, take an equity stake, or structure a profit-share. We agree the right form upfront.",
      },
      {
        q: "How do you assess risk?",
        a: "We verify suppliers, landed costs, clearing exposure and real demand before committing. If the operating risk is unclear, we say so.",
      },
    ],
    cta: { label: "Pitch an opportunity", subject: "investment" },
  },
  {
    slug: "corporate-services",
    name: "Corporate Services",
    icon: "Building2",
    tagline: "The trade back-office, run for you.",
    summary:
      "Importation, clearing, warehousing and distribution handled on your behalf, the operational backbone of cross-border trade, without the overhead.",
    intro:
      "Not everyone wants to build an import operation from scratch. Our corporate services let businesses use the infrastructure GG BEARERS already runs, sourcing, clearing, warehousing and distribution, as a service, so they can trade across borders without carrying the fixed cost or learning curve.",
    what: [
      "Importation and exportation handling, sourcing, documentation, freight coordination and customs clearing managed end to end.",
      "Warehousing and inventory, secure storage in Lagos with honest stock counts and organised dispatch.",
      "Distribution, moving goods into wholesale and retail channels through routes we already operate.",
    ],
    how: [
      {
        title: "Scope the work",
        description:
          "Tell us what you need moved or handled. We map the route, the paperwork and the costs before you commit.",
      },
      {
        title: "Quote & agree",
        description:
          "You get a clear, itemised quote, no hidden clearing surprises, and we agree timelines in writing.",
      },
      {
        title: "Execute",
        description:
          "We handle sourcing, freight, clearing, storage and dispatch, keeping you updated at each handover.",
      },
      {
        title: "Account & improve",
        description:
          "We reconcile honestly at the end and look for ways to make the next run cheaper or faster.",
      },
    ],
    benefits: [
      "Cross-border trade capability without building your own operation",
      "Itemised, honest quoting, no hidden clearing costs",
      "Secure Lagos warehousing with accurate stock counts",
      "One accountable team from source to shelf",
    ],
    faqs: [
      {
        q: "Can you handle clearing and customs documentation?",
        a: "Yes. Sourcing, freight coordination, customs documentation and clearing are handled end to end as part of the service.",
      },
      {
        q: "Do you offer warehousing on its own?",
        a: "Yes. You can use our secure Lagos storage and dispatch independently of importation if that is all you need.",
      },
      {
        q: "How is pricing structured?",
        a: "Every engagement is quoted upfront and itemised so you can see exactly what each stage costs before you agree.",
      },
    ],
    cta: { label: "Request a quote", subject: "corporate-services" },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
