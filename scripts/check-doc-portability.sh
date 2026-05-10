#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

TARGETS=(
  "README.md"
  "web/README.md"
  "cms/README.md"
  "docs"
)

echo "[check-doc-portability] scanning for machine-specific absolute paths..."

if rg -n "/Users/[A-Za-z0-9._-]+/" "${TARGETS[@]}"; then
  echo "[check-doc-portability] FAIL: found machine-specific absolute path(s)."
  exit 1
fi

echo "[check-doc-portability] PASS"

