/** @type {import('next').NextConfig} */

// The admin runs only on 127.0.0.1 and is never deployed. It still refuses to
// be framed and sends no referrer, so a stray browser tab cannot drive it.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
];

const nextConfig = {
  poweredByHeader: false,
  experimental: {
    // Because the admin has a middleware (the hosted sign-in gate), Next holds
    // every request body for it and silently keeps only the first 10MB. A
    // phone video arrived cut in half, the upload route could not parse it,
    // and the owner saw "Could not reach the admin server". This has to sit
    // above MAX_UPLOAD_LOCAL in app/api/media/[site]/route.ts (500MB) so that
    // an oversized file gets that route's own plain refusal instead.
    proxyClientMaxBodySize: "520mb",
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
