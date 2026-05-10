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
