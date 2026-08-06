/**
 * Contact data. `inquiryTypes` powers the routed "what's this about?" selector;
 * the values MUST stay in sync with the enum in lib/contact-schema.ts and with
 * the `subject` values used by service-page CTAs.
 */
export const inquiryTypes = [
  { value: "partnership", label: "Partnership" },
  { value: "investment", label: "Investment" },
  { value: "corporate-services", label: "Corporate services" },
  { value: "careers", label: "Careers" },
  { value: "general", label: "General enquiry" },
] as const;

export type InquiryValue = (typeof inquiryTypes)[number]["value"];

export const contactCopy = {
  eyebrow: "Contact",
  title: "Start a conversation.",
  lede: "Tell us what it's about and we'll route you to the right person, partnerships, investment, corporate services, or careers. We typically reply within two business days.",
  responseTime: "Typical reply time: within 2 business days",
};
