#!/bin/bash
# Directus Permission Fix Script
# Fixes 403 errors caused by Directus v11 in-memory permission cache issues

echo "🔄 Restarting Directus container..."
docker restart qiqiutech-directus

echo "⏳ Waiting for Directus to be ready..."
for i in {1..30}; do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:8055/server/health | grep -q "200"; then
    echo "✅ Directus is ready!"
    break
  fi
  sleep 1
done

echo ""
echo "🔐 Getting fresh JWT token..."
JWT=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@qiuqiutech.com","password":"ChangeThisAdminPassword123!"}' \
  "http://localhost:8055/auth/login" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['access_token'])")

echo ""
echo "🧪 Testing all collections..."
for col in submissions partnership_requests topics contents homepage_payload user_profiles; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $JWT" \
    "http://localhost:8055/items/$col?limit=1")
  if [ "$STATUS" = "200" ]; then
    echo "  ✅ $col: 200"
  else
    echo "  ❌ $col: $STATUS"
  fi
done

echo ""
echo "Done! If all show ✅, permission cache is synced."
