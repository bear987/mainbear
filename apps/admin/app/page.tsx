import Link from "next/link";
import { SITES } from "@/lib/sites";

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-heading">Which site are you changing?</h1>
      <p className="mt-1 text-sm text-muted">
        Pick a site, edit it, look at the preview, then publish when you are happy.
      </p>

      <div className="mt-6 grid gap-3">
        {SITES.map((site) => (
          <Link
            key={site.id}
            href={`/${site.id}`}
            className="group rounded-lg border border-line bg-panel p-4 transition-colors hover:border-muted"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 size-3 shrink-0 rounded-full"
                style={{ background: site.accent }}
              />
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-heading">{site.name}</h2>
                <p className="mt-0.5 text-sm text-body">{site.blurb}</p>
                <p className="mt-2 font-mono text-xs text-muted">
                  {site.url.replace("https://", "")} · {site.files.length} sections you can edit
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
