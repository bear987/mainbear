"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { GA_ID, track } from "../lib/analytics";

/**
 * Loads GA4 deferred (never blocking first paint) and fires the two events
 * that can only be measured globally: page_view on every route change, and
 * scroll_depth_75 once per page. Renders nothing when no GA ID is set, but
 * still tracks — track() no-ops safely.
 */
export function Analytics() {
  const pathname = usePathname();
  const fired = useRef<string>("");

  useEffect(() => {
    track("page_view");
  }, [pathname]);

  /* One delegated listener classifies every link on the site, including
     links inside the shared @repo/ui nav and footer, so no component has
     to be wired up by hand. */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      const label = link.textContent?.trim().slice(0, 60) ?? "";

      if (link.dataset.cta !== undefined) {
        track("cta_click", { cta_label: label, section: link.dataset.ctaSection });
      }

      if (href.startsWith("tel:")) {
        track("phone_click", { cta_label: label, destination: href });
      } else if (href.includes("wa.me")) {
        track("whatsapp_click", {
          cta_label: label,
          enquiry_type: href.includes("wholesale") ? "wholesale" : "retail",
          destination: "whatsapp",
        });
      } else if (/^https?:\/\//.test(href)) {
        track("outbound_click", { cta_label: label, destination: href });
      } else if (link.closest("header")) {
        track("nav_click", { cta_label: label, destination: href });
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    fired.current = "";
    const onScroll = () => {
      if (fired.current === pathname) return;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= 0.75) {
        fired.current = pathname;
        track("scroll_depth_75");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });`}
      </Script>
    </>
  );
}
