# QiuQiuTech Live To Do

最后更新：2026-05-09（本轮已同步）  
真值规则：本文件是任务拆分、进展标记、完成状态的唯一真值源。

## 状态标记

- `✅ 已完成`：功能可运行，且文档已同步
- `🟨 进行中`：已有实现，仍需联调/补齐
- `⬜ 未开始`：尚未进入开发
- `⛔ 阻塞`：受外部条件限制（环境/权限/依赖）

## 工作流规则（多 AI 并行）

1. 每次推进前，先在本文件认领一个任务并更新时间。
2. 每完成一步，更新“状态 + 证据 + 下一步”。
3. 同步更新 `README.md`、`web/README.md` 的状态摘要（不重复写详细流水）。
4. 若状态与其他文档冲突，以本文件为准并在同次提交纠偏。

## 任务分解（当前阶段）

| ID | 任务 | 状态 | 当前进展 | 证据/落点 | 下一步 |
| --- | --- | --- | --- | --- | --- |
| T01 | 路径与文档真值统一到新根目录 | ✅ 已完成 | 已替换旧路径并同步关键文档时间戳 | `README.md` `web/README.md` `docs/README.md` `docs/ai-handoff.md` `docs/current-build-status.md` | 维持增量同步 |
| T02 | 五条写链路 API 壳层落地 | ✅ 已完成 | 投稿草稿/合作草稿/合作申请/收藏/通知已读均可调用 | `web/src/app/api/**` + `web/src/lib/action-service.ts` | 进入真实 Directus 联调 |
| T03 | `/admin` 最小审核流（队列+操作） | ✅ 已完成（增强版） | 已补齐驳回原因、批量通过/拒绝、操作者透传、审核说明展示与中文操作日志；`/api/admin/*/review` 优先写入请求级 `qqt_uid`，审核台已消费 `reviewedBy/reviewedAt/reviewNote` 回写 | `web/src/app/admin/page.tsx` `web/src/components/admin-review-queue.tsx` `web/src/lib/admin-review-service.ts` | 后续接真实账号体系、细粒度权限与更完整审计 |
| T04 | Directus 本地实例 + 集合完整核验 | ✅ 已完成（本地方案） | 实例可用；通过 `cms/sql/bootstrap-minimal-business-schema.sql` 完成最小业务集合初始化 | `cms/sql/bootstrap-minimal-business-schema.sql` `docs/e2e-validation-log.md` | 后续补齐 `/collections` API 权限根因（不阻塞开发） |
| T05 | 五条写链路端到端联调留痕 | ✅ 已完成 | 5 条链路二次复测均返回 `source=directus`，并记录落库 ID | `docs/e2e-validation-log.md` `web/scripts/e2e-actions-smoke.sh` | 后续补截图与后台 UI 侧证据 |
| T06 | 内容读取链路切换到 Directus 优先 | ✅ 已完成（第一阶段） | 已补最小 `contents/topics/homepage_payload` 结构 + snake_case 到 camelCase 兼容映射；`/` `/contents` `/topics` `/requests` 均返回 200；本轮继续补上 `cms-client` 的服务端鉴权重试，公开读 `401/403` 时自动尝试带 token 读取；lint/build 通过 | `cms/sql/bootstrap-minimal-business-schema.sql` `web/src/lib/cms-client.ts` `docs/e2e-validation-log.md` | 后续继续补齐 Directus 侧 `contents/homepage_payload` 的 schema/permission 真值，减少 fallback 依赖 |
| T07 | 真实登录态接入（替换 mock user） | 🟨 进行中 | 已新增会话 API（cookie `qqt_uid`）与请求级 userId 解析；`/auth` 已升级为高保真登录界面，补齐账号体验/微信扫码入口、验证码体验、注册体验、当前会话识别、前置校验与状态反馈；本轮继续补齐 `POST /api/auth/session` 的 `user_profiles` 同步写入、`/api/me/profile` 资料更新接口与 `/me` 资料编辑表单，聚合读取改为优先走带鉴权的私有查询并按真实数据重算统计卡/资料卡/最近活动 | `web/src/app/api/auth/session/route.ts` `web/src/app/api/me/profile/route.ts` `web/src/lib/current-user.ts` `web/src/lib/account-service.ts` `web/src/components/auth-modal.tsx` `web/src/components/profile-settings-form.tsx` `cms/sql/bootstrap-minimal-business-schema.sql` | 接入微信扫码与真实账号体系，并在打开 `NEXT_PUBLIC_USE_DIRECTUS=true` 后完成 `/me` 的真实资料联调与 `user_profiles` 权限复验 |
| T08 | 抓取管道 MVP（主动+链接抓取） | ✅ 已完成（MVP） | 已落地脚本：单链接抓取、批量抓取、Directus 导入、去重、一键同步、失败日志、失败回放重试、cron 执行入口、来源级限速（delayMs）、失败告警（webhook）、结构化质量评分、来源健康度统计 | `scripts/crawl/fetch-url-to-json.mjs` `scripts/crawl/fetch-batch-from-list.mjs` `scripts/crawl/crawl-report-utils.mjs` `scripts/import/import-submissions-to-directus.mjs` `scripts/import/retry-failed-imports.mjs` `scripts/sync/crawl-and-import.mjs` `scripts/sync/run-crawl-cron.sh` `scripts/sync/notify-failures.mjs` | 后续补后台消费这些报告的可视化与人工复核面板 |
| T09 | 项目规范体系文档化（多 AI 约束） | ✅ 已完成 | 已新增 6 份约束文档并接入文档索引 | `docs/engineering-rules.md` `docs/ui-governance.md` `docs/content-data-contract.md` `docs/review-sop.md` `docs/ai-collaboration-protocol.md` `docs/release-checklist.md` | 在后续开发中按规范持续执行 |
| T10 | 首页卡顿防护（Directus 请求超时 + fallback） | ✅ 已完成 | 已为 CMS 读请求与 Directus 鉴权/写请求补充超时中断，避免首页长期转圈 | `web/src/lib/cms-client.ts` `web/src/lib/directus-auth.ts` | 跟进 T04/T05 做真实联调与证据回填 |
| T11 | 动作接口联调可观测性增强（directus/fallback 标识） | ✅ 已完成 | API 返回补充 `source/reason`，按钮文案可直接显示当前写入来源 | `web/src/lib/cms-types.ts` `web/src/lib/action-service.ts` `web/src/lib/mock-action-service.ts` `web/src/components/action-buttons.tsx` | 用于后续 T05 快速区分真实落库与回退 |
| T12 | 动作链路一键联调脚本 | ✅ 已完成 | 已新增 5 条动作链路 smoke 脚本并输出 `source/reason` | `web/scripts/e2e-actions-smoke.sh` | 用于每轮联调快速定位阻塞原因 |
| T13 | `/admin` 抓取报告可视化（最小版） | ✅ 已完成（增强版） | 后台可读取 `tmp/` 下最新 `_batch-report.json` 与 `_import-report.json`，展示来源健康度、质量均分、导入摘要、异常提示，并补充失败重试建议与导入失败样本 | `web/src/lib/crawl-report-service.ts` `web/src/components/admin-crawl-ops-panel.tsx` `web/src/app/admin/page.tsx` | 后续接 Directus/任务中心持久化与人工处理动作 |
| T14 | Directus 后台品牌与中文语言基线 | ✅ 已完成（本地实例） | 已将 Directus 项目名/描述/logo/favicon 对齐为 QiuQiuTech，并把默认语言与管理员语言切为 `zh-CN` | `cms/.env` `web/public/qiuqiutech-header-logo.png` `web/public/qiuqiutech-mark.png` Directus `/settings` `/users` | 后续将后台初始化改造成可重复执行脚本，供另一台电脑一键复现 |
| T15 | Directus 后台初始化脚本化（品牌/语言） | ✅ 已完成 | 已新增幂等脚本，一条命令即可复用品牌资源并写入 `project_name/project_descriptor/default_language/admin language` | `cms/scripts/apply-branding-and-language.mjs` `cms/README.md` `docs/directus-initialization-checklist.md` | 后续扩展到角色/权限/集合初始化全套脚本 |
| T16 | Directus 后台初始化脚本化（角色/策略基线） | ✅ 已完成 | 已新增角色/策略幂等脚本，并补一键基础初始化入口，可批量重放品牌/语言 + 角色/策略 | `cms/scripts/seed-roles-and-policies.mjs` `cms/scripts/init-local-foundation.mjs` `cms/README.md` `docs/directus-initialization-checklist.md` | 后续扩展到更细粒度 permissions、collections、seed data |
| T17 | Directus 后台基础基线自检脚本 | ✅ 已完成 | 已新增可执行校验脚本，可验证品牌/语言/角色/policy/access 是否到位，供另一台电脑执行初始化后快速自检 | `cms/scripts/verify-local-foundation.mjs` `cms/README.md` `docs/directus-initialization-checklist.md` | 后续扩展到 schema、collections、seed data 的完整自检 |
| T18 | 后台真实进展与占位边界梳理 | ✅ 已完成 | 已明确 `/admin` 中“最小审核流 + 抓取报告面板”为真实接通；顶部统计卡、左侧导航、展示位运营、运营备注属于静态占位/说明层，尚未接入真实数据与动作 | `web/src/app/admin/page.tsx` `web/src/components/admin-review-queue.tsx` `web/src/components/admin-crawl-ops-panel.tsx` `README.md` `docs/current-build-status.md` | 下一步按模块逐个接通展示位、标签、用户、认证与统计 |
| T19 | 前台首页样式加载兜底修复 | ✅ 已完成 | 已补运行时 CSS fallback，绕过 `/_next/static/css/app/layout.css` 404，恢复首页与频道页样式加载 | `web/src/lib/runtime-css-fallback.ts` `web/src/app/layout.tsx` | 继续观察 Next 16 产物路径是否稳定，必要时升级为更正式的构建层修复 |
| T20 | 后台中文化、品牌资源与外链修正 | ✅ 已完成 | 后台页面可见英文已收敛为中文；Directus 后台主 logo 改为“大鸟无文字”；tab/favicon 保持“仅鸟头”；合作申请默认作品链接改为站内 `/me`，避免跳到不可用外链 | `web/src/app/admin/page.tsx` `web/src/components/admin-review-queue.tsx` `web/src/components/admin-crawl-ops-panel.tsx` `web/src/components/latest-conversation-brief-dialog.tsx` `web/src/components/action-buttons.tsx` `cms/scripts/apply-branding-and-language.mjs` `cms/scripts/verify-local-foundation.mjs` | 后续继续排查新增模块中的外链来源与站内替代策略 |
| T21 | 前台站内搜索增强（筛选/排序/空态/弹出面板） | ✅ 已完成（增强版） | 已在现有内容服务层内补齐：弹出式搜索面板（点击头部搜索按钮弹出，不跳转全页）、实时搜索结果（防抖 300ms）、键盘导航（↑↓/Enter/ESC）、热门标签快速搜索；`/search` 页面保留用于全量结果查看；未引入 Directus 全文检索 | `web/src/components/site-search-panel.tsx` `web/src/components/site-shell.tsx` `web/src/app/search/page.tsx` `web/src/app/api/search/route.ts` | 后续接搜索联想、热词推荐与 Directus 全文检索 |
| T22 | 前后台 Tab icon 统一 | ✅ 已完成 | 前台首页 Chrome Tab icon 与 Directus 后台 Tab icon 已统一为同一套“仅鸟头”图标；已同时替换 Next 文件级 icon 资源（`web/src/app/favicon.ico` `web/src/app/icon.png` `web/src/app/apple-icon.png`）与前端 metadata 图标引用，解决前端鸟头尺寸和透明底不一致问题 | `web/src/app/layout.tsx` `web/src/app/favicon.ico` `web/src/app/icon.png` `web/src/app/apple-icon.png` `web/public/qiuqiutech-tab-icon.png` `web/public/qiuqiutech-bird-mark.png` | 后续如再替换品牌资源，需保持前后台 Tab icon 同源 |
| T23 | 公开前台开发语境泄漏治理 | ✅ 已完成 | 已将“公开前台不得暴露内部开发状态、账户流程必须按用户任务组织”上升为系统级硬约束，并同步到工程规则、UI 规则、AI 协作协议、README 与交接文档 | `docs/engineering-rules.md` `docs/ui-governance.md` `docs/ai-collaboration-protocol.md` `README.md` `web/README.md` `docs/current-build-status.md` `docs/ai-handoff.md` `docs/README.md` | 后续新增公开页面时按该约束做设计与评审 |
| T24 | 首页 Hero 与登录页语言系统统一 | ✅ 已完成 | 首页麦当劳案例位已重构为真实 Hero 轮播，改用浮动箭头切换；标签规则收敛为“一个主类型标签 + 两个以内主题标签 + 一句辅助说明”，并继续将首页主视觉、策略主题、投稿与合作区块的语气和层级向 `/auth` 对齐 | `web/src/components/home-hero-carousel.tsx` `web/src/app/page.tsx` `README.md` `web/README.md` `docs/current-build-status.md` `docs/ai-handoff.md` | 继续将首页其余模块与频道页做同一套展示语言收口 |

## 最新更新流水

### 2026-05-08 09:50 (UTC+8)

- 完成：任务管理机制切换为“单一真值 + 实时流水”。
- 完成：新增本文件并将其设为 To Do 状态主锚点。
- 影响：后续多 AI 并行时，任务拆分与状态不会分散在多个文档里。

### 2026-05-08 10:05 (UTC+8)

- 完成：新增 6 份规范文档并纳入 `docs/README.md` 索引。
- 完成：新增任务 `T09` 并标记为完成，作为后续协作执行基线。

### 2026-05-08 10:45 (UTC+8)

- 完成：首页卡顿修复，新增 Directus/CMS 请求超时保护（6s）并保留 fallback。
- 验证：`npm --prefix web run lint`、`npm --prefix web run build` 均通过。

### 2026-05-08 11:12 (UTC+8)

- 完成：Directus 本地实例拉起，`/server/health` 与管理员登录验证通过。
- 阻塞：业务集合自动创建接口返回 `FORBIDDEN`，已把 T04 状态调整为阻塞并写入联调日志。

### 2026-05-08 12:06 (UTC+8)

- 完成：动作 API 增加 `source/reason` 响应字段，联调可直接识别 `directus` 还是 `fallback`。
- 完成：前台动作按钮回显写入来源，降低联调误判成本。

### 2026-05-08 12:20 (UTC+8)

- 完成：新增 `web/scripts/e2e-actions-smoke.sh`，可一键验证 5 条动作链路并输出 `source/reason`。
- 新发现：当前 fallback 主因之一是 `DIRECTUS_STATIC_TOKEN` 过期（`TOKEN_EXPIRED`），已同步到联调日志与 README。

### 2026-05-08 12:28 (UTC+8)

- 完成：落地 `cms/sql/bootstrap-minimal-business-schema.sql`，解除本地联调阻塞。
- 完成：5 条动作链路二次复测全部 `source=directus`，T05 由进行中改为完成。

### 2026-05-08 12:40 (UTC+8)

- 完成：扩展 SQL bootstrap，新增 `contents/topics/homepage_payload` 最小结构与种子数据。
- 完成：`cms-client` 增加 snake_case -> camelCase 兼容映射，提升 Directus 读链路稳定性。

### 2026-05-08（本轮）

- 完成：`npm --prefix web run lint`、`npm --prefix web run build` 再次通过。
- 完成：动作链路 smoke 复测 5/5，全部 `source=directus`。
- 完成：读链路页面连通性复测，`/`、`/contents`、`/topics`、`/requests` 均为 `200`。
- 完成：T07 第一阶段，新增 `POST/DELETE /api/auth/session`（cookie 会话）并将关键写链路改为“请求用户优先”。
- 完成：新增后再次执行 `npm --prefix web run lint` 与 `npm --prefix web run build`，均通过。
- 完成：登录页最小闭环落地（登录写 cookie -> 跳转 `/me` -> 可退出登录），并再次通过 lint/build。
- 完成：T08 第一阶段，新增抓取脚本（链接抓取/批量抓取/导入待审核池），并实测导入 `submissions.id=4`。
- 完成：T08 补充去重与一键同步脚本，复测结果 `skip duplicate -> id=4`，新增导入 `id=5`。
- 完成：T08 补充失败回放重试脚本与 cron 入口脚本，已验证 cron 执行可正常抓取并执行去重导入。
- 完成：T08 增加来源级限速参数（`delayMs`）与失败告警脚本（`notify-failures`），并完成 cron 联调验证。
- 完成：T08 补齐结构化抓取质量评分与来源健康度统计，单条结果新增 `quality` 字段，批量抓取新增 `_batch-report.json`，导入新增 `_import-report.json`。
- 验证：执行 `node scripts/crawl/fetch-url-to-json.mjs --url=https://socialbeta.com/ --out=tmp/crawl-verify/one.json` 与 `node scripts/crawl/fetch-batch-from-list.mjs --list=scripts/crawl/sources.sample.txt --outDir=tmp/crawl-verify/batch --delayMs=10`，确认评分与健康度报告均生成成功。
- 完成：T13 最小版抓取报告面板接入 `/admin`，可直接消费最新批次与导入报告并显示来源健康度、质量均分、导入结果与异常摘要。
- 验证：`npm --prefix web run lint`、`npm --prefix web run build` 通过；`/admin` 构建为动态页面并保留服务端按需读取报告能力。
- 完成：前台开发环境修复，`npm run dev` 切换为 `next dev --webpack`，规避路径迁移后 Turbopack 对旧 `.next` 目录的 HMR 写入异常。
- 验证：清理 `web/.next` 后重启 dev server，`HEAD /`、`HEAD /contents`、`GET /` 均返回 `200`；首页标题已调整为 `QiuQiuTech`。
- 完成：T14 本地 Directus 后台品牌/语言基线对齐，`project_descriptor` 改为“球球科技后台管理系统”，`default_language` 与管理员 `language` 已切为 `zh-CN`。
- 验证：Directus `/settings` 返回 `project_name=QiuQiuTech`、`project_descriptor=球球科技后台管理系统`、`default_language=zh-CN`；管理员用户 `language=zh-CN`。
- 完成：首页标签页标题逻辑参考 SocialBeta 收敛：首页改为“品牌名｜核心定位”，内页保留“页面名 | 品牌名”。
- 验证：`https://socialbeta.com/` 返回 `<title>SocialBeta｜专注品牌营销实践和趋势研究</title>`；`https://socialbeta.com/about` 返回 `<title>关于我们 | SocialBeta</title>`；本地首页返回 `<title>QiuQiuTech｜营销行业实时洞察与合作对接平台</title>`，内容页返回 `<title>内容中心 | QiuQiuTech</title>`。
- 完成：T15 新增 `cms/scripts/apply-branding-and-language.mjs`，并接入 `cms/README.md` 与 `docs/directus-initialization-checklist.md`。
- 验证：执行 `node cms/scripts/apply-branding-and-language.mjs` 输出 `success=true`，并返回 `project_name=QiuQiuTech`、`project_descriptor=球球科技后台管理系统`、`default_language=zh-CN`、`admin_language=zh-CN`。
- 完成：T16 新增 `cms/scripts/seed-roles-and-policies.mjs` 的正式验证与文档接入，并新增 `cms/scripts/init-local-foundation.mjs` 作为本地后台基础初始化入口。
- 验证：执行 `node cms/scripts/seed-roles-and-policies.mjs` 返回 `success=true`，并创建/复用 `Member`、`Verified Member`、`Operator` 及对应 policy/access；执行 `node cms/scripts/init-local-foundation.mjs` 可顺序重放品牌/语言与角色/策略基线。
- 完成：T17 新增 `cms/scripts/verify-local-foundation.mjs`，并接入 CMS README 与 Directus 初始化清单，作为另一台电脑执行初始化后的标准自检入口。
- 验证：执行 `node cms/scripts/verify-local-foundation.mjs` 返回 `success=true`、`failedCount=0`，确认品牌/语言/角色/policy/access 基线均已对齐。
- 完成：前台与后台品牌资源进一步替换为用户提供的透明底 logo；前台头部保留“鸟头 + 文字”，后台主 logo 调整为“大鸟无文字”，tab / favicon / app icon 改为“仅鸟头”。
- 验证：已替换 `web/public/qiuqiutech-brand-lockup.png`、`web/public/qiuqiutech-admin-logo.png`、`web/public/qiuqiutech-bird-mark.png`，并重跑 `node cms/scripts/apply-branding-and-language.mjs`；后台当前 `project_logo=qiuqiutech-admin-logo.png`、`public_favicon=qiuqiutech-bird-mark.png`，`node cms/scripts/verify-local-foundation.mjs` 返回 `success=true`、`failedCount=0`。

### 2026-05-08 22:20 (UTC+8)

- 完成：补充后台真实进展边界说明，明确 `/admin` 当前仅有“最小审核流”和“抓取报告面板”为真实接通，其余统计卡、导航、展示位、备注仍为静态占位。
- 完成：修复首页样式丢失问题，在根布局中接入运行时 CSS fallback，兜底 `/_next/static/css/app/layout.css` 404 导致的无样式渲染。
- 完成：后台页面可见英文收敛为中文；Directus 后台主 logo 默认值切换为“大鸟无文字”版本，自检脚本同步校验新文件名。
- 完成：修复合作申请默认作品集链接，避免跳到当前不可用的站外地址 `https://qiuqiutech.com/portfolio`。
- 验证：执行 `npm --prefix web run lint`、`npm --prefix web run build` 通过；`node cms/scripts/apply-branding-and-language.mjs` 与 `node cms/scripts/verify-local-foundation.mjs` 均成功；已重启 `127.0.0.1:3000` 并确认首页返回新的 CSS fallback 链接 `/_next/static/chunks/12h3xidcg~gw5.css`。

### 2026-05-08 22:42 (UTC+8)

- 完成：确认前台头部搜索框此前是纯静态占位，不是 bug；现已替换为真实搜索表单。
- 完成：新增 `/search` 页面，支持通过 `q` 参数搜索内容、专题与合作需求三类结果。
- 完成：搜索结果当前走现有内容服务层关键词匹配，作为第一阶段最小版，避免阻塞前台继续使用。

### 2026-05-08（本轮继续）

- 完成：升级 `/auth` 登录界面，保留最小会话闭环的同时提升为高保真结构，补齐账号体验/微信扫码双入口、体验账号快捷填充、前置校验与状态反馈。
- 完成：同步更新 `README.md`、`web/README.md`、`docs/ai-handoff.md`、`docs/current-build-status.md`、`docs/README.md` 的登录页状态描述。
- 验证：待执行 `npm --prefix web run lint` 与 `npm --prefix web run build`。

### 2026-05-08（本轮继续 2）

- 完成：`/api/auth/session` 新增 `GET`，用于当前会话识别；`/auth` 补齐验证码体验、注册体验与会话清理入口。
- 完成：定位“前端打不开”问题，确认页面服务本身可达；已清理残留 `next build` 锁进程，并将前端重新拉起到 `http://127.0.0.1:3000`。
- 验证：`curl -I http://127.0.0.1:3000`、`curl -I http://127.0.0.1:3000/auth`、`curl -I http://127.0.0.1:3000/me` 返回 `200`；`GET/POST /api/auth/session` 正常；`npm --prefix web run lint`、`npm --prefix web run build` 通过。

### 2026-05-08（本轮继续 3）

- 完成：按 C 端展示优先收瘦 `/auth`，删除过多说明卡片与“内部过程式”表达，保留核心登录动作与少量价值信息。
- 完成：文案从“联调说明页”调整为更偏产品入口表达，弱化对标平台同质感，突出“内容判断 + 合作机会 + 个人工作台”的差异化。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 4）

- 完成：重构 `/auth` 信息架构，顶层改为“直接登录 / 去注册”双入口，不再把注册和登录方式混在同一组 tab 里。
- 完成：登录内部仅保留三种方式切换：账号密码、手机验证码、微信扫码；注册流程独立为单独表单。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 5）

- 完成：优化登录区视觉层级，将三种登录方式从普通 tab 收敛为更清晰的选择卡片，并补充简短辅助说明。
- 完成：下压体验账号权重，将其整理为底部辅助区，避免抢占主登录流程注意力。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 6）

- 完成：补齐登录/注册两侧的引导文案与底部互跳入口，让用户更容易判断“现在该登录还是先注册”。
- 完成：为账号密码、手机验证码、微信扫码三种方式分别补充适用说明，减少功能切换带来的理解成本。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 7）

- 完成：继续收敛 `/auth` 的开发痕迹，移除体验账号展示区，弱化“账号标识/团队名”等容易干扰 C 端理解的表达。
- 完成：进一步朝“逻辑清晰、结构克制”的公开站登录入口靠拢，保持参考思路但不照搬对标平台样式。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 8）

- 完成：继续打磨 `/auth` 的上线感，优化左右两栏的排版节奏、分隔关系、表单分区标题与次级说明层。
- 完成：让右侧更像单一任务登录面板，左侧更像品牌引导区，减少“组件拼装感”。
- 验证：再次执行 `npm --prefix web run lint`、`npm --prefix web run build`，均通过。

### 2026-05-09（本轮）

- 完成：将“开发态/测试态/内部态信息外露”定义为系统级问题并做审计，优先清理公开前台的 `/auth` 与 `/me`。
- 完成：`/auth` 移除显眼会话条、开发式字段表达与旧组件残留；`/me` 移除会话 ID 暴露；后台审核台把 `mock/admin-mock/fallback` 改为业务可理解提示。
- 完成：删除旧副本 `web/src/components/auth-modal 2.tsx`，同步移除未使用的登录演示常量，降低后续回弹风险。
- 验证：执行 `npm --prefix web run lint`、`npm --prefix web run build` 通过；再次搜索公开前台可见残留词，`体验账号 / auth-modal 2 / 账号标识 / 会话 ID / admin-mock / mock 审核队列 / 当前已登录` 已清空或仅保留为合理业务表达。

### 2026-05-09 09:35 (UTC+8)

- 完成：把“公开前台不得暴露内部开发状态、账户流程必须按用户任务组织”正式升级为系统级硬约束。
- 完成：规则已同步写入 `docs/engineering-rules.md`、`docs/ui-governance.md`、`docs/ai-collaboration-protocol.md`、`README.md`、`web/README.md`、`docs/current-build-status.md`、`docs/ai-handoff.md`、`docs/README.md`。
- 结果：后续不止登录页，首页、用户中心、投稿、合作、审核相关公开触点也都必须按该原则开发与评审。

### 2026-05-09 11:20 (UTC+8)

- 完成：首页麦当劳案例位从静态大卡改为真实 Hero 轮播，采用浮动箭头切换，不再保留底部伪轮播按钮。
- 完成：首页主视觉标签规则收敛为“一个主类型标签 + 两个以内主题标签 + 一句辅助说明”，清理 `label / tags / summary` 的重复表达。
- 完成：首页的主视觉、策略主题、用户投稿、合作广场等模块语气继续向 `/auth` 的品牌引导区 + 任务面板语言系统对齐，减少 demo 感和中英混杂感。
- 完成：同步更新 `README.md`、`web/README.md`、`docs/current-build-status.md`、`docs/ai-handoff.md` 的首页状态说明。
- 验证：执行 `npm --prefix web run lint` 与 `npm --prefix web run build`，均通过；本地 `http://127.0.0.1:3000` 服务端渲染已包含新的 Hero 轮播结构与箭头切换按钮。

### 2026-05-09 12:40 (UTC+8)

- 完成：新增 `docs/Latest-conversation-brief.md`，作为下一位 AI 的最短接棒入口。
- 完成：整理并同步 `docs/ai-handoff.md`、`docs/current-build-status.md`、`docs/Git-sync-handoff-brief.md`、`docs/README.md`，统一为 `QiuQiuTech Frontend Experience Workbench` 的命名与口径。
- 完成：在根 `README.md` 与 `web/README.md` 补入 `Latest-conversation-brief` 入口，缩短接棒路径。

### 2026-05-09（本轮继续）

- 完成：补齐多 AI 接手执行契约，新增 `docs/AI-Execution-Contract.md`（一票否决项、必更文档清单、最小验证门槛、统一回报格式）。
- 完成：修正文档绝对路径到统一根变量 `$QIQIUTECH_ROOT`，避免其他 AI 点击路径失效。
- 完成：新增 `scripts/validate-handoff.sh` 一键校验（路径可移植 + lint + build）并实测通过。

### 2026-05-08 22:58 (UTC+8)

- 完成：前台首页 Chrome Tab icon 与 Directus 后台 Tab icon 对齐统一，前后台当前都收敛为“仅鸟头”图标。
- 完成：前端彻底移除旧 `favicon.ico` 链路，改为透明 64x64 PNG `qiuqiutech-tab-icon.png`，解决前端鸟头大小与透明底不一致问题。
- 完成：补齐 Next 文件级图标资源替换，`web/src/app/favicon.ico` 与 `web/src/app/icon.png` / `apple-icon.png` 现已统一为透明 64x64 鸟头资源。

### 2026-05-08 22:40 (UTC+8)

- 完成：并行推进 T03 子任务，`/api/admin/*/review` 已注入请求级操作者（`qqt_uid` cookie 优先），不再固定写入 `admin-mock`。
- 完成：审核服务返回 `reviewedBy/reviewedAt`，审核台前端已消费服务端返回值刷新操作者与时间。
- 验证：`npm --prefix web run lint` 通过；`npm --prefix web run build` 当前受 Next 构建进程信号中断影响（退出码 `143`），待清理环境后复验。

### 2026-05-09 17:32 (UTC+8)

- 完成：T21 搜索升级为弹出式搜索面板（`SiteSearchPanel` 组件），点击头部"搜索"按钮弹出下方面板，不跳转全页。
- 完成：新增实时搜索（防抖 300ms）、键盘导航（↑↓/Enter/ESC）、热门标签快速搜索、结果分类标签（内容/专题/合作）。
- 完成：头部搜索展示形式继续向 SocialBeta 收敛，改为纯“搜索”入口按钮 + 展开层标题 / 输入框 / 深色搜索按钮 / 热门搜索结构。
- 更新：`docs/current-build-status.md` 搜索部分与 T21 任务描述。
- 验证：`curl http://127.0.0.1:3000/` 返回 `200`。

### 2026-05-08 22:41 (UTC+8)

- 完成：认领并完成 T21 增强版子任务，`/search` 新增筛选计数、排序、分组空态建议与全局空结果引导。
- 完成：`site-search-form` 补移动端样式优化（自适应输入宽度、显式“搜索”按钮、移动端提示文案）。
- 验证：`npm --prefix web run lint`、`npm --prefix web run build` 均通过；`curl -I http://127.0.0.1:3000/search?q=联名` 与 `curl -I http://127.0.0.1:3000/search?q=联名&type=contents&sort=latest` 均返回 `200`。

### 2026-05-08（本轮收尾）

- 完成：收尾并发子任务，T03 从“进行中”升级为“已完成（增强版）”，审核台补齐批量通过/拒绝、驳回原因、审核说明展示、中文操作日志与请求级操作者透传。
- 完成：T13 同步增强，抓取报告面板新增失败重试建议与导入失败样本区，方便人工处理失败导入。
- 验证：再次执行 `npm --prefix web run lint` 与 `npm --prefix web run build`，均通过。

### 2026-05-08（本轮继续 T07）

- 完成：为本地最小业务 schema 补齐 `user_profiles` 表、Directus collection 注册与管理员权限，bootstrap 现已覆盖真实用户资料基础表。
- 完成：升级 `POST /api/auth/session`，登录/注册时除写入 `qqt_uid` 外，还会在 Directus 模式下同步 `user_profiles` 最小资料（昵称、手机号、来源、城市/机构预留）；注册面板已补可选“所属机构 / 所在城市”输入。
- 完成：`/me` 的 `account-service` 改为优先走带鉴权的私有聚合查询，减少因 public permission 不足导致整个用户中心直接回退 mock；同时按真实聚合结果重算统计卡、资料卡、最近活动与快捷动作。
- 完成：新增 `PATCH /api/me/profile` 与 `/me` 资料编辑表单，当前可维护昵称、身份、机构、城市、联系方式策略与简介。
- 验证：`npm --prefix web run lint`、`npm --prefix web run build` 通过；`curl -s -c /tmp/qqt-cookies.txt -H 'Content-Type: application/json' -d '{"userId":"codex-smoke","displayName":"Codex Smoke","phone":"13800001234","authSource":"register"}' http://127.0.0.1:3000/api/auth/session` 返回 `{"ok":true,...}`；随后 `curl -s -b /tmp/qqt-cookies.txt http://127.0.0.1:3000/api/auth/session` 返回 `isLoggedIn=true`。
- 验证：重新拉起 `http://127.0.0.1:3000` 的 `next dev --webpack` 后，`curl -s -b /tmp/qqt-cookies.txt -H 'Content-Type: application/json' -X PATCH -d '{"displayName":"Codex Smoke Updated","roleType":"agency","companyName":"QiuQiuTech Ops","city":"上海","bio":"负责内容运营与合作推进。","contactPolicy":"apply_only"}' http://127.0.0.1:3000/api/me/profile` 返回 `ok=true`，并因 `user_profiles` 当前返回 `403 FORBIDDEN` 自动回退为 `source=fallback`。
- 备注：当前本地新开发服务已重启到 `http://127.0.0.1:3000`；`/api/me/profile` 已生效。当前 `/api/me/profile` 的 smoke 命中 `user_profiles` 权限/集合问题后会按设计回退 fallback，`/api/me/dashboard` 在 `NEXT_PUBLIC_USE_DIRECTUS=false` 下仍会继续返回 mock 兜底数据。
