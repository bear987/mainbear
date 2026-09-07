import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { isHosted } from "@/lib/config";
import { isRefusal, requireSession } from "@/lib/guard";
import { mediaPath, relativeMediaPath, slotsFor, statusFor } from "@/lib/media";
import { ToolMissing, processInto } from "@/lib/process";
import { readContent, writeContent } from "@/lib/repo";
import { getSite, type SiteId } from "@/lib/sites";
import { writeBytes } from "@/lib/store";

type Params = { params: Promise<{ site: string }> };

/** Uploads are capped before anything is written. */
const MAX_UPLOAD_LOCAL = 500 * 1024 * 1024;
/**
 * Hosted, the whole file has to travel through a serverless function, so it
 * has to be small. The browser shrinks pictures before sending them, which
 * puts a normal photograph far under this.
 */
const MAX_UPLOAD_HOSTED = 5 * 1024 * 1024;

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }
  return NextResponse.json({
    slots: await statusFor(site as SiteId, guard.session?.token),
    hosted: isHosted,
  });
}

export async function POST(request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  const token = guard.session?.token;
  const form = await request.formData();
  const slotPath = String(form.get("path") ?? "");
  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file was attached." }, { status: 400 });
  }

  const cap = isHosted ? MAX_UPLOAD_HOSTED : MAX_UPLOAD_LOCAL;
  if (file.size > cap) {
    return NextResponse.json(
      {
        error: isHosted
          ? "That file is too large to send from here. Pictures are shrunk automatically, so this is usually a video, which has to be added from the admin on your computer."
          : "That file is over 500MB. Trim it before uploading.",
      },
      { status: 413 },
    );
  }

  const slots = await slotsFor(site as SiteId, token);
  const slot = slots.find((s) => s.path === slotPath);
  if (!slot) {
    return NextResponse.json(
      { error: "That is not somewhere this site looks for a file." },
      { status: 400 },
    );
  }

  // The logo keeps its uploaded format, because a transparent PNG flattened to
  // JPEG would gain the very background it is meant not to have.
  let slotPathToWrite = slot.path;
  if (slot.preserveFormat) {
    const wantsPng = file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
    slotPathToWrite = slot.path.replace(/\.[^.]+$/, wantsPng ? ".png" : ".jpg");
  }

  /* ---------------------------------------------------------------
     Hosted: there is no ffmpeg and no disk. The browser has already
     resized the picture, so the bytes are committed as they arrive.
     Video cannot be re-encoded here, so it is refused rather than
     silently committing a 10MB file into the repository forever.
     --------------------------------------------------------------- */
  if (isHosted) {
    if (slot.kind === "video") {
      return NextResponse.json(
        {
          error:
            "Videos have to be added from the admin on your computer, where they can be re-encoded. Sending one straight through would put a very large file into the repository permanently.",
        },
        { status: 501 },
      );
    }

    try {
      const bytes = Buffer.from(await file.arrayBuffer());
      const result = await writeBytes(
        relativeMediaPath(site, slotPathToWrite),
        bytes,
        `${getSite(site)?.name}: update ${slot.label.toLowerCase()}`,
        token,
      );
      if (slot.preserveFormat && slotPathToWrite !== slot.path) {
        const data = (await readContent(site, "site", token)) as { site: Record<string, unknown> };
        data.site.logoFile = slotPathToWrite;
        await writeContent(site, "site", data, `${getSite(site)?.name}: point at the new logo`, token);
      }
      return NextResponse.json({
        ok: true,
        path: slotPathToWrite,
        bytes: bytes.length,
        originalBytes: file.size,
        published: true,
        commit: result.commit,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Could not save that picture." },
        { status: 409 },
      );
    }
  }

  /* Local: re-encode through ffmpeg, then write to disk. */
  const staging = await mkdtemp(path.join(tmpdir(), "gg-admin-"));
  const incoming = path.join(staging, "incoming");

  try {
    await writeFile(incoming, Buffer.from(await file.arrayBuffer()));

    const target = mediaPath(site, slotPathToWrite);
    const limit = slot.kind === "video" ? (slot.maxHeight ?? 720) : (slot.maxWidth ?? 1600);
    const result = await processInto(incoming, target, slot.kind, limit);

    if (slot.preserveFormat && slotPathToWrite !== slot.path) {
      const data = (await readContent(site, "site")) as { site: Record<string, unknown> };
      data.site.logoFile = slotPathToWrite;
      await writeContent(site, "site", data, "point at the new logo");
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
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  const slotPath = new URL(request.url).searchParams.get("path") ?? "";
  const slots = await slotsFor(site as SiteId, guard.session?.token);
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

  if (isHosted) {
    return NextResponse.json(
      { error: "Removing a file has to be done from the admin on your computer." },
      { status: 501 },
    );
  }

  await rm(mediaPath(site, slot.path), { force: true });
  return NextResponse.json({ ok: true });
}
