import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GG Bearers admin",
  description: "Edit and publish the three GG Bearers sites.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-line bg-panel">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
            <Link href="/" className="text-sm font-semibold tracking-wide text-heading">
              GG BEARERS <span className="text-muted">admin</span>
            </Link>
            <Link href="/review" className="btn">
              Review and publish
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-5 pb-10 text-xs text-muted">
          Runs on this computer only. Nothing is public until you publish.
        </footer>
      </body>
    </html>
  );
}
