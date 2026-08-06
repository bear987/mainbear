import type { Leader } from "@/content/about";

/**
 * Leadership card with a styled monogram in place of a photo. Replace the
 * placeholder block with an <Image> when real headshots are available, the
 * role/focus layout stays the same.
 */
export function TeamCard({ leader }: { leader: Leader }) {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface shadow-card">
      <div
        className="grid aspect-[5/4] place-items-center bg-ink-900"
        style={{
          backgroundImage:
            "radial-gradient(120% 100% at 20% 0%, rgba(59,91,219,0.28), transparent 60%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "auto, 32px 32px, 32px 32px",
        }}
      >
        <span
          aria-hidden
          className="font-display text-3xl font-semibold tracking-tight text-white/90"
        >
          {leader.initials}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-heading">
          {leader.role}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{leader.focus}</p>
      </div>
    </article>
  );
}
