#!/usr/bin/env bash
# Rebuild dist/ from src/. No devDependencies needed — pulled on demand via npx.
# The published package.json is intentionally a pure consumption manifest (no
# scripts), so consumers installing by git URL never trigger a build/prepare.
set -euo pipefail
cd "$(dirname "$0")"
npx --yes esbuild@0.27.4 src/index.ts --bundle --format=esm --platform=neutral \
  --external:react --outfile=dist/index.js
npx --yes typescript@5.9.3 tsc -p tsconfig.build.json
echo "Built dist/:"; ls dist
