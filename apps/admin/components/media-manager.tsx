"use client";

import { AlertTriangle, Check, ImageOff, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Slot = {
  path: string;
  label: string;
  group: string;
  kind: "image" | "video";
  note?: string;
  optional?: boolean;
  exists: boolean;
  bytes?: number;
};

type Result = { bytes: number; originalBytes: number; width?: number; height?: number };

function size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function SlotCard({
  siteId,
  slot,
  onChanged,
}: {
  siteId: string;
  slot: Slot;
  onChanged: () => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Bumped after every write so the thumbnail is refetched rather than reused.
  const [version, setVersion] = useState(0);

  const upload = useCallback(
    async (file: File) => {
      setBusy(true);
      setError(null);
      setResult(null);
      try {
        const body = new FormData();
        body.set("path", slot.path);
        body.set("file", file);
        const res = await fetch(`/api/media/${siteId}`, { method: "POST", body });
        const payload = (await res.json()) as Result & { error?: string };
        if (!res.ok) {
          setError(payload.error ?? "Could not process that file.");
          return;
        }
        setResult(payload);
        setVersion((v) => v + 1);
        onChanged();
      } catch {
        setError("Could not reach the admin server.");
      } finally {
        setBusy(false);
      }
    },
    [siteId, slot.path, onChanged],
  );

  const remove = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/media/${siteId}?path=${encodeURIComponent(slot.path)}`,
        { method: "DELETE" },
      );
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) setError(payload.error ?? "Could not remove that file.");
      else {
        setResult(null);
        setVersion((v) => v + 1);
        onChanged();
      }
    } finally {
      setBusy(false);
    }
  };

  const src = `/api/media/${siteId}/raw/${slot.path}?v=${version}`;

  return (
    <div
      className="rounded-lg border border-line bg-panel p-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) void upload(file);
      }}
    >
      <div className="flex gap-3">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-md border border-line-soft bg-page">
          {slot.exists ? (
            slot.kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt="" className="size-full object-cover" />
            ) : (
              <video src={src} className="size-full object-cover" muted playsInline preload="metadata" />
            )
          ) : (
            <ImageOff className="size-6 text-muted" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-heading">{slot.label}</h3>
          <p className="mt-0.5 font-mono text-xs break-all text-muted">{slot.path}</p>

          {slot.note ? <p className="mt-1 text-xs text-muted">{slot.note}</p> : null}

          <p className="mt-1 text-xs text-body">
            {slot.exists ? (
              <>on the site, {size(slot.bytes ?? 0)}</>
            ) : slot.optional ? (
              <span className="text-muted">not added yet</span>
            ) : (
              <span className="text-warn">missing</span>
            )}
          </p>

          {result ? (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-good">
              <Check className="size-3.5" />
              saved at {result.width}×{result.height}, {size(result.originalBytes)} down to{" "}
              {size(result.bytes)}
            </p>
          ) : null}

          {error ? (
            <p className="mt-1 flex items-start gap-1.5 text-xs text-bad">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="btn"
              disabled={busy}
              onClick={() => input.current?.click()}
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
              {slot.exists ? "Replace" : "Add"}
            </button>

            {slot.exists && slot.optional ? (
              <button type="button" className="btn btn-danger" disabled={busy} onClick={remove}>
                <Trash2 className="size-3.5" /> Remove
              </button>
            ) : null}

            <input
              ref={input}
              type="file"
              accept={slot.kind === "image" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(file);
                e.target.value = "";
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MediaManager({ siteId }: { siteId: string }) {
  const [slots, setSlots] = useState<Slot[] | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/media/${siteId}`, { cache: "no-store" });
    const body = (await res.json()) as { slots: Slot[] };
    setSlots(body.slots);
  }, [siteId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (!slots) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 className="size-4 animate-spin" /> Looking for your pictures...
      </p>
    );
  }

  const groups = [...new Set(slots.map((s) => s.group))];
  const present = slots.filter((s) => s.exists).length;

  return (
    <div>
      <p className="text-sm text-muted">
        {present} of {slots.length} in place. Drop a file on a card, or press Add. Pictures and
        video are resized and re-encoded on the way in, so a large photograph straight off a phone
        is safe to use.
      </p>

      <div className="mt-6 space-y-8">
        {groups.map((group) => (
          <section key={group}>
            <h2 className="mb-3 text-sm font-semibold tracking-wide text-muted uppercase">
              {group}
            </h2>
            <div className="grid gap-3">
              {slots
                .filter((s) => s.group === group)
                .map((slot) => (
                  <SlotCard key={slot.path} siteId={siteId} slot={slot} onChanged={load} />
                ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
