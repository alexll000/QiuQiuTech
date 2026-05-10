# 种子数据（营销热度趋势起始数据）

## `submissions.seed.json`

从本地 Directus/Postgres 导出的 **`submissions`** 表快照（仅业务字段，**不含密钥**），用于：

- 新电脑克隆仓库后，首页「营销热度趋势」**立即有折线/话题**，不必先跑爬虫。
- 演示或联调时统一基准数据。

更新快照（在你本机数据最新时执行）：

```bash
# 需已启动 Docker：qiqiutech-postgres
node scripts/seed/export-submissions-seed.mjs
```

导入到新起的 Directus（先完成 `cms` 初始化与 `submissions` 集合，见上级 `cms/README.md`）：

```bash
# 在仓库根目录，使用 web 或 cms 同套鉴权环境变量
export NEXT_PUBLIC_DIRECTUS_URL=http://127.0.0.1:8055
export DIRECTUS_STATIC_TOKEN=...   # 或 DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD

node scripts/seed/import-submissions-seed.mjs
```

说明：

- 导入脚本是**幂等的**：已存在相同 `title` / `external_link` 的记录会跳过。
- 若 Directus 里已有你自己的数据，只会**追加**不存在的行，不会清空现有库。
- 数据为案例标题与摘要，如有外链均为公开站点；若不希望纳入仓库，可从 `.gitignore` 忽略本文件并仅在内部传递。

---

## 会不会「写死」成静态展示？会不会误伤协作者？

**不会把前端写死。** 种子只做一件事：往 **`submissions` 表里插入若干行**（或跳过已存在的行）。首页趋势图**从来不读 JSON 种子文件**，而是每次请求时由服务端 **实时查询 Directus** 再聚合（见 `web/src/lib/marketing-heat-trend.ts`）。因此：

| 误解 | 实际情况 |
|------|----------|
| 「导入种子 = 页面变成静态 HTML」 | ❌ 页面仍是动态渲染；数据来自 **当前数据库内容**。 |
| 「仓库里的 seed.json 会覆盖线上」 | ❌ 只在**你执行导入脚本**且**库里尚无同标题/同外链**时插入；不会批量删除或覆盖他人数据。 |
| 「以后更新不了趋势」 | ✅ 继续跑 **抓取 → 入库**，或在 Directus 里增删改 `submissions`，下一刷新/下一请求就会反映（客户端还会定时拉 `/api/trends/marketing-heat`）。 |

若**长期不跑抓取、也不在后台新增投稿**，库里记录不变，折线在一段时间内看起来「变化不大」——这是因为 **业务数据没变**，不是种子把代码写成静态；要解决靠 **定时抓取 / 运营录入**，不是删掉种子文件。

**协作者可以不导入种子**：仅首页初期可能「样本偏少或为空」，按 `docs/features/marketing-heat-trend-tech-and-sources.md` 跑爬虫或自建数据即可。
