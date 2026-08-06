"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { roles, companyLabels, type CompanyTag } from "@/content/roles";
import { cn } from "@/lib/cn";

type Filter = "all" | CompanyTag;

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All companies" },
  { value: "A", label: companyLabels.A },
  { value: "B", label: companyLabels.B },
  { value: "C", label: companyLabels.C },
];

export function RolesList() {
  const [active, setActive] = useState<Filter>("all");

  const counts = useMemo(() => {
    return {
      all: roles.length,
      A: roles.filter((r) => r.company === "A").length,
      B: roles.filter((r) => r.company === "B").length,
      C: roles.filter((r) => r.company === "C").length,
    } as Record<Filter, number>;
  }, []);

  const visible = active === "all" ? roles : roles.filter((r) => r.company === active);

  return (
    <div>
      {/* Filter */}
      <div
        role="group"
        aria-label="Filter roles by company"
        className="flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const selected = active === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(f.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-[var(--ease-quint)] active:scale-[0.98]",
                selected
                  ? "border-line-strong bg-elevated text-heading"
                  : "border-line bg-surface text-fg hover:border-line-strong hover:bg-surface",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "tabular-nums",
                  "text-muted",
                )}
              >
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Roles */}
      <ul className="mt-8 space-y-4">
        {visible.map((role) => (
          <li
            key={role.id}
            className="group rounded-[var(--radius-lg)] border border-line bg-surface p-6 shadow-card transition-all duration-300 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:shadow-lift sm:p-7"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-semibold text-heading">
                    {role.title}
                  </h3>
                  <span className="rounded-full border border-line bg-highlight/60 px-2.5 py-0.5 text-xs font-medium text-action-200">
                    {companyLabels[role.company]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {role.department} · {role.location} · {role.type}
                </p>
                <p className="mt-3 max-w-[68ch] leading-relaxed text-fg">
                  {role.summary}
                </p>
              </div>
              <Link
                href="/contact?subject=careers"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-heading transition-all duration-200 ease-[var(--ease-quint)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface active:scale-[0.98]"
                aria-label={`Apply for ${role.title} at ${companyLabels[role.company]}`}
              >
                Apply
                <span
                  aria-hidden
                  className="grid h-6 w-6 place-items-center rounded-full bg-elevated transition-transform duration-300 ease-[var(--ease-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-px"
                >
                  ↗
                </span>
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {visible.length === 0 && (
        <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-line bg-surface p-10 text-center">
          <p className="text-lg font-medium text-heading">
            No open roles here right now.
          </p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            We're always glad to meet good people ahead of need.{" "}
            <Link href="/contact?subject=careers" className="font-medium text-action-300 hover:text-action-200">
              Send us an introduction
            </Link>{" "}
            and we'll keep you in mind.
          </p>
        </div>
      )}
    </div>
  );
}
