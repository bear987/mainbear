import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "../components/analytics";
import { Footer } from "../components/footer";
import { Nav } from "../components/nav";
import { contact, group, site } from "../content/site";

/* Two families, self-hosted: a Swiss grotesque for display at extreme
   scale, and a terminal monospace for every label, spec and figure. */
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
  weight: "100 900",
  preload: true,
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Mini Buses & Mini Trucks | ${site.name}, Lagos Nigeria`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "mini bus for sale Lagos",
    "mini truck for sale Nigeria",
    "Daihatsu Hijet price Nigeria",
    "Suzuki Carry price Nigeria",
    "Gran Max minibus Lagos",
    "bus coupling Nigeria",
    "wholesale mini buses",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `Mini Buses & Mini Trucks | ${site.name}, Lagos Nigeria`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: mini buses and mini trucks, coupled and sold in Lagos`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#111110",
  colorScheme: "light",
};

/* AutoDealer identifies this as a vehicle dealership to search engines,
   and ties it back to the parent holding company. */
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "AutoDealer",
  "@id": `${site.url}/#organization`,
  name: site.name,
  description: site.description,
  url: site.url,
  email: contact.email,
  telephone: contact.phoneHref.replace("tel:", ""),
  areaServed: { "@type": "Country", name: "Nigeria" },
  currenciesAccepted: "NGN",
  parentOrganization: {
    "@type": "Organization",
    name: group.parent.name,
    url: group.parent.href,
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: `${contact.address.street}, ${contact.address.landmark}`,
    addressLocality: contact.address.area,
    addressRegion: contact.address.city,
    addressCountry: "NG",
  },
  geo: { "@type": "GeoCoordinates", latitude: 6.5244, longitude: 3.3792 },
  openingHoursSpecification: contact.hours
    .filter((slot) => slot.opens !== null)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek:
        slot.days === "Monday to Friday"
          ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
          : [slot.days],
      opens: slot.opens,
      closes: slot.closes,
    })),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <a
          href="#main"
          className="stamp sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-ink focus:bg-paper focus:px-4 focus:py-3 focus:text-ink"
        >
          Skip to content
        </a>

        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
