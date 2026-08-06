import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { services } from "@/content/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const now = new Date();

  const staticPaths = ["", "/about", "/services", "/companies", "/careers", "/contact"];
  const servicePaths = services.map((s) => `/services/${s.slug}`);

  return [...staticPaths, ...servicePaths].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : path.startsWith("/services/") ? 0.6 : 0.8,
  }));
}
