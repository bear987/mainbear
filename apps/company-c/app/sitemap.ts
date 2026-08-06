import type { MetadataRoute } from "next";
import { vehicles } from "../content/vehicles";
import { site } from "../content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/inventory`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/wholesale`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
  ];

  const models: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${site.url}/inventory/${vehicle.slug}`,
    lastModified: new Date(`${vehicle.updated}T00:00:00Z`),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...pages, ...models];
}
