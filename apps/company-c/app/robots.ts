import type { MetadataRoute } from "next";
import { site } from "../content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/contact/thank-you"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
