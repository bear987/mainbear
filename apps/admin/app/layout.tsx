import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { isHosted } from "@/lib/config";
import { SESSION_COOKIE, unseal } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "GG Bearers admin",
  description: "Edit and publish the three GG Bearers sites.",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = isHosted ? unseal((await cookies()).get(SESSION_COOKIE)?.value) : null;

  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-line bg-panel">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <Link href="/" className="text-sm font-semibold tracking-wide text-heading">
              GG BEARERS <span className="text-muted">admin</span>
            </Link>

            <div className="flex items-center gap-2">
              {isHosted ? null : (
                <Link href="/review" className="btn">
                  Review and publish
                </Link>
              )}

              {session ? (
                <form action="/api/auth/signout" method="post" className="flex items-center gap-2">
                  <span className="text-xs text-muted">{session.login}</span>
                  <button type="submit" className="btn">
                    Sign out
                  </button>
                </form>
              ) : null}
            </div>
          </div>
        </header>

        {isHosted ? (
          <p className="border-b border-warn/30 bg-warn/10 px-5 py-2 text-center text-xs text-body">
            Anything you save here goes live on the real site within about a minute. There is no
            separate publish step.
          </p>
        ) : null}

        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>

        <footer className="mx-auto max-w-5xl px-5 pb-10 text-xs text-muted">
          {isHosted
            ? "Signed in with GitHub. Changes are committed as you, and the sites rebuild themselves."
            : "Runs on this computer only. Nothing is public until you publish."}
        </footer>
      </body>
    </html>
  );
}
