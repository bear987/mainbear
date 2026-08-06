import { Spotlight } from "@repo/ui/spotlight";
import { formatNaira, type MenuItem } from "@/content/menu";
import { MenuImage } from "@/components/menu-image";

const tagClass: Record<string, string> = {
  spicy: "border-action-500/40 bg-action-500/15 text-action-300",
  vegetarian: "border-olive/40 bg-olive/15 text-olive",
};

export function DishCard({ item }: { item: MenuItem }) {
  return (
    <Spotlight color="rgba(217,98,43,0.15)" className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-1 hover:border-line-strong hover:shadow-glow">
        <MenuImage slug={item.slug} alt={item.name} className="aspect-[4/3]" />
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug text-heading">
              {item.name}
            </h3>
            <span className="shrink-0 font-display text-lg text-action-300 tnum">
              {formatNaira(item.priceNGN)}
            </span>
          </div>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
          {item.tags && item.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${tagClass[tag] ?? "border-line text-muted"}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Spotlight>
  );
}
