# QiuQiuTech Web

这是 QiuQiuTech 当前实际开发中的前端工程。

最短接棒入口：

- [docs/Latest-conversation-brief.md](../docs/Latest-conversation-brief.md)

它基于：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- App Router
- Storybook 10
- shadcn-compatible primitives

## 这部分代码现在负责什么

当前 `web/` 负责：

- 前台整站框架
- 首页主视觉与频道页高保真方向稿
- SEO 基础设施（metadata / robots / sitemap / JSON-LD）
- 内容 / 事件 / 玩法 / 专题 / 对接 / 投稿 / 榜单 / 登录 / 用户中心 / 后台入口页面
- 基础详情页演示
- 品牌色、导航、页脚和平台级页面骨架组件
- 本地 API 契约路由，用于承接账户工作台与流程蓝图
- 投稿草稿表单与合作申请表单（前台可填写并提交到本地 API）

当前 `web/` 还**不负责**：

- 真实数据库
- 抓取任务执行
- 真实登录态
- 真实 API

## 前台高优先级约束

`web/` 是公开前台工程，因此以下规则优先级极高：

- 任何公开页面都不能把开发态、测试态、联调态、内部态信息直接展示给用户。
- 登录/注册/用户中心的结构必须先按用户任务组织，再区分具体方式，不能把技术入口混在主流程里。
- `mock`、`fallback`、`admin-mock`、`会话 ID`、`账号标识`、体验账号等词汇不得直接进入 C 端文案。
- fallback、mock、降级逻辑允许保留在实现层，但只能留在代码、日志、接口或后台受控区域。
- 如果用户已经完成登录，不要把登录页做成状态说明页，应优先跳转或只保留轻提示。

但它最终负责：

- 公开网页发布
- 搜索引擎可索引页面
- 品牌化前台体验
- 内容、专题、合作需求的公开展示

## 启动方式

```bash
cp .env.example .env.local
npm install
npm run dev
```

默认访问地址：

- [http://localhost:3000](http://localhost:3000)

检查命令：

```bash
npm run lint
npm run build
npm run storybook
npm run build-storybook
```

## Frontend experience workbench（本轮新增）

当前 `web/` 已补一层最小前端体验工作台，目的不是做第二套页面，而是把关键 UI 模块、页面状态和产品逻辑先固定在可审查环境里。

这套体系在项目内统一名称为：

- `QiuQiuTech Frontend Experience Workbench`

已接入：

- `components.json`：shadcn-compatible 配置入口
- `.storybook/*`：Storybook 运行配置
- `src/lib/utils.ts`：`cn()` 工具
- `src/components/ui/button.tsx`：第一个基础 primitive
- `src/stories/foundations.stories.tsx`：品牌 token 基线
- `src/components/ui/button.stories.tsx`：按钮状态
- `src/components/platform-ui.stories.tsx`：现有平台模式组件审查入口
- 页面逻辑、交互状态和 CTA 主次也默认通过 stories 和真实页面联动审查

建议工作流：

1. 先做 primitive / pattern
2. 补 story
3. 再接真实页面
4. 页面改完同时复看 Storybook 和真实页面

给其他 AI 的最短说明：

- 当前前端统一走 `QiuQiuTech Frontend Experience Workbench`
- 先看 `src/components/ui/*` 和现有 stories
- 先补 story，再改页面
- 不要直接在页面里临时造一套新按钮/卡片/输入框
- 不只审美化，还要一起审页面结构、用户路径和 CTA 主次

当前本地开发建议：

- 使用 `npm run dev`（已固定为 `next dev --webpack`）
- 原因：路径迁移后，Turbopack 曾反复尝试向旧 `.next` 目录写入 HMR 资源，导致首页持续刷新、tab 点击无响应
- 若首页再次出现“乱码”或无样式，优先检查 `/_next/static/css/app/layout.css` 是否 404；当前已在 `src/app/layout.tsx` 中增加运行时 CSS fallback 兜底
- 页面标题规则已参考 SocialBeta 收敛：首页使用“品牌名｜核心定位”，频道/详情页继续使用“页面名 | 品牌名”
- 前台头部 logo 已切为透明底“鸟头 + 文字”版本；tab / favicon / app icon 已切为透明底“仅鸟头”版本
- 前台首页 Chrome Tab icon 已与 Directus 后台 Tab icon 对齐统一，当前都使用同一套“仅鸟头”图标资源；前端文件级 icon 与 metadata icon 已统一为透明 64x64 输出
- 后台本地基础初始化已前置脚本化：先执行 `cms/sql/bootstrap-minimal-business-schema.sql`，再执行 `node cms/scripts/init-local-foundation.mjs`，最后用 `node cms/scripts/verify-local-foundation.mjs` 自检
- Directus 后台主 logo 默认使用透明底“大鸟无文字”版本，前台站点继续使用带文字品牌锁定版
- 前台头部搜索框已升级为增强版：支持移动端样式优化，搜索页支持类型筛选计数、排序与分组空态引导（仍基于现有内容服务层）
- 登录页信息架构已按“登录 / 注册”重组，后续若继续扩展账号体系，必须保持任务优先而非技术优先
- 首页 Hero 已升级为真实轮播组件，当前采用浮动箭头切换；首页与登录页的高权重公开触点都应遵守同一套标签、说明和信息层级规则
- 后续新增 UI 组件优先放入 `src/components/ui/`，并同步补 Storybook story；避免再次出现“同一类按钮/卡片每页一套”的漂移

## 当前目录结构

```text
web/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ api/
│  │  ├─ contents/
│  │  ├─ events/
│  │  ├─ playbooks/
│  │  ├─ topics/
│  │  ├─ requests/
│  │  ├─ submit/
│  │  ├─ rankings/
│  │  ├─ auth/
│  │  ├─ me/
│  │  └─ admin/
│  ├─ components/
│  │  ├─ site-shell.tsx
│  │  ├─ platform-ui.tsx
│  │  ├─ auth-modal.tsx
│  │  ├─ action-buttons.tsx
│  │  ├─ admin-crawl-ops-panel.tsx
│  │  ├─ submission-draft-form.tsx
│  │  └─ request-application-form.tsx
│  └─ lib/
│     ├─ site-data.ts
│     ├─ content-service.ts
│     ├─ account-service.ts
│     ├─ action-service.ts
│     ├─ cms-client.ts
│     ├─ cms-types.ts
│     ├─ crawl-report-service.ts
│     ├─ directus-auth.ts
│     ├─ form-blueprints.ts
│     ├─ mock-account-service.ts
│     ├─ mock-action-service.ts
│     ├─ mock-workflow-service.ts
│     ├─ workflow-service.ts
│     └─ seo.ts
├─ public/
└─ package.json
```

## 页面说明

### 已完成骨架

- `/`：首页
- `/contents`：营销内容
- `/events`：营销事件
- `/playbooks`：营销玩法
- `/topics`：专题策展
- `/requests`：合作对接
- `/submit`：我要投稿
- `/rankings`：榜单趋势
- `/auth`：高保真登录入口（当前接最小会话层）
- `/me`：用户中心
- `/admin`：后台入口骨架
- `/search`：站内搜索结果页（增强版：筛选计数 / 排序 / 空态引导 / 移动端入口优化）

### `/admin` 当前真实进展

- 已接通：最小审核流增强版（队列读取、审核动作、状态筛选、分页、批量通过/拒绝、审核说明、中文操作日志）
- 已接通：抓取报告最小面板增强版（读取 `_batch-report.json` / `_import-report.json`，并展示失败重试建议与导入失败样本）
- 仍为占位：顶部统计卡、左侧大部分导航、展示位运营、运营备注、用户/认证/统计等模块

结论：

- 当前后台不是完整 CMS，而是“先把审核和抓取接通”的第一阶段最小运营台

### 已有演示详情页

- `/contents/[slug]`
- `/requests/[slug]`
- `/topics/[slug]`

### 本地 API 契约

- `/api/me/dashboard`
- `/api/auth/session`
- `/api/me/saved-items/toggle`
- `/api/me/notifications/read`
- `/api/submissions/drafts`
- `/api/requests/drafts`
- `/api/requests/[slug]/apply`
- `/api/workflows/submission-center`
- `/api/workflows/request-application`

这些路由当前返回 service/mock 数据，后续可以平滑替换成真实后台接口。

## Directus 读/写灰度开关

当前 `web/src/lib/*-service.ts` 采用同一套策略：

- 默认走 mock
- 当 `NEXT_PUBLIC_USE_DIRECTUS=true` 时优先请求 Directus
- Directus 不可用或权限不足时自动回退 mock（避免前台直接崩溃）
- CMS / Directus 请求均有 6 秒超时保护，避免页面长期 loading

### 写入链路（本轮新增）

为了让 `/submit` 和 `/requests/[slug]` 在 Directus 模式下真正落库，本轮新增：

- `src/lib/directus-auth.ts`：封装 Directus token 获取与鉴权请求
- `src/lib/action-service.ts`：对 `saveSubmissionDraft` / `applyToRequest` / `toggleSavedItem` / `markNotificationRead` / `saveRequestDraft` 实现 Directus 落库（失败 fallback）

需要配置（见 `.env.example`）：

- `NEXT_PUBLIC_USE_DIRECTUS=true`
- `NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055`
- `DIRECTUS_STATIC_TOKEN=...`（推荐）或 `DIRECTUS_ADMIN_EMAIL/DIRECTUS_ADMIN_PASSWORD`
- `QIUQIUTECH_CURRENT_USER_ID=me`（当前未接真实登录态，写入使用占位用户）

联调建议（本地）：

- 优先使用 `DIRECTUS_ADMIN_EMAIL` + `DIRECTUS_ADMIN_PASSWORD`，由服务端动态登录换 token。
- 若使用 `DIRECTUS_STATIC_TOKEN`，请注意 token 过期会导致动作链路回退到 fallback（响应会带 `source=fallback` 与 `reason`）。
- `POST /api/auth/session` 本轮已支持在 Directus 模式下同步 `user_profiles` 最小资料；`/me` 的 `account-service` 也已改成优先走带鉴权的私有聚合查询
- 若当前运行环境仍是 `NEXT_PUBLIC_USE_DIRECTUS=false`，用户中心会继续回退 mock 账户工作台数据，这是当前预期行为

## 当前主要组件

### `src/components/site-shell.tsx`

负责：

- 顶部导航
- 页面外层容器
- 页脚
- `SectionTitle`

### `src/components/platform-ui.tsx`

负责：

- `PageHero`
- `InsightPanel`
- `FilterChips`
- `MetaList`
- `DirectoryCard`
- `RailCard`
- `PrimaryButton`
- `SecondaryButton`

这是当前页面统一骨架的核心。

### `src/lib/site-data.ts`

当前是整站的演示数据源，包含：

- 首页模块数据
- 频道页卡片数据
- 榜单页、用户中心、后台页占位数据
- 内容详情 / 对接详情 / 专题详情演示数据

注意：

- 栏目类型、合作类型这类一级分类可以固定
- 内容标签、合作标签、趋势标签这类展示型 tag 不能在页面里写死，后续要以发布时录入或 CMS 返回的数据为准

后续接真实开发时，这个文件会逐步被：

- Directus collections
- API 返回结构
- seed data

替代。

### `src/lib/cms-types.ts`

未来接 Directus 时的前端数据契约类型骨架。

### `src/lib/cms-client.ts`

未来接 Directus 时的请求入口骨架。

当前已经按 Directus REST 常见结构预留：

- 响应默认按 `{ data: ... }` 解包
- 列表默认按 `status=published` 读取
- 详情默认按 `slug` 查询，而不是错误地把 slug 当 id

也就是说，后面接真实 CMS 时，collection 字段只要对齐，前台不需要大改。

### `src/lib/content-service.ts`

这一层是页面真实使用的数据服务层。

当前策略：

- 默认走 mock 数据
- 打开 `NEXT_PUBLIC_USE_DIRECTUS=true` 后优先尝试 CMS
- CMS 不可用时自动回退到 mock
- 首页的趋势关键词、玩法关键词、精选案例、合作卡等模块，已经开始优先从内容和合作数据里派生，而不是单纯依赖静态常量

### `src/lib/account-service.ts`

负责：

- 用户中心数据入口
- 后续接真实登录态后的账户工作台数据聚合
- CMS 不可用时回退到 mock 账户数据

当前已支持：

- 优先读取 Directus 的 `user_dashboard` 单例
- 若单例不存在，则自动聚合 `user_profiles/submissions/saved_items/match_applications/notifications`
- 聚合后会重算用户中心顶部统计卡

### `src/lib/action-service.ts`

负责：

- 收藏动作入口
- 通知已读动作入口
- 保存草稿动作入口
- 申请合作动作入口

其中：

- **保存草稿**与**申请合作**已支持 Directus 落库（开启 Directus 开关并配置鉴权后生效）
- **发布合作需求草稿**已支持 Directus 落库（`/api/requests/drafts` -> `partnership_requests` 草稿）
- **收藏切换**已支持 Directus 落库（按 `user_id + target_type + target_id` 做切换）
- **通知全部已读**已支持 Directus 落库（批量更新当前用户未读通知）

### `src/lib/mock-action-service.ts`

负责：

- 当前动作接口的 mock 成功返回
- 后续替换成真实后台逻辑前的本地占位

### `src/lib/mock-account-service.ts`

负责：

- 当前用户中心演示数据
- 投稿 / 收藏 / 合作申请 / 通知的 mock 结构

### `src/lib/workflow-service.ts`

负责：

- 投稿中心结构化蓝图入口
- 合作申请流程说明入口
- 后续接真实表单 schema / 审核流 schema 的承接层

### `src/lib/mock-workflow-service.ts`

负责：

- 投稿类型、投稿字段、审核状态、创作者权益的 mock 蓝图
- 合作申请步骤与安全策略说明的 mock 蓝图

### `src/components/auth-modal.tsx`

负责：

- 登录弹窗主结构
- 顶层“直接登录 / 去注册”分流
- 账号密码、手机验证码、微信扫码三种登录方式
- 体验账号填充、前置校验与状态反馈
- 当前会话识别、验证码体验与注册体验承接层
- 后续顶部弹窗登录复用

### `src/components/action-buttons.tsx`

负责：

- 收藏按钮
- 通知已读按钮
- 保存草稿按钮
- 申请合作按钮

当前这些按钮已接到本地 API 契约路由，后续可直接替换为真实后台动作。

### `src/components/admin-crawl-ops-panel.tsx`

负责：

- 在 `/admin` 展示最新抓取批次报告
- 展示来源健康度、质量均分、导入摘要与异常提示
- 为后续人工复核与任务中心持久化预留展示层

当前通过 `src/lib/crawl-report-service.ts` 读取仓库根 `tmp/` 下最新 `_batch-report.json` / `_import-report.json`。

### `src/lib/form-blueprints.ts`

负责：

- 登录相关结构数据
- 用户中心结构数据
- 减少 `auth / me` 页面里的重复常量

### `src/app/robots.ts` / `src/app/sitemap.ts`

负责：

- 提前把公开站点的 SEO 基建搭起来
- 明确哪些路由允许索引
- 为内容、专题、合作详情输出基础 sitemap

## 当前设计约束

这个前端不是普通模板站，必须遵守这些设计方向：

- 高级感优先，这是当前最高设计约束
- 高级、简约、时尚、专业
- 内容平台优先，不做传统门户感
- 配色围绕 logo 深蓝 / 青绿 / 暖黄
- 首页不是营销 landing page，而是平台首页
- 首页 Hero、登录页、投稿页等高权重公开触点必须使用同一套信息层级规则：主标签不复读、辅助标签不超过 2 层、说明文本不重复标题
- 后台也要品牌统一，但不能做成花哨 demo

## 开发注意事项

1. 当前路由命名以最新 brief 为准，不再使用旧的 `/content`、`/connect`
2. 如果你看到 `docs/` 里还有旧文档，先以根目录 `README` 和外部最新 brief 为准
3. 当前项目还没拆成 `web / admin / api` 三工程，后台只是前端骨架入口
4. 接真实数据前，尽量继续复用 `platform-ui.tsx` 这一层，不要每个页面重新写一套

### 其他 AI 接手禁忌（工程执行版）

1. 禁止移除 `action-service` 与 `account-service` 的 fallback 分支，除非真实认证、真实资料、真实审核链路已全量替代并回归通过。
2. 禁止在未同步 `cms/sql/bootstrap-minimal-business-schema.sql` 的情况下改核心集合字段名（`submissions/partnership_requests/match_applications/saved_items/notifications`）。
3. 禁止把 `/api/auth/session` 当最终认证方案；它只是过渡层，目标仍是微信扫码与真实账号体系。
4. 禁止前台硬编码内容标签/趋势标签/合作标签，必须来自 CMS 或发布数据。
5. 禁止只改 UI 不跑验证：每轮至少 `npm run lint`、`npm run build`，动作链路改动必须追加 `web/scripts/e2e-actions-smoke.sh`。
6. 禁止只改代码不更新文档：必须同步根 `README.md`、`web/README.md`、`docs/ai-handoff.md`、`docs/current-build-status.md`、`docs/README.md`。

## 下一步最合理的开发顺序

1. 设计并落库真实数据模型
2. 选定后台底座方案
3. 接 Directus + PostgreSQL
4. 接内容系统 API
5. 接投稿审核流
6. 接合作对接流
7. 再补搜索、SEO、数据看板与后台真实交互

## 下一步动作（工程内执行版）

下一位 AI 可直接从这里开始：

1. `web/.env.local` 打开 `NEXT_PUBLIC_USE_DIRECTUS=true`，补齐 Directus 鉴权变量（状态：`✅ 已完成（本地联调）`）
2. 本地跑通并记录 5 条动作链路（投稿草稿、合作需求草稿、合作申请、收藏切换、通知已读）（状态：`✅ 已完成`）
   - 联调记录模板：`docs/e2e-validation-log.md`（已补）
3. 在 `src/app/api/admin/*` 新增最小审核 API（先做 submissions + partnership_requests）（状态：`✅ 已完成（最小版）`）
   - 已完成：`POST /api/admin/submissions/[id]/review`、`POST /api/admin/requests/[id]/review`
   - 验收标准（完成即改为 `✅`）：
     - API 路由可被 `/admin` 页面直接调用
     - 状态流转支持 `pending_review/approved/rejected/published`
     - 状态变更时写入 `reviewed_by/reviewed_at/review_note`
     - 错误返回结构统一：`{ success: false, message }`
4. 在 `src/app/admin/page.tsx` 增加最小“待审核队列 + 操作按钮”（状态：`✅ 已完成（最小版）`）
   - 已完成：`AdminReviewQueue` 组件已接入，并可调用审核 API 更新状态
   - 已完成：审核队列读取 API（`/api/admin/submissions/review-queue`、`/api/admin/requests/review-queue`）
   - 验收标准（完成即改为 `✅`）：
     - 可展示 submissions 与 partnership_requests 两个队列
     - 每条记录提供通过/拒绝/发布操作
     - 操作完成后可看到状态、时间、操作者更新
     - 失败与 fallback 状态有明确提示文案
5. 补充操作结果反馈（成功/失败/回退 mock）与状态文案统一（状态：`✅ 已完成（当前轮）`）
   - 已完成：状态筛选（全部/草稿/待审核/通过/拒绝/发布）
   - 已完成：审核队列 API 支持 `status` 参数（服务端筛选）
   - 已完成：审核台默认视图为“待审核”
   - 已完成：分页（默认每页 4 条）
   - 已完成：操作日志面板（success/fallback/error）
6. 完成后执行（状态：`✅ 已完成（当前轮）`）：
   - `npm run lint`
   - `npm run build`
   - 本地预览：`npm --prefix web run dev -- --hostname 127.0.0.1 --port 3000`
7. 同步更新交接文档（状态：`✅ 已完成（本次）`）：
   - 根 `README.md`
   - `web/README.md`
   - `docs/ai-handoff.md`
   - `docs/current-build-status.md`

## 每轮常规动作（与根 README 对齐）

每次继续开发后，默认都要执行：

1. 对照根 `README.md` 更新本文件状态
2. 若任务状态有变化，立即回写 `docs/ai-handoff.md`
3. 同步 `docs/current-build-status.md` 的阶段结论
4. 在 `docs/README.md` 追加本轮同步记录

## To Do 状态（与根 README 对齐）

最后更新：2026-05-09（本轮）

详细任务拆分与实时状态请查看：
- [docs/todo-live.md](docs/todo-live.md)

联调补充：
- 动作接口响应新增 `source`（`directus` / `fallback`）与 `reason`（fallback 原因），用于快速判断是否真实落库。
- 可直接执行 `web/scripts/e2e-actions-smoke.sh` 一键验证 5 条动作链路。
- 本地 Directus 后台当前已完成品牌与中文语言基线：`project_name/logo/favicon` 对齐为 QiuQiuTech，`default_language` 与管理员 `language` 为 `zh-CN`。

- `✅ 已完成`：功能可用且已写入当前文档
- `⏳ 进行中`：已有代码，待环境联调/回归
- `⬜ 未开始`：未进入编码阶段

### 当前优先级（执行顺序）

1. 审核台从当前最小 cookie 会话升级到真实后台账号体系
2. 补齐 5 条动作链路联调截图（当前 API + 数据留痕已完成）
3. 接入 Directus 真实内容读取并下沉 mock 到仅兜底
4. 追踪 `/collections` API 权限根因（当前已用 SQL bootstrap 方案解除开发阻塞）
5. 补后台审核与内容读链路联调截图证据（API 与连通性验证已完成）
6. 对接真实认证（微信扫码/账号体系）并替换当前最小 cookie 会话方案
7. 将抓取报告从 `tmp/` 读文件升级为可持久化任务中心与人工处理动作（当前 `/admin` 已具备最小可视化）
8. 继续收敛本地开发环境与真实登录态，避免旧路径缓存、mock 操作者等过渡态影响联调体验
9. 站内搜索下一步接搜索联想、热词推荐与 Directus 全文检索（当前仅做服务层内增强）
