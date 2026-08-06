\# Group Sites Monorepo



Turborepo + pnpm. Three Next.js 15 (App Router) + TypeScript sites for an

operating holding company and its two subsidiaries, deployed to Vercel

subdomains.



\## Structure

\- apps/company-a  → parent / operating holding company. Runs its own services

&#x20; (partnerships, investing, corporate services, careers) AND links out to the

&#x20; subsidiaries via the "Our Companies" section.

\- apps/company-b  → subsidiary, b.companya.com

\- apps/company-c  → subsidiary, c.companya.com

\- packages/ui     → shared components (button, layout, nav, footer)

\- packages/config → shared tailwind / ts / eslint config



\## Rules

\- Work on ONE app at a time. Don't edit other apps unless explicitly asked.

\- Shared, reused-across-sites components live in packages/ui. App-specific

&#x20; components stay in the app.

\- Shared components must be prop-driven — never hardcode one company's text

&#x20; or links into packages/ui.

\- Each app owns its own branding (colors, fonts) via its tailwind config.

\- Subdomain links between sites use full absolute URLs, not relative paths.

\- Keep all copy/data in separate data/content files, not inline in JSX, so a

&#x20; CMS can be added later.

\- Match the provided design references for layout and styling. If none are

&#x20; provided, follow the UI guidance in the build prompt instead.



\## Commands

\- pnpm dev                      → run all apps

\- pnpm --filter company-a dev   → run one app

\- pnpm build                    → turbo build all

