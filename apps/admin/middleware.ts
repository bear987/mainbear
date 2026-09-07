import { NextResponse, type NextRequest } from "next/server";
import { hostedProblems, isHosted } from "@/lib/config";

/**
 * The gate.
 *
 * Hosted, nothing is reachable without a session except the sign-in itself.
 * This runs before every page and every API route, so a route added later is
 * protected by default rather than by remembering to protect it.
 *
 * Locally it does nothing: the admin is bound to 127.0.0.1 and there is
 * nobody else on the machine to keep out.
 */

const OPEN_PATHS = [
  "/signed-out",
  "/api/auth/signin",
  "/api/auth/callback",
  "/api/health",
];

export function middleware(request: NextRequest) {
  if (!isHosted) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // The health check has to answer even when nothing else will, otherwise a
  // misconfigured admin gives no way to find out what is missing. It reports
  // only which settings are absent, never their values.
  if (pathname === "/api/health") return NextResponse.next();

  // A misconfigured hosted admin serves nothing at all. Falling open here
  // would expose three live sites to whoever found the address.
  if (hostedProblems().length > 0 && pathname !== "/signed-out") {
    return new NextResponse(
      "This admin is not configured correctly, so it is refusing to run. Check its environment variables.",
      { status: 503, headers: { "content-type": "text/plain" } },
    );
  }

  if (OPEN_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // The cookie is only checked for presence here, because verifying it needs
  // Node crypto. Every route re-checks it properly before doing anything.
  const cookie = request.cookies.get("gg_admin_session");
  if (!cookie?.value) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Not signed in." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
