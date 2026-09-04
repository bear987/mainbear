"use client";

import { ExternalLink, Loader2, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Status = { id: string; port: number; running: boolean; starting: boolean };

/**
 * Starts the site's dev server on demand and links to it once it answers, so
 * an edit can be seen locally before it is published.
 */
export function PreviewControl({ siteId, port }: { siteId: string; port: number }) {
  const [running, setRunning] = useState<boolean | null>(null);
  const [starting, setStarting] = useState(false);

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/preview", { cache: "no-store" });
      const body = (await res.json()) as { status: Status[] };
      const mine = body.status.find((s) => s.id === siteId);
      setRunning(Boolean(mine?.running));
      return Boolean(mine?.running);
    } catch {
      setRunning(false);
      return false;
    }
  }, [siteId]);

  useEffect(() => {
    void check();
  }, [check]);

  // While a server is booting, poll until the port answers.
  useEffect(() => {
    if (!starting) return;
    const timer = setInterval(async () => {
      if (await check()) setStarting(false);
    }, 2000);
    const stop = setTimeout(() => setStarting(false), 90_000);
    return () => {
      clearInterval(timer);
      clearTimeout(stop);
    };
  }, [starting, check]);

  const start = async () => {
    setStarting(true);
    await fetch("/api/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ site: siteId }),
    });
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3">
      <span className="text-sm text-body">Preview</span>

      {running === null ? (
        <span className="text-sm text-muted">checking...</span>
      ) : running ? (
        <>
          <span className="inline-flex items-center gap-1.5 text-sm text-good">
            <span className="size-2 rounded-full bg-good" aria-hidden />
            running on port {port}
          </span>
          <a
            className="btn"
            href={`http://localhost:${port}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink className="size-3.5" /> Open preview
          </a>
        </>
      ) : starting ? (
        <span className="inline-flex items-center gap-2 text-sm text-muted">
          <Loader2 className="size-3.5 animate-spin" /> starting, this takes a few seconds
        </span>
      ) : (
        <>
          <span className="text-sm text-muted">not running</span>
          <button type="button" className="btn" onClick={start}>
            <Play className="size-3.5" /> Start preview
          </button>
        </>
      )}
    </div>
  );
}
