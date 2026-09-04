"use client";

import { AlertTriangle, Check, Info, Loader2, RotateCcw, Save } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { humanise } from "@/lib/fields";

type Token = {
  name: string;
  value: string;
  kind: "color" | "length" | "font" | "shadow" | "other";
  note?: string;
  readOnly?: boolean;
};

type Block = { selector: string; label: string; hint: string; tokens: Token[] };

type ContrastResult = {
  label: string;
  foreground: string;
  background: string;
  ratio: number;
  grade: "pass" | "large" | "fail";
  large: boolean;
};

type Theme = {
  blocks: Block[];
  mirrors: string[];
  contrast: { dark: ContrastResult[]; light: ContrastResult[] | null; lightLabel: string | null };
};

/** "--color-action-500" reads as "Action 500". */
function tokenLabel(name: string): string {
  return humanise(name.replace(/^--(color|radius|font|shadow|ease)-/, ""));
}

function ContrastTable({ title, results }: { title: string; results: ContrastResult[] }) {
  const worst = results.filter((r) => r.grade !== "pass");
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      <p className="mt-0.5 text-xs text-muted">
        {worst.length === 0
          ? "Every combination is comfortably readable."
          : `${worst.length} to look at. These are warnings, not rules, and nothing is changed for you.`}
      </p>
      <ul className="mt-3 space-y-1.5">
        {results.map((r) => (
          <li key={r.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="text-body">
              {r.label}
              {r.large ? <span className="ml-1 text-xs text-muted">(large)</span> : null}
            </span>
            <span
              className={
                r.grade === "pass" ? "text-good" : r.grade === "large" ? "text-warn" : "text-bad"
              }
            >
              {r.ratio.toFixed(2)}:1{" "}
              {r.grade === "pass" ? "ok" : r.grade === "large" ? "large text only" : "too low"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TokenRow({
  token,
  value,
  onChange,
}: {
  token: Token;
  value: string;
  onChange: (next: string) => void;
}) {
  const isColor = token.kind === "color";
  // A colour picker only understands #rrggbb, so it is offered alongside the
  // text field rather than replacing it. Translucent values stay text-only.
  const hexish = /^#[0-9a-f]{6}$/i.test(value.trim());

  return (
    <div className="flex items-start gap-3 border-b border-line-soft py-2.5 last:border-0">
      {isColor ? (
        <span
          aria-hidden
          className="mt-0.5 size-8 shrink-0 rounded border border-line"
          style={{ background: value }}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="text-sm font-medium text-heading">{tokenLabel(token.name)}</span>
          <span className="font-mono text-xs text-muted">{token.name}</span>
        </div>
        {token.note ? <p className="mt-0.5 text-xs text-muted">{token.note}</p> : null}
        {token.readOnly ? (
          <p className="mt-0.5 flex items-start gap-1 text-xs text-muted">
            <Info className="mt-0.5 size-3 shrink-0" />
            Typefaces are loaded in code. Ask Claude to change the typeface itself.
          </p>
        ) : null}
      </div>

      <div className="flex w-[22rem] shrink-0 items-center gap-2">
        {isColor && hexish ? (
          <input
            type="color"
            aria-label={`${tokenLabel(token.name)} colour picker`}
            value={value.trim()}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-10 shrink-0 cursor-pointer rounded border border-line bg-page"
          />
        ) : null}
        <input
          type="text"
          className="field font-mono text-xs"
          value={value}
          readOnly={token.readOnly}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export function ThemeEditor({ siteId }: { siteId: string }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/theme/${siteId}`, { cache: "no-store" });
    setTheme((await res.json()) as Theme);
    setEdited({});
  }, [siteId]);

  useEffect(() => {
    void load();
  }, [load]);

  const key = (selector: string, name: string) => `${selector}|${name}`;

  const edits = useMemo(
    () =>
      Object.entries(edited).map(([k, value]) => {
        const [selector, name] = k.split("|");
        return { selector: selector!, name: name!, value };
      }),
    [edited],
  );

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch(`/api/theme/${siteId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ edits }),
      });
      const body = (await res.json()) as { error?: string; changed?: number };
      if (!res.ok) {
        setError(body.error ?? "Could not save the design.");
        return;
      }
      setSaved(body.changed ?? edits.length);
      await load();
    } catch {
      setError("Could not reach the admin server.");
    } finally {
      setSaving(false);
    }
  };

  if (!theme) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Reading the design...
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-xl text-sm text-muted">
          The colours, corner radius and shadows this site is built from. Everything on the site
          reads these, so a change here reaches every page at once.
        </p>
        <div className="flex items-center gap-2">
          {edits.length > 0 ? (
            <button type="button" className="btn" onClick={() => setEdited({})}>
              <RotateCcw className="size-3.5" /> Undo changes
            </button>
          ) : null}
          <button
            type="button"
            className="btn btn-primary"
            onClick={save}
            disabled={edits.length === 0 || saving}
          >
            {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
            Save {edits.length > 0 ? `(${edits.length})` : ""}
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-heading">
          <AlertTriangle className="size-4 shrink-0 text-bad" /> {error}
        </p>
      ) : null}

      {saved !== null ? (
        <p className="mt-4 flex items-center gap-2 rounded-md border border-good/40 bg-good/10 px-4 py-3 text-sm text-body">
          <Check className="size-4 shrink-0 text-good" />
          Saved. {saved} value{saved === 1 ? "" : "s"} written, including any kept in step in the
          dark regions. Start the preview to see it.
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <ContrastTable title="Readability, dark theme" results={theme.contrast.dark} />
        {theme.contrast.light ? (
          <ContrastTable
            title={`Readability, ${theme.contrast.lightLabel?.toLowerCase() ?? "light theme"}`}
            results={theme.contrast.light}
          />
        ) : null}
      </div>

      <div className="mt-8 space-y-8">
        {theme.blocks.map((block) => (
          <section key={block.selector}>
            <h2 className="text-sm font-semibold tracking-wide text-muted uppercase">
              {block.label}
            </h2>
            <p className="mt-0.5 mb-3 text-sm text-muted">{block.hint}</p>
            <div className="rounded-lg border border-line bg-panel px-4">
              {block.tokens.map((token) => {
                const k = key(block.selector, token.name);
                return (
                  <TokenRow
                    key={k}
                    token={token}
                    value={edited[k] ?? token.value}
                    onChange={(next) => setEdited((e) => ({ ...e, [k]: next }))}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {theme.mirrors.length > 0 ? (
        <p className="mt-6 flex items-start gap-2 text-xs text-muted">
          <Info className="mt-0.5 size-3.5 shrink-0" />
          This site keeps a second copy of the dark colours for the regions that stay dark on a
          light page ({theme.mirrors.join(", ")}). A change to the main palette is carried into
          them automatically, unless one has been set to something different on purpose.
        </p>
      ) : null}
    </div>
  );
}
