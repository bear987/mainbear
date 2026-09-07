import { NextResponse } from "next/server";
import { MODE, hostedProblems } from "@/lib/config";

/**
 * Whether this admin is configured well enough to be used. Deliberately says
 * only which settings are missing, never their values.
 */
export async function GET() {
  const problems = hostedProblems();
  return NextResponse.json(
    { mode: MODE, ok: problems.length === 0, problems },
    { status: problems.length === 0 ? 200 : 503 },
  );
}
