# 营销热度趋势（内容平台聚合）开发文档

本功能用于在 QiuQiuTech 首页展示「营销热度趋势」模块（参考 UI：折线趋势 + 24h/7d/30d 切换 + 热门话题标签），并由抓取任务每 **12 小时**自动同步更新。

> 重要：这里的「热度」指 **营销内容平台的内容更新热度**（案例/观察/品牌动态等），不是舆情监测。

---

## 1. 目标与交付物

- **数据源**：聚合“基础 6 个核心平台 + 扩展资讯源（addog 业内资讯目录）”
  - SocialBeta：`https://socialbeta.com/`
  - 数英：`https://www.digitaling.com/`
  - 梅花网：`https://www.meihua.info/`
  - Campaign Brief：`https://campaignbrief.com/`
  - Adweek：`https://www.adweek.com/`
  - TOPYS：`https://www.topys.cn/`
  - 扩展目录：`https://www.addog.vip/#hot3`
  - 新增重点源：`https://hd.weibo.com/`、`https://www.brandstar.com.cn/`
- **分类维度（固定 5 类）**
  - 品牌动态
  - 联名
  - 内容营销
  - Campaign
  - 趋势观察
- **更新频率**：每 12 小时跑批一次（抓取 → 入库 → 前台读取）
- **展示**：首页模块「营销热度趋势」展示多条折线与热门话题标签

---

## 2. 系统边界与架构

本仓库采用 “抓取脚本 → Directus 投稿池（submissions）→ 前台聚合渲染” 的最小闭环。

### 2.1 数据流（MVP）

1. `scripts/crawl/*` 抓取 URL，输出结构化 JSON 到 `tmp/<batch>/xxx.json`
2. `scripts/import/import-submissions-to-directus.mjs` 将 JSON 导入 Directus 的 `submissions`
3. 前台首页在服务端渲染阶段从 Directus 拉取 `submissions`（按时间窗口）
4. 在 Node 侧按「5类」聚合成折线序列 + 热门话题标签（tag topN）

> 说明：当前不强依赖 `contents` 正式发布表。趋势以 `submissions` 为数据源（更贴近“抓取同步更新”）。

### 2.2 起始数据（仓库内种子）

他人克隆或新电脑拉起空库时，可先导入 **`cms/seed/submissions.seed.json`**，再用 **`node scripts/seed/import-submissions-seed.mjs`** 写入 Directus，首页即可有初始折线与话题（无需先跑爬虫）。细节见 **`cms/seed/README.md`**；更新快照用 **`node scripts/seed/export-submissions-seed.mjs`**（需本机 Postgres 容器）。

---

## 3. 数据模型（Directus）

本功能依赖 `submissions` 集合的以下字段（见 `docs/data-model.md`）：

- `date_updated`：用于时间窗口筛选与分桶（本仓库的最小 SQL schema 默认包含该字段）
- `title / summary`：用于分类与热门话题提取（MVP）
- `submission_type`：此功能默认抓取为 `case`（不强要求）
- `status`：允许包含 `pending_review/under_review/approved/published`（MVP不强过滤，建议排除 `draft/archived`）
- `external_link`：去重与溯源

---

## 4. 抓取来源清单与字段约定

### 4.1 来源清单文件（建议）

新增来源清单：`scripts/crawl/sources.marketing-platforms.txt`

- 每行一个抓取入口 URL
- 支持注释：以 `#` 开头
- 支持扩展元数据（MVP 约定）：

```text
<url> | type=<case|event|playbook> | tags=<tag1,tag2,...>
```

### 4.2 标签（tags）写入约定

为了稳定聚合，抓取写入的 tags **必须包含**下面 5 类之一（至少一个）：

- `品牌动态`
- `联名`
- `内容营销`
- `Campaign`
- `趋势观察`

可附加补充标签（用于热门话题）：如 `在地化传播`、`周更栏目`、`创意广告`、`跨界联名` 等。

---

## 5. 趋势聚合规则（MVP 固定）

### 5.1 时间窗口

- `24h`：近 24 小时
- `7d`：近 7 天
- `30d`：近 30 天

### 5.2 分桶（points）

折线点数固定为 **7 个点**（与首页横轴刻度一致）：

- 24h：每 2.4 小时一个桶（约等分）
- 7d：每 0.7 天一个桶
- 30d：每 3 天一个桶

### 5.3 计算方式

对每个时间桶：

- 统计该桶内 `submissions` 数量（满足 tags 中包含该分类标签）
- 对每条 submission 允许计入多个分类（如果 tags 同时命中多个分类）

最终将每条线归一化到 0~100（用于 UI 统一比例）。

---

## 6. API 与前端接入

### 6.1 API（内部聚合）

新增 API 路由（Next.js App Router）：

- `GET /api/trends/marketing-heat?window=24h|7d|30d`

返回：

- `series[]`：5 类折线数据（label/color/values）
- `hotTopics[]`：热门话题标签（从所有 tags 聚合 topN，排除 5 个分类标签本身）
- `generatedAt`：生成时间

> 首页也可以直接在服务端函数中调用同样的聚合逻辑（避免额外请求），API 用于后续“实时刷新/前端轮询/管理台预览”。

### 6.1.1 让 API 读到真实 Directus 数据（必须配置）

本功能默认在 Directus 侧读取 `submissions`，因此在运行 `web/` 时需要具备 Directus 可访问与鉴权配置。

最小配置方式（二选一）：

- **方式 A（推荐）**：`DIRECTUS_STATIC_TOKEN=<token>`
- **方式 B**：`DIRECTUS_ADMIN_EMAIL=<email>` + `DIRECTUS_ADMIN_PASSWORD=<password>`

同时需要：

- `NEXT_PUBLIC_USE_DIRECTUS=true`
- `NEXT_PUBLIC_DIRECTUS_URL=http://127.0.0.1:8055`（按你的实际部署修改）

若未配置鉴权，API 会回退到空数据（不报错），页面仍可渲染但不会出现真实趋势波动。

本仓库已提供示例配置文件：

- `web/.env.example.marketing-trends`

### 6.2 首页渲染点

首页趋势模块在 `web/src/app/page.tsx`：

- 标题：`营销热度趋势`
- 切换：`24h / 7d / 30d`（MVP 可先做样式，后续接交互）
- 折线：渲染 `realtimeTrendSeries`
- 热门话题：渲染 `trendKeywords`

### 6.3 前端交互（已实现）

- **窗口切换**：`24h / 7d / 30d` 点击后请求 `GET /api/trends/marketing-heat?window=...`，无刷新更新折线与热门话题
- **自动刷新**：默认每 60 秒刷新一次当前窗口（用于“看板感”），当页面不可见（切后台 tab）时自动暂停
- **热门话题可点**：点击跳转站内搜索 `/search?q=<tag>`
- **手动刷新**：右上角提供“刷新”按钮，点击立即刷新当前窗口数据

---

## 7. 12 小时跑批（执行方式）

### 7.1 一键跑批命令（本地）

```bash
DIRECTUS_ADMIN_EMAIL=... DIRECTUS_ADMIN_PASSWORD=... \
scripts/sync/run-crawl-cron.sh scripts/crawl/sources.marketing-platforms.txt tmp/crawl-marketing crawler-bot 1200 tmp/crawl-failures.json
```

### 7.2 生产 Cron（示例）

每天两次（00:00 与 12:00）：

```cron
0 0,12 * * * /path/to/repo/scripts/sync/run-crawl-cron.sh /path/to/repo/scripts/crawl/sources.marketing-platforms.txt /path/to/repo/tmp/crawl-marketing crawler-bot 1200 /path/to/repo/tmp/crawl-failures.json
```

---

## 8. 失败与排障

### 8.1 常见问题

- **时间窗口切换出现抖动**
  - 原因通常是切换按钮 active/inactive 样式尺寸不一致（字重、padding、宽度变化）
  - 已采用固定三等分 segmented control（每项固定宽高）避免抖动
  - 若二次改 UI，务必保持 24h/7d/30d 按钮的宽高与字重一致
- **趋势为空（没有曲线）**
  - 先看 `GET /api/trends/marketing-heat?window=24h` 的 `totalSubmissions`
  - 若为 `0` 且预期有数据，优先检查 Directus 是否运行（`localhost:8055`）
  - 本地可用：`cd cms && docker compose up -d`
- **网页 500 / 无法打开**
  - 常见于本地同时存在多个 Next dev 实例（如 3000/3001 冲突）
  - 保留单实例并确认首页返回 200

- **抓取成功但趋势不动**
  - 确认 Directus `submissions` 是否新增
  - 确认新导入记录的 `tags` 是否包含 5 类之一（否则不会进入任一曲线）
- **导入失败**
  - 看 `tmp/crawl-failures.json`
  - 看每批次目录下 `_import-report.json`
- **重复内容过多**
  - 当前去重依据：`external_link` 或 `title`（见 `scripts/import/import-submissions-to-directus.mjs`）

### 8.2 调试建议

- 先用单条抓取验证：

```bash
node scripts/crawl/fetch-url-to-json.mjs --url=https://socialbeta.com/ --out=tmp/debug.json --type=case --extraTags=Campaign,趋势观察
```

---

## 9. 迭代路线（后续）

- 解析列表页，抓取多条文章链接（而非只抓入口页）
- 引入 `sources` 集合做可视化管理（站点/栏目/频率/健康度）
- 将 `submissions` 审核通过后自动转换为 `contents` 并发布
- 前端趋势模块接入真实切换交互与无刷新更新（SSE/WebSocket）

---

## 10. 多 AI / 多电脑联调规范（新增）

### 10.1 必要前提

- 所有联调机器都需要本地可运行以下服务：
  - `web`（Next.js）
  - `cms`（Directus + Postgres，建议 Docker Compose）
- 不要假设“上一个 AI/同事机器上的服务还在运行”。

### 10.2 每次接手前的最小自检（建议固化为 SOP）

1. 检查 web：
   - `http://localhost:3000` 可访问（状态 200）
2. 检查 Directus：
   - `http://localhost:8055` 可访问
   - `docker compose ps` 中 `qiqiutech-directus`/`qiqiutech-postgres` 为 Running
3. 检查趋势接口：
   - `GET /api/trends/marketing-heat?window=24h`
   - 关注 `success`、`totalSubmissions`、`series`

### 10.3 环境变量一致性

- `web/.env.local` 至少保证：
  - `NEXT_PUBLIC_USE_DIRECTUS=true`
  - `NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055`（或团队统一地址）
  - `DIRECTUS_STATIC_TOKEN` 或 `DIRECTUS_ADMIN_EMAIL/PASSWORD`
- 多机器联调时，禁止把个人路径或本机端口写死在业务代码里。

### 10.4 交接建议

- 交接信息里必须写明：
  - 当前运行端口（3000/8055）
  - 是否需要先启动 Docker
  - 最近一次趋势接口返回（是否非空）
  - 若接口为空，当前判断是“无数据”还是“服务未启动”

