import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { hostedProblems, isAllowedUser, isHosted } from "@/lib/config";
import { SESSION_COOKIE, unseal, type Session } from "@/lib/session";

/**
 * Verify the caller before a route does anything.
 *
 * The middleware only checks that a session cookie is present, because it runs
 * on the edge without Node crypto. This is where the cookie is actually
 * decrypted and the account re-checked against the allow list, so a forged,
 * expired, or since-revoked session gets no further.
 *
 * Locally there is no session and none is needed: the admin listens on
 * 127.0.0.1 only.
 */

export type Guarded = { session: Session | null };

export async function requireSession(): Promise<Guarded | NextResponse> {
  if (!isHosted) return { session: null };

  if (hostedProblems().length > 0) {
    return NextResponse.json({ error: "The admin is not configured." }, { status: 503 });
  }

  const store = await cookies();
  const session = unseal(store.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  // The allow list can change after a session was issued. Honour the current
  // one, so removing an account takes effect immediately rather than in a week.
  if (!isAllowedUser(session.login)) {
    return NextResponse.json(
      { error: "That account is no longer allowed to edit these sites." },
      { status: 403 },
    );
  }

  return { session };
}

/** True when the value returned by requireSession is a refusal to pass on. */
export function isRefusal(value: Guarded | NextResponse): value is NextResponse {
  return value instanceof NextResponse;
}
