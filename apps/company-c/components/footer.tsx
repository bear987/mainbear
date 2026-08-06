import { SiteFooter } from "@repo/ui/site-footer";
import { contact, footerColumns, group, site } from "../content/site";
import { Logo } from "./logo";

/**
 * GG Autos configuration of the shared footer. Carries the persistent
 * "Part of the GG Bearers group" link to the parent, as an absolute URL.
 */
export function Footer() {
  const openDays = contact.hours.filter((slot) => slot.opens !== null);

  return (
    <SiteFooter
      brand={
        <div>
          <Logo />
          <p className="mt-4 max-w-[34ch] text-sm text-fg">{site.tagline}</p>
          <p className="stamp mt-5">
            {site.coordinates}
            <br />
            {site.region}
          </p>
        </div>
      }
      columns={footerColumns}
      aside={
        <div>
          <h2 className="stamp text-muted">Yard &amp; office</h2>
          <address className="mt-4 not-italic text-sm text-fg">
            {contact.address.street}
            <br />
            {contact.address.landmark}
            <br />
            {contact.address.area}, {contact.address.city}
          </address>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="tnum font-mono hover:text-heading" href={contact.phoneHref}>
                {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a className="tnum font-mono hover:text-heading" href={contact.phoneAltHref}>
                {contact.phoneAltDisplay}
              </a>
            </li>
            <li>
              <a className="font-mono hover:text-heading" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
          </ul>
          <ul className="stamp mt-4 space-y-1">
            {openDays.map((slot) => (
              <li key={slot.days} className="tnum">
                {slot.days}, {slot.opens} to {slot.closes}
              </li>
            ))}
            <li>Sunday, closed</li>
          </ul>
        </div>
      }
      bottomLeft={
        <span className="stamp">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </span>
      }
      bottomRight={
        <a
          href={group.parent.href}
          target="_blank"
          rel="noopener noreferrer"
          className="stamp border border-line px-3 py-1.5 transition-colors hover:border-line-strong hover:text-heading"
        >
          {group.parent.label} ↗
        </a>
      }
    />
  );
}
