import { NextResponse } from "next/server";
import { hostedProblems, isHosted, siteUrl } from "@/lib/config";
import { newStateToken } from "@/lib/session";

/**
 * Start the GitHub sign-in.
 *
 * The `state` value is generated here, put in a short-lived cookie, and
 * checked when GitHub sends the visitor back. Without it, someone could hand
 * you a link that completes a sign-in as them.
 */
export async function GET(request: Request) {
  if (!isHosted) {
    return NextResponse.json(
      { error: "The admin is running locally, where there is nothing to sign in to." },
      { status: 400 },
    );
  }

  const problems = hostedProblems();
  if (problems.length > 0) {
    return NextResponse.json(
      { error: "The admin is not configured for sign-in.", problems },
      { status: 503 },
    );
  }

  const base = siteUrl() || new URL(request.url).origin;
  const state = newStateToken();

  const authorise = new URL("https://github.com/login/oauth/authorize");
  authorise.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID!);
  authorise.searchParams.set("redirect_uri", `${base}/api/auth/callback`);
  // `repo` is what lets the admin commit content to a private repository.
  authorise.searchParams.set("scope", "repo read:user");
  authorise.searchParams.set("state", state);

  const response = NextResponse.redirect(authorise.toString());
  response.cookies.set("gg_admin_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });
  return response;
}
