# Directus Collections Matrix

这份表是为了把 QiuQiuTech 当前前台、审核流和合作对接系统，明确映射到 Directus collections。

## 1. `contents`

- 作用：营销内容主表
- 对应前台：
  - `/contents`
  - `/contents/[slug]`
  - 首页精选内容、事件联动、专题联动
- 核心字段：
  - `title`
  - `slug`
  - `summary`
  - `body`
  - `content_type`
  - `source_name`
  - `source_url`
  - `brand_name`
  - `industry`
  - `tags`
  - `cover_image`
  - `seo_title`
  - `seo_description`
  - `published_at`
  - `status`

## 2. `topics`

- 作用：专题策展主表
- 对应前台：
  - `/topics`
  - `/topics/[slug]`
- 核心字段：
  - `title`
  - `slug`
  - `intro`
  - `topic_type`
  - `cover_image`
  - `status`

## 3. `partnership_requests`

- 作用：品牌 / 市场人合作对接主表
- 对应前台：
  - `/requests`
  - `/requests/[slug]`
- 核心字段：
  - `title`
  - `slug`
  - `request_type`
  - `summary`
  - `description`
  - `target_type`
  - `industry`
  - `city`
  - `budget_range`
  - `cycle`
  - `contact_policy`
  - `published_at`
  - `status`

## 4. `submissions`

- 作用：用户投稿池
- 对应后台：
  - 投稿审核
  - 驳回建议
  - 发布入内容系统
- 核心字段：
  - `submission_type`
  - `title`
  - `cover_image`
  - `body`
  - `tags`
  - `external_link`
  - `contact_name`
  - `contact_info`
  - `status`
  - `review_note`

## 5. `homepage_payload`

- 作用：首页聚合配置
- 对应前台：
  - `/`
- 当前建议：
  - 先用一个 singleton collection 承担首页模块配置
  - 后续如果模块复杂到必须拆分，再拆成 `placements` + `homepage_sections`

## 6. `placements`

- 作用：推荐位与运营位
- 主要用途：
  - 首页 banner
  - 首页精选位
  - 专题联动位
  - 投稿联动曝光位

## 7. `review_tasks`

- 作用：审核任务记录
- 主要用途：
  - 内容审核
  - 投稿审核
  - 合作卡审核
  - 审核日志追踪

## 8. `tags`

- 作用：标签表
- 用于统一：
  - 内容标签
  - 事件标签
  - 玩法标签
  - 专题标签
  - 合作需求标签

## 9. `industries`

- 作用：行业表
- 用途：
  - 内容行业
  - 合作行业
  - 首页筛选与专题聚合

## 10. 当前前端接口落点

当前前台服务层已经预留这些请求落点：

- [web/src/lib/cms-client.ts](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/src/lib/cms-client.ts)
  - `/items/homepage_payload`
  - `/items/contents?filter[status][_eq]=published&sort=-published_at`
  - `/items/contents?filter[slug][_eq]={slug}&limit=1`
  - `/items/topics?filter[status][_eq]=published`
  - `/items/topics?filter[slug][_eq]={slug}&limit=1`
  - `/items/partnership_requests?filter[status][_eq]=published`
  - `/items/partnership_requests?filter[slug][_eq]={slug}&limit=1`

这意味着下一阶段最省力的方式不是重写前台，而是先把 Directus collection 名、`slug` 字段、`status` 字段和返回结构尽量对齐当前服务层。

## 11. 账户体系补充

当前前台已经明确存在：

- `/auth`
- `/me`

因此 Directus 侧除了系统用户，还需要补这些能力：

### `user_profiles`

- 作用：前台用户资料扩展表
- 对应前台：
  - `/me`
  - 投稿人展示信息
  - 合作发布者展示信息
- 核心字段：
  - `user`
  - `display_name`
  - `avatar`
  - `role_type`
  - `bio`
  - `city`
  - `company_name`
  - `contact_policy`
  - `verification_status`

### `saved_items`

- 作用：用户收藏
- 对应前台：
  - `/me`
- 核心字段：
  - `user`
  - `target_type`
  - `target_id`
  - `created_at`

### `notifications`

- 作用：通知中心
- 对应前台：
  - `/me`
- 核心字段：
  - `user`
  - `notification_type`
  - `title`
  - `body`
  - `is_read`
  - `related_target_type`
  - `related_target_id`
  - `created_at`
