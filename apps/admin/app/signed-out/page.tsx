export const dynamic = "force-dynamic";

export default async function SignedOut({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <div className="mx-auto max-w-md pt-10 text-center">
      <h1 className="text-xl font-semibold text-heading">Not signed in</h1>
      <p className="mt-2 text-sm text-body">
        {reason ?? "Sign in with the GitHub account that owns these sites."}
      </p>

      {/* A real page load, not a client-side navigation: this route redirects
          out to GitHub, which next/link cannot follow. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/api/auth/signin" className="btn btn-primary mt-6 inline-flex">
        Sign in with GitHub
      </a>

      <p className="mt-8 text-xs text-muted">
        Only the accounts allowed to edit these sites can get in. If you think that should include
        you, ask the owner to add your GitHub username.
      </p>
    </div>
  );
}
