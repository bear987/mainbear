/** @type {import('next').NextConfig} */

// Content-Security-Policy. 'unsafe-inline' is required for Next's hydration
// scripts and for inline style attributes / next/font; tighten to nonces later
// via middleware if needed. frame-src allows the Google Maps embed on /contact.
// Cloudflare Web Analytics is cookieless, so it needs no consent banner. Its
// beacon only loads when NEXT_PUBLIC_CF_BEACON is set, and the policy only
// widens by exactly the two hosts it needs when it is, so a site with no
// analytics keeps the tighter policy.
const cf = process.env.NEXT_PUBLIC_CF_BEACON
  ? {
      script: " https://static.cloudflareinsights.com",
      connect: " https://cloudflareinsights.com https://static.cloudflareinsights.com",
    }
  : { script: "", connect: "" };

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${cf.script}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${cf.connect}`,
  "frame-src https://www.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@repo/ui"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
