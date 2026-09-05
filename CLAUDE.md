# GG BEARERS group sites

**Read this file first in every session. It is the source of truth for this
project.** The Claude memory entry for this project is only a pointer to this
file plus the off-repo account details.

---

## MAINTENANCE RULE (do this every time)

After **any** change, addition or new development in this repo, update this
file **in the same turn as the change**, before reporting done:

1. Update the affected block under **Current state, site by site**.
2. Add one entry at the top of **Changelog**, newest first.
3. If a new trap cost you time, add it to **Gotchas and lessons**.
4. If the owner supplied something that was previously missing, remove it from
   **Still needed from the owner**.

Keep the Changelog to roughly the newest 25 entries. Fold anything older into
the state sections and delete the line. This file must stay readable in one
pass, not grow into an archive.

---

## What this is

An operating holding company in Lagos and its two subsidiaries, as three
separate Next.js sites in one Turborepo monorepo. All three are **publicly
live**, so placeholder content is visible to real customers.

| App | Company | Netlify site | Live domain | Dev port |
| --- | --- | --- | --- | --- |
| `apps/company-a` | GG BEARERS (parent) | `gg-bearers` | ggbearers.com | 3000 |
| `apps/company-b` | GG FOODS (restaurant) | `gg-food` (singular, `gg-foods` was taken) | foods.ggbearers.com | 3001 |
| `apps/company-c` | GG AUTOS (vehicles) | `gg-autos` | autos.ggbearers.com | 3002 |
| `apps/admin` | The editing tool, not a site | none, never deployed | local only | 4000 |

GG BEARERS is an *operating* holding company. It runs its own services
(import/export, wholesale, retail, partnerships, investment, corporate
services) **and** routes to the two subsidiaries. It is not a passive parent.

## Stack

- Turborepo + pnpm 9, Node 22 (`.nvmrc`). Windows dev machine, D: drive.
- Next **16.2** (App Router) / React 19.2 / TypeScript 5.9. The original brief
  said Next 15; installed and building on 16.
- Tailwind **v4**, CSS-first config. Tokens live in each app's
  `app/globals.css` `@theme` block. There is no `tailwind.config`.
- `zod` for form validation, `lucide-react` for icons. `resend` is a dependency
  of company-a and company-b; **company-c calls the Resend REST API with plain
  `fetch` instead**, so it carries no such dependency.

### Commands

```
pnpm install
pnpm admin                         # the editing tool, http://127.0.0.1:4000
pnpm --filter company-a dev        # or company-b / company-c
pnpm --filter company-a build
pnpm --filter company-a lint
pnpm --filter company-a check-types
pnpm build                         # turbo, all three
```

All three dev servers can run at once (3000 / 3001 / 3002). Do **not** run
`build` for an app while its dev server is running: the build wipes `.next` and
the dev server then serves broken chunks.

### Shared packages

- `packages/ui` holds `container`, `cta-button`, `reveal`, `spotlight`,
  `site-nav`, `site-footer`, `cn`, plus the scaffold's `button` / `card` /
  `code`. The exports map is `"./*": "./src/*.tsx"`, so **every file must be
  `.tsx`**, including `cn.tsx`.
- A consuming app needs `@source "../../../packages/ui/src";` in its
  `globals.css` and `transpilePackages: ["@repo/ui"]` in `next.config.js`.
- Shared components are **token-driven and prop-driven**. They read
  `paper` / `surface` / `elevated` / `line` / `line-strong` / `heading` / `fg` /
  `muted` / `action-*` and never hardcode one company's text, links or colours.
- `SiteNav` takes `variant?: "island" | "bar"` and `shape?: "pill" | "square"`;
  `CtaButton` takes `shape`. Defaults keep company-a and company-b rendering
  unchanged.
- `packages/eslint-config` and `packages/typescript-config` are shared config.

---

## Working rules

- **All copy and data live in `apps/<app>/content/data/*.json`**, never inline
  in JSX. Each `content/<name>.ts` is now a thin loader: it imports the JSON,
  declares the TypeScript types the site is written against, and computes
  anything derived. This is not negotiable, it is what lets the owner edit the
  sites through `pnpm admin`.
- **Derived values never go in the JSON.** A `tel:` link is built from the
  phone number, the GG FOODS wa.me and Maps links from the number and address,
  GG BEARERS' company cards from `site.subsidiaries`, the homepage service
  cards from `services`, GG AUTOS' Group footer column from `group`, and its
  `catalogueStats` counted from the vehicle list. Store the source, compute the
  rest, or editing one value silently fails to update the other.
- **The type vocabulary stays in TypeScript.** `Brand`, `BodyType`, `Status`,
  the label maps and `inquiryTypes` values are what the site is typed against
  and what other code matches on, so they are not editable data.
- **No em dashes or en dashes anywhere in site copy.** The owner reads them as
  AI-generated. Plain punctuation only, commas and full stops.
- **Never invent facts.** No fake people, no fake testimonials, no guessed
  specifications, no invented statistics. Unknown values are omitted, bracketed
  as `[ADD YOUR ...]`, or rendered as "to be confirmed" / "On enquiry". The
  owner has enforced this repeatedly.
- Cross-site links always use **full absolute URLs**, never relative paths.
- Each app owns its visual identity through its own `globals.css` tokens. The
  three style systems are deliberately different and must stay distinct.
- `content/vehicles.ts` (company-c) and `content/menu.ts` (company-b) carry
  plain-English edit guides in a header comment, written for the owner rather
  than a developer. Keep those current when the shape of the data changes.
- Commit identity is set **repo-locally** to `GG Bearers <ggbearers@gmail.com>`.
  Do not change the machine's global git config.
- **Shipping is semi-automatic.** Do the work, update this file, then ask the
  owner a single yes or no question: commit and push? Do not ship without
  asking, and do not write a long pitch either. One question, then act on the
  answer. Work goes straight to `main`, which is how every commit here has been
  made and what the Netlify pipeline expects.

---

## Deployment and infrastructure

- **GitHub:** `https://bear987@github.com/bear987/mainbear.git` (private,
  branch `main`). The remote is deliberately scoped with the `bear987@`
  username so Git Credential Manager keys the credential per user and a
  different account's saved login is not disturbed. `gh` CLI is not installed
  on this machine.
- **Netlify**, three sites from the one repo. Per-site settings, which live in
  the dashboard and not in a toml:
  - Base directory: **blank** (must stay blank, so `pnpm install` runs at the
    workspace root and `@repo/ui` resolves)
  - Package directory: `apps/company-{a,b,c}`
  - Build command: `pnpm --filter company-{a,b,c} build`
  - Publish directory: `apps/company-{a,b,c}/.next`
- **Build skipping:** root `netlify.toml` sets
  `ignore = "bash scripts/netlify-ignore.sh"`. One script serves all three
  sites by switching on Netlify's `SITE_NAME`. A root `netlify.toml` cannot
  vary per site, and per-app tomls are never read when the base is blank, so
  this is the only mechanism available. Shared paths that must rebuild
  everything are listed by hand in the script (`packages`, `pnpm-lock.yaml`,
  `pnpm-workspace.yaml`, `package.json`, `turbo.json`, `.nvmrc`,
  `netlify.toml`, `scripts`), so **keep that list current**. Every uncertain
  case exits 1 and builds. The script makes no network calls, on purpose.
- **DNS: Cloudflare** (nameservers `anastasia.ns.cloudflare.com` and
  `sid.ns.cloudflare.com`, registrar Namecheap). Four CNAMEs, all **grey cloud
  / DNS-only**: apex and `www` to `gg-bearers.netlify.app`, `foods` to
  `gg-food.netlify.app`, `autos` to `gg-autos.netlify.app`. **Keep the proxy
  off**, an orange cloud blocks Netlify's Let's Encrypt issuance. The five
  Namecheap `eforward*` MX records and the root `v=spf1` TXT are preserved so
  email forwarding keeps working.
- **Email: Resend**, scoped to the subdomain `send.ggbearers.com` so its SPF
  does not collide with the root forwarding SPF. From addresses `site@`,
  `foods@` and `autos@ggbearers.com`, all delivering to `ggbearers@gmail.com`.
- **Environment variables**, set per Netlify site: `RESEND_API_KEY`,
  `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, and optionally `NEXT_PUBLIC_GA_ID`
  (company-c). If `NEXT_PUBLIC_GA_ID` is ever set, add it to root `turbo.json`
  `env` too or turbo may serve a stale cached build.
- Contact endpoints return `delivered: boolean`, not a bare `{ok:true}`. That
  flag is what makes a live site distinguishable from a misconfigured one.
  Keep it.

---

## Business facts

Shared across all three sites until each subsidiary has its own.

- Motto (parent): "Integrity is our first priority"
- Legal name: GG Bearers Company Limited
- Address: 13 Femi Killa Street, opp. Market Square, Ago Palace, Okota, Lagos,
  Nigeria
- Phones: 09018495507 (primary), 08062891562 (also the WhatsApp line,
  `2348062891562`)
- Email: ggbearers@gmail.com
- Parent hours: Monday to Friday, 9:00am to 6:00pm WAT
- GG FOODS motto: "Taste with a touch of excellence". Hours Monday to Sunday,
  10:00 to 22:00.
- GG AUTOS trading hours are **assumed** (Mon-Fri 8-18, Sat 9-16, Sun closed)
  and flagged as such in its `content/site.ts`.

---

## The admin app

`pnpm admin` starts it on `http://127.0.0.1:4000`. It is a fourth app in the
monorepo, is never deployed, and no Netlify site maps to it.

- **Pick a site, pick a section, edit, save.** Saving writes the JSON to disk
  only. Nothing is public until Publish.
- **Editors are inferred, not hand-written.** `lib/fields.ts` chooses a control
  from the shape of the value: long strings get a box, numbers a number input,
  booleans a checkbox, lists of objects a collapsible add-and-remove list.
  Overrides live in that one file: `READ_ONLY` for fields that set a web
  address or must match code (`id`, `value`, `tag`), `ALWAYS_LONG` for prose,
  and `FIELD_NOTES` for the fields where a wrong value shows on the site.
  Adding a field to a content file needs no admin change at all.
- **Two guards run before anything is written** (`lib/validate.ts`). The file
  currently on disk is the template: values may change and list items may be
  added or removed, but a field cannot disappear or change type, because the
  loaders cast the JSON to hand-written types. And no string may contain an em
  or en dash. A save that fails returns the exact paths, and writes nothing.
  **Optional fields are handled by merging every existing list item and
  requiring only the keys that appear in all of them** — comparing against the
  first item alone reported every dish without tags as broken.
- **Publish** stages only `apps/company-*/content/data/*.json` and
  `apps/company-*/public/*`, so unrelated work in the repo is never swept in.
  It shows which Netlify sites will actually rebuild, using the same rules as
  `scripts/netlify-ignore.sh` (`lib/git.ts`, `sitesThatWouldRebuild`) — keep
  that list in step with the shell script.
- **Pictures and video** live on each site's media page. `lib/media.ts` is the
  registry: fixed slots for page headers, heroes and backdrops, plus slots
  **derived from the content itself** — one per dish from `menu.json`, and per
  vehicle from `vehicles.json` including its `imageCount` and an optional
  walkaround video. Adding a vehicle in the editor immediately creates
  somewhere to put its photographs. 106 slots across the three sites.
  - Uploads are **re-encoded through system ffmpeg**, which is already on PATH
    (`winget install Gyan.FFmpeg` if it ever is not). Deliberately **no npm
    dependency**, because anything added to the admin lands in the lockfile,
    which is a shared path, and would rebuild all three sites.
  - Images scale down to the slot's `maxWidth` (never up) and are written as
    clean JPEG. Video becomes H.264 at the slot's height, CRF 26, `faststart`,
    and **audio is dropped**, since every video on these sites plays muted as a
    background layer. A 4032×3024 photo came down 84%, a 1080p clip 95%.
  - Every write goes to a temporary file first and is moved into place only on
    success, so a failed encode can never leave a half-written file where the
    site expects a picture.
  - A slot the site has no fallback for cannot be deleted, only replaced.
  - **The logo is the one special case.** `site.logoFile` in company-a's
    content names the file, the slot preserves a PNG rather than flattening its
    transparency, and uploading one rewrites `logoFile` to match. Do not go
    back to trying `.png` then `.jpg` in the component: `nav.tsx` is a client
    component so it cannot check the filesystem, and a guess 404s on every page
    load for whichever file is absent.
- **Colours and design** edits each site's `globals.css` tokens. The file is
  never regenerated: `lib/theme.ts` finds a block by selector, locates each
  `--name: value;` declaration, and replaces **only the value's byte range**,
  so comments, ordering and anything the admin does not understand survive. A
  page-colour change came out as exactly two changed lines.
  - Editable blocks are `@theme` plus each site's light-mode block. Values that
    would break the stylesheet are refused before any write: `;`, `{`, `}`, a
    comment, a token that is not in that block, a block that is not editable,
    or a radius without a unit.
  - **Typefaces are read-only**, because they are loaded by `next/font` in
    `layout.tsx`. A CSS edit alone cannot add a family, so the field says so
    rather than pretending.
  - **Mirror blocks are kept in step.** `.force-dark` (company-a) and `.on-ink`
    (company-c) hold a second copy of the dark tokens so those regions stay
    dark on a light page. Editing `@theme` also updates a mirror **only when it
    currently holds the identical value**, so a deliberate difference is never
    overwritten.
  - **Contrast is checked, never corrected.** `lib/contrast-pairs.ts` scores
    the combinations these sites actually use, compositing translucent
    surfaces over the page colour first. The accent row reports the most
    readable of the accent shades, because the dark sites put a light accent on
    near-black while GG Autos puts a dark one on concrete, so a fixed shade
    would warn about a pairing that never appears. Button text is checked as
    white only, since the filled buttons hardcode white. The maths is validated
    against known values, including the 5.4:1 that company-c's own stylesheet
    claims for `action-600` on concrete.
  - **Three pre-existing warnings stand, deliberately unfixed** (changing brand
    colour is the owner's call): white on GG Foods' flame `action-500` is
    3.66:1 in both themes, and GG Autos' `muted` on concrete is 4.30:1.
- **Page layout** controls the order of the home page's sections and whether
  each appears. Each app's `app/page.tsx` now holds its sections in a
  `Record<string, ReactNode>` and renders
  `sectionsFor("home").map(...)`; the order and the on/off flags live in
  `content/data/layout.json`, read through the app's own `lib/layout.ts`.
  - The admin only ever sends an **order and enabled flags**. Labels, notes and
    which sections exist come from the file on disk, so it cannot invent a
    section the page has no code for, drop one, or list one twice, and a
    section marked `required` (every hero, which carries the H1) cannot be
    switched off. All five refusals are tested.
  - **company-a's `companiesClosing` is deliberately one entry**, not two. The
    port photograph dissolves into the sea photograph across both bands through
    a single `PhotoDuo`, so separating or reordering them apart would put a
    hard seam in the middle. Keep coupled regions as one entry.
  - **15 pages are wired up**: every page on all three sites that has more than
    one orderable section. GG Bearers home, about, services, companies, careers
    and contact; GG Foods home, about and order; GG Autos home, inventory,
    services, wholesale, about and contact.
  - **Two pages are deliberately not wired**, and should stay that way. GG
    Foods' menu builds its categories from a `{categories.map(...)}` expression
    rather than fixed blocks, so there is nothing stable to reorder; its visit
    page returns a single section. Both were refused by the transformer rather
    than forced.
  - **Structured data and analytics are never sections.** A `<script>` block,
    `<JsonLd>` or `<Analytics>` renders outside the layout, because switching a
    page's schema off would quietly cost search results with nothing visible to
    show for it.
  - Section ids on the converted pages are positional (`header`, `section2`,
    ...). The **label** in `layout.json` is what the owner reads, so keep those
    written in their words; the ids are internal and changing one breaks the
    link to the page's code.
- **Preview** starts a site's dev server on demand and links to it.
- Everything editable is enumerated in `lib/sites.ts`. Nothing outside that
  registry can be read or written, which is what blocks a path-traversal
  request; `dataPath()` throws for anything else.

All four phases are built, and layout control now covers every page that has
sections worth ordering. What remains is whatever the owner asks for next.

## Current state, site by site

### company-a, GG BEARERS (parent)

- **Style: "Obsidian".** OLED base `--color-paper` #050508, glass surfaces
  (`--color-surface` is a translucent white), luminous action blue, film grain
  via `body::after` (plain opacity, **never** a blend mode), `AmbientBackdrop`
  radial orbs. Display font **Sora**, body font local **Geist**
  (`app/fonts/GeistVF.woff`). Skills ban Inter, do not reintroduce it.
- **Light mode** via `:root[data-theme="light"]` token overrides; default is
  dark. Cinematic islands (hero, the `PhotoDuo` wrapper, `PageHeader` with a
  backdrop, `Section tone="ink"`) carry `.force-dark`, which re-declares the
  dark vars locally. `ThemeToggle` sits in the nav pill, and a no-flash boot
  script runs first in `<body>`.
- Nav is a floating glass island **pill**, not an edge-to-edge bar, with a CSS
  two-bar hamburger morph and a staggered mobile overlay reveal.
- **Hero:** `home-port.jpg` carries the frame, graded into the palette with a
  brightness and saturation knock-back plus a flat navy tint (no blend mode, to
  keep scrolling cheap). The wireframe `GlobeBackdrop` and shipping-lane arcs
  are a lighter supporting layer. One directional scrim, opaque behind the
  headline on the left and clear over the picture on the right, plus a short
  bottom fade into the next section.
- Under the headline sits the formal **company statement**, typeset as a third
  tier: Sora, legal name at weight 500 on `text-heading`, the rest at weight
  400 on `text-ink-100`, then the lede at `text-ink-200`. Three-step luminance
  ladder, and the two paragraphs use different measures (46ch vs 52ch) so they
  rag differently. Mobile spacing is tight on purpose to keep the CTA above the
  fold at 375px.
- `GlobeBackdrop` is canvas with no dependencies: continent coastline
  polylines, glowing hubs (Lagos drawn larger), route arcs, additive glow. Its
  performance guards are load-bearing. It pauses off-screen via
  IntersectionObserver and on a hidden tab, gates to about 45fps, caps dpr at
  2, and pre-renders the hub glow to an offscreen sprite. **Never place a globe
  in a `space="tight"` section**, the clipped fragment looks broken.
- **Images are deliberately restrained** ("when necessary, not random"): page
  headers, the about story band, and the home companies plus closing bands,
  which share ONE `PhotoDuo` wrapper spanning both sections with the second
  photo masked in mid-way, so a seam is geometrically impossible. Never blend
  two photo sections through a separate strip.
- All backdrop photos are **self-hosted** in `public/images/`. Zero remote
  images, and CSP `img-src` is `'self' data:`.
- Stats bar: every figure animates with a staggered mask reveal, text stats
  included.
- Pages: home, about, services, services/[slug], companies, careers, contact,
  contact/thank-you, 404, sitemap, robots, opengraph-image. 17 routes.
- Content: `content/{site,home,about,services,companies,roles,contact}.ts`.
  Partnerships name JD Mercentile and Antways Japan.
- Logo: `public/brand/logo.jpg` (a JPG on black, no transparency) wired through
  `components/logo.tsx` with a monogram fallback on error, and used as the
  favicon via `layout.tsx` `metadata.icons`.
- **Known debt:** 12 lint warnings, unescaped apostrophes across
  `services/[slug]`, `services` and `roles-list`, plus one unused `Icon` import
  in `services/page.tsx`. Netlify does not run lint, so nothing is blocked.

### company-b, GG FOODS (restaurant)

- **Style: "Ember Room"** dark (charcoal #1a1714, flame mapped to
  `--color-action-*` with #d9622b at 500, cream text, olive and wine tag
  tokens) plus **"Cream Room"** light (`html[data-theme="light"]`, paper
  #f7efe0, espresso text; `action-200/300` are deliberately darkened because
  they are used only as text and icon accents). Default is dark. Fonts are
  **Fraunces** display and **Karla** body.
- The signature detail is `DrawnUnderline`, a `pathLength=1` draw-in triggered
  by `[data-reveal].is-visible`, plus 3% grain.
- **Atmosphere:** `EmberBackdrop` is pure CSS and compositor-only (breathing
  hearth glow, rising ember dots, steam wisps, wine corner radial). No blend
  modes, no canvas. Global reduced-motion kills all of it.
- **Backdrop media:** `components/backdrop-fx.ts` holds the shared mask, grade,
  cast and dim so photo and video match. The mask **intersects** a vertical
  linear gradient, which dissolves the top and bottom into the page charcoal so
  stacked sections have no hard horizontal cut, with a gentle radial for the
  sides, using `mask-composite: intersect` and
  `-webkit-mask-composite: source-in`. Grade and dim are CSS vars
  (`--backdrop-grade`, `--backdrop-dim`) so they flip with the theme and text
  stays legible in both.
- All 6 backdrop stills are AI-generated to the Ember Room palette
  (`public/images/backdrops/{about,kitchen,interior,order,order-hero,menu-header}.jpg`)
  plus `public/images/menu/hero.jpg`. There are **5 videos**
  (`public/videos/{hero,about,kitchen,order,interior}.mp4`), each a
  locked-camera image-to-video from its own still, played by `hero-video.tsx`
  and `video-backdrop.tsx`: a poster base layer carries LCP and the fallback,
  with a `<video autoplay muted loop playsInline>` layered on top, gated on
  `prefers-reduced-motion`. `menu-header.jpg` and `order-hero.jpg` stay static.
- The menu is one file, `content/menu.ts`, with a loud placeholder header: 7
  Nigerian dishes, 7 intercontinental, 5 sides and drinks, naira prices, spicy
  and vegetarian tags, and a `signature` flag driving the home strip. Dish
  images are `/images/menu/<slug>.jpg` through a client `MenuImage` with a
  designed ember fallback.
- Pages: home, menu, about, visit, order, 404, sitemap, robots,
  opengraph-image. 10 routes. Restaurant JSON-LD in the layout
  (`servesCuisine`, `openingHoursSpecification`, `parentOrganization`).
- The contact form has ONE `contact` field that may hold a phone **or** an
  email, so `replyTo` is set only when the value parses as an address. A phone
  number in a reply-to header would be malformed.

### company-c, GG AUTOS (vehicles)

- **Style: "Industrial Brutalist"**, the "plant floor" direction. Concrete
  `--color-paper` #e9e7e1, ink #111110 (never pure black or white), and one
  hazard accent, **signal red** #d6231c, chosen to stay distinct from GG FOODS'
  flame. Zero radius, `--shadow-card: none`, `--shadow-lift: 4px 4px 0 0
  #111110` (a hard stamped offset, no blur), no glow. Snap easing
  `cubic-bezier(0.9,0,0.1,1)` plus a `steps(6,end)` stepped reveal. Fonts are
  the scaffold's self-hosted **Geist Sans and Geist Mono**.
- `--color-action-200/300` are deliberately remapped **dark** (#7d0f0b and
  #a3140f) because the shared `CtaButton` ghost variant uses them as text on
  concrete. Red text is `action-600` #b51a14 (5.4:1), fills use 500.
- `.on-ink` blocks re-declare the tokens so shared components invert with no
  overrides, the same idea as company-a's `.force-dark`. Spotlight is
  deliberately unused here, glow is banned by the style.
- **The business:** mini buses and mini trucks, coupling, attachment **and
  joining** (all three words appear, including in page metadata and the
  `Service` schema `alternateName`), retail, wholesale, plus importation and
  clearing, which GG Autos handles for its own yard and for the wider group.
- **Catalogue** (`content/vehicles.ts`) is a **model catalogue, not a stock
  list**: a spec selector on the left, an auto-advancing image carousel on the
  right. 12 available models plus 2 coming-soon placeholders.
  - Kei-class range with full specifications: `suzuki-mini-bus`,
    `suzuki-mini-truck`, `hijet-mini-bus`, `hijet-mini-truck`,
    `daihatsu-mini-bus`, `daihatsu-mini-truck`.
  - Also supplied, specifications deliberately blank and shown as "to be
    confirmed": `toyota-hiace`, `hummer-bus` (full-size bus body type),
    `nissan-vanette`, `mazda-bongo-bus`, `toyota-dyna-truck`,
    `mazda-bongo-truck`.
  - Coming soon: `enclosed-box-body-truck`, `long-wheelbase-mini-bus`. No
    price, no invented specs, a hazard-hatch "not on the yard yet" notice, and
    a single "tell me when it lands" WhatsApp CTA. They are excluded from
    featured, related and wholesale lists but keep a detail page, with schema
    availability `PreOrder`.
  - **`Hijet` is its own marque here.** Do not "correct" it into a Daihatsu
    model. That is how the Lagos market asks for it, and the owner named it.
  - **Every mini bus is a 7 seater.** A full-size bus has its own seat count.
    Mini trucks use `payloadKg` and `bedLength` instead of `seats`.
  - **Prices are removed site-wide by the owner's decision.** The price field
    is deleted from the model, not nulled. Every surface reads "On enquiry",
    and the Offer schema keeps currency and availability only. Do not add a
    price field back.
- The Specification section covers belt and chain engines, manual and automatic
  gear selections, three and four plug systems, and four and five speeds on the
  mini trucks.
- Pages: home (plant-floor hero, poster-first video, mono data rail with a
  ticking `Counter`, `Ticker` marquee, trust section, `ManifestTable`, retail
  and wholesale split, FAQ), inventory (client `VehicleBrowser`),
  inventory/[slug] (SSG, gallery, spec ledger, sticky enquiry panel, Vehicle
  and Offer JSON-LD), services, wholesale (terms ledger with visibly bracketed
  unconfirmed values), about (mission, what we do, roles not invented people),
  contact, contact/thank-you, api/contact, 404, error.tsx, sitemap, robots,
  opengraph-image. 25 routes.
- **Asset convention**, the owner's "upload and refresh, it reflects":
  detection is **client-side** (`onError` to a designed fallback, and
  `VideoSlot` `probe` does a HEAD fetch), never a build-time filesystem check,
  so dropping a file into `/public` and refreshing publishes it with no
  rebuild. Paths: `/images/inventory/<slug>.jpg` plus `-1.jpg`, `-2.jpg` for
  the carousel (`imageCount` says how many to look for),
  `/images/hero-poster.jpg` and `/video/hero.mp4`,
  `/images/assembly-poster.jpg` and `/video/assembly.mp4`, and an optional
  `/video/inventory/<slug>.mp4`.
- **There are no vehicle photographs yet.** All 12 models show the designed
  "Photographs pending" panel. The 7 old AI photos were full-size vans, the
  wrong class for kei vehicles, and are parked in
  `public/images/_archive-full-size-vans/` rather than deleted.
  `hero-poster.jpg` and `assembly-poster.jpg` are still valid and in use.
- Below-fold video never autoplays (poster plus a play control). The hero video
  is gated on reduced-motion **and** `navigator.connection.saveData` / 2g.
- Lint fixes for `turbo/no-undeclared-env-vars` and `no-undef` on `next.config`
  live in `apps/company-c/eslint.config.js`, not in root `turbo.json`, per the
  owner's "don't touch root tooling".

---

## Gotchas and lessons

Each of these cost real time. Read before debugging something similar.

**CSS and layout**

- **Tailwind v4 layer trap.** Custom classes like `.stamp`, `.grid-rules`,
  `.on-ink` and `.hazard-hatch` must live in `@layer components`, not
  `@layer utilities`. A `.stamp { color: ... }` in the utilities layer emits
  after Tailwind's own utilities and silently beats every `text-*` class.
- **Content behind an absolute backdrop needs `relative z-[1]`.** A `Reveal`
  transform creates a temporary stacking context; when the transition ends and
  `transform` returns to `none`, the content drops behind the absolute photo
  layers and text visibly disappears. This applies to any absolute backdrop
  pattern.
- **Never put `mix-blend-mode` on a fixed full-viewport layer.** The grain
  overlay did, which forced a whole-page re-composite on every scroll frame and
  produced scroll freezes. Use plain opacity.
- Scope `will-change` narrowly, for example `[data-reveal]:not(.is-visible)`.
- Light-mode token trick: redefining a var closer to the element beats
  specificity fights, which is why `.force-dark` and `.on-ink` work.

**React and Next**

- **Never fetch-probe for asset existence.** A HEAD-probing carousel never
  resolved, because React's double-invoked dev effects plus cleanup aborted
  every request, so the skeleton showed forever. The `<Image onError>` pattern
  is the one that works here.
- **`useSearchParams()` inside `<Suspense>` left a statically prerendered page
  completely unhydrated.** The DOM looked correct, there were zero
  `__reactFiber$` keys, and every click was dead. Read deep-link params from
  `window.location.search` in a mount effect instead. Watch for this on any
  prerendered page in this repo.
- **Do not trust HMR after multi-step edits to one file.** A stale chunk served
  a broken intermediate edit long after the file on disk was correct. Restart
  the dev server.
- CSP adds `'unsafe-eval'` to `script-src` **only** when
  `NODE_ENV !== "production"`, because React and Turbopack need eval in dev.
  Verified that it does not leak into production.

**Changing the content layer safely**

- **Prove a refactor by diffing rendered HTML, not by reading the code.** The
  content migration was verified by capturing every route from the local dev
  servers before and after and diffing. First prove the harness itself is
  deterministic by capturing twice with no change: the run that caught this
  needed `self.__next_r` and Turbopack chunk names normalised before two
  identical captures matched. A noisy harness proves nothing.
- **Extract data by importing the module, never by retyping it.** Node 24
  strips TypeScript types natively, so copying `content/*.ts` to a temp folder,
  rewriting the `@/content/...` alias to a relative path with an explicit
  extension, and importing it dumps the exact values the site renders. Use
  `pathToFileURL` for the import specifier on Windows.
- `pnpm build` at the root fails on this machine with exit code 3221225781, a
  Windows DLL error inside the turbo binary. Build each app instead:
  `pnpm --filter company-a build`. Netlify is unaffected, it filters per site.

**Environment and tooling on this machine**

- **PowerShell mangles multi-line `git commit -m` strings** that contain quotes
  or arrows: git receives the fragments as pathspecs and the commit silently
  does not happen. Use the Bash tool with `git commit -F -` and a heredoc, or
  write the message to a file.
- **The Bash tool itself breaks on quoted heredocs containing apostrophes**
  (the command is passed through `bash -c`, so an apostrophe in the body ends
  the quoting). Write long prose files with the Write tool instead.
- **The preview MCP cannot serve this D: drive app by name**, its cwd must be
  relative within the session root on C:. What **does** work is
  `preview_start {url: "http://localhost:3002"}`, which attaches to a dev
  server you started manually. Screenshots fail when the pane is not displayed,
  but `javascript_tool`, `read_console_messages` and `read_network_requests`
  all work.
  - In that attached pane `document.hidden` is `true`, so anything gated on
    visibility looks broken. Override it with
    `Object.defineProperty(document, 'hidden', {value: false})` and dispatch
    `visibilitychange`.
  - Lazy and non-priority images never load there.
  - `.stamp` and `uppercase` classes mean `innerText` comes back uppercased, so
    **match page text case-insensitively**, or use `textContent`.
- `curl` to the live domains fails TLS on this machine because local antivirus
  intercepts it (the certificate reads "Avast Web/Mail Shield Root"). Use
  `curl -k`. This is a local artefact, not a site problem.
- **Stopping a background dev server does not always kill it.** Stopping the
  task kills the `pnpm` wrapper and leaves the Next child listening, which then
  blocks the next start with `EADDRINUSE`. Find the holder with
  `Get-NetTCPConnection -LocalPort <port> -State Listen`, check its
  `CommandLine` contains `group-sites`, and only then stop that PID. Never kill
  node broadly.
- **`buildId` is not in the served HTML**, so polling for it to detect a fresh
  deploy silently never fires. Read the Netlify dashboard for the published
  commit instead, it is the authoritative signal.
- **The Chrome extension is connected on this machine**, so the Netlify,
  Cloudflare and GitHub dashboards can be read directly through the
  `claude-in-chrome` tools using the owner's logged-in session. That is how
  deploy outcomes get verified. There is no Netlify CLI and no API token here,
  so the dashboard is the only route. `get_page_text` returns "Loading" on the
  first call because the deploy list hydrates late, just call it again. Deploy
  log lines are not in `get_page_text` output at all, read them with
  `read_page` scoped to the log region's `ref_id`.
- Pasted chat images are **not** written to disk and cannot be recovered from
  Downloads or Temp. The owner must save the file and give a path.
- The sandbox blocks `Remove-Item` on paths under `D:\GG`. Write temporary
  files to the session scratchpad instead.
- There is no `ffmpeg` or ImageMagick here. PNG to JPG conversion goes through
  PowerShell `System.Drawing`.

**Deployment**

- **A build cancelled by the ignore hook is labelled "Failed" in the Netlify
  dashboard, not "Skipped".** The deploy list shows a red `Failed`, and the
  detail page says "Your deploy failed due to an error" with Initializing
  marked Failed. That is normal and expected: Netlify's own line reads
  `Failed during stage 'checking build content for changes': Canceled build due
  to no content change`. To tell a real failure from a successful skip, open
  the deploy log and look for `netlify-ignore: nothing affecting <workspace>
  changed, cancelling build.` followed by `User-specified ignore command
  returned exit code 0. Returning early from build.` Also check that the
  **Published** deploy at the top of the list is still the previous commit,
  which means nothing was replaced. Netlify's own built-in no-content-change
  skip, seen on `d114080` before this hook existed, is the only thing that ever
  shows the friendlier `Skipped` label.
- **Netlify bakes environment variables in at deploy time.** A deploy created
  before a variable was saved never sees it, so always redeploy after adding
  vars.
- A `delivered: false` on every form was once caused by the Key and Value
  fields being swapped in the Netlify UI, with the `re_...` key pasted into the
  KEY box.
- **401 on every route including `robots.txt`**, with `Server: Netlify` and an
  empty body, is Netlify visitor-access password protection, not a build
  failure. Site configuration, Access and security, Visitor access.
- **Domain diagnosis:** a 404 that persists with `curl -k` means the host is
  not attached to the site in Netlify. A 200 with `-k` but a TLS error without
  it means the host is attached and the certificate is still provisioning, so
  give it a few minutes.
- `turbo-ignore` was tested and **rejected**: it is deprecated in favour of
  `turbo query affected`, and it failed with `spawn npx ENOENT` and defaulted
  to "proceed with deployment", meaning it would have saved nothing while
  looking like it worked.
- An early version of `netlify-ignore.sh` ran `git fetch` to deepen the shallow
  clone and hung for five minutes. The script makes no network calls now.

---

## Still needed from the owner

Nothing here can be invented. Each item is a real gap that placeholder content
is currently covering on a live site.

**All sites:** real photography, a transparent PNG logo (company-a currently
uses a JPG on black, company-c falls back to a text wordmark), a GA4
measurement ID, real team names and roles, real statistics and testimonials.
Photography and the logo can now be uploaded through the admin's media page,
so these no longer need a developer.

**GG FOODS:** the real menu and prices, its own address, phone and opening
hours (it currently reuses the parent's), and a real maps link for the visit
page.

**GG AUTOS:** vehicle photographs for all 12 models, specifications for the six
non-kei makes (Toyota, Mazda, Nissan, Hummer), warranty and after-sales terms,
payment terms, lead time and delivery coverage (all bracketed on /wholesale),
and real trading hours to replace the assumed ones.

**Parked:** animating the two remaining static GG FOODS backdrops
(`menu-header`, `order-hero`), and regenerating any video whose motion warps.
Both need an image-generation credit top-up.

**Declined so far:** an `/admin` CMS. The original brief forbade it; local
admin, Decap and Sanity were offered on 2026-08-01 and the owner did not pick
one, so it was not built.

---

## Changelog

Newest first, one entry per change. Keep to roughly 25 entries.

- **2026-09-05** — **Layout control extended from 3 pages to 15**, every page
  across the three sites with more than one orderable section. The pages were
  converted by a script that moves their own blocks and **refuses anything it
  cannot parse with certainty** rather than guessing: it correctly declined GG
  Foods' menu, whose categories come from a `map()` expression, and its visit
  page, which is a single section. Verified by comparing the rendered DOM of
  **all 45 routes before and after: identical**, then proved to detect a change
  by hiding and reordering a section on the GG Bearers about page, which
  removed exactly that section and left every other route untouched. Labels
  were written by hand: the auto-derived ones were developer comments and HTML
  entities, which is not what the owner should be reading. Two bugs caught on
  the way, both by the type check: the header slice re-emitted the function's
  opening line, and company-c's relative import needed one more level.

- **2026-09-04** — **Admin platform, Phase 4: page layout.** The three home
  pages now render from `content/data/layout.json`, so sections can be reordered
  or switched off in the admin. The pages were rebuilt **programmatically from
  their own original blocks** rather than retyped, then verified by comparing
  the rendered DOM with `<script>` payloads stripped: **identical on all three**
  (43,205 / 40,544 / 43,997 characters of markup). Comparing the raw HTML is not
  enough here, because React's module numbering inside the hydration payload
  shifts when the component tree order changes without any visible difference.
  The comparison was then proved to *detect* a change: disabling and reordering
  a section produced a real diff and removed that content. Every guard refuses
  what it should. company-a's companies and closing bands are one entry, since
  one photograph dissolves across both.
- **2026-09-04** — **Admin platform, Phase 3: colours and design.** A design
  page per site editing the `globals.css` tokens in place, with live swatches,
  a colour picker on plain hex values, and a readability check per theme.
  Verified: a page-colour change rewrote exactly two lines, the `.force-dark`
  mirror included and the deliberately different light-mode value untouched,
  with the comment on the line preserved; the edited values reached the
  compiled production stylesheet. Every guard refused what it should. The
  contrast maths was validated against four known values. Three genuine
  pre-existing warnings were surfaced and left for the owner to decide on.
  Typefaces are shown read-only, because `next/font` loads them in code.
- **2026-09-04** — **Admin platform, Phase 2: pictures and video.** A media
  page per site, 106 slots, the per-dish and per-vehicle ones derived from the
  content so they appear as soon as an item is added. Drag and drop or browse;
  everything is re-encoded through system ffmpeg on the way in, with no npm
  dependency added, so the lockfile is untouched and no site rebuilds because
  of the admin. Verified with real files: a 4032×3024 photo saved at 1600 wide
  and 84% smaller, a 1080p clip with audio saved at 720p, 95% smaller, silent,
  and faststart confirmed by byte offset. Guards tested: a path the site does
  not use, a path escaping the public folder, traversal on the file-serving
  route, deleting a picture with no fallback, and a non-media file, all
  refused; a failed upload leaves the existing picture byte-identical and no
  temporary file behind. Company-a's logo now comes from `site.logoFile`, and
  uploading a transparent PNG keeps its alpha and updates that value, which
  also removes the guessed-extension 404 the first attempt would have caused.
- **2026-09-04** — **Admin platform, Phase 1.** The editable content of all
  three sites moved from TypeScript to `content/data/*.json`, with each
  `content/*.ts` becoming a typed loader that keeps every derived value
  computed. Verified by capturing all 45 routes before and after from the local
  dev servers: **zero diff**, and all three production builds green with lint
  unchanged. Added `apps/admin`, a local-only editing tool on port 4000: site
  picker, inferred editors for every content file, shape and dash validation
  before any write, an on-demand preview, and a review screen that shows the
  diff in plain language and which Netlify sites a publish would rebuild before
  committing and pushing. Verified end to end in a browser: the page hydrates,
  an edit through the UI reaches disk, saving an unedited file produces a
  byte-identical file, and path traversal is refused. Phases 2 to 4 (media,
  design tokens, section reordering) are not built yet.
  **Shipped as `64374fe` and verified in production:** this was the first push
  in a while to genuinely rebuild all three sites, because the lockfile is a
  shared path. All three published, and all 42 routes were compared against the
  newly deployed sites on visible text and metadata, plus `robots.txt`
  byte-for-byte: identical. Every site returns 200, real 404s, CSP and HSTS
  intact, no `unsafe-eval`. All three contact endpoints accept a honeypot
  payload with 200 and reject an invalid one with 400. **GG Autos requires
  `phone` and its honeypot field is `website`**, unlike the other two, so a
  payload shaped for A or B returns 400 there and that is correct.
- **2026-09-04** (`6deaaf1`, plus this follow-up) — Replaced the original
  scaffold `CLAUDE.md` with this living project file, and reduced the Claude
  memory entry to a pointer to it. The old file still described a Next 15 /
  Vercel / `b.companya.com` project that no longer exists. No app code touched.
  Pushed, and the ignore hook was verified in the Netlify dashboards: all three
  sites cancelled the build and all three still publish `1dbfa4c`. Added the
  gotchas that came out of that check, the misleading "Failed" label on a
  cancelled build and how to read the dashboards from here.
- **2026-08-26** (`1dbfa4c`) — Netlify build skipping: root `netlify.toml` plus
  one `SITE_NAME`-aware `scripts/netlify-ignore.sh`, so a push only rebuilds
  the sites it affects.
- **2026-08-26** (`aedf3e4`) — Copy and catalogue updates.
  **GG BEARERS:** every stat animates with a staggered mask reveal, not just
  the numeric ones; "Two businesses" became "Our businesses" so the section
  survives the group growing; partnerships name JD Mercentile and Antways
  Japan; "what we do" leads with the vehicles imported.
  **GG AUTOS:** "joining" added everywhere coupling and attachment appear,
  including metadata and the Service schema; new Products and services section;
  new Mission and What we do on About; importation and clearing added as a
  fourth service; **prices removed site-wide**, the field deleted from the
  model, everything reading "On enquiry"; six makes added (Toyota Hiace,
  Hummer, Nissan Vanette, Mazda Bongo bus and truck, Dyna truck) with
  specifications left blank rather than invented; full-size bus became its own
  body type; every mini bus is a 7 seater; new Specification section.
- **2026-08-26** (`f56bbc1`) — Company statement added to the GG BEARERS hero
  as a third typographic tier, `legalName` updated to GG Bearers Company
  Limited (which flows into the footer copyright and the Organization schema),
  and mobile spacing tightened to keep the CTA above the fold at 375px.
- **2026-08-09** (`d114080`) — GG BEARERS hero given a photograph and a single
  directional scrim, replacing two stacked vignettes over generated art that
  read as generic.
- **2026-08-09** (`0436ea5`) — Contact endpoints report `delivered: boolean`
  instead of a bare `{ok:true}`, which is what made the Resend
  misconfiguration diagnosable.
- **2026-08-08** — All three domains fully live under strict TLS with their own
  certificates, all six cross-site links verified in both directions, and
  contact forms delivering in production on all three.
- **2026-08-07** (`3d3eb92`) — Subsidiaries moved from `b.` and `c.` to
  `foods.` and `autos.`. All six references lived in the per-app
  `content/site.ts`, so no JSX changed. DNS moved to Cloudflare.
- **2026-08-06** (`dcf2e60`) — GG FOODS contact form actually delivers by
  email. It had been validating, logging and returning success while silently
  dropping every enquiry.
- **2026-08-06** (`7a48418`) — Initial commit, 231 files, first deploys to
  Netlify.
