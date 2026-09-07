import { NextResponse } from "next/server";
import { siteUrl } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/session";

/** Sign out by destroying the session cookie, which holds the GitHub token. */
export async function POST(request: Request) {
  const base = siteUrl() || new URL(request.url).origin;
  const response = NextResponse.redirect(`${base}/signed-out`, { status: 303 });
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
