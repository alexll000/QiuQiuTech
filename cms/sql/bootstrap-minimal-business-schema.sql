-- QiuQiuTech minimal business schema bootstrap (local dev)
-- Purpose: unblock local integration when /collections API is forbidden.

BEGIN;

-- 1) Physical tables
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  submission_type VARCHAR(32) NOT NULL,
  submitter_user_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  external_link TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partnership_requests (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  request_type VARCHAR(64) NOT NULL,
  publisher_user_id VARCHAR(64),
  summary TEXT,
  city VARCHAR(128),
  budget_range VARCHAR(128),
  contact_policy VARCHAR(32),
  target_type VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS match_applications (
  id SERIAL PRIMARY KEY,
  request_id INTEGER NOT NULL,
  applicant_user_id VARCHAR(64) NOT NULL,
  message TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS saved_items (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  target_type VARCHAR(32) NOT NULL,
  target_id VARCHAR(128) NOT NULL,
  title VARCHAR(255),
  href VARCHAR(512),
  date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL DEFAULT '系统通知',
  body TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  date_created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL UNIQUE,
  display_name VARCHAR(128) NOT NULL,
  role_type VARCHAR(32) NOT NULL DEFAULT 'marketer',
  bio TEXT,
  city VARCHAR(128),
  company_name VARCHAR(255),
  verification_status VARCHAR(32) NOT NULL DEFAULT 'unverified',
  contact_policy VARCHAR(32) NOT NULL DEFAULT 'apply_only',
  phone VARCHAR(32),
  auth_source VARCHAR(32),
  date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT NOT NULL DEFAULT '',
  content_type VARCHAR(32) NOT NULL DEFAULT 'case',
  source_name VARCHAR(128),
  brand_name VARCHAR(128),
  published_at TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL DEFAULT 'published'
);

CREATE TABLE IF NOT EXISTS topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  intro TEXT,
  topic_type VARCHAR(32) DEFAULT 'industry',
  status VARCHAR(32) NOT NULL DEFAULT 'published',
  date_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_payload (
  id SERIAL PRIMARY KEY,
  hero_spotlight JSONB,
  selected_case_cards JSONB,
  realtime_trend_series JSONB,
  realtime_events_feed JSONB,
  request_cards JSONB,
  playbook_tags JSONB,
  trend_keywords JSONB,
  submission_showcase JSONB,
  value_highlights JSONB
);

-- 2) Register collections in Directus system table (idempotent)
INSERT INTO directus_collections (collection, icon, hidden, singleton, accountability, collapse)
VALUES
  ('submissions', 'article', false, false, 'all', 'open'),
  ('partnership_requests', 'handshake', false, false, 'all', 'open'),
  ('match_applications', 'diversity_3', false, false, 'all', 'open'),
  ('saved_items', 'bookmark', false, false, 'all', 'open'),
  ('notifications', 'notifications', false, false, 'all', 'open'),
  ('user_profiles', 'badge', false, false, 'all', 'open'),
  ('contents', 'feed', false, false, 'all', 'open'),
  ('topics', 'topic', false, false, 'all', 'open'),
  ('homepage_payload', 'home', false, true, 'all', 'open')
ON CONFLICT (collection) DO NOTHING;

-- 3) Ensure the current administrator policy has CRUD permissions for these collections
INSERT INTO directus_permissions (collection, action, permissions, validation, presets, fields, policy)
SELECT c.collection, a.action, '{}'::json, '{}'::json, '{}'::json, '*', admin_policy.id
FROM (
  SELECT id
  FROM directus_policies
  WHERE admin_access = true
  ORDER BY name
  LIMIT 1
) AS admin_policy
CROSS JOIN (
  VALUES
    ('submissions'),
    ('partnership_requests'),
    ('match_applications'),
    ('saved_items'),
    ('notifications'),
    ('user_profiles'),
    ('contents'),
    ('topics'),
    ('homepage_payload')
) AS c(collection)
CROSS JOIN (
  VALUES ('create'), ('read'), ('update'), ('delete')
) AS a(action)
ON CONFLICT DO NOTHING;

-- 4) Seed one published request for apply flow
INSERT INTO partnership_requests
  (title, slug, request_type, publisher_user_id, summary, city, budget_range, contact_policy, target_type, status, published_at)
VALUES
  (
    '消费品牌寻线下联名快闪共创团队',
    'brand-looking-for-popup-cocreation-team',
    'brand_to_marketer',
    'seed-user',
    '用于本地联调的合作需求种子数据',
    '上海',
    '10-20w',
    'apply_only',
    '营销活动执行',
    'published',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO contents
  (title, slug, summary, content_type, source_name, brand_name, published_at, status)
VALUES
  ('本周值得关注的品牌营销案例观察', 'weekly-marketing-cases-observation', '用于本地联调的内容种子数据', 'case', 'QiuQiuTech', 'QiuQiuTech', NOW(), 'published'),
  ('麦当劳爆改“牡丹楼”式的在地化话题案例', 'mcdonalds-peony-building-campaign', '用于本地联调的案例内容', 'trend', 'SocialBeta', '麦当劳', NOW(), 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO topics
  (title, slug, intro, topic_type, status)
VALUES
  ('节日营销专题', 'festival-marketing-topic', '聚合节点营销和节日传播案例', 'festival', 'published'),
  ('季度营销复盘专题', 'quarterly-recap-topic', '聚合季度策略复盘内容', 'quarterly', 'published')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO user_profiles
  (user_id, display_name, role_type, bio, city, company_name, verification_status, contact_policy, auth_source)
VALUES
  (
    'me',
    'QiuQiuTech Creator',
    'marketer',
    '关注品牌内容、节点营销、平台玩法与合作撮合的营销从业者。',
    '上海',
    'QiuQiuTech Studio',
    'verified',
    'apply_only',
    'seed'
  )
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
