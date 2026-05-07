# Data Model

## 1. 核心集合

第一批建议在 Directus 中建立以下集合：

1. `contents`
2. `events`
3. `playbooks`
4. `submissions`
5. `topics`
6. `partnership_requests`
7. `match_applications`
8. `tags`
9. `industries`
10. `placements`
11. `sources`
12. `users`（扩展系统用户）
13. `user_profiles`
14. `saved_items`
15. `notifications`

## 2. `contents`

正式发布内容主表。

字段建议：

- `id`
- `title`
- `slug`
- `content_type`
- `summary`
- `cover_image`
- `body`
- `source_type`
- `source_name`
- `source_url`
- `brand_name`
- `industry`
- `status`
- `published_at`
- `is_featured`
- `featured_weight`
- `seo_title`
- `seo_description`

### `content_type`

- case
- trend
- brand_news
- report
- feature

## 3. `events`

营销事件表。

字段建议：

- `id`
- `title`
- `slug`
- `event_type`
- `summary`
- `cover_image`
- `body`
- `source_name`
- `source_url`
- `brand_name`
- `industry`
- `heat_score`
- `status`
- `published_at`

### `event_type`

- campaign
- collab
- seasonal
- launch
- popup
- social_hot

## 4. `playbooks`

营销玩法 / 方法论表。

字段建议：

- `id`
- `title`
- `slug`
- `playbook_type`
- `summary`
- `cover_image`
- `body`
- `industry`
- `applicable_scenarios`
- `status`
- `published_at`

### `playbook_type`

- strategy
- channel
- content_format
- topic_mechanism
- ip_collab
- growth_creative

## 5. `submissions`

用户投稿池。

字段建议：

- `id`
- `submission_type`
- `submitter_user_id`
- `title`
- `summary`
- `cover_image`
- `body`
- `external_link`
- `contact_name`
- `contact_info`
- `industry`
- `status`
- `review_note`
- `reviewed_by`
- `reviewed_at`
- `converted_content_id`

### `submission_type`

- case
- event
- playbook

### `status`

- draft
- pending_review
- under_review
- approved
- rejected
- published
- archived

## 6. `topics`

专题策展表。

字段建议：

- `id`
- `title`
- `slug`
- `topic_type`
- `intro`
- `cover_image`
- `status`
- `featured_weight`
- `seo_title`
- `seo_description`

### `topic_type`

- festival
- quarterly
- annual
- industry
- brand

## 7. `partnership_requests`

合作需求表。

字段建议：

- `id`
- `title`
- `slug`
- `request_type`
- `publisher_user_id`
- `publisher_role`
- `target_role`
- `industry`
- `city`
- `budget_range`
- `timeline`
- `description`
- `contact_policy`
- `status`
- `published_at`
- `expires_at`
- `is_verified`

### `request_type`

- brand_to_marketer
- brand_to_brand
- marketer_to_partner
- agency_collab
- platform_match

### `contact_policy`

- public
- apply_only
- platform_match

### `status`

- draft
- pending_review
- approved
- rejected
- published
- closed
- archived

## 8. `match_applications`

合作申请表。

字段建议：

- `id`
- `request_id`
- `applicant_user_id`
- `message`
- `status`
- `review_note`
- `created_at`

### `status`

- pending
- accepted
- rejected
- connected
- closed

## 9. `tags`

字段建议：

- `id`
- `name`
- `slug`
- `tag_type`
- `heat_score`

### `tag_type`

- general
- industry
- event
- playbook
- topic

## 10. `user_profiles`

用户资料扩展表。

字段建议：

- `id`
- `user_id`
- `display_name`
- `avatar`
- `role_type`
- `bio`
- `city`
- `company_name`
- `contact_policy`
- `verification_status`

### `role_type`

- brand
- marketer
- agency
- independent

### `verification_status`

- unverified
- pending
- verified
- rejected

## 11. `saved_items`

用户收藏表。

字段建议：

- `id`
- `user_id`
- `target_type`
- `target_id`
- `created_at`

### `target_type`

- content
- topic
- request

## 12. `notifications`

用户通知表。

字段建议：

- `id`
- `user_id`
- `notification_type`
- `title`
- `body`
- `is_read`
- `related_target_type`
- `related_target_id`
- `created_at`

## 10. `industries`

字段建议：

- `id`
- `name`
- `slug`
- `sort_order`

建议预置：

- 食品饮料
- 美妆个护
- 汽车
- 科技数码
- 生活方式
- 时尚零售
- 文旅
- 金融
- 医疗健康
- 泛娱乐

## 11. `placements`

首页和专题推荐核心配置表。

字段建议：

- `id`
- `placement_key`
- `placement_name`
- `target_type`
- `target_id`
- `start_at`
- `end_at`
- `sort_order`
- `status`

### `placement_key`

- home_hero
- home_focus
- home_featured_cases
- home_requests
- home_submissions
- home_topics
- rankings_monthly
- topic_featured

## 12. `sources`

抓取来源表。

字段建议：

- `id`
- `name`
- `source_type`
- `base_url`
- `rss_url`
- `status`
- `last_crawled_at`
- `notes`

### `source_type`

- rss
- webpage
- manual_url
- api

## 13. 关系建议

- `contents` ↔ `tags`：多对多
- `contents` ↔ `topics`：多对多
- `events` ↔ `topics`：多对多
- `playbooks` ↔ `topics`：多对多
- `submissions` → `users`：多对一
- `submissions` → `contents`：多对一
- `partnership_requests` → `users`：多对一
- `match_applications` → `partnership_requests`：多对一
- `match_applications` → `users`：多对一

## 14. 当前建议

建模时先追求：

- 清晰
- 稳定
- 可审核
- 可扩展

不要一开始把所有复杂需求都塞进一张表里。
