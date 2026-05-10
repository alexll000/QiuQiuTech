# QiuQiuTech — 从零搭建（换电脑 / 配置缺失）

目标：**同一台电脑上可与任意目录的前端工程共用同一套 Docker（Directus + Postgres）**；**换电脑后仅依赖本仓库 + 本文档即可恢复可运行状态**。

---

## A. 同一台电脑：共用 Docker（推荐）

Docker 数据在 **volume** `qiqiutech_pg_data` 与容器名 **`qiqiutech-postgres` / `qiqiutech-directus`** 上，与前端仓库路径无关。

1. **只需保证容器已启动**（在任意一份克隆的 `cms/` 下执行过一次即可）：
   ```bash
   cd /path/to/任意/QiuQiuTech/cms
   docker compose up -d
   ```
2. **任意目录的前端**只要 `.env.local` 中：
   ```bash
   NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
   NEXT_PUBLIC_USE_DIRECTUS=true
   ```
   并配置好 Directus 令牌或管理员密码（见 `web/.env.example`）。
3. **不要在第二个 `cms/` 里再启一套默认 compose**（会端口 **8055 / 5432**、容器名冲突）。若必须并存多套，需自行改 `docker-compose.yml` 的端口与 `container_name`（进阶）。

停栈：`docker compose down`（默认**不删除** volume，数据仍在）。

---

## B. 换电脑：最小步骤（配置为空时）

### 1）必备环境

- Node.js（建议 LTS，与 lockfile 兼容）
- Docker Desktop（或其它 Docker 引擎）
- Git（若从仓库克隆）

### 2）CMS / 数据库

```bash
cd cms
cp .env.example .env   # 若仓库未带 .env，照此新建并按注释填写
docker compose up -d
```

浏览器打开 `http://localhost:8055` 完成首次向导或使用已有初始化脚本（见 `cms/README.md`）。

**数据库结构 / 种子**：按 `cms/README.md` 执行 SQL 与 `node cms/scripts/init-local-foundation.mjs`（路径均以仓库根为准）。

### 2.5）导入营销热度起始数据（推荐）

仓库内自带 **`cms/seed/submissions.seed.json`**（由当前环境导出、可随提交更新），用于让首页「营销热度趋势」在新环境**立刻有折线与话题**，无需先跑爬虫。

在仓库根目录、Directus 已启动且鉴权环境变量已配置（与 `web/.env.local` 同源即可）：

```bash
node scripts/seed/import-submissions-seed.mjs
```

详见 **`cms/seed/README.md`**。更新快照（你本机数据更新后想刷新仓库里的种子文件）：

```bash
node scripts/seed/export-submissions-seed.mjs
```

### 3）前端

```bash
cd web
cp .env.example .env.local   # 若未有 .env.local；再填入 Directus URL 与鉴权
npm install                  # 若备份未带 node_modules，必须执行
npm run dev
```

打开 `http://localhost:3000`，并自检：

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8055/server/health
curl -s "http://127.0.0.1:3000/api/trends/marketing-heat?window=24h" | head -c 200
```

### 4）营销热度趋势无曲线时

先确认 **2.5** 的种子是否已导入；若仍为空：多为 Directus 未启动或 `submissions` 表无数据——确认 health `200`，再执行种子导入、抓取或 `docs/features/marketing-heat-trend.md` 中的流程。

---

## C. 备份中带 `node_modules` 的说明

优点：换同架构机器时可跳过下载，加快首次启动。

注意：

- **跨操作系统**（如 macOS → Windows/Linux）可能含原生二进制，建议在新系统执行 `rm -rf web/node_modules && npm install` 重装。
- **架构不一致**（Intel ↔ Apple Silicon）也可能需重装依赖。

---

## D. 相关文档索引

| 文档 | 用途 |
|------|------|
| `README.md` | 仓库总览 |
| `cms/README.md` | Directus、SQL、初始化脚本 |
| `docs/features/marketing-heat-trend.md` | 营销热度功能与联调 |
| `docs/features/marketing-heat-trend-module-inventory.md` | 该模块源码文件清单 |
| `cms/seed/README.md` | 起始投稿数据（营销热度）导入说明 |
