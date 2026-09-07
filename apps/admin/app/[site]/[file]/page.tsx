import { notFound, redirect } from "next/navigation";
import { ContentForm } from "@/components/content-form";
import { isHosted } from "@/lib/config";
import { isRefusal, requireSession } from "@/lib/guard";
import { readContent } from "@/lib/repo";
import { getFile, getSite } from "@/lib/sites";

/**
 * Rendered per request, never prerendered.
 *
 * Hosted, the content is fetched from GitHub using the signed-in visitor's
 * token, which does not exist at build time. Prerendering this page would
 * either fail the build or bake in a stale copy of the content.
 */
export const dynamic = "force-dynamic";

export default async function FilePage({
  params,
}: {
  params: Promise<{ site: string; file: string }>;
}) {
  const guard = await requireSession();
  if (isRefusal(guard)) redirect("/signed-out");

  const { site: siteId, file: fileId } = await params;
  const site = getSite(siteId);
  const file = getFile(siteId, fileId);
  if (!site || !file) notFound();

  const data = await readContent(siteId, fileId, guard.session?.token);

  return (
    <ContentForm
      siteId={site.id}
      siteName={site.name}
      accent={site.accent}
      fileId={file.id}
      fileLabel={file.label}
      fileHint={file.hint}
      initial={data}
      hosted={isHosted}
    />
  );
}
