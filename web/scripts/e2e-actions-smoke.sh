#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:3000}"

echo "[e2e] base_url=${BASE_URL}"

post() {
  local name="$1"
  local path="$2"
  local body="$3"

  echo ""
  echo "== ${name} =="
  curl -sS -X POST "${BASE_URL}${path}" \
    -H "Content-Type: application/json" \
    -d "${body}" | jq '{ok,message,source,reason,draftId,applicationId}'
}

post "submission_draft" "/api/submissions/drafts" \
'{"submissionType":"case","title":"E2E 脚本投稿草稿","summary":"脚本联调","tags":["E2E","Smoke"],"sourceUrl":"https://example.com"}'

post "request_draft" "/api/requests/drafts" \
'{"title":"E2E 脚本合作需求","requestType":"brand_to_marketer","summary":"脚本联调合作需求","city":"上海","budgetRange":"10-20w","contactPolicy":"apply_only"}'

post "request_apply" "/api/requests/brand-looking-for-popup-cocreation-team/apply" \
'{"intro":"脚本联调申请合作","portfolioUrl":"https://example.com/portfolio","contactPreference":"apply_only"}'

post "saved_toggle" "/api/me/saved-items/toggle" \
'{"targetType":"content","targetId":"weekly-marketing-cases-observation","title":"本周案例观察","href":"/contents/weekly-marketing-cases-observation"}'

post "notifications_read" "/api/me/notifications/read" '{}'

echo ""
echo "[e2e] done"
