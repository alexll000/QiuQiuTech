# 迁移 / 全盘交付 — 文档与工程自检清单

在「他人可克隆即跑」「备份目录与 Git 一致」类需求合并前，建议按本清单走一遍。漏项会导致「有的写了、有的没写」的接棒成本。

## 1. 运行路径

- [ ] 根目录 `README.md` 含 **克隆 → `web` 安装 → `cms` Docker** 的最低步骤
- [ ] `docs/setup-from-scratch.md` 覆盖：换机、端口冲突、共用 Docker、营销热度无数据排障
- [ ] `web/.env.example`、`cms/.env.example` 与真实必填项一致，**无**把 `.env` / `.env.local` 提交进 Git

## 2. 营销热度趋势（易漏项）

- [ ] `docs/features/marketing-heat-trend-tech-and-sources.md` 存在且含：**展示技术栈、抓取技术细节（Node fetch + HTML 解析，非无头浏览器）**、清单文件路径、种子与动态性的说明
- [ ] `scripts/crawl/sources.marketing-platforms.txt` 为 **URL 唯一权威**；文档中引用的「约 N 条」若与 `grep -E '^https://' ... | wc -l` 差太多需更新
- [ ] 生产抓取命令写清：`crawl-and-import.mjs` 需 **`--list=scripts/crawl/sources.marketing-platforms.txt`**（默认是短 `sources.sample.txt`）
- [ ] `cms/seed/README.md` 说清：种子**非**写死前端、**不**覆盖他人数据、与动态抓取的关系
- [ ] 12h 更新：说明由 **外部 cron** 调抓取，**不是** Next 内置定时器

## 3. 数据与种子

- [ ] `cms/seed/submissions.seed.json` 若入仓：无隐私密钥；说明可跳过导入
- [ ] `import-submissions-seed.mjs` / `export-submissions-seed.mjs` 在 `cms/seed/README.md` 或 `scripts/seed` 有入口说明

## 4. 备份 / 多目录

- [ ] `docs/BACKUP-folder-parity.md` 说明离线目录与 **Git 拉取** 的对应关系
- [ ] 大目录 `node_modules` 是否进备份：在备份说明中写清（可选、跨架构需重装）

## 5. 变更后必做

- [ ] 文档或脚本有功能变更时，**同步** `docs/features/marketing-heat-trend.md` 或技术索引，避免三处真值源打架
- [ ] 推 Git 后，若存在固定备份路径，**rsync 或说明拉取** 二选一，避免只更新本地不更新远程

---

**说明**：没有人能不遗漏「全世界」细节；本清单用于把遗漏概率压到可接受范围。更新本清单时保持简短可勾选。
