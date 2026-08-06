import type { Company } from "@/content/companies";
import { CtaButton } from "@/components/cta-button";
import { Spotlight } from "@/components/spotlight";

/**
 * Card routing to a subsidiary. Logo placeholder shows initials until a real
 * logo asset is supplied; the visit button always uses the full absolute URL.
 */
export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group h-full rounded-[calc(var(--radius-xl)+7px)] border border-line bg-surface p-1.5 shadow-card transition-all duration-500 ease-[var(--ease-quint)] hover:-translate-y-1 hover:border-line-strong hover:shadow-glow">
      <Spotlight className="h-full">
      <article className="flex h-full flex-col rounded-[var(--radius-xl)] bg-surface p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-9">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="grid h-14 w-14 shrink-0 place-items-center rounded-[var(--radius-lg)] border border-line bg-surface font-display text-lg font-semibold text-heading"
        >
          {company.logoText}
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-heading">
            {company.name}
          </h3>
          <p className="text-sm text-muted">
            A GG BEARERS company · {company.tag}
          </p>
        </div>
      </div>

      <p className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-fg">
        {company.blurb}
      </p>

      <div className="mt-7">
        <CtaButton href={company.href} variant="outline" trailing="ArrowUpRight">
          Visit {company.name}
        </CtaButton>
      </div>
      </article>
      </Spotlight>
    </div>
  );
}
