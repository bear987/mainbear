/**
 * Visitor counting, provider agnostic.
 *
 * Analytics providers change their free tiers, and switching should never mean
 * changing code again. Set one environment variable and redeploy:
 *
 *   Cloudflare  NEXT_PUBLIC_CF_BEACON            the token from the JS snippet
 *   Umami       NEXT_PUBLIC_UMAMI_WEBSITE_ID     the website id
 *               NEXT_PUBLIC_UMAMI_SRC            optional, EU or self-hosted
 *
 * Both are cookieless, which is why these sites still need no consent banner.
 * If neither is set, nothing loads at all, the Content-Security-Policy stays
 * at its tightest, and the privacy policy hides its analytics section so it
 * never claims something the site is not doing.
 *
 * Cloudflare needs its JS SNIPPET installation, not the automatic one: these
 * sites are DNS-only (grey cloud) so that Netlify can issue their
 * certificates, which means Cloudflare never sees the HTML and has nothing to
 * inject into. In the dashboard: Add a site, then Manage Site, then "Enable
 * with JS Snippet installation".
 */

export const UMAMI_DEFAULT_SRC = "https://cloud.umami.is/script.js";
const CF_SRC = "https://static.cloudflareinsights.com/beacon.min.js";

export type AnalyticsProvider = "cloudflare" | "umami" | null;

/** Which provider is configured, decided by which variable is present. */
export function analyticsProvider(): AnalyticsProvider {
  if (process.env.NEXT_PUBLIC_CF_BEACON) return "cloudflare";
  if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) return "umami";
  return null;
}

/** The name shown to visitors in the privacy policy. */
export function analyticsProviderName(): string | null {
  const provider = analyticsProvider();
  if (provider === "cloudflare") return "Cloudflare Web Analytics";
  if (provider === "umami") return "Umami";
  return null;
}

export function WebAnalytics() {
  const provider = analyticsProvider();
  if (!provider) return null;

  if (provider === "cloudflare") {
    return (
      <script
        defer
        src={CF_SRC}
        data-cf-beacon={JSON.stringify({ token: process.env.NEXT_PUBLIC_CF_BEACON })}
      />
    );
  }

  return (
    <script
      defer
      src={process.env.NEXT_PUBLIC_UMAMI_SRC || UMAMI_DEFAULT_SRC}
      data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
    />
  );
}
