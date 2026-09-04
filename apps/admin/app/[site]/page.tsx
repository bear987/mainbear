import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewControl } from "@/components/preview-control";
import { SITES, getSite } from "@/lib/sites";

export function generateStaticParams() {
  return SITES.map((s) => ({ site: s.id }));
}

export default async function SitePage({ params }: { params: Promise<{ site: string }> }) {
  const { site: siteId } = await params;
  const site = getSite(siteId);
  if (!site) notFound();

  return (
    <div>
      <Link href="/" className="text-xs text-muted hover:text-body">
        ← All sites
      </Link>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span aria-hidden className="size-3 rounded-full" style={{ background: site.accent }} />
        <h1 className="text-xl font-semibold text-heading">{site.name}</h1>
        <a
          href={site.url}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs text-muted hover:text-body"
        >
          {site.url.replace("https://", "")}
        </a>
      </div>

      <PreviewControl siteId={site.id} port={site.port} />

      <h2 className="mt-8 text-sm font-semibold tracking-wide text-muted uppercase">
        What would you like to change?
      </h2>

      <div className="mt-3 grid gap-2">
        {site.files.map((file) => (
          <Link
            key={file.id}
            href={`/${site.id}/${file.id}`}
            className="rounded-lg border border-line bg-panel px-4 py-3 transition-colors hover:border-muted"
          >
            <h3 className="text-sm font-semibold text-heading">{file.label}</h3>
            <p className="mt-0.5 text-sm text-muted">{file.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
