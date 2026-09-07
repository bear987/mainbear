import { NextResponse } from "next/server";
import { hostedProblems, isAllowedUser, isHosted, siteUrl } from "@/lib/config";
import { SESSION_COOKIE, cookieOptions, safeEqual, seal } from "@/lib/session";

/**
 * Finish the GitHub sign-in.
 *
 * Three things have to hold before a session is issued: the `state` matches
 * the one this server set, GitHub exchanges the code for a token, and the
 * account that token belongs to is on the allow list. Failing any of them
 * signs nobody in.
 */
export async function GET(request: Request) {
  if (!isHosted || hostedProblems().length > 0) {
    return NextResponse.json({ error: "Sign-in is not available." }, { status: 503 });
  }

  const url = new URL(request.url);
  const base = siteUrl() || url.origin;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const expected = request.headers
    .get("cookie")
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("gg_admin_state="))
    ?.slice("gg_admin_state=".length);

  const fail = (reason: string) =>
    NextResponse.redirect(`${base}/signed-out?reason=${encodeURIComponent(reason)}`);

  if (!code || !state || !expected || !safeEqual(state, expected)) {
    return fail("That sign-in link was not one this site started. Try again from the sign-in page.");
  }

  // Exchange the code for an access token.
  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${base}/api/auth/callback`,
    }),
  });

  const tokenBody = (await tokenResponse.json()) as { access_token?: string; error?: string };
  if (!tokenBody.access_token) {
    return fail("GitHub did not complete the sign-in. Try again.");
  }

  // Who is this?
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      authorization: `Bearer ${tokenBody.access_token}`,
      accept: "application/vnd.github+json",
    },
  });
  if (!userResponse.ok) {
    return fail("GitHub would not say who you are. Try again.");
  }
  const user = (await userResponse.json()) as { login: string; name?: string; avatar_url?: string };

  if (!isAllowedUser(user.login)) {
    // Named on purpose: the owner needs to know which account was refused.
    return fail(`The GitHub account ${user.login} is not allowed to edit these sites.`);
  }

  const response = NextResponse.redirect(base || "/");
  response.cookies.set(
    SESSION_COOKIE,
    seal({
      login: user.login,
      name: user.name || user.login,
      avatar: user.avatar_url || "",
      token: tokenBody.access_token,
      issued: Math.floor(Date.now() / 1000),
    }),
    cookieOptions(true),
  );
  response.cookies.delete("gg_admin_state");
  return response;
}
