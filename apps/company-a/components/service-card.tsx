import Link from "next/link";
import type { Service } from "@/content/services";
import { Icon, type IconName } from "@/components/icon";
import { Spotlight } from "@/components/spotlight";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block h-full rounded-[calc(var(--radius-xl)+7px)] border border-line bg-surface p-1.5 shadow-card transition-all duration-500 ease-[var(--ease-quint)] hover:-translate-y-1 hover:border-line-strong hover:shadow-glow"
    >
      <Spotlight className="h-full">
      <article className="flex h-full flex-col rounded-[var(--radius-xl)] bg-surface p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8">
      <span className="grid h-12 w-12 place-items-center rounded-[var(--radius-lg)] bg-highlight text-action-300">
        <Icon name={service.icon as IconName} size={24} />
      </span>
      <h3 className="mt-6 font-display text-xl font-semibold text-heading">
        {service.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-action-300">{service.tagline}</p>
      <p className="mt-3 flex-1 leading-relaxed text-muted">{service.summary}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-heading">
        Explore {service.name}
        <Icon
          name="ArrowRight"
          size={15}
          className="text-action-300 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
      </article>
      </Spotlight>
    </Link>
  );
}
