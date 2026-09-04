/**
 * Group-wide open roles.
 *
 * ⚠️ SEED / SAMPLE DATA, these are realistic placeholder listings to build and
 * demonstrate the Careers hub. They are NOT live vacancies. Replace them in the
 * admin app with real openings before launch. Each role is tagged by company:
 * A = GG BEARERS (parent), B = GG FOODS, C = GG AUTOS.
 *
 * Editable values live in data/roles.json.
 */
import data from "./data/roles.json";

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

export const companyLabels: Record<CompanyTag, string> = data.companyLabels;

export const roles: Role[] = data.roles as Role[];
