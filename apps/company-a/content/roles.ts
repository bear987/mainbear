/**
 * Group-wide open roles.
 *
 * ⚠️ SEED / SAMPLE DATA, these are realistic placeholder listings to build and
 * demonstrate the Careers hub. They are NOT live vacancies. Replace this array
 * (or move it to a CMS) with real openings before launch. Each role is tagged by
 * company: A = GG BEARERS (parent), B = GG FOODS, C = GG AUTOS.
 */

export type CompanyTag = "A" | "B" | "C";
export type RoleType = "Full-time" | "Contract" | "Internship";

export type Role = {
  id: string;
  title: string;
  company: CompanyTag;
  department: string;
  location: string;
  type: RoleType;
  summary: string;
};

export const companyLabels: Record<CompanyTag, string> = {
  A: "GG BEARERS",
  B: "GG FOODS",
  C: "GG AUTOS",
};

export const roles: Role[] = [
  {
    id: "import-documentation-officer",
    title: "Import Documentation Officer",
    company: "A",
    department: "Trade Operations",
    location: "Okota, Lagos",
    type: "Full-time",
    summary:
      "Prepare and manage import paperwork, bills of lading and customs documentation, keeping every consignment audit-ready.",
  },
  {
    id: "customs-clearing-coordinator",
    title: "Customs Clearing Coordinator",
    company: "A",
    department: "Trade Operations",
    location: "Lagos (Apapa / Tin Can)",
    type: "Full-time",
    summary:
      "Coordinate clearing agents and port processes to move goods through customs cleanly and on schedule.",
  },
  {
    id: "partnerships-manager",
    title: "Partnerships Manager",
    company: "A",
    department: "Partnerships & Investments",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Source, structure and grow trade partnerships with manufacturers, exporters and distributors.",
  },
  {
    id: "group-finance-analyst",
    title: "Group Finance Analyst",
    company: "A",
    department: "Finance",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Own reconciliation, landed-cost analysis and reporting across the group's trade and subsidiary accounts.",
  },
  {
    id: "warehouse-supervisor-foods",
    title: "Warehouse Supervisor",
    company: "B",
    department: "Operations",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Run day-to-day warehouse operations for GG FOODS, accurate stock counts, safe storage and organised dispatch.",
  },
  {
    id: "wholesale-sales-rep-foods",
    title: "Wholesale Sales Representative",
    company: "B",
    department: "Sales",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Grow GG FOODS wholesale accounts and keep distributors supplied, informed and loyal.",
  },
  {
    id: "procurement-officer-foods",
    title: "Procurement Officer",
    company: "B",
    department: "Procurement",
    location: "Lagos",
    type: "Contract",
    summary:
      "Source food products, negotiate supplier terms and safeguard quality and margin for GG FOODS.",
  },
  {
    id: "automotive-sales-lead-autos",
    title: "Automotive Sales Lead",
    company: "C",
    department: "Sales",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Lead GG AUTOS vehicle sales, dealers, fleets and individual buyers, from enquiry to close.",
  },
  {
    id: "spare-parts-inventory-officer-autos",
    title: "Spare Parts Inventory Officer",
    company: "C",
    department: "Operations",
    location: "Lagos",
    type: "Full-time",
    summary:
      "Manage GG AUTOS spare-parts stock, imports, cataloguing, and keeping fast-movers available.",
  },
  {
    id: "trade-operations-intern",
    title: "Trade Operations Intern",
    company: "A",
    department: "Trade Operations",
    location: "Okota, Lagos",
    type: "Internship",
    summary:
      "Learn cross-border trade end to end, documentation, clearing and logistics, alongside the operations team.",
  },
];
