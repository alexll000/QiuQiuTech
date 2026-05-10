# Directus Initialization Checklist

这份文档是给 QiuQiuTech 下一阶段正式接 Directus 时直接照着做的，不需要再重新梳理后台范围。

## 1. 本地启动

进入 [cms/README.md](cms/README.md) 对应目录：

```bash
cd cms
cp .env.example .env
docker compose up -d
```

预期地址：

- `http://localhost:8055` -> Directus 后台
- `http://localhost:5432` -> PostgreSQL

如需快速进入联调状态，可先执行最小集合脚本：

```bash
cd "$QIQIUTECH_ROOT"
docker exec -i qiqiutech-postgres psql -U directus -d qiqiutech < cms/sql/bootstrap-minimal-business-schema.sql
node cms/scripts/init-local-foundation.mjs
```

其中 `init-local-foundation.mjs` 会顺序执行：

- `apply-branding-and-language.mjs`
- `seed-roles-and-policies.mjs`

执行后可统一完成以下基线：

- 后台品牌资源
- 项目描述
- 默认语言与管理员语言
- `Member` / `Verified Member` / `Operator` 三类基础角色
- 第一阶段 role-policy access 关联

完成后建议立刻执行：

```bash
node cms/scripts/verify-local-foundation.mjs
```

若返回 `success=true` 且 `failedCount=0`，说明当前机器至少已完成第一阶段后台基础基线。

## 2. 先建立的核心 Collections

第一阶段不要贪多，先把能支撑首页、内容、投稿和合作对接的集合起好：

1. `contents`
2. `topics`
3. `partnership_requests`
4. `submissions`
5. `homepage_payload`
6. `placements`
7. `tags`
8. `industries`
9. `review_tasks`
10. `user_profiles`
11. `saved_items`
12. `notifications`
13. `match_applications`

详细字段参照：

- [data-model.md](docs/data-model.md)
- [directus-collections-matrix.md](docs/directus-collections-matrix.md)

## 3. 首页优先策略

QiuQiuTech 首页模块多，如果直接让前台拼很多 Directus 请求，后面会很乱。

所以第一阶段直接把首页当作一个聚合配置对象处理：

- `homepage_payload`
  - `heroSpotlight`
  - `selectedCaseCards`
  - `realtimeTrendSeries`
  - `realtimeEventsFeed`
  - `latestEvents`
  - `topicCards`
  - `requestCards`
  - `playbookTags`
  - `trendKeywords`
  - `submissionShowcase`
  - `valueHighlights`

这和当前 [web/src/app/page.tsx](web/src/app/page.tsx) 的消费结构保持一致。

## 4. 推荐的角色

本地第一阶段已经脚本化沉淀的角色为：

1. `Administrator`（Directus 默认管理员）
2. `Member`
3. `Verified Member`
4. `Operator`

后续可继续补：

5. `Visitor/Public`

权限说明看：

- [roles-permissions.md](docs/roles-permissions.md)

## 5. 第一批内容录入顺序

建议不要一上来就录全量真实内容，先把站点最关键的公开面跑顺：

1. 首页 `homepage_payload`
2. 8-12 条 `contents`
3. 4-6 条 `topics`
4. 4-6 条 `partnership_requests`
5. 2-3 条 `submissions`
6. 1 条 `user_profiles`
7. 2-3 条 `notifications`
8. 2-3 条 `match_applications`

这样前台已经能从 mock 切到第一版真实 CMS 数据。

## 6. 与前端对接时的环境变量

在 [web/.env.example](web/.env.example) 基础上增加：

```bash
NEXT_PUBLIC_USE_DIRECTUS=true
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
```

## 7. 接通时先验证的页面

先验证这几个页面，不要一次性全切：

1. `/`
2. `/contents`
3. `/contents/[slug]`
4. `/topics`
5. `/requests`
6. `/me`
7. `/submit`

## 8. 接通成功的判定标准

满足这些才算不是“表面接通”：

1. 首页能从 Directus 读取 `homepage_payload`
2. 内容列表和详情能读真实 `contents`
3. 专题页能读真实 `topics`
4. 合作页能读真实 `partnership_requests`
5. 用户中心能读真实账户工作台数据
6. 投稿中心和合作申请流程至少能读真实 schema 或 singleton 配置
7. CMS 挂掉时前台仍能安全回退 mock

## 9. 第二批优先打通的动作接口

在第一批读取链路稳定后，建议优先打通：

1. 收藏 / 取消收藏
2. 通知已读
3. 保存投稿草稿
4. 提交合作申请

当前前端本地契约已存在：

- `/api/me/saved-items/toggle`
- `/api/me/notifications/read`
- `/api/submissions/drafts`
- `/api/requests/[slug]/apply`
