# AI Execution Contract

最后更新：2026-05-09 14:35 (UTC+8)

## 适用范围

任何接手 QiuQiuTech 的 AI（含并行 AI）都必须遵守本契约。

## 一票否决项

出现以下任一情况，本轮交付视为无效：

1. 只改代码，不更新文档真值链路。
2. 没有验证命令与关键输出，只口头说明“已完成”。
3. 擅自删除 fallback / 去重 / 审核状态流保护逻辑。
4. 在公开前台暴露内部词汇（mock/fallback/admin-mock/会话ID/体验账号等）。

## 必更文档清单（有代码改动就必须全更）

1. `docs/todo-live.md`
2. `README.md`
3. `web/README.md`
4. `docs/current-build-status.md`
5. `docs/ai-handoff.md`
6. `docs/README.md`（追加本轮流水）

若包含联调或回归，必须同时更新：

- `docs/e2e-validation-log.md`

## 路径规范（跨机器强制）

1. 文档禁止写机器绝对路径（如 `/Users/<name>/...`）。
2. 仓库内文件引用优先使用相对路径（如 `docs/todo-live.md`）。
3. 终端命令统一使用根变量：
   - `QIQIUTECH_ROOT=<your-local-repo-path>`
   - `cd "$QIQIUTECH_ROOT"`
4. 外部文件（不在仓库）禁止写死本机路径，统一标注“外部文件”并建议入库后再引用。

## 最小验证门槛

至少执行并记录以下命令：

1. `npm --prefix web run lint`
2. `npm --prefix web run build`
3. 若改动动作链路：`bash web/scripts/e2e-actions-smoke.sh`
4. 若改动抓取链路：至少一次 `scripts/sync/run-crawl-cron.sh` 或等价链路命令
5. 文档可移植性校验：`scripts/check-doc-portability.sh`

推荐一键执行：

- `scripts/validate-handoff.sh`

## 回报格式（必须按此顺序）

1. 本轮完成
2. 验证结果（命令 + 关键输出）
3. 文档同步（列出文件）
4. 下一步

## 状态冲突裁决

若状态描述冲突，按以下优先级：

1. 用户最新要求
2. `QiuQiuTech_Full_Development_Brief_v2.md`
3. `docs/todo-live.md`
4. 当前代码
