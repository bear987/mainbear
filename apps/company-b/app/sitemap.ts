import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ["", "/menu", "/about", "/visit", "/order"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "/menu" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.7,
  }));
}
