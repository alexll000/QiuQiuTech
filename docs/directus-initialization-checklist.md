# Directus Initialization Checklist

这份文档是给 QiuQiuTech 下一阶段正式接 Directus 时直接照着做的，不需要再重新梳理后台范围。

## 1. 本地启动

进入 [cms/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/cms/README.md) 对应目录：

```bash
cd /Users/stonework/Downloads/Trae/codeX/QiuQiuTech/cms
cp .env.example .env
docker compose up -d
```

预期地址：

- `http://localhost:8055` -> Directus 后台
- `http://localhost:5432` -> PostgreSQL

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

详细字段参照：

- [data-model.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/data-model.md)
- [directus-collections-matrix.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-collections-matrix.md)

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

这和当前 [web/src/app/page.tsx](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/src/app/page.tsx) 的消费结构保持一致。

## 4. 推荐的角色

至少先建立这四类角色：

1. `admin`
2. `operator`
3. `verified_user`
4. `public`

权限说明看：

- [roles-permissions.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/roles-permissions.md)

## 5. 第一批内容录入顺序

建议不要一上来就录全量真实内容，先把站点最关键的公开面跑顺：

1. 首页 `homepage_payload`
2. 8-12 条 `contents`
3. 4-6 条 `topics`
4. 4-6 条 `partnership_requests`
5. 2-3 条 `submissions`

这样前台已经能从 mock 切到第一版真实 CMS 数据。

## 6. 与前端对接时的环境变量

在 [web/.env.example](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/.env.example) 基础上增加：

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

## 8. 接通成功的判定标准

满足这些才算不是“表面接通”：

1. 首页能从 Directus 读取 `homepage_payload`
2. 内容列表和详情能读真实 `contents`
3. 专题页能读真实 `topics`
4. 合作页能读真实 `partnership_requests`
5. CMS 挂掉时前台仍能安全回退 mock
