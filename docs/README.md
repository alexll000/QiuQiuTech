# Docs Guide

这个目录下同时存在两类文档：

1. **当前有效文档**
2. **历史阶段文档**

接手时不要把它们混在一起看。

## 当前优先阅读顺序

### 1. 外部最新开发 Brief

主真值源：

- `QiuQiuTech_Full_Development_Brief_v2.md`（外部文件，建议放到仓库 `docs/brief/` 后再引用）

这份文档当前优先级最高，尤其是：

- 栏目命名
- 信息架构
- 数据模型方向
- 权限与审核流
- 后台栏目要求

### 2. 当前仓库总说明

- [README.md](README.md)

### 3. 当前 AI 交接文档

- [ai-handoff.md](docs/ai-handoff.md)
- [Latest-conversation-brief.md](docs/Latest-conversation-brief.md)

这份文档现在负责：

- 最新进展
- 当前真实状态
- 下一步开发顺序
- 整体路线图
- 下一个 AI 接手注意事项

其中：

- `Latest-conversation-brief.md` 是最短接棒入口
- `ai-handoff.md` 是长版真实状态与路线文档

### 4. 当前前端工程说明

- [web/README.md](web/README.md)

## 本目录中文档定位

### 仍有参考价值

- [QiuQiuTech-design-system-v1.md](docs/QiuQiuTech-design-system-v1.md)  
  用于看设计语言、视觉原则、品牌方向。

- [QiuQiuTech-skills-and-stack.md](docs/QiuQiuTech-skills-and-stack.md)  
  用于看之前的技能与技术栈建议。

### 当前开发文档

- [current-build-status.md](docs/current-build-status.md)
- [ai-handoff.md](docs/ai-handoff.md)
- [Latest-conversation-brief.md](docs/Latest-conversation-brief.md)
- [todo-live.md](docs/todo-live.md)
- [ui-workbench.md](docs/ui-workbench.md)
- [engineering-rules.md](docs/engineering-rules.md)
- [ui-governance.md](docs/ui-governance.md)
- [content-data-contract.md](docs/content-data-contract.md)
- [review-sop.md](docs/review-sop.md)
- [ai-collaboration-protocol.md](docs/ai-collaboration-protocol.md)
- [AI-Execution-Contract.md](docs/AI-Execution-Contract.md)
- [release-checklist.md](docs/release-checklist.md)
- [architecture.md](docs/architecture.md)
- [backend-plan.md](docs/backend-plan.md)
- [data-model.md](docs/data-model.md)
- [roles-permissions.md](docs/roles-permissions.md)
- [homepage-module-mapping.md](docs/homepage-module-mapping.md)
- [deployment-plan.md](docs/deployment-plan.md)
- [seo-content-publishing.md](docs/seo-content-publishing.md)
- [directus-initialization-checklist.md](docs/directus-initialization-checklist.md)
- [directus-collections-matrix.md](docs/directus-collections-matrix.md)

### 营销热度趋势（首页模块）

- [features/marketing-heat-trend-tech-and-sources.md](docs/features/marketing-heat-trend-tech-and-sources.md) — **技术栈、配置索引、抓取 URL 说明（Git 内单一索引）**
- [features/marketing-heat-trend.md](docs/features/marketing-heat-trend.md) — 业务规则与联调
- [features/marketing-heat-trend-module-inventory.md](docs/features/marketing-heat-trend-module-inventory.md) — 源码文件列表
- [setup-from-scratch.md](docs/setup-from-scratch.md) — 换机 / Docker / 种子数据

### 历史阶段资料

以下文档主要是前期讨论或旧阶段产物，**不能直接当成当前实现真值**：

- [QiuQiuTech-Brief.md](docs/QiuQiuTech-Brief.md)
- [QiuQiuTech-platform-brief-v1.md](docs/QiuQiuTech-platform-brief-v1.md)
- [QiuQiuTech-prd-v1.md](docs/QiuQiuTech-prd-v1.md)
- [QiuQiuTech-sitemap-and-page-modules-v1.md](docs/QiuQiuTech-sitemap-and-page-modules-v1.md)

这些文档的问题主要是：

- 仍然使用旧路由，如 `/content`、`/connect`
- 页面模块和当前代码已不完全一致
- 部分内容比最新 brief 更早，容易误导后续开发

## 当前实现真值

如果文档和代码冲突，当前应按以下顺序判断：

1. 最新用户明确要求
2. `QiuQiuTech_Full_Development_Brief_v2.md`
3. `docs/ai-handoff.md`
4. 当前 `web/src/` 已实现结构
5. `docs/` 中仍有参考价值的文档
6. 历史 v1 文档

## 建议后续整理方式

后面如果继续整理文档，建议把历史资料移入：

```text
docs/archive/
```

并额外补三份真正面向开发的文档：

1. `architecture.md`
2. `backend-plan.md`
3. `data-model.md`

## Git 同步约定

以后只要做“更新 Git / 同步 GitHub”，默认至少同步这四块内容：

1. 代码最新状态
2. `current-build-status.md`
3. `ai-handoff.md`
4. README 中的接手说明

## 任务状态标记约定（新增）

从本次开始，任务状态统一按以下优先级维护：

1. `docs/todo-live.md`
2. 根 `README.md` 的状态摘要
3. `web/README.md` 的状态摘要
4. `docs/current-build-status.md` 的阶段描述与未完成项

状态语义统一为：

- `✅ 已完成`：可运行且已有文档记录
- `⏳ 进行中`：已实现部分能力，仍需联调/验证
- `⬜ 未开始`：尚未进入开发

如果这些文件的状态描述冲突，以 `docs/todo-live.md` 为准，并在同一次提交中完成其余文档同步。

关键同步记录：

- 2026-05-09 09:35 (UTC+8)：将“公开前台不得暴露内部开发状态，账户流程必须按用户任务组织”升级为系统级硬约束，并同步到 `README.md`、`web/README.md`、`docs/engineering-rules.md`、`docs/ui-governance.md`、`docs/ai-collaboration-protocol.md`、`docs/current-build-status.md`、`docs/ai-handoff.md`。
- 2026-05-09（本轮继续）：新增 `docs/ui-workbench.md`，并在 `web/` 接入 Storybook 10 与 shadcn-compatible 基线；同步更新根 README / web README / build-status / handoff / UI 治理规则。
- 2026-05-09 12:40 (UTC+8)：新增 `docs/Latest-conversation-brief.md` 作为下一位 AI 的最短接棒入口，并同步整理 handoff / build-status / docs 索引。

- 2026-05-07 21:21 (UTC+8)：审核流相关状态从“计划中”对齐为“最小版已完成”，并同步 `docs/ai-handoff.md` 与 `docs/current-build-status.md`。
- 2026-05-07 21:22 (UTC+8)：新增联调记录模板 `docs/e2e-validation-log.md`，并在 README 体系补充联调状态说明。
- 2026-05-07 21:23 (UTC+8)：固化“每轮常规动作（必须执行）”流程到根 `README.md` 与 `web/README.md`。
- 2026-05-08 09:35 (UTC+8)：完成项目路径迁移对齐（切换到统一根变量 `$QIQIUTECH_ROOT`），同步更新根 README / web README / ai-handoff / build-status 的状态时间与下一步任务。
- 2026-05-08 09:50 (UTC+8)：新增 `todo-live.md` 作为任务拆分与进度标记唯一真值源，支持多 AI 并行协作。
- 2026-05-08 10:05 (UTC+8)：新增 6 份规范文档（工程规则/UI 治理/数据契约/审核 SOP/AI 协作协议/发布检查清单）。
- 2026-05-08 10:45 (UTC+8)：补充首页稳定性修复文档同步（Directus/CMS 请求超时保护 + fallback 说明）。
- 2026-05-08 11:12 (UTC+8)：同步 Directus 联调阻塞状态（实例可用但业务集合 API 创建 `FORBIDDEN`）并更新 To Do。

- 2026-05-08 12:06 (UTC+8)：新增动作接口联调可观测性（source/reason）并同步 README 体系。

- 2026-05-08 12:20 (UTC+8)：新增 5 条动作链路联调脚本，输出 source/reason 并定位 TOKEN_EXPIRED 回退原因。

- 2026-05-08 12:28 (UTC+8)：落地 SQL bootstrap 最小业务集合，动作链路 5/5 复测切到 source=directus。

- 2026-05-08 12:40 (UTC+8)：推进 T06 第一阶段，补齐 contents/topics/homepage_payload 最小结构与 snake_case 兼容映射。
- 2026-05-08（本轮）：完成 lint/build 回归，动作链路 smoke 5/5（source=directus）复测通过，`/` `/contents` `/topics` `/requests` 连通性复测均为 200，并同步 T06 状态到 todo-live/README/handoff。
- 2026-05-08（本轮继续）：推进 T07 第一阶段，新增 `POST/DELETE /api/auth/session` 与 `qqt_uid` cookie 方案，`/api/me/*` 及动作链路切换为请求级用户优先，并通过 lint/build。
- 2026-05-08（本轮继续）：补齐登录最小闭环（`/auth` 登录跳 `/me`、`/me` 退出登录），并完成 lint/build 回归验证。
- 2026-05-08（本轮继续）：补充“其他 AI 接手禁忌”到根 README 与 web README，固化未完成阶段的开发边界与验证约束。
- 2026-05-08（本轮继续）：推进 T08 第一阶段，新增抓取与导入脚本（单链接/批量/Directus 待审核导入），并同步状态到 todo/build-status/handoff。
- 2026-05-08（本轮继续）：T08 补齐去重与一键同步脚本（`crawl-and-import`），并记录真实导入结果（`submissions.id=4/5`）。
- 2026-05-08（本轮继续）：T08 补齐失败回放重试与 cron 入口（`retry-failed-imports` / `run-crawl-cron.sh`），并完成可执行验证。
- 2026-05-08（本轮继续）：T08 补齐来源级限速（`delayMs`）与失败告警脚本（`notify-failures`），并回写 README/handoff/build-status。
- 2026-05-08（本轮继续）：补充“多 AI 强制交接规则”（必更文档清单、禁止结束条件、统一回报模板）到 `README.md` / `docs/ai-collaboration-protocol.md` / `docs/release-checklist.md`。
- 2026-05-09（本轮继续）：新增 `AI-Execution-Contract.md`（一票否决项 + 必更文档清单 + 最小验证门槛 + 统一回报格式），并修正文档中的本机绝对路径到统一根变量 `$QIQIUTECH_ROOT`。
- 2026-05-09（本轮继续）：新增 `scripts/check-doc-portability.sh` 并接入协作协议/发布清单，强制校验文档中机器绝对路径，降低跨电脑接手风险。
- 2026-05-08 20:03 (UTC+8)：推进 T08 收尾，新增抓取质量评分、来源健康度统计、批次报告与导入报告，并将 todo/README/handoff/build-status 状态同步为“MVP 已完成”。
- 2026-05-08 20:52 (UTC+8)：推进 T13 最小版，在 `/admin` 接入抓取报告可视化面板，消费最新批次/导入报告并同步 todo/README/web-README/handoff/build-status。
- 2026-05-08 21:15 (UTC+8)：修复前台本地开发异常，`web` 切到 `next dev --webpack` 并清理 `.next`；同步首页标题与 README 状态说明。
- 2026-05-08 21:18 (UTC+8)：对齐本地 Directus 后台品牌与中文语言基线，完成 `QiuQiuTech` 品牌资源、`project_descriptor` 中文化与 `zh-CN` 默认语言/管理员语言设置。
- 2026-05-08 21:24 (UTC+8)：参考 SocialBeta 页面标题逻辑，统一首页/内页 tab 标题规则：首页改为“品牌名｜核心定位”，内页保留“页面名 | 品牌名”。
- 2026-05-08 21:31 (UTC+8)：补充 README / web README 的后台开发进度摘要与页面标题规则说明，便于后续 AI 快速判断后台所处阶段。
- 2026-05-08 21:24 (UTC+8)：新增 Directus 后台品牌/语言初始化脚本 `cms/scripts/apply-branding-and-language.mjs`，并同步接入 CMS README、初始化清单、To Do 与进度文档。
- 2026-05-08 21:40 (UTC+8)：完成 Directus 角色/策略基线脚本验证，新增 `cms/scripts/seed-roles-and-policies.mjs` 与 `cms/scripts/init-local-foundation.mjs` 的文档接入，并同步 README / todo-live / handoff / build-status。
- 2026-05-08 21:48 (UTC+8)：新增 `cms/scripts/verify-local-foundation.mjs` 自检脚本并完成验证，同步 CMS README、初始化清单、README 看板与 todo-live。
- 2026-05-08 21:56 (UTC+8)：替换前台与 Directus 后台品牌资源为透明底 logo，前台头部切到“鸟头 + 文字”，tab / favicon 切到“仅鸟头”；该条已在 22:20 的同步中进一步纠偏为“后台主 logo 使用大鸟无文字”。
- 2026-05-08 22:20 (UTC+8)：补充后台真实进展边界、首页样式 fallback 修复、后台中文化与“大鸟无文字”主 logo，对齐 todo-live / README / handoff / build-status。
- 2026-05-08 22:42 (UTC+8)：补齐前台站内搜索最小版，确认原搜索框属于静态占位而非 bug，并同步到 todo-live / README / web README / handoff / build-status。
- 2026-05-08 22:58 (UTC+8)：统一前台首页与 Directus 后台的 Tab icon，前端文件级 icon 与 metadata icon 一并切到透明 64x64 鸟头资源。
- 2026-05-08（本轮继续）：升级 `/auth` 登录界面为高保真结构，并同步 `todo-live / README / web README / ai-handoff / current-build-status` 的登录页状态描述。
- 2026-05-08（本轮继续 2）：补充 `/api/auth/session` 的 `GET` 会话识别、验证码/注册体验承接层，并完成前端服务恢复与 `lint/build` 回归，同步到真值文档。
- 2026-05-08（本轮继续 3）：按 C 端展示优先收瘦 `/auth` 登录页，减少对标同质化与内部说明感，并同步状态到真值文档。
- 2026-05-08（本轮继续 4）：重构 `/auth` 信息架构为“直接登录 / 去注册”双入口，拆开登录方式与注册流程，并同步状态到真值文档。
- 2026-05-08（本轮继续 5/6）：继续收敛 `/auth` 的视觉层级与引导关系，补充方式说明、互跳入口与辅助区权重调整，并同步状态到真值文档。
- 2026-05-08（本轮收尾）：完成 T03 审核台增强版与 T13 抓取报告面板增强项收尾，并同步 todo-live / README / web README / ai-handoff / current-build-status。
- 2026-05-08（本轮继续 7）：进一步移除 `/auth` 的开发痕迹和干扰性表达，向更克制的公开站登录入口收口，并同步状态到真值文档。
- 2026-05-08（本轮继续 8）：继续打磨 `/auth` 的排版节奏与任务面板结构，让页面更接近正式上线产品，并同步状态到真值文档。
- 2026-05-09 07:41 (UTC+8)：继续推进 T07，补齐 `user_profiles` 本地最小 schema、会话接口资料同步写入、`/me` 私有聚合读取与对应真值文档同步。
- 2026-05-09 11:20 (UTC+8)：继续推进首页联调，麦当劳案例位改为真实 Hero 轮播，标签策略与信息层级向 `/auth` 统一，并同步 `todo-live / README / web README / ai-handoff / current-build-status`。
