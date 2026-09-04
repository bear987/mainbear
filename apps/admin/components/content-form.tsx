"use client";

import { AlertTriangle, Check, Loader2, RotateCcw, Save } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ValueEditor } from "./value-editor";

type Problem = { path: string; message: string };

type Props = {
  siteId: string;
  siteName: string;
  accent: string;
  fileId: string;
  fileLabel: string;
  fileHint: string;
  initial: unknown;
};

export function ContentForm({
  siteId,
  siteName,
  accent,
  fileId,
  fileLabel,
  fileHint,
  initial,
}: Props) {
  const [value, setValue] = useState<Record<string, unknown>>(
    initial as Record<string, unknown>,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const original = useMemo(() => JSON.stringify(initial), [initial]);
  const dirty = JSON.stringify(value) !== original;

  // Losing an edit to a stray back button is the one thing that would make
  // this tool untrustworthy.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    setProblems([]);
    try {
      const res = await fetch(`/api/content/${siteId}/${fileId}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(value),
      });
      const body = (await res.json()) as { problems?: Problem[]; error?: string };
      if (!res.ok) {
        setProblems(body.problems ?? []);
        setError(body.error ?? "Could not save.");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Could not reach the admin server.");
    } finally {
      setSaving(false);
    }
  }, [siteId, fileId, value]);

  return (
    <div>
      <Link href={`/${siteId}`} className="text-xs text-muted hover:text-body">
        ← {siteName}
      </Link>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 rounded-full" style={{ background: accent }} />
            <h1 className="text-xl font-semibold text-heading">{fileLabel}</h1>
          </div>
          <p className="mt-1 text-sm text-muted">{fileHint}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {dirty ? (
            <button
              type="button"
              className="btn"
              onClick={() => setValue(initial as Record<string, unknown>)}
            >
              <RotateCcw className="size-3.5" /> Undo changes
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={save} disabled={!dirty || saving}>
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : saved ? (
              <Check className="size-3.5" />
            ) : (
              <Save className="size-3.5" />
            )}
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-md border border-bad/40 bg-bad/10 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-heading">
            <AlertTriangle className="size-4 text-bad" /> {error}
          </p>
          {problems.length > 0 ? (
            <ul className="mt-2 space-y-1 text-sm text-body">
              {problems.map((p, i) => (
                <li key={i}>
                  <span className="font-mono text-xs text-muted">{p.path}</span> {p.message}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {saved ? (
        <p className="mt-4 rounded-md border border-good/40 bg-good/10 px-4 py-2 text-sm text-body">
          Saved to this computer. It is not public until you publish it on the review screen.
        </p>
      ) : null}

      <div className="mt-6 space-y-5">
        {Object.entries(value).map(([key, child]) => (
          <ValueEditor
            key={key}
            name={key}
            value={child}
            onChange={(next) => setValue({ ...value, [key]: next })}
          />
        ))}
      </div>
    </div>
  );
}
