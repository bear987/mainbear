import { cn } from "@repo/ui/cn";
import { site } from "@/content/site";

/**
 * GG FOODS lockup: a flame tile beside the wordmark. Swap the SVG for a real
 * logo asset later without touching layout.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-[7px] bg-action-500 text-white"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      </span>
      <span className="font-display text-[1.1rem] font-semibold leading-none tracking-tight text-heading">
        {site.name}
      </span>
    </span>
  );
}
