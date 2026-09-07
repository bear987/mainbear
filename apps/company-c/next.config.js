/** @type {import('next').NextConfig} */

// Content-Security-Policy. 'unsafe-inline' is required for Next's hydration
// scripts and inline styles / next/font. media-src covers the hero, assembly
// and walkaround videos served from /public. frame-src allows a map embed.
// Google Analytics hosts are allowed ONLY when a measurement ID is
// configured, so the policy stays tight on a site with no analytics.
const ga = process.env.NEXT_PUBLIC_GA_ID
  ? { script: " https://www.googletagmanager.com", connect: " https://www.google-analytics.com https://www.googletagmanager.com" }
  : { script: "", connect: "" };

// React and Turbopack use eval() in development only. Production never does,
// so the allowance is scoped to the dev server and never ships.
const evalAllowance = process.env.NODE_ENV === "production" ? "" : " 'unsafe-eval'";

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
  `script-src 'self' 'unsafe-inline'${evalAllowance}${ga.script}${cf.script}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "media-src 'self'",
  "font-src 'self' data:",
  `connect-src 'self'${ga.connect}${cf.connect}`,
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
