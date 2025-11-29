#!/bin/bash
set -e

echo "Packaging SpotJump..."

# Clean previous builds
rm -rf firefox_dist SpotJump-Chrome.zip SpotJump-Firefox.zip

# Prepare Firefox distribution
mkdir -p firefox_dist
cp background.js content.js spotify_content.js styles.css options.html options.css firefox_dist/
cp -r icons firefox_dist/
cp manifest.firefox.json firefox_dist/manifest.json

# Zip Chrome (MV3)
echo "Creating Chrome zip..."
zip -q -r SpotJump-Chrome.zip . -x "*.git*" ".github/*" "node_modules/*" "*.DS_Store" "manifest.firefox.json" "firefox_dist/*" "bump_version.sh" "package.sh" "__MACOSX/*" ".*"

# Zip Firefox (MV2)
echo "Creating Firefox zip..."
cd firefox_dist
zip -q -r ../SpotJump-Firefox.zip . -x "*.DS_Store" "__MACOSX/*" ".*"
cd ..

echo "✅ Done!"
echo "Files created:"
echo "- SpotJump-Chrome.zip"
echo "- SpotJump-Firefox.zip"
