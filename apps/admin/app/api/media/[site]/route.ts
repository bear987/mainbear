import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { mediaPath, slotsFor, statusFor } from "@/lib/media";
import { ToolMissing, processInto } from "@/lib/process";
import { readContent, writeContent } from "@/lib/repo";
import { getSite, type SiteId } from "@/lib/sites";

type Params = { params: Promise<{ site: string }> };

/** Uploads are capped before anything is written to disk. */
const MAX_UPLOAD = 500 * 1024 * 1024;

export async function GET(_request: Request, { params }: Params) {
  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }
  return NextResponse.json({ slots: await statusFor(site as SiteId) });
}

export async function POST(request: Request, { params }: Params) {
  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  const form = await request.formData();
  const slotPath = String(form.get("path") ?? "");
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  }
  if (file.size > MAX_UPLOAD) {
    return NextResponse.json(
      { error: "That file is over 500MB. Trim it before uploading." },
      { status: 413 },
    );
  }

  // Only a slot the site actually looks for may be written.
  const slots = await slotsFor(site as SiteId);
  const slot = slots.find((s) => s.path === slotPath);
  if (!slot) {
    return NextResponse.json(
      { error: "That is not somewhere this site looks for a file." },
      { status: 400 },
    );
  }

  const staging = await mkdtemp(path.join(tmpdir(), "gg-admin-"));
  const incoming = path.join(staging, "incoming");

  try {
    await writeFile(incoming, Buffer.from(await file.arrayBuffer()));

    // The logo keeps its uploaded format, because a transparent PNG flattened
    // to JPEG would gain the very background it is meant not to have.
    let slotPathToWrite = slot.path;
    if (slot.preserveFormat) {
      const wantsPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
      slotPathToWrite = slot.path.replace(/\.[^.]+$/, wantsPng ? ".png" : ".jpg");
    }

    const target = mediaPath(site, slotPathToWrite);
    const limit = slot.kind === "video" ? (slot.maxHeight ?? 720) : (slot.maxWidth ?? 1600);
    const result = await processInto(incoming, target, slot.kind, limit);

    // Point the site at the file that now exists, so it never asks for one
    // that does not and 404s on every page load.
    if (slot.preserveFormat && slotPathToWrite !== slot.path) {
      const data = (await readContent(site, "site")) as { site: Record<string, unknown> };
      data.site.logoFile = slotPathToWrite;
      await writeContent(site, "site", data);
    }

    return NextResponse.json({
      ok: true,
      path: slotPathToWrite,
      bytes: result.bytes,
      originalBytes: file.size,
      width: result.probe?.width,
      height: result.probe?.height,
    });
  } catch (error) {
    const status = error instanceof ToolMissing ? 501 : 400;
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not process that file." },
      { status },
    );
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  const slotPath = new URL(request.url).searchParams.get("path") ?? "";
  const slots = await slotsFor(site as SiteId);
  const slot = slots.find((s) => s.path === slotPath);
  if (!slot) {
    return NextResponse.json({ error: "Unknown file." }, { status: 400 });
  }

  // Removing a picture the site has no fallback for would leave a hole.
  if (!slot.optional) {
    return NextResponse.json(
      { error: "This site expects a picture here, so it cannot be left empty. Replace it instead." },
      { status: 400 },
    );
  }

  await rm(mediaPath(site, slot.path), { force: true });
  return NextResponse.json({ ok: true });
}
