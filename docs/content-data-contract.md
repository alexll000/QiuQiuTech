# Content Data Contract

最后更新：2026-05-08 10:05 (UTC+8)

## 目标

统一内容、投稿、合作对接的数据字段与状态机，避免前后端和多 AI 实现口径不一致。

## 核心对象

1. `ContentItem`
2. `Submission`
3. `PartnershipRequest`
4. `MatchApplication`
5. `SavedItem`
6. `Notification`

## 通用字段约束

- `id`: string
- `title`: string（必填）
- `slug`: string（详情对象必填）
- `status`: enum（见各对象状态机）
- `tags`: string[]（动态来源，禁止写死）
- `created_at/updated_at`: datetime
- `created_by/updated_by`: string

## 状态机

### Submission

`draft -> pending_review -> approved/rejected -> published -> archived`

### PartnershipRequest

`draft -> pending_review -> approved/rejected -> published -> archived`

### MatchApplication

`pending -> reviewing -> connected -> closed_success/closed_failed`

## SEO 字段（内容详情/专题详情）

- `seo_title`
- `seo_description`
- `seo_keywords`
- `canonical_url`

若缺失则使用降级策略：

- `seo_title = title`
- `seo_description = excerpt`
- `seo_keywords = tags.join(",")`

