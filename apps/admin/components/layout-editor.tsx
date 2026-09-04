"use client";

import { AlertTriangle, ArrowDown, ArrowUp, Check, Eye, EyeOff, Loader2, Lock, RotateCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Section = {
  id: string;
  label: string;
  note?: string;
  enabled: boolean;
  required?: boolean;
};

type PageLayout = { label: string; sections: Section[] };

export function LayoutEditor({ siteId }: { siteId: string }) {
  const [pages, setPages] = useState<Record<string, PageLayout> | null>(null);
  const [draft, setDraft] = useState<Record<string, Section[]>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/layout/${siteId}`, { cache: "no-store" });
    const body = (await res.json()) as { pages?: Record<string, PageLayout>; error?: string };
    if (!res.ok || !body.pages) {
      setError(body.error ?? "Could not read the layout.");
      setPages({});
      return;
    }
    setPages(body.pages);
    setDraft(Object.fromEntries(Object.entries(body.pages).map(([k, v]) => [k, v.sections])));
  }, [siteId]);

  useEffect(() => {
    void load();
  }, [load]);

  const dirty = useMemo(() => {
    if (!pages) return {};
    return Object.fromEntries(
      Object.entries(draft).map(([page, sections]) => [
        page,
        JSON.stringify(sections) !== JSON.stringify(pages[page]?.sections ?? []),
      ]),
    );
  }, [draft, pages]);

  const move = (page: string, index: number, by: number) => {
    setDraft((d) => {
      const list = [...(d[page] ?? [])];
      const to = index + by;
      if (to < 0 || to >= list.length) return d;
      const [item] = list.splice(index, 1);
      list.splice(to, 0, item!);
      return { ...d, [page]: list };
    });
  };

  const toggle = (page: string, index: number) => {
    setDraft((d) => {
      const list = [...(d[page] ?? [])];
      const item = list[index];
      if (!item || item.required) return d;
      list[index] = { ...item, enabled: !item.enabled };
      return { ...d, [page]: list };
    });
  };

  const save = async (page: string) => {
    setSaving(page);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch(`/api/layout/${siteId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          page,
          order: (draft[page] ?? []).map((s) => ({ id: s.id, enabled: s.enabled })),
        }),
      });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(body.error ?? "Could not save the layout.");
        return;
      }
      setSaved(page);
      await load();
    } catch {
      setError("Could not reach the admin server.");
    } finally {
      setSaving(null);
    }
  };

  if (!pages) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Reading the layout...
      </p>
    );
  }

  const entries = Object.entries(pages);

  return (
    <div>
      <p className="max-w-xl text-sm text-muted">
        The order sections appear in, and whether they appear at all. Turning one off hides it from
        the page completely, it is not just moved out of sight.
      </p>

      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-heading">
          <AlertTriangle className="size-4 shrink-0 text-bad" /> {error}
        </p>
      ) : null}

      {entries.length === 0 ? (
        <p className="mt-6 rounded-lg border border-line bg-panel px-4 py-6 text-center text-sm text-body">
          No page on this site has an editable layout yet.
        </p>
      ) : null}

      <div className="mt-6 space-y-8">
        {entries.map(([page, layout]) => {
          const sections = draft[page] ?? [];
          return (
            <section key={page}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
                  {layout.label}
                </h2>
                <div className="flex items-center gap-2">
                  {dirty[page] ? (
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        setDraft((d) => ({ ...d, [page]: pages[page]?.sections ?? [] }))
                      }
                    >
                      <RotateCcw className="size-3.5" /> Undo
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!dirty[page] || saving === page}
                    onClick={() => save(page)}
                  >
                    {saving === page ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : saved === page ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    {saved === page && !dirty[page] ? "Saved" : "Save"}
                  </button>
                </div>
              </div>

              <ol className="space-y-2">
                {sections.map((section, index) => (
                  <li
                    key={section.id}
                    className={`flex items-start gap-3 rounded-lg border border-line bg-panel px-3 py-2.5 ${
                      section.enabled ? "" : "opacity-55"
                    }`}
                  >
                    <span className="mt-1 w-5 shrink-0 text-center font-mono text-xs text-muted">
                      {index + 1}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium text-heading">{section.label}</span>
                        {section.required ? (
                          <span className="inline-flex items-center gap-1 rounded border border-line px-1.5 py-0.5 text-[11px] text-muted">
                            <Lock className="size-3" /> always shown
                          </span>
                        ) : null}
                        {!section.enabled ? (
                          <span className="rounded border border-warn/50 px-1.5 py-0.5 text-[11px] text-warn">
                            hidden
                          </span>
                        ) : null}
                      </div>
                      {section.note ? (
                        <p className="mt-0.5 text-xs text-muted">{section.note}</p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        className="btn px-2"
                        aria-label={`Move ${section.label} up`}
                        disabled={index === 0}
                        onClick={() => move(page, index, -1)}
                      >
                        <ArrowUp className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="btn px-2"
                        aria-label={`Move ${section.label} down`}
                        disabled={index === sections.length - 1}
                        onClick={() => move(page, index, 1)}
                      >
                        <ArrowDown className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        className="btn px-2"
                        aria-label={
                          section.enabled ? `Hide ${section.label}` : `Show ${section.label}`
                        }
                        disabled={section.required}
                        onClick={() => toggle(page, index)}
                      >
                        {section.enabled ? (
                          <Eye className="size-3.5" />
                        ) : (
                          <EyeOff className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
