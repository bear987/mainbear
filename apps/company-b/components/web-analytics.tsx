/**
 * Cloudflare Web Analytics.
 *
 * Chosen over Google Analytics on purpose: it sets NO cookies and does not
 * follow anyone between sites, so these sites need no consent banner. It
 * reports totals, not people.
 *
 * Dormant until NEXT_PUBLIC_CF_BEACON is set, so nothing loads and the
 * Content-Security-Policy stays at its tightest until analytics is actually
 * turned on. The privacy policy hides its analytics section on the same
 * condition, so the policy never claims something the site is not doing.
 */
export function WebAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_BEACON;
  if (!token) return null;

  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
