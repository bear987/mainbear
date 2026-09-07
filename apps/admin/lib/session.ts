import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * The signed-in session.
 *
 * The GitHub access token is what actually lets the admin commit, so it never
 * reaches the browser as readable text and never leaves the cookie. The cookie
 * is encrypted and authenticated with AES-256-GCM, which means a tampered or
 * forged cookie fails to decrypt rather than being trusted.
 */

export type Session = {
  login: string;
  name: string;
  avatar: string;
  token: string;
  /** Seconds since the epoch. */
  issued: number;
};

export const SESSION_COOKIE = "gg_admin_session";

/** A week. Long enough not to be a nuisance, short enough to expire a lost phone. */
const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

function key(): Buffer {
  const secret = process.env.SESSION_SECRET ?? "";
  if (secret.length < 32) throw new Error("SESSION_SECRET is missing or too short.");
  return createHash("sha256").update(secret).digest();
}

export function seal(session: Session): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(session), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [iv, tag, body].map((b) => b.toString("base64url")).join(".");
}

export function unseal(value: string | undefined): Session | null {
  if (!value) return null;
  try {
    const [ivPart, tagPart, bodyPart] = value.split(".");
    if (!ivPart || !tagPart || !bodyPart) return null;

    const decipher = createDecipheriv(
      "aes-256-gcm",
      key(),
      Buffer.from(ivPart, "base64url"),
    );
    decipher.setAuthTag(Buffer.from(tagPart, "base64url"));
    const plain = Buffer.concat([
      decipher.update(Buffer.from(bodyPart, "base64url")),
      decipher.final(),
    ]).toString("utf8");

    const session = JSON.parse(plain) as Session;
    if (!session.login || !session.token) return null;

    // An old session is not a valid one, however well it decrypts.
    const age = Math.floor(Date.now() / 1000) - session.issued;
    if (age > MAX_AGE_SECONDS || age < -60) return null;

    return session;
  } catch {
    // Any failure here is a forged, corrupted or stale cookie. Refuse it.
    return null;
  }
}

export function cookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

/** Compare two secrets without leaking their contents through timing. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function newStateToken(): string {
  return randomBytes(24).toString("base64url");
}
