# Brand assets

Save the GG BEARERS crest here as **`logo.png`** (this exact path):

    apps/company-a/public/brand/logo.png

Once it's here it appears automatically in:

- the header nav lockup and the footer (via `components/logo.tsx`)
- the browser tab favicon + Apple touch icon (via `app/layout.tsx` → `metadata.icons`)

Until the file exists, the site shows a monogram fallback — nothing breaks.

Recommended: a square PNG with a transparent background, ~256×256 or larger.
For the crest-on-black version, a transparent cutout looks best on the dark UI.
