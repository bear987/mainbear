# Putting the admin online at admin.ggbearers.com

Three jobs, in this order. The order matters: the site must not exist and be
reachable before its sign-in settings are in place.

Nothing here is dangerous, and none of it changes the three live sites.

---

## 1. Tell GitHub about the admin

This is what lets you sign in with your own GitHub account instead of a
password.

1. Go to **https://github.com/settings/developers**, open **OAuth Apps**, and
   press **New OAuth App**.
2. Fill it in:
   - **Application name:** `GG Bearers admin`
   - **Homepage URL:** `https://admin.ggbearers.com`
   - **Authorization callback URL:**
     `https://admin.ggbearers.com/api/auth/callback`
     (this has to match exactly, including the `https` and no trailing slash)
3. Press **Register application**.
4. Copy the **Client ID**.
5. Press **Generate a new client secret** and copy that too. GitHub shows the
   secret **once**, so paste it somewhere before leaving the page.

You will paste both into Netlify in step 2. Do not put either of them in a
message, an email, or a file in the repository.

---

## 2. Create the Netlify site, with its settings, before it is reachable

1. In Netlify, **Add new site → Import an existing project**, choose the
   `bear987/mainbear` repository.
2. Set it up exactly like the other three, except the package directory:
   - **Site name:** `gg-admin`
   - **Base directory:** *leave blank*
   - **Package directory:** `apps/admin`
   - **Build command:** `pnpm --filter admin build`
   - **Publish directory:** `apps/admin/.next`
3. **Before the first deploy finishes**, go to **Site configuration →
   Environment variables** and add these five:

   | Variable | Value |
   | --- | --- |
   | `ADMIN_MODE` | `hosted` |
   | `GITHUB_CLIENT_ID` | the Client ID from step 1 |
   | `GITHUB_CLIENT_SECRET` | the client secret from step 1 |
   | `SESSION_SECRET` | a long random string, at least 32 characters |
   | `ALLOWED_GITHUB_USERS` | `bear987` |

   For `SESSION_SECRET`, any long jumble of letters and numbers will do, as
   long as nobody else has it. It is what stops someone forging a sign-in.

   `ALLOWED_GITHUB_USERS` is the list of GitHub usernames allowed in, separated
   by commas. Anyone else is refused by name, even with a valid GitHub account.

4. **Redeploy.** Netlify bakes environment variables in at deploy time, so a
   deploy made before you saved them will not see them. This has caught us
   before.

**If you get the order wrong, nothing bad happens.** An admin without its
settings refuses to serve anything at all, rather than letting anyone in.
Visit `https://admin.ggbearers.com/api/health` and it will tell you exactly
which settings are missing.

---

## 3. Point the address at it

In **Cloudflare**, add one DNS record:

- **Type:** CNAME
- **Name:** `admin`
- **Target:** `gg-admin.netlify.app`
- **Proxy status:** **DNS only, the grey cloud**

The grey cloud matters. An orange cloud stops Netlify issuing the certificate,
which is the same trap the other three subdomains have.

Then in Netlify, under **Domain management**, add `admin.ggbearers.com` to the
`gg-admin` site. The certificate takes a few minutes.

---

## Checking it worked

1. `https://admin.ggbearers.com/api/health` should say
   `{"mode":"hosted","ok":true,"problems":[]}`.
2. Opening `https://admin.ggbearers.com` should send you to GitHub to sign in.
3. After signing in you should land on the site picker, with your GitHub
   username and a **Sign out** button in the corner.
4. Signing in with any other GitHub account should be refused by name.

---

## What is different from the admin on your computer

**Saving publishes.** There is no separate publish step and no review screen.
The moment you save, the change is committed and the site rebuilds, live in
about a minute. The banner across the top says so.

**Pictures work, video does not.** Photographs are shrunk in your browser
before they are sent, so a phone photo is fine. Video needs re-encoding that
cannot run on a server like this, and the files are far too large to send
anyway, so video is still added from the admin on your computer.

**No local preview.** There is no dev server in the cloud. Save, then look at
the real site.

**Removing a picture** is still a job for the computer admin.

Everything else, all the text on all fifteen pages, the layout of each page,
and the colours, works the same from anywhere.

---

## If you ever want to lock it down again

Remove your username from `ALLOWED_GITHUB_USERS` and redeploy, and nobody can
get in. To close it entirely, delete the `gg-admin` site in Netlify. Neither
affects the three live sites, and the admin on your computer keeps working
either way.
