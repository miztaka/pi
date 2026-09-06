#!/usr/bin/env bash
# Rebuild the pkg/pi-ai orphan branch (distributable @miztaka/pi-ai) from the
# current backport-node20 working tree.
#
# Layout of pkg/pi-ai: package.json (scripts stripped) + dist/ + README.md +
# CHANGELOG.md + LICENSE (from repo root). Consumed by AISDA via
# github:miztaka/pi#<tag>.
#
# Usage: scripts/update-pkg-pi-ai.sh [--tag]
#   --tag  also (re)create the vX.Y.Z-node20 tag for the commit
#
# Run from the backport-node20 branch with a fresh build in packages/ai/dist.
set -euo pipefail

on_error() {
	echo "FAILED at line $1." >&2
	echo "If the worktree is stuck on pkg/pi-ai, recover with: git switch backport-node20" >&2
}
trap 'on_error $LINENO' ERR

TAG=false
[[ "${1:-}" == "--tag" ]] && TAG=true

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$BRANCH" != "backport-node20" ]]; then
	echo "ERROR: run from backport-node20 (currently on '$BRANCH')" >&2
	exit 1
fi

if [[ ! -f packages/ai/dist/compat.js || ! -f packages/ai/dist/providers/data/.manifest.json ]]; then
	echo "ERROR: packages/ai/dist is missing or stale — build first:" >&2
	echo "  (cd packages/telemetry && npm run build) && (cd packages/ai && npm run build:offline)" >&2
	exit 1
fi

# npm install churns the root lockfile via workspace renames; never commit it.
git checkout -- package-lock.json 2>/dev/null || true
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then
	echo "ERROR: tracked files are modified — commit or stash first:" >&2
	git status --porcelain --untracked-files=no
	exit 1
fi

VERSION="$(node -p "require('./packages/ai/package.json').version")"
TAG_NAME="v${VERSION%%-node20*}-node20"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -r packages/ai/dist "$TMP/dist"
cp packages/ai/package.json packages/ai/README.md packages/ai/CHANGELOG.md "$TMP/"
cp LICENSE "$TMP/LICENSE"

node -e "
const fs = require('fs');
const p = '$TMP/package.json';
const pkg = JSON.parse(fs.readFileSync(p, 'utf8'));
delete pkg.scripts; // no install-time scripts in the distributable
fs.writeFileSync(p, JSON.stringify(pkg, null, '\t') + '\n');
"

echo "Packaging @miztaka/pi-ai ${VERSION} as ${TAG_NAME}"

git branch -D pkg/pi-ai 2>/dev/null || true
git switch --orphan pkg/pi-ai

rm -rf dist package.json README.md CHANGELOG.md LICENSE
cp -r "$TMP"/* .
git add dist package.json README.md CHANGELOG.md LICENSE
git commit -q -m "pkg/pi-ai: distributable @miztaka/pi-ai ${VERSION} (Node 20 CJS-bundler-friendly build)"
SHA="$(git rev-parse --short HEAD)"

if $TAG; then
	git tag -f "$TAG_NAME"
	echo "Tagged $TAG_NAME -> $SHA"
fi

git switch backport-node20
if [[ -z "$(git ls-files dist)" ]]; then
	rm -rf dist # leftover packaging copy, untracked on this branch
fi

echo
echo "Done: pkg/pi-ai $SHA${TAG:+ (tag $TAG_NAME)}"
echo "Review, then push:"
echo "  git push --force-with-lease origin pkg/pi-ai${TAG:+ $TAG_NAME}"
echo "AISDA pin: \"@miztaka/pi-ai\": \"github:miztaka/pi#${TAG_NAME}\""
