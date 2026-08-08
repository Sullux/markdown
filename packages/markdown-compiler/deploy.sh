#!/usr/bin/env bash
set -e

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"

echo "Preparing release for ${TAG}..."

if git rev-parse "$TAG" >/dev/null 2>&1; then
  echo "Error: Git tag ${TAG} already exists." >&2
  exit 1
fi

echo "Step 1: Staging build artifacts..."
node build.js

echo "Step 2: Publishing to NPM..."
(cd .deploy && npm publish --registry=https://registry.npmjs.org/)

echo "Step 3: Tagging git commit..."
git tag "$TAG"

echo "Successfully published and tagged ${TAG}!"
