#!/usr/bin/env bash
# Rebuild dist/ from src/ and commit it. Two entry points:
#   .     — headless session store + API client (no React)
#   ./ui  — the shared auth screens (React provided by the consumer, --external)
# Consumers install the committed dist/ via the public tarball, so this never
# runs on their machines — only when cutting a release.
set -euo pipefail
cd "$(dirname "$0")"
[ -d node_modules ] || npm install --legacy-peer-deps --no-audit --no-fund
BIN=node_modules/.bin

# headless entry — no React
"$BIN/esbuild" src/index.ts --bundle --format=esm --platform=neutral \
  --external:react --outfile=dist/index.js

# ui entry — JSX (automatic runtime); React + its jsx-runtime stay external so
# the consumer's single React instance is used.
"$BIN/esbuild" src/ui/index.ts --bundle --format=esm --platform=neutral \
  --jsx=automatic --external:react --external:react/jsx-runtime --external:react-dom \
  --outfile=dist/ui.js

# type declarations for both entries (dist/index.d.ts, dist/ui/index.d.ts, …)
"$BIN/tsc" -p tsconfig.build.json

echo "Built dist/:"; ls dist
