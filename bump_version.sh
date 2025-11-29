#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "Error: Please provide a version number."
  echo "Usage: $0 <version>"
  echo "Example: $0 1.0.1"
  exit 1
fi

VERSION="$1"

# Optional: prevent releasing from a dirty tree (except untracked files)
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Error: Working tree is not clean. Commit or stash your changes first."
  exit 1
fi

# Choose portable sed -i syntax (macOS vs Linux)
if sed --version >/dev/null 2>&1; then
  # GNU sed (Linux / many CI)
  SED_INPLACE=('sed' '-i')
else
  # BSD sed (macOS)
  SED_INPLACE=('sed' '-i' '')
fi

# Update manifest.json (Chrome)
"${SED_INPLACE[@]}" \
  "s/\"version\"[[:space:]]*:[[:space:]]*\"[^\"]*\"/\"version\": \"$VERSION\"/" \
  manifest.json

# Update manifest.firefox.json (Firefox)
"${SED_INPLACE[@]}" \
  "s/\"version\"[[:space:]]*:[[:space:]]*\"[^\"]*\"/\"version\": \"$VERSION\"/" \
  manifest.firefox.json

echo "Updated manifests to version $VERSION"

git add manifest.json manifest.firefox.json
git commit -m "chore: release v$VERSION"
git tag "v$VERSION"

echo "Created commit and tag v$VERSION"
echo "Pushing to GitHub..."

git push
git push --tags

echo "Done! Release v$VERSION triggered."
