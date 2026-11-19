#!/usr/bin/env bash
# Publishes the built lib (dist, not source) only when its version is not on npm yet,
# then tags it so changesets/action creates the GitHub Release.
set -euo pipefail

name=$(node -p "require('./projects/ngx-view-morph/package.json').name")
version=$(node -p "require('./projects/ngx-view-morph/package.json').version")

if npm view "$name@$version" version >/dev/null 2>&1; then
  echo "$name@$version already on npm, nothing to publish"
  exit 0
fi

bun run build
# ng-packagr can't read assets outside the lib root, so copy the license by hand
cp LICENSE README.md dist/ngx-view-morph/
npm publish dist/ngx-view-morph --access public --provenance
bunx changeset tag
