"use client";

import { AlertTriangle, Check, Loader2, Rocket } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SITES } from "@/lib/sites";

type ChangedFile = {
  path: string;
  site: string | null;
  label: string;
  added: number;
  removed: number;
};

type Review = {
  files: ChangedFile[];
  diffs: Record<string, string>;
  rebuilds: string[];
  branch: string;
  ahead: number;
};

type Published = { commit: string; rebuilds: string[] };

function siteName(id: string): string {
  return SITES.find((s) => s.id === id)?.name ?? id;
}

/** Only the added and removed lines, which is what a person wants to read. */
function meaningfulLines(diff: string): string[] {
  return diff
    .split("\n")
    .filter((l) => (l.startsWith("+") || l.startsWith("-")) && !l.startsWith("+++") && !l.startsWith("---"))
    .slice(0, 40);
}

export function ReviewScreen() {
  const [review, setReview] = useState<Review | null>(null);
  const [message, setMessage] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState<Published | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/review", { cache: "no-store" });
      setReview((await res.json()) as Review);
    } catch {
      setError("Could not read the repository.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const publish = async () => {
    setPublishing(true);
    setError(null);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const body = (await res.json()) as { error?: string; commit?: string; rebuilds?: string[] };
      if (!res.ok) {
        setError(body.error ?? "The publish failed.");
        return;
      }
      setPublished({ commit: body.commit ?? "", rebuilds: body.rebuilds ?? [] });
      setMessage("");
      await load();
    } catch {
      setError("Could not reach the admin server.");
    } finally {
      setPublishing(false);
    }
  };

  if (!review) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Reading your changes...
      </p>
    );
  }

  const editable = review.files.filter((f) => f.site !== null);
  const other = review.files.filter((f) => f.site === null);

  return (
    <div>
      <h1 className="text-xl font-semibold text-heading">Review and publish</h1>
      <p className="mt-1 text-sm text-muted">
        Everything you have changed since the last publish. Nothing here is public yet.
      </p>

      {published ? (
        <div className="mt-5 rounded-md border border-good/40 bg-good/10 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-heading">
            <Check className="size-4 text-good" /> Published as {published.commit}
          </p>
          <p className="mt-1 text-sm text-body">
            {published.rebuilds.length === 0
              ? "No site needed rebuilding."
              : `${published.rebuilds.map(siteName).join(" and ")} will be live in about 40 seconds.`}
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="mt-5 flex items-center gap-2 rounded-md border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-heading">
          <AlertTriangle className="size-4 text-bad" /> {error}
        </div>
      ) : null}

      {editable.length === 0 ? (
        <div className="mt-6 rounded-lg border border-line bg-panel px-4 py-6 text-center">
          <p className="text-sm text-body">You have not changed anything yet.</p>
          <Link href="/" className="btn mt-3 inline-flex">
            Pick a site to edit
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {editable.map((file) => {
              const lines = meaningfulLines(review.diffs[file.path] ?? "");
              return (
                <div key={file.path} className="rounded-lg border border-line bg-panel">
                  <div className="flex items-center justify-between gap-3 border-b border-line-soft px-4 py-2.5">
                    <h2 className="text-sm font-semibold text-heading">{file.label}</h2>
                    <span className="font-mono text-xs text-muted">
                      <span className="text-good">+{file.added}</span>{" "}
                      <span className="text-bad">-{file.removed}</span>
                    </span>
                  </div>
                  {lines.length > 0 ? (
                    <pre className="diff px-4 py-3">
                      {lines.map((line, i) => (
                        <div
                          key={i}
                          className={line.startsWith("+") ? "text-good" : "text-bad"}
                        >
                          {line}
                        </div>
                      ))}
                    </pre>
                  ) : (
                    <p className="px-4 py-3 text-sm text-muted">A new file.</p>
                  )}
                </div>
              );
            })}
          </div>

          {other.length > 0 ? (
            <p className="mt-4 rounded-md border border-warn/40 bg-warn/10 px-4 py-3 text-sm text-body">
              {other.length} other {other.length === 1 ? "file has" : "files have"} also changed in
              this project. Publishing here leaves {other.length === 1 ? "it" : "them"} alone.
            </p>
          ) : null}

          <div className="mt-6 rounded-lg border border-line bg-panel p-4">
            <label className="block">
              <span className="mb-1 block text-xs font-medium tracking-wide text-muted uppercase">
                What did you change?
              </span>
              <input
                type="text"
                className="field"
                placeholder="Updated the menu prices"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <p className="mt-3 text-sm text-body">
              Publishing rebuilds{" "}
              <strong className="text-heading">
                {review.rebuilds.length === 0
                  ? "nothing"
                  : review.rebuilds.map(siteName).join(" and ")}
              </strong>
              . The other sites are left untouched.
            </p>

            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={publish}
              disabled={publishing || message.trim().length < 3}
            >
              {publishing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Rocket className="size-3.5" />
              )}
              Publish, and make it live
            </button>
          </div>
        </>
      )}
    </div>
  );
}
