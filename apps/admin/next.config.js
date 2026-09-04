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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
