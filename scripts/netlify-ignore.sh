#!/usr/bin/env bash
#
# Netlify "ignore builds" hook, shared by all three sites.
#
# Every push to main reaches all three Netlify sites, and each production
# deploy costs credits. This cancels the build when nothing the site
# depends on has changed.
#
# EXIT CODES (Netlify's convention):
#   0 = cancel this build, nothing relevant changed
#   1 = go ahead and build
#
# `git diff --quiet` uses exactly the same convention (0 = no differences,
# 1 = differences), so its exit code is passed straight through.
#
# WHY NOT turbo-ignore: it is deprecated in favour of `turbo query
# affected`, and it shells out to npx, which failed outright when tested.
# On failure it defaults to building, so it silently stopped saving
# anything. A plain git diff has no dependencies, is deterministic, and
# can be tested locally.
#
# The trade-off is that the shared paths below are listed by hand rather
# than derived from the dependency graph. Keep SHARED in step with
# anything every app depends on.
#
# Fail-safe: any uncertainty exits 1 and builds. A wrongly skipped deploy
# looks identical to a successful one in the dashboard, which makes it a
# genuinely nasty failure to notice.

set -uo pipefail

case "${SITE_NAME:-}" in
  gg-bearers) workspace="company-a" ;;
  gg-food)    workspace="company-b" ;;
  gg-autos)   workspace="company-c" ;;
  *)
    echo "netlify-ignore: unrecognised SITE_NAME '${SITE_NAME:-<unset>}'."
    echo "netlify-ignore: building rather than guessing."
    exit 1
    ;;
esac

# Anything every app depends on: the shared UI and config packages, the
# lockfile, the workspace and turbo config, the Node pin, and this hook.
SHARED="packages pnpm-lock.yaml pnpm-workspace.yaml package.json turbo.json .nvmrc netlify.toml scripts"

previous="${CACHED_COMMIT_REF:-}"
current="${COMMIT_REF:-HEAD}"

if [ -z "${previous}" ]; then
  echo "netlify-ignore: no CACHED_COMMIT_REF (first build, or cache cleared)."
  echo "netlify-ignore: building."
  exit 1
fi

# Netlify clones shallowly, so the previous commit may be absent. Just
# build if so. An earlier version ran `git fetch` to deepen the clone here
# and hung for minutes when the network stalled; a build hook that hangs is
# worse than a build that was not strictly necessary, so there is
# deliberately no network access in this script.
if ! git cat-file -e "${previous}^{commit}" 2>/dev/null; then
  echo "netlify-ignore: ${previous} is not in this shallow clone, building."
  exit 1
fi

echo "netlify-ignore: site '${SITE_NAME}' -> workspace '${workspace}'"
echo "netlify-ignore: comparing ${previous}..${current}"

# shellcheck disable=SC2086
if git diff --quiet "${previous}" "${current}" -- "apps/${workspace}" ${SHARED}; then
  echo "netlify-ignore: nothing affecting ${workspace} changed, cancelling build."
  exit 0
fi

echo "netlify-ignore: changes affecting ${workspace}:"
# shellcheck disable=SC2086
git diff --name-only "${previous}" "${current}" -- "apps/${workspace}" ${SHARED} | sed 's/^/  /'
echo "netlify-ignore: building."
exit 1
