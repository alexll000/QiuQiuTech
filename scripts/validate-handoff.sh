#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "[validate-handoff] 1/3 check doc portability"
scripts/check-doc-portability.sh

echo "[validate-handoff] 2/3 web lint"
npm --prefix web run lint

echo "[validate-handoff] 3/3 web build"
npm --prefix web run build

echo "[validate-handoff] PASS"

