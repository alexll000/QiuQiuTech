# 离线备份目录与 Git 对齐说明

若在 **`Downloads/Trae/QiuQiuTech_0510`**（或其它路径）保留一份「全量可运行」拷贝，建议定期从本仓库根目录 **rsync**，使文档与 Git **一致**：

```bash
DEST="$HOME/Downloads/Trae/QiuQiuTech_0510"
SRC="/path/to/QiuQiuTech"   # 本仓库根

rsync -a --delete \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='_archive' \
  --exclude='tmp' \
  --exclude='.git/objects/pack/*.tmp-*' \
  "$SRC/" "$DEST/"
```

营销热度相关文档以 Git 为准：

- `docs/features/marketing-heat-trend-tech-and-sources.md`
- `docs/features/marketing-heat-trend.md`
- `docs/migration-doc-self-check.md`（交付前自检，防文档漏项）
- `scripts/crawl/sources.marketing-platforms.txt`

若在备份中附带 **`web/node_modules`**（可选），请注意跨系统可能需要重装依赖。
