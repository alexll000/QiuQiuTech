# AI Handoff

## 当前项目定位

QiuQiuTech 是一个：

- 营销内容聚合平台
- 用户投稿审核发布平台
- 品牌 / 市场人合作对接平台

当前阶段不是最终上线版，而是：

**高保真前台框架 + 数据契约层 + Directus 接入前准备阶段。**

> 2026-05-07 晚间补充：已补齐“投稿草稿”和“合作申请”两条写入链路的前台表单与 Directus 落库骨架（失败可回退 mock）。
> 2026-05-07 晚间继续补充：收藏切换与通知全部已读也已接入 Directus 写入（同样保留 fallback）。
> 2026-05-07 晚间继续补充：`/me` 已支持“单例优先 + 多集合聚合”读取策略，降低对 `user_dashboard` 单例的依赖。
> 2026-05-07 晚间继续补充：`/requests` 已支持“发布合作需求草稿”表单与 API（`/api/requests/drafts`），可直接入 `partnership_requests` 的 `draft`。
> 2026-05-07 晚间继续补充：后台最小审核流已上线（审核动作 API + 审核队列 API + `/admin` 队列操作台），并支持 Directus 优先与 fallback。
> 2026-05-09 本轮补充：`web/` 已接入 Storybook 10 与 shadcn-compatible 基线，前端开发统一走 `QiuQiuTech Frontend Experience Workbench`，后续不只沉淀 UI，也同步沉淀页面结构、状态设计、CTA 主次和用户路径。

## 当前前端已具备

### 页面

- 首页
- 内容中心
- 营销事件
- 玩法拆解
- 专题策展
- 合作对接
- 投稿中心
- 榜单趋势
- 登录
- 用户中心
- 后台入口

### 服务层

- `content-service.ts`
- `account-service.ts`
- `workflow-service.ts`
- `action-service.ts`
- `directus-auth.ts`（新增：写入链路鉴权）

### Frontend Experience Workbench

- `.storybook/main.ts`
- `.storybook/preview.ts`
- `components.json`
- `src/lib/utils.ts`
- `src/components/ui/button.tsx`
- `src/components/ui/button.stories.tsx`
- `src/components/platform-ui.stories.tsx`
- `src/stories/foundations.stories.tsx`
- `src/components/ui/form-controls.stories.tsx`
- `src/components/site-search-form.stories.tsx`
- `src/components/forms-workbench.stories.tsx`
- `src/components/home-hero-carousel.stories.tsx`

### 本地 API 契约

- `/api/auth/session`
- `/api/me/dashboard`
- `/api/me/saved-items/toggle`
- `/api/me/notifications/read`
- `/api/submissions/drafts`
- `/api/requests/drafts`
- `/api/requests/[slug]/apply`
- `/api/admin/submissions/[id]/review`
- `/api/admin/requests/[id]/review`
- `/api/admin/submissions/review-queue`
- `/api/admin/requests/review-queue`
- `/api/workflows/submission-center`
- `/api/workflows/request-application`

## 当前设计约束

最高设计约束：

- 高级感优先

同时保持：

- 简约
- 时尚
- 专业
- 内容平台气质

补充的高优先级产品约束：

- 公开前台禁止暴露开发态、测试态、联调态、内部态信息。
- 账户相关页面必须先按用户任务组织，再区分具体实现方式。
- `mock/fallback/admin-mock/会话 ID/账号标识/体验账号` 这类内部语义不得直接出现在 C 端界面。
- 发现此类问题时，按系统级错误处理，不按普通文案瑕疵处理。

补充：

- 首页、列表页、详情页、登录页、投稿页不只审视觉，也一起审页面结构、状态设计、CTA 主次和用户路径。
- 这一套口径已经固化为 `QiuQiuTech Frontend Experience Workbench`，后续 AI 接手时直接沿用该系统名。

## 当前数据约束

- 栏目类型、合作类型这类 taxonomy 可以固定
- 内容标签、合作标签、趋势标签不能写死
- 标签展示应优先来自发布时录入的数据或 CMS 返回数据

## 后续接手优先顺序

1. 继续做首页第二轮收口，把首页剩余模块统一到同一套前端体验语言和层级
2. 把 `auth / submit / requests` 的关键页面状态继续纳入 `QiuQiuTech Frontend Experience Workbench`
3. 起 Directus 本地实例并继续补 schema/permission 真值
4. 打开 `NEXT_PUBLIC_USE_DIRECTUS=true` 验证读链路（首页/内容/专题/合作）
5. 验证写链路（投稿草稿 / 合作申请 / 收藏切换 / 通知已读 / 合作需求草稿）
6. 将抓取报告升级为可持久化任务中心与人工处理动作

## 接手前先读

1. [README.md](README.md)
2. [web/README.md](web/README.md)
3. [current-build-status.md](docs/current-build-status.md)
4. [directus-collections-matrix.md](docs/directus-collections-matrix.md)
5. [data-model.md](docs/data-model.md)

## To Do 状态同步锚点（新增）

最后同步：2026-05-09 12:40 (UTC+8)

- 任务拆分、实时进展、并行认领以 [todo-live.md](docs/todo-live.md) 为唯一真值源

- 根 `README.md` 已新增「To Do 状态看板（README 对齐版）」并作为任务状态真值源
- `web/README.md` 已新增对齐状态区块
- 根 `README.md` 与 `web/README.md` 已新增“每轮常规动作（必须执行）”
- 根 `README.md` 与 `web/README.md` 已将“审核流 API（最小版）”与“`/admin` 最小审核台”更新为 `✅`
- 联调记录模板已新增：`docs/e2e-validation-log.md`
- 浏览器本地预览已验证可用：`http://127.0.0.1:3000`
- 已补首页稳定性修复：`cms-client.ts` 与 `directus-auth.ts` 增加 6 秒超时保护，避免首页长时间 loading
- Directus 当前状态：实例可用、管理员可登录；已通过 `cms/sql/bootstrap-minimal-business-schema.sql` 完成本地最小业务集合初始化，5 条动作链路均可真实落库（`source=directus`）
- 本轮验证补充：`npm --prefix web run lint` 与 `npm --prefix web run build` 通过；`/` `/contents` `/topics` `/requests` 连通性复测均返回 `200`
- 本轮开发补充：已落地最小会话层（`POST/DELETE /api/auth/session`），`/api/me/*` 与动作写链路改为“请求用户优先（cookie `qqt_uid`）”
- 本轮开发补充：`/auth` 已接最小登录动作（写 cookie 后跳转 `/me`），`/me` 已接退出登录按钮
- 本轮开发补充：`/auth` 已升级为高保真登录界面，补齐账号体验/微信扫码双入口、体验账号快捷填充、前置校验与状态反馈，同时保留最小会话层边界说明
- 本轮开发补充：`/api/auth/session` 已新增 `GET`，`/auth` 已补验证码体验、注册体验、当前会话识别与会话清理入口
- 本轮环境处理补充：前端已重新拉起到 `http://127.0.0.1:3000`；已清理残留 `next build` 锁进程并完成 `lint/build` 回归
- 本轮体验补充：`/auth` 已按 C 端入口收瘦，删减过多说明层与内部联调话术，保留更轻量的登录动作与差异化价值表达
- 本轮结构补充：`/auth` 已改为“直接登录 / 去注册”双入口；登录内部再分账号密码、手机验证码、微信扫码三种方式，注册流程不再混入登录 tab
- 本轮体验补充：`/auth` 已补顶部说明、方式说明与底部互跳引导，降低登录/注册决策成本
- 本轮收口补充：`/auth` 已移除体验账号展示区，进一步弱化开发痕迹与内部表达，整体更接近公开站登录入口
- 本轮视觉补充：`/auth` 已继续优化排版节奏与分区关系，左侧更偏品牌引导，右侧更偏单一任务登录面板
- 本轮规则补充：已将“公开前台不得暴露内部开发状态，账户流程必须按用户任务组织”写入 `docs/engineering-rules.md`、`docs/ui-governance.md`、`docs/ai-collaboration-protocol.md`、`README.md` 与 `web/README.md`
- 本轮前端体验基线补充：`web/` 已接入 Storybook 10、品牌 token story、按钮 primitive story、表单控件 story、搜索 story、表单工作台 story 与首页 Hero story；后续关键前端变更默认要先落到 `QiuQiuTech Frontend Experience Workbench` 再接页面
- 本轮首页第二轮补充：首屏逻辑已进一步朝“看什么 / 升温什么 / 去哪里行动”收口，首页不再只是视觉展示页，而是更明确的产品入口
- 本轮首页补充：麦当劳案例位已从静态大卡重构为真实 Hero 轮播，采用浮动箭头切换；标签规则已收敛为“一个主类型标签 + 两个以内主题标签 + 一句辅助说明”，并继续向 `/auth` 的语言系统对齐
- 本轮开发补充：T08 第一阶段已落地抓取脚本链路（单链接抓取/批量抓取/导入 Directus 待审核池/一键同步），并实测写入 `submissions.id=4/5`（含去重）
- 本轮开发补充：T08 已补失败重试脚本与 cron 入口（`retry-failed-imports.mjs` / `run-crawl-cron.sh`），可执行定时抓取与失败回放
- 本轮开发补充：T08 已补来源级限速（`delayMs`）与失败告警脚本（`notify-failures.mjs`，支持 webhook 或 dry-run）
- 本轮开发补充：T08 已补结构化质量评分与来源健康度统计；单条抓取结果新增 `quality`，批量抓取输出 `_batch-report.json`，导入输出 `_import-report.json`
- 本轮开发补充：T13 已补 `/admin` 抓取报告面板（最小版），可直接读取最新 `_batch-report.json` / `_import-report.json` 并展示来源健康度、质量均分、导入摘要与异常提示
- 本轮开发补充：本地 `web` 开发模式已切换为 `webpack`，规避路径迁移后 Turbopack 对旧 `.next` 目录的 HMR 写入异常；首页标题已调整为 `QiuQiuTech`
- 本轮开发补充：T14 已完成本地 Directus 后台品牌与中文语言基线，项目名/logo/favicon 与 `default_language`、管理员 `language` 已切为 QiuQiuTech / `zh-CN`
- 本轮开发补充：首页标题逻辑已参考 SocialBeta 收敛：首页为“品牌名｜核心定位”，内页保留“页面名 | 品牌名”
- 本轮开发补充：T15 已完成第一阶段 Directus 初始化脚本化，`node cms/scripts/apply-branding-and-language.mjs` 可重放后台品牌与中文语言基线
- 本轮开发补充：T16 已完成第一阶段 Directus 角色/策略基线脚本化，`node cms/scripts/seed-roles-and-policies.mjs` 可创建/复用 `Member`、`Verified Member`、`Operator` 与对应 policy/access
- 本轮开发补充：已新增 `node cms/scripts/init-local-foundation.mjs`，可一键串行重放后台品牌/语言与角色/策略基线
- 本轮开发补充：T17 已完成本地后台基础基线自检脚本，`node cms/scripts/verify-local-foundation.mjs` 可校验品牌/语言/角色/policy/access 是否全部到位
- 本轮开发补充：已替换透明底品牌资源；前台头部使用“鸟头 + 文字”，后台主 logo 使用“大鸟无文字”，tab / favicon 使用“仅鸟头”，并同步到 `apply-branding-and-language.mjs`
- 本轮开发补充：前台首页 Chrome Tab icon 与 Directus 后台 Tab icon 已统一；前端文件级 icon（`web/src/app/favicon.ico` `icon.png` `apple-icon.png`）与 metadata icon 均已改为透明 64x64 鸟头输出，解决前端鸟头大小和透明底不一致问题
- 本轮开发补充：首页无样式问题已确认根因是 Next 注入 `/_next/static/css/app/layout.css` 返回 404，当前已在 `web/src/app/layout.tsx` 接入运行时 CSS fallback 兜底
- 本轮开发补充：`/admin` 的真实可用范围已补清楚，当前只有“最小审核流”和“抓取报告面板”为真实接通，其余大块为静态占位说明层
- 本轮开发补充：合作申请默认作品集地址已改为站内 `/me`，避免跳到不可用站外地址
- 本轮开发补充：站内搜索已从最小版推进到增强版（仍基于现有内容服务层）：新增类型筛选计数、排序、分组空态建议、全局空结果引导，以及移动端搜索入口样式优化
- 本轮开发补充：T03 已收尾完成增强版，`/admin` 审核台现支持批量通过/拒绝、驳回原因、审核说明展示、中文操作日志与请求级操作者透传
- 本轮开发补充：T13 已继续增强，抓取报告面板新增失败重试建议与导入失败样本区
- 本轮验证补充：再次执行 `npm --prefix web run lint` 与 `npm --prefix web run build`，均通过
- 本轮开发补充：T07 继续推进，`POST /api/auth/session` 在 Directus 模式下已支持同步 `user_profiles` 最小资料，`/auth` 注册面板已补可选“所属机构 / 所在城市”，`/me` 聚合读取已改为优先走带鉴权的私有查询
- 本轮验证补充：`curl -s -c /tmp/qqt-cookies.txt -H 'Content-Type: application/json' -d '{"userId":"codex-smoke","displayName":"Codex Smoke","phone":"13800001234","authSource":"register"}' http://127.0.0.1:3000/api/auth/session` 返回 `ok=true`；随后 `curl -s -b /tmp/qqt-cookies.txt http://127.0.0.1:3000/api/auth/session` 返回 `isLoggedIn=true`
- 本轮环境边界补充：当前运行中的本地服务仍是 `NEXT_PUBLIC_USE_DIRECTUS=false`，所以 `/api/me/dashboard` 仍会返回 mock 兜底数据；打开 Directus 开关后可继续验证真实用户资料链路
- 本文档与 `current-build-status.md` 的任务描述应与根 README 状态保持一致
- 若出现冲突，先更新根 `README.md`，再同步其余文档
