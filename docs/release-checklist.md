# Release Checklist

最后更新：2026-05-08 10:05 (UTC+8)

## 构建与质量

- [ ] `npm --prefix web run lint` 通过
- [ ] `npm --prefix web run build` 通过
- [ ] 关键路由可访问（首页/内容/投稿/合作/用户中心/后台）

## 功能联调

- [ ] 投稿草稿保存
- [ ] 合作需求草稿发布
- [ ] 合作申请提交
- [ ] 收藏切换
- [ ] 通知已读
- [ ] 审核队列与状态流转

联调证据统一记录到：`docs/e2e-validation-log.md`

## SEO 检查

- [ ] 首页与核心频道页 `title/description/keywords`
- [ ] `canonical`
- [ ] `robots.ts`
- [ ] `sitemap.ts`
- [ ] 结构化数据（JSON-LD）

## 运营与回滚

- [ ] 审核日志可追溯（含操作者与时间）
- [ ] 异常时 fallback 可用（Directus 不可用时前台不崩）
- [ ] 明确回滚策略（配置回退或路由回退）

## 多 AI 交接完整性（强制）

- [ ] `docs/todo-live.md` 已更新任务状态/证据/下一步
- [ ] `README.md` 与 `web/README.md` 已同步状态摘要
- [ ] `docs/current-build-status.md` 与 `docs/ai-handoff.md` 已同步
- [ ] `docs/README.md` 已追加本轮同步流水
- [ ] 若有联调：`docs/e2e-validation-log.md` 已留痕
- [ ] 本轮回复含“完成项 + 验证 + 文档更新 + 下一步”四段摘要
- [ ] 文档路径可移植性检查通过：`scripts/check-doc-portability.sh`
- [ ] 一键交接校验通过：`scripts/validate-handoff.sh`
