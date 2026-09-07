import { NextResponse } from "next/server";
import { isHosted } from "@/lib/config";
import { isRefusal, requireSession } from "@/lib/guard";
import { readContent, writeContent } from "@/lib/repo";
import { getFile, getSite, isAllowed } from "@/lib/sites";
import { validate } from "@/lib/validate";

type Params = { params: Promise<{ site: string; file: string }> };

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site, file } = await params;
  if (!isAllowed(site, file)) {
    return NextResponse.json({ error: "Not an editable file." }, { status: 404 });
  }
  try {
    return NextResponse.json({ data: await readContent(site, file, guard.session?.token) });
  } catch {
    return NextResponse.json({ error: "Could not read that file." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site, file } = await params;
  if (!isAllowed(site, file)) {
    return NextResponse.json({ error: "Not an editable file." }, { status: 404 });
  }

  let next: unknown;
  try {
    next = (await request.json()) as unknown;
  } catch {
    return NextResponse.json({ error: "That was not valid JSON." }, { status: 400 });
  }

  const token = guard.session?.token;

  // The version currently stored is the shape the site is typed against.
  const current = await readContent(site, file, token);
  const problems = validate(current, next);
  if (problems.length > 0) {
    return NextResponse.json({ error: "Not saved.", problems }, { status: 422 });
  }

  const label = getFile(site, file)?.label ?? file;
  const siteName = getSite(site)?.name ?? site;

  try {
    const result = await writeContent(
      site,
      file,
      next,
      `${siteName}: update ${label.toLowerCase()}`,
      token,
    );
    // Hosted, a save is a commit, so the site is already rebuilding.
    return NextResponse.json({ ok: true, published: isHosted, commit: result.commit });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save." },
      { status: 409 },
    );
  }
}
