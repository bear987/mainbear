/**
 * Contact data. `inquiryTypes` powers the routed "what's this about?" selector;
 * the values MUST stay in sync with the enum in lib/contact-schema.ts and with
 * the `subject` values used by service-page CTAs. The admin app exposes the
 * labels for editing but not the values, for that reason.
 *
 * Editable values live in data/contact.json.
 */
import data from "./data/contact.json";

export type InquiryValue =
  | "partnership"
  | "investment"
  | "corporate-services"
  | "careers"
  | "general";

export type InquiryType = { value: InquiryValue; label: string };

export const inquiryTypes: InquiryType[] = data.inquiryTypes as InquiryType[];

export const contactCopy: {
  eyebrow: string;
  title: string;
  lede: string;
  responseTime: string;
} = data.contactCopy;
