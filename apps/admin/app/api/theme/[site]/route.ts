import { NextResponse } from "next/server";
import { checkContrast } from "@/lib/contrast-pairs";
import { getSite } from "@/lib/sites";
import { readTheme, writeTheme, type Edit } from "@/lib/theme";

type Params = { params: Promise<{ site: string }> };

/**
 * Resolve one theme's token values. A light-mode block only lists what it
 * overrides, so it inherits the rest from the main palette, exactly as the
 * browser resolves it.
 */
function resolve(base: Record<string, string>, overrides?: Record<string, string>) {
  return { ...base, ...(overrides ?? {}) };
}

export async function GET(_request: Request, { params }: Params) {
  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  const theme = await readTheme(site);
  const valuesFor = (selector: string) =>
    Object.fromEntries(
      (theme.blocks.find((b) => b.selector === selector)?.tokens ?? []).map((t) => [
        t.name,
        t.value,
      ]),
    );

  const base = valuesFor("@theme");
  const lightBlock = theme.blocks.find((b) => b.selector !== "@theme");

  return NextResponse.json({
    blocks: theme.blocks,
    mirrors: theme.mirrors,
    contrast: {
      dark: checkContrast(base),
      light: lightBlock ? checkContrast(resolve(base, valuesFor(lightBlock.selector))) : null,
      lightLabel: lightBlock?.label ?? null,
    },
  });
}

export async function PUT(request: Request, { params }: Params) {
  const { site } = await params;
  if (!getSite(site)) {
    return NextResponse.json({ error: "Unknown site." }, { status: 404 });
  }

  let edits: Edit[];
  try {
    const body = (await request.json()) as { edits?: Edit[] };
    edits = body.edits ?? [];
  } catch {
    return NextResponse.json({ error: "That was not valid JSON." }, { status: 400 });
  }

  if (edits.length === 0) {
    return NextResponse.json({ error: "Nothing to change." }, { status: 400 });
  }

  try {
    const changed = await writeTheme(site, edits);
    return NextResponse.json({ ok: true, changed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save the design." },
      { status: 422 },
    );
  }
}
