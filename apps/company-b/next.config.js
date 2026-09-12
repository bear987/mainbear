/** @type {import('next').NextConfig} */

// Content-Security-Policy. 'unsafe-inline' is required for Next's hydration
// scripts and inline styles / next/font. frame-src allows a future map embed.
// Visitor counting, provider agnostic. Whichever variable is set decides the
// provider, and the policy widens by exactly the origins that provider needs.
// A site with no analytics keeps the tighter policy. Both supported providers
// are cookieless, so no consent banner is needed either way.
//
// Cloudflare must be its JS SNIPPET installation: these sites are DNS-only so
// Netlify can issue their certificates, so Cloudflare never sees the HTML and
// its automatic injection cannot work.
let analytics = { script: "", connect: "" };
if (process.env.NEXT_PUBLIC_CF_BEACON) {
  analytics = {
    script: " https://static.cloudflareinsights.com",
    // The manually installed beacon posts cross-origin, unlike the injected one.
    connect: " https://cloudflareinsights.com https://static.cloudflareinsights.com",
  };
} else if (process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID) {
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC || "https://cloud.umami.is/script.js";
  let origin;
  try {
    origin = new URL(umamiSrc).origin;
  } catch {
    // Failing the build is the honest response: a typo here would otherwise
    // load nothing and be blocked silently, with no sign anything was wrong.
    throw new Error(
      `NEXT_PUBLIC_UMAMI_SRC is not a valid URL: ${umamiSrc}. Expected something like https://cloud.umami.is/script.js`,
    );
  }
  analytics = { script: ` ${origin}`, connect: ` ${origin}` };
}

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${analytics.script}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self'${analytics.connect}`,
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
