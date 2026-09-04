import { NextResponse } from "next/server";
import { aheadOfRemote, changedFiles, currentBranch, fileDiff, sitesThatWouldRebuild } from "@/lib/git";

/** Everything the review screen needs: what changed, and what shipping it does. */
export async function GET() {
  try {
    const files = await changedFiles();
    const diffs: Record<string, string> = {};
    for (const f of files) {
      diffs[f.path] = await fileDiff(f.path);
    }
    return NextResponse.json({
      files,
      diffs,
      rebuilds: sitesThatWouldRebuild(files.map((f) => f.path)),
      branch: await currentBranch(),
      ahead: await aheadOfRemote(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read the repository." },
      { status: 500 },
    );
  }
}
