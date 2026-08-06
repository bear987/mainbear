import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Fraunces, Karla } from "next/font/google";
import "./globals.css";
import { SiteNav } from "@repo/ui/site-nav";
import { SiteFooter } from "@repo/ui/site-footer";
import { site } from "@/content/site";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

// Runs before paint: applies the saved theme so there's no flash of the wrong
// palette. No stored preference → default Ember (dark).
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}})();`;

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-karla",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, intercontinental dishes and Nigerian meals in Lagos`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_NG",
    url: site.url,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#1a1714",
  colorScheme: "dark light",
};

function restaurantSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    url: site.url,
    slogan: site.motto,
    description: site.description,
    telephone: "+2349018495507",
    email: site.email,
    servesCuisine: ["Nigerian", "Intercontinental"],
    priceRange: "₦₦",
    menu: `${site.url}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.schemaDays,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    parentOrganization: {
      "@type": "Organization",
      name: site.parent.name,
      url: site.parent.url,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${karla.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-[var(--radius-sm)] focus:bg-action-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SiteNav
          links={[...site.nav]}
          logo={<Logo />}
          cta={site.orderCta}
          end={<ThemeToggle />}
          homeAriaLabel={`${site.name}, home`}
        />
        <main id="main" className="pt-[var(--header-h)]">
          {children}
        </main>
        <SiteFooter
          brand={
            <>
              <Link href="/" className="inline-flex rounded-sm">
                <Logo />
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-muted">{site.motto}.</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{site.tagline}</p>
            </>
          }
          columns={[
            {
              title: "Explore",
              links: [
                { label: "Menu", href: "/menu" },
                { label: "About", href: "/about" },
                { label: "Visit us", href: "/visit" },
                { label: "Order", href: "/order" },
              ],
            },
            {
              title: "The group",
              links: [
                { label: site.parent.label, href: site.parent.url, external: true },
                ...site.siblings.map((s) => ({
                  label: s.name,
                  href: s.url,
                  external: true,
                })),
              ],
            },
          ]}
          aside={
            <div>
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                Visit us
              </h2>
              <address className="mt-4 space-y-3 text-sm not-italic text-muted">
                <p className="leading-relaxed">{site.address.full}</p>
                <p>
                  <a href={site.phone.tel} className="hover:text-heading">
                    {site.phone.label}
                  </a>
                </p>
                <p>
                  <a
                    href={site.whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-heading"
                  >
                    Order on WhatsApp
                  </a>
                </p>
                <p>{site.hours.display}</p>
              </address>
            </div>
          }
          bottomLeft={
            <p>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
            </p>
          }
          bottomRight={<p>{site.motto}.</p>}
        />
      </body>
    </html>
  );
}
