#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT_DIR"

: "${DIRECTUS_ADMIN_EMAIL:?DIRECTUS_ADMIN_EMAIL is required}"
: "${DIRECTUS_ADMIN_PASSWORD:?DIRECTUS_ADMIN_PASSWORD is required}"

LIST_PATH="${1:-scripts/crawl/sources.sample.txt}"
OUT_DIR="${2:-tmp/crawl-cron}"
SUBMITTER_USER_ID="${3:-crawler-bot}"
DELAY_MS="${4:-1200}"
FAIL_LOG="${5:-tmp/crawl-failures.json}"

node scripts/sync/crawl-and-import.mjs \
  --list="$LIST_PATH" \
  --outDir="$OUT_DIR" \
  --submitterUserId="$SUBMITTER_USER_ID" \
  --delayMs="$DELAY_MS" \
  --failLog="$FAIL_LOG"

# 如配置了 QQT_CRAWL_ALERT_WEBHOOK，则在有失败日志时触发告警。
node scripts/sync/notify-failures.mjs --failLog="$FAIL_LOG"
