import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { mediaPath } from "@/lib/media";
import { getSite } from "@/lib/sites";

/**
 * Serves a site's picture or video to the admin's own preview thumbnails.
 * The admin lives on a different port from the sites, so it cannot link to
 * their public folders directly.
 */

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ site: string; path: string[] }> },
) {
  const { site, path: parts } = await params;
  if (!getSite(site)) return new NextResponse("Unknown site", { status: 404 });

  const slotPath = parts.join("/");
  let file: string;
  try {
    file = mediaPath(site, slotPath);
  } catch {
    return new NextResponse("Refused", { status: 400 });
  }

  const type = TYPES[path.extname(file).toLowerCase()];
  if (!type) return new NextResponse("Not a media file", { status: 400 });

  try {
    const info = await stat(file);
    const body = await readFile(file);
    return new NextResponse(new Uint8Array(body), {
      headers: {
        "content-type": type,
        "content-length": String(info.size),
        // The admin rewrites these files in place, so nothing may be cached.
        "cache-control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
