import { NextResponse } from "next/server";
import { isHosted } from "@/lib/config";
import { isRefusal, requireSession } from "@/lib/guard";
import { readLayout, writeLayout } from "@/lib/layout";
import { getSite } from "@/lib/sites";

type Params = { params: Promise<{ site: string }> };

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }
  try {
    return NextResponse.json({ pages: await readLayout(site, guard.session?.token) });
  } catch {
    return NextResponse.json({ error: "This site has no editable layout yet." }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireSession();
  if (isRefusal(guard)) return guard;

  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  let body: { page?: string; order?: { id: string; enabled: boolean }[] };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "That was not valid JSON." }, { status: 400 });
  }

  if (!body.page || !Array.isArray(body.order)) {
    return NextResponse.json({ error: "A page and an order are required." }, { status: 400 });
  }

  try {
    const sections = await writeLayout(site, body.page, body.order, guard.session?.token);
    return NextResponse.json({ ok: true, sections, published: isHosted });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the layout." },
      { status: 422 },
    );
  }
}
