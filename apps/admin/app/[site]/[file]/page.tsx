import { notFound } from "next/navigation";
import { ContentForm } from "@/components/content-form";
import { readContent } from "@/lib/repo";
import { SITES, getFile, getSite } from "@/lib/sites";

export function generateStaticParams() {
  return SITES.flatMap((s) => s.files.map((f) => ({ site: s.id, file: f.id })));
}

export default async function FilePage({
  params,
}: {
  params: Promise<{ site: string; file: string }>;
}) {
  const { site: siteId, file: fileId } = await params;
  const site = getSite(siteId);
  const file = getFile(siteId, fileId);
  if (!site || !file) notFound();

  const data = await readContent(siteId, fileId);

  return (
    <ContentForm
      siteId={site.id}
      siteName={site.name}
      accent={site.accent}
      fileId={file.id}
      fileLabel={file.label}
      fileHint={file.hint}
      initial={data}
    />
  );
}
