import Link from "next/link";
import { SiteFooter } from "@repo/ui/site-footer";
import { site } from "@/content/site";
import { companies } from "@/content/companies";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
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
          title: "Group",
          links: [
            { label: "About", href: "/about" },
            { label: "Services", href: "/services" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/contact" },
          ],
        },
        {
          title: "Our Companies",
          links: companies.map((c) => ({
            label: c.name,
            href: c.href,
            external: true,
          })),
        },
      ]}
      aside={
        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Contact
          </h2>
          <address className="mt-4 space-y-3 text-sm not-italic text-muted">
            <p className="leading-relaxed">{site.address.full}</p>
            <p>
              {site.phones.map((p, i) => (
                <span key={p.href}>
                  {i > 0 && <span> · </span>}
                  <a href={p.href} className="hover:text-heading">
                    {p.label}
                  </a>
                </span>
              ))}
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="hover:text-heading">
                {site.email}
              </a>
            </p>
            <p>{site.hours}</p>
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
  );
}
