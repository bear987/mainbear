import { NextResponse } from "next/server";
import { readContent, writeContent } from "@/lib/repo";
import { isAllowed } from "@/lib/sites";
import { validate } from "@/lib/validate";

type Params = { params: Promise<{ site: string; file: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { site, file } = await params;
  if (!isAllowed(site, file)) {
    return NextResponse.json({ error: "Not an editable file." }, { status: 404 });
  }
  try {
    return NextResponse.json({ data: await readContent(site, file) });
  } catch {
    return NextResponse.json({ error: "Could not read that file." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
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

  // The version on disk is the shape the site is typed against.
  const current = await readContent(site, file);
  const problems = validate(current, next);
  if (problems.length > 0) {
    return NextResponse.json({ error: "Not saved.", problems }, { status: 422 });
  }

  await writeContent(site, file, next);
  return NextResponse.json({ ok: true });
}
