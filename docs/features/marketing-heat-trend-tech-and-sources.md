# 营销热度趋势 — 技术栈与数据源说明（单一事实来源）

本文与 **`docs/features/marketing-heat-trend.md`**（业务规则、联调）、**`scripts/crawl/sources.marketing-platforms.txt`**（URL 清单正文）配套：Git 与本地备份请以三者为准；若本文与清单文件冲突，**以仓库中的 `.txt` 文件为准**（清单会随扩展持续增加）。

---

## 1. 技术栈（按链路分层）

| 层级 | 技术 | 说明 |
|------|------|------|
| **前台展示** | Next.js App Router、`React` 客户端组件、`TypeScript`、`Tailwind CSS v4` | 首页模块 `MarketingHeatTrendCard`：自定义 **SVG** 折线图（非 ECharts）、图例与分段控件、`fetch` + `AbortController` 防抖与超时 |
| **HTTP API** | Next.js Route Handler `GET /api/trends/marketing-heat` | 服务端调用聚合函数，返回 JSON（`series`、`hotTopicStats`、`axisLabels` 等） |
| **趋势聚合** | Node.js（`server-only`）、纯算法 | `web/src/lib/marketing-heat-trend.ts`：时间窗口分桶、关键词归类到 5 大类、归一化与轻度平滑、热门话题抽取与黑名单 |
| **CMS 读取** | Directus REST、`directusAuthedFetchJSON` | 读取 `submissions` 集合；鉴权见 `web/.env.example`（静态 Token 或管理员密码） |
| **数据库** | PostgreSQL（Docker 内） | 由 `cms/docker-compose.yml` 提供；业务表见 `cms/sql/bootstrap-minimal-business-schema.sql` |
| **抓取流水线（入库）** | Node.js、`fetch` 拉取 HTML、正则抽取标题/摘要 | **`scripts/crawl/fetch-url-to-json.mjs`**（非无头浏览器）；批量列表 **`fetch-batch-from-list.mjs`**；一条龙 **`scripts/sync/crawl-and-import.mjs`** → **`scripts/import/import-submissions-to-directus.mjs`** |
| **起始数据（无爬虫也能看图）** | JSON 种子 + 导入脚本 | `cms/seed/submissions.seed.json`、`scripts/seed/import-submissions-seed.mjs`，见 **`cms/seed/README.md`**（**非静态写死前端**，仅向数据库灌入初始行；动态性见该 README） |

---

## 1.1 抓取实现必备说明（当前仓库真实行为）

以下为实现细节，**迁移/接手必须知晓**，避免误以为「用了 Playwright / 浏览器自动化」或「种子写死页面」。

### 单 URL 抓取（核心）

- **文件**：`scripts/crawl/fetch-url-to-json.mjs`
- **技术**：Node 内置 **`fetch(url)`** 下载 HTML（带 `User-Agent`），**不做**无头浏览器渲染。
- **解析**：用正则从 HTML 中取 `<title>`、`<meta name=description / og:description>`、`<body>` 纯文本摘要；**不是**完整 DOM 渲染。
- **产物**：写入 JSON（含 `submission.title/summary/status` 等），供导入脚本上传 Directus。
- **局限**：依赖服务端返回的 HTML；**重度 SPA / 强反爬**站点可能抓取不完整或失败，需在运维上接受或日后改用 Playwright 等方案（若引入须更新本文档）。

### 批量与一条龙

1. **`fetch-batch-from-list.mjs`**：逐行读取清单 URL，间隔延时，调用上面的单 URL 脚本，输出到 `tmp/crawl/*.json`。
2. **`crawl-and-import.mjs`**：先批量抓取，再调用 **`import-submissions-to-directus.mjs`** 写入 `submissions`。
3. **清单默认**：`crawl-and-import.mjs` 默认 `--list=scripts/crawl/sources.sample.txt`；跑营销平台完整列表须显式：

   ```bash
   node scripts/sync/crawl-and-import.mjs --list=scripts/crawl/sources.marketing-platforms.txt --outDir=tmp/crawl
   ```

### 与「动态展示」的关系

- **趋势图**：运行时 **读数据库里的 `submissions`**，按时间窗口重算；**不**嵌入种子 JSON。
- **种子**：仅加速「空库第一条曲线」，**不替代**后续抓取；长期热度依赖定时任务写入新 `submissions`。

---

## 2. 配置文件与脚本索引（与此功能直接相关）

| 路径 | 用途 |
|------|------|
| `scripts/crawl/sources.marketing-platforms.txt` | **抓取入口 URL 清单**（唯一权威列表）；含 `type=`、`tags=` 约定 |
| `scripts/crawl/sources.sample.txt` | 示例/测试用较短列表 |
| `scripts/sync/crawl-and-import.mjs` | 默认 `--list=scripts/crawl/sources.sample.txt`；生产跑营销源应显式传 `--list=scripts/crawl/sources.marketing-platforms.txt` |
| `scripts/import/import-submissions-to-directus.mjs` | 将 `tmp/crawl/*.json` 导入 Directus `submissions` |
| `web/.env.example` / `web/.env.local`（不提交） | `NEXT_PUBLIC_DIRECTUS_URL`、`DIRECTUS_*` 鉴权 |
| `cms/.env.example` / `cms/.env`（不提交） | Directus 容器配置 |
| `cms/seed/submissions.seed.json` | 仓库内演示/起始投稿快照 |
| `web/src/lib/marketing-heat-trend.ts` | 趋势与话题核心逻辑 |
| `web/src/components/marketing-heat-trend-card.tsx` | 图表 UI |
| `web/src/app/api/trends/marketing-heat/route.ts` | API |

定时 **12 小时**：由外部 cron / 宿主机计划任务调用 `crawl-and-import`（或等价流水线），**不在 Next.js 进程内内置闹钟**。

---

## 3. 抓取站点链接（数量与来源）

- **权威清单**：`scripts/crawl/sources.marketing-platforms.txt`（每行一条 `https://...`，含注释块分组：SocialBeta、数英、梅花网、Campaign Brief、Adweek、TOPYS、addog 扩展及 hd.weibo、品牌星球等）。
- **当前规模（便于核对）**：约 **56** 条有效 URL 行（以 `grep -E '^https://'` 计数为准，随提交可能变化）。
- **首页趋势图读的不是「实时爬 URL」**，而是 **Directus 里已有 `submissions`**；抓取任务负责把页面摘要写入 `submissions`，趋势模块再聚合展示。

若需完整域名一览，在克隆仓库后执行：

```bash
grep -E '^https://' scripts/crawl/sources.marketing-platforms.txt
```

---

## 4. Git / 文档对照（避免遗漏）

以下内容已纳入 **Git 仓库**：

| 内容 | 文档或文件 |
|------|------------|
| 业务规则、联调、故障排除 | `docs/features/marketing-heat-trend.md` |
| 技术栈 + 配置索引 + 数据源说明（本文） | `docs/features/marketing-heat-trend-tech-and-sources.md` |
| 源码文件列表 | `docs/features/marketing-heat-trend-module-inventory.md` |
| 换机与 Docker | `docs/setup-from-scratch.md` |
| 克隆与运行总入口 | 根目录 `README.md` → 「克隆与本地运行」 |
| 种子数据 | `cms/seed/README.md` |

合并阅读顺序建议：**README** → **setup-from-scratch** → **marketing-heat-trend.md** → **本文** → **module-inventory**。

---

## 5. 迁移文档自检清单（接手 / 全盘迁移必核）

维护者在合并文档或发布备份前，建议逐项核对（详见 **`docs/migration-doc-self-check.md`**）：

- [ ] 克隆后：`README` + `setup-from-scratch` 能否从零跑通 Docker + `npm install` + `npm run dev`
- [ ] 营销热度：**技术栈与抓取实现**（本文 §1.1）、**URL 清单文件路径**、**种子语义**（`cms/seed/README.md`）均已写明
- [ ] 环境变量：仅 `.env.example` 入 Git，无密钥泄露
- [ ] 抓取生产命令：是否注明 `--list=scripts/crawl/sources.marketing-platforms.txt`
