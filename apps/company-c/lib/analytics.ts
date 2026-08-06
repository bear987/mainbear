/* Conversion instrumentation. Only the events this site can actually
   produce — there is no signup, booking, newsletter or checkout here.

   Everything is a safe no-op until NEXT_PUBLIC_GA_ID is set, so the
   site runs clean with no analytics configured. */

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "nav_click"
  | "scroll_depth_75"
  | "outbound_click"
  | "whatsapp_click"
  | "phone_click"
  | "enquiry_submit";

export type EventProps = {
  /** Where on the page the action happened, e.g. "hero", "inventory_card". */
  section?: string;
  /** The words on the control the user actually clicked. */
  cta_label?: string;
  /** Retail and wholesale enquiries must be distinguishable. */
  enquiry_type?: "retail" | "wholesale" | "assembly" | "general";
  item_id?: string;
  item_name?: string;
  value?: number;
  currency?: string;
  form_name?: string;
  destination?: string;
};

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export function track(event: AnalyticsEvent, props: EventProps = {}): void {
  if (typeof window === "undefined") return;

  const payload = {
    ...props,
    page_path: window.location.pathname,
    page_title: document.title,
    device_type: window.innerWidth < 768 ? "mobile" : "desktop",
  };

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
    return;
  }

  // No GA configured. Keep the call observable in development so the
  // funnel can be verified before an ID exists.
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload);
  }
}
