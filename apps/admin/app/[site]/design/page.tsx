import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeEditor } from "@/components/theme-editor";
import { SITES, getSite } from "@/lib/sites";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SITES.map((s) => ({ site: s.id }));
}

export default async function DesignPage({ params }: { params: Promise<{ site: string }> }) {
  const { site: siteId } = await params;
  const site = getSite(siteId);
  if (!site) notFound();

  return (
    <div>
      <Link href={`/${site.id}`} className="text-xs text-muted hover:text-body">
        ← {site.name}
      </Link>

      <div className="mt-3 mb-4 flex items-center gap-2">
        <span aria-hidden className="size-2.5 rounded-full" style={{ background: site.accent }} />
        <h1 className="text-xl font-semibold text-heading">Colours and design</h1>
      </div>

      <ThemeEditor siteId={site.id} />
    </div>
  );
}
