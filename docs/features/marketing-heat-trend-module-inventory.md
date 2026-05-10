# 营销热度趋势模块 — 源码清单（可运行快照）

本文列出当前首页「营销热度趋势」功能涉及的**全部自有源码与文档**，便于备份、迁移或在另一仓库中复用，避免重复劳动。

## 运行时依赖（非源码）

| 依赖 | 说明 |
|------|------|
| Directus | 通过 `directusAuthedFetchJSON` 读取 `submissions` 集合（见 `marketing-heat-trend.ts`） |
| 环境变量 | `NEXT_PUBLIC_DIRECTUS_URL`、`DIRECTUS_STATIC_TOKEN` 或管理员账号（见 `web/.env.example`） |
| 数据字段 | 趋势分类与话题从 `date_updated`、`title`、`summary` 等推导 |
| 起始数据（可选） | `cms/seed/submissions.seed.json` + `scripts/seed/import-submissions-seed.mjs`，见 `cms/seed/README.md` |

## 前端 / API 源码

| 路径 | 职责 |
|------|------|
| `web/src/lib/marketing-heat-trend.ts` | 窗口分桶、分类、平滑、热门话题黑名单与统计、`getMarketingHeatTrend` |
| `web/src/components/marketing-heat-trend-card.tsx` | 折线图 SVG、图例、时间窗、刷新与请求取消、话题案例内联列表 |
| `web/src/app/api/trends/marketing-heat/route.ts` | `GET ?window=24h|7d|30d` JSON 接口 |
| `web/src/app/page.tsx` | 首页挂载 `MarketingHeatTrendCard` |

## 与其它模块的交界（勿删未评估）

| 路径 | 说明 |
|------|------|
| `web/src/lib/content-service.ts` | 引用 `getMarketingHeatTrend` / `deriveMarketingHeatSeriesFromSubmissions`，供其它内容逻辑复用 |

## 全局样式（搜索框等可能与首页同屏）

营销趋势卡片旁的头部搜索若需一并迁移体验，通常还涉及：

| 路径 | 说明 |
|------|------|
| `web/src/components/site-search-panel.tsx` | SocialBeta 风格伸缩搜索 |
| `web/src/components/site-shell.tsx` | 壳层挂载搜索 |
| `web/src/app/globals.css` | 含搜索面板动画等 |

（若仅迁移「趋势」最小闭包，可暂不带搜索；当前成品首页为两者共存。）

## 抓取数据源配置（行业站点列表）

| 路径 | 说明 |
|------|------|
| `scripts/crawl/sources.marketing-platforms.txt` | 营销平台 URL 列表（供爬虫/导入流水线使用，趋势展示依赖库内已有 `submissions`） |

## 文档

| 路径 | 说明 |
|------|------|
| `docs/features/marketing-heat-trend.md` | 功能说明、联调、故障排除、多 AI 协作约定 |
| `docs/setup-from-scratch.md` | 换机从零搭建（含 Docker 共用说明） |

## 自检接口

```bash
curl -s "http://127.0.0.1:3000/api/trends/marketing-heat?window=24h" | head -c 400
```

预期：`success: true` 且含 `series`、`hotTopicStats`（数据量视 Directus 而定）。
