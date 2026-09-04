/**
 * Service offerings GG BEARERS runs directly. Careers/talent is a fourth area
 * but lives on the Careers page, so it is summarised here only for the
 * homepage "what we do" overview, it has no standalone /services entry.
 *
 * Editable values live in data/services.json.
 */
import data from "./data/services.json";

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

export const services: Service[] = data.services as Service[];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
