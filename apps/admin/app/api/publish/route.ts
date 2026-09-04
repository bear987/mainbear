import { NextResponse } from "next/server";
import { changedFiles, commitAndPush, sitesThatWouldRebuild } from "@/lib/git";

/**
 * Commit and push. Only files the admin itself is responsible for are staged,
 * so unrelated work in the repository is never swept into a publish.
 */
const PUBLISHABLE = /^apps\/company-[abc]\/(content\/data\/[a-z-]+\.json|public\/.+)$/;

export async function POST(request: Request) {
  let body: { message?: string };
  try {
    body = (await request.json()) as { message?: string };
  } catch {
    body = {};
  }

  const message = (body.message ?? "").trim();
  if (message.length < 3) {
    return NextResponse.json(
      { error: "Describe the change in a few words before publishing." },
      { status: 400 },
    );
  }

  try {
    const files = await changedFiles();
    const paths = files.map((f) => f.path).filter((p) => PUBLISHABLE.test(p));

    if (paths.length === 0) {
      return NextResponse.json({ error: "There is nothing to publish." }, { status: 400 });
    }

    const rebuilds = sitesThatWouldRebuild(paths);
    const { commit } = await commitAndPush(paths, message);

    return NextResponse.json({ ok: true, commit, published: paths, rebuilds });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "The publish failed." },
      { status: 500 },
    );
  }
}
