import type { Metadata } from "next";
import { site } from "@/content/site";

export const baseUrl = site.url;

/**
 * Per-page metadata helper, sets title template, description, canonical and
 * Open Graph / Twitter cards consistently. `metadataBase` is set once in the
 * root layout, so relative OG image paths resolve correctly.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  ogType = "website",
}: {
  title: string;
  description: string;
  path?: string;
  ogType?: "website" | "article";
}): Metadata {
  const url = new URL(path, baseUrl).toString();
  const fullTitle = path === "/" ? `${site.name}, ${title}` : `${title} | ${site.name}`;

  return {
    // `absolute` bypasses the root layout's title template (no double suffix).
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      url,
      siteName: site.name,
      title: fullTitle,
      description,
      locale: "en_NG",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
