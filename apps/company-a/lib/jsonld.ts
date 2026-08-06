import { site } from "@/content/site";
import { companies } from "@/content/companies";
import { baseUrl } from "@/lib/metadata";

/** Organization schema, signals the group's identity + its subsidiaries. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    slogan: site.motto,
    description: site.description,
    email: site.email,
    telephone: site.phones.map((p) => p.label),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    /** Declares the parent → subsidiary relationship to search engines. */
    subOrganization: companies.map((c) => ({
      "@type": "Organization",
      name: c.name,
      url: c.href,
    })),
  };
}

/** LocalBusiness schema for the Contact page. */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phones[0]?.label,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHours: "Mo-Fr 09:00-18:00",
  };
}

export function serviceSchema(opts: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    description: opts.description,
    url: new URL(opts.path, baseUrl).toString(),
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed: site.address.country,
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, baseUrl).toString(),
    })),
  };
}
