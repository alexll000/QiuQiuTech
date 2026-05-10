# QiuQiuTech

QiuQiuTech 是一个面向品牌方、市场人、营销从业者、代理公司与独立操盘手的营销行业平台。

它不是传统资讯站、论坛或招聘站，而是一个：

**以结构化内容为入口、以投稿审核为增长机制、以合作撮合为差异化价值的营销行业平台。**

## 克隆与本地运行（给他人）

1. **克隆**
   ```bash
   git clone https://github.com/alexll000/QiuQiuTech.git
   cd QiuQiuTech
   ```
2. **前台**：进入 `web/`，复制环境模板并安装依赖（仓库内**不包含** `node_modules`）：
   ```bash
   cd web
   cp .env.example .env.local
   # 按文件内注释填写 DIRECTUS 地址与令牌；详见下方文档链接
   npm install
   npm run dev
   ```
   浏览器打开 <http://localhost:3000>。
3. **后台（Directus + PostgreSQL）**：见 `cms/README.md`，常用命令：
   ```bash
   cd cms
   cp .env.example .env   # 若尚无 .env
   docker compose up -d
   ```
   Directus：<http://localhost:8055>。可与任意路径的前端工程**共用同一套 Docker**，只需前端 `.env.local` 指向同一地址。
4. **（推荐）导入营销热度起始数据**：仓库自带 `cms/seed/submissions.seed.json`，在仓库根执行 `node scripts/seed/import-submissions-seed.mjs` —— 详见 [cms/seed/README.md](cms/seed/README.md)（可在配置好 Directus 鉴权 env 后导入，首页趋势图即有初始案例）。
5. **更长步骤与排障**（换电脑、端口占用、营销热度无数据等）：[docs/setup-from-scratch.md](docs/setup-from-scratch.md)。
6. **营销热度趋势**：业务文档 [docs/features/marketing-heat-trend.md](docs/features/marketing-heat-trend.md)；**技术栈 / 配置与数据源索引** [docs/features/marketing-heat-trend-tech-and-sources.md](docs/features/marketing-heat-trend-tech-and-sources.md)；源码清单 [docs/features/marketing-heat-trend-module-inventory.md](docs/features/marketing-heat-trend-module-inventory.md)。

**说明**：`web/.env.local`、`cms/.env` 含密钥，**不会**提交到 Git；他人克隆后须自行从 `.env.example` 生成并填写。根目录 `data.db` 为空占位文件，已被忽略，**可不拷贝**，不影响运行。

## 当前状态

当前最新开发交接真值源：

- [docs/Latest-conversation-brief.md](docs/Latest-conversation-brief.md)（最短接棒入口）
- [docs/ai-handoff.md](docs/ai-handoff.md)
- [docs/current-build-status.md](docs/current-build-status.md)
- [docs/todo-live.md](docs/todo-live.md)（任务拆分与状态真值源）
- [docs/ui-workbench.md](docs/ui-workbench.md)（前端体验工作台与 Storybook 工作流）
- [docs/setup-from-scratch.md](docs/setup-from-scratch.md)（换电脑从零搭建、与同机共用 Docker）

当前仓库已经完成的是：

- 一套可运行的前台站点框架
- 首页高保真方向稿
- 内容中心 / 合作对接 / 投稿中心的高保真 UI 方向稿
- 首页与核心频道页 SEO 元数据基础层
- 登录 / 用户中心 / 后台入口高保真骨架
- 基础内容详情 / 专题详情 / 合作详情演示数据
- 投稿草稿表单（可保存草稿）
- 合作申请表单（可提交申请）
- Directus 写入链路的鉴权与落库骨架（草稿与申请）

当前还没有完成的是：

- 真实后端 API
- Directus collections 与真实数据库落地
- 更完整的审核审计、权限细粒度与真实账号体系
- 抓取任务中心持久化与后台人工处理动作
- 合作申请的后台审核深化与联系方式保护策略落库

也就是说，**现在是“可继续正式开发的产品框架阶段”**，不是最终可上线版本。

## 后台进度摘要

当前后台相关开发已经到达：

- Directus 本地实例可启动、可登录
- 最小业务集合已完成本地初始化
- 后台品牌资源与中文语言基线已对齐
- 后台基础角色/策略基线已可脚本化初始化
- `/admin` 最小审核台已可用
- `/admin` 抓取报告最小可视化已可用

当前后台“真实接通”和“静态占位”的边界是：

- 真实接通：投稿/合作审核队列读取、审核动作、抓取批次报告读取、导入摘要读取
- 静态占位：顶部运行状态卡、左侧大部分导航、展示位运营卡、运营备注、用户/认证/统计等模块入口

这意味着当前后台不是“开发偏了”，而是只完成了第一阶段最小运营闭环。

当前后台仍未完成：

- 真正的账号体系与操作者身份
- 更完整的审核审计与权限细粒度
- 抓取任务中心持久化与人工处理动作
- 展示位、标签、用户、认证、统计等后台模块的真实数据接入
- 将 Directus 初始化继续扩展到集合、字段与种子数据脚本

## 当前技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- App Router
- Storybook 10（frontend experience workbench）
- shadcn-compatible primitives（渐进接入）

设计规范（最新）：

- [docs/QiuQiuTech-design-system-v1.md](docs/QiuQiuTech-design-system-v1.md) — 包含**阴影系统风格 A（深色投影浮起）**、色彩、字体、圆角、动效等全量 token

当前代码集中在：

```text
QiuQiuTech/
├─ cms/                 # Directus 后台骨架与本地启动文件
├─ docs/                # 项目说明、brief、设计与交接文档
└─ web/                 # 当前实际开发中的前台工程
```

## 产品范围

QiuQiuTech 当前围绕三条主线展开：

1. 营销内容
2. 用户投稿并审核发布
3. 品牌 / 市场人合作对接

当前前台一级导航已经对齐为：

1. 首页
2. 营销内容
3. 营销事件
4. 营销玩法
5. 专题策展
6. 合作对接
7. 我要投稿
8. 榜单趋势
9. 登录 / 用户中心

## 最终发布形态

QiuQiuTech 最终是一个对外公开发布的 Web 平台。

这意味着后续开发默认要按这些标准推进：

- 前台可公开访问
- 内容与专题页可索引
- 后台独立登录管理
- 站点支持 SEO 与内容发布
- 前后台职责分离

## 高优先级产品约束

以下规则是当前仓库的系统级硬约束，后续前台开发默认必须遵守：

- 公开前台禁止暴露开发态、测试态、联调态、内部态信息。
- 登录、注册、账号与会话相关页面必须按用户任务组织，不按技术实现组织。
- 禁止把 `mock`、`fallback`、`admin-mock`、`会话 ID`、`账号标识`、体验账号这类内部语义直接展示给 C 端用户。
- 技术兜底可以存在于代码和服务层，但不能成为用户界面的说明内容。
- 已完成登录或已进入某状态的用户，应优先跳转或弱提示，不应让状态说明主导界面。

这条约束的直接背景是：公开前台曾出现开发语境泄漏与账户信息架构混乱问题，现已上升为长期执行规则，而不是一次性页面修补。

## 当前页面实现

已存在的核心页面：

- `/`
- `/contents`
- `/events`
- `/playbooks`
- `/topics`
- `/requests`
- `/submit`
- `/rankings`
- `/auth`
- `/me`
- `/admin`

已存在的演示详情页：

- `/contents/[slug]`
- `/topics/[slug]`
- `/requests/[slug]`

## 设计方向

当前设计方向由以下约束主导：

- 高级感优先，这是当前最高设计约束
- 高级
- 简约
- 时尚
- 专业
- 内容平台优先，不做传统门户感
- 配色围绕 logo 的深蓝、青绿、暖黄

视觉参考来源包括：

- SocialBeta：整体调性、简洁和内容气质
- React Bits：局部动态效果与品牌化视觉增强
- 用户提供的首页拼贴 UI：作为版式方向，不直接照抄
- 用户补充的内容中心 / 趋势图 / 投稿页 / 合作页参考图：用于约束页面结构、比例和筛选布局

## 当前架构判断

### 前端

当前仓库里真正可运行的是 `web/`。

### 后台

后台路线已经明确为 **Directus**。

当前仓库已补入：

- `cms/.env.example`
- `cms/docker-compose.yml`
- `cms/README.md`

结论是：**前台继续保留 Next.js，后台进入 Directus 路线推进。**

## 如何启动

进入前端工程：

```bash
cd web
npm install
npm run dev
```

默认本地地址：

- [http://localhost:3000](http://localhost:3000)
- Directus 后台：[http://localhost:8055](http://localhost:8055)

常用检查命令：

```bash
cd web
npm run lint
npm run build
npm run storybook
npm run build-storybook
```

前端体验开发约定（新增）：

- 不再只在页面里直接堆样式；关键 UI 模块先进入 `web` 的 Storybook workbench 再回接页面。
- `web/components.json`、`web/src/lib/utils.ts` 和 `web/src/components/ui/*` 现在是后续基础组件扩展入口。
- 公开前台的重要状态至少要能在 Storybook 里单独审：默认态、长文案态、空态、移动端可读性。
- 首页、列表页、详情页、登录页等关键页面不只审视觉，还要审信息层级、用户路径和 CTA 主次。

当前这套体系在仓库内统一命名为：

- `QiuQiuTech Frontend Experience Workbench`

如果要给其他 AI 交接，请直接说明：

- 当前前端统一走 `QiuQiuTech Frontend Experience Workbench`
- 先 Storybook，后页面
- 先 primitives，后业务模块
- 不要在页面里临时发明一套新 UI
- 不只管 UI，还要一起处理页面结构、状态设计、CTA 主次和用户路径
- 关键公开前台模块至少补默认态、长文案态、空态/弱数据态、移动端可读性

## 最新进展（交接必读）

最后更新：2026-05-09（本轮）

本轮额外完成了一项系统级纠偏：

- 已将“公开前台不得暴露内部开发状态，账户流程必须按用户任务组织”写入 `docs/engineering-rules.md`、`docs/ui-governance.md`、`docs/ai-collaboration-protocol.md`，并同步到本文档与前端 README，后续开发默认按该原则执行。
- 首页 Hero 联调已继续推进：麦当劳案例位已从静态大卡改为真实轮播，采用浮动箭头切换；标签与说明层级已按“一个主类型 + 两个以内主题标签 + 一句辅助说明”收口，并继续向 `/auth` 的品牌引导区 + 任务面板语言系统对齐。
- 前端体验工作台已接入：`web/` 新增 Storybook 10、shadcn-compatible 基础配置、品牌 token story、按钮 primitive story 与平台模式 story，后续前端改动不再只靠页面临场拼装。

本轮补齐了两条“可真实落库”的关键用户动作（支持灰度回退，保证前台不崩）：

1. **投稿保存草稿**
   - 页面：`/submit`
   - API：`POST /api/submissions/drafts`
   - Directus 落库（开启 `NEXT_PUBLIC_USE_DIRECTUS=true` 且配置鉴权后）：创建 `submissions`（`status=draft`）
2. **合作申请提交**
   - 页面：`/requests/[slug]`
   - API：`POST /api/requests/[slug]/apply`
   - Directus 落库：先按 `slug` 查 `partnership_requests`，再创建 `match_applications`（`status=pending`）

并在后续补齐了另外两条动作：

3. **收藏切换**
   - 页面：`/contents/[slug]` 的收藏按钮已带 `targetType/targetId/title/href`
   - API：`POST /api/me/saved-items/toggle`
   - Directus 落库：优先按 `user_id + target_type + target_id` 查重，存在则删除（取消收藏），不存在则创建
4. **通知全部已读**
   - 页面：`/me` 通知中心按钮
   - API：`POST /api/me/notifications/read`
   - Directus 落库：读取当前用户未读通知后逐条更新 `is_read=true`

5. **用户中心多集合聚合读取（新增）**
   - 服务：`web/src/lib/account-service.ts`
   - 优先读取 `user_dashboard` 单例；若不存在则自动聚合：
     - `user_profiles`
     - `submissions`
     - `saved_items`
     - `match_applications`
     - `notifications`
   - 聚合失败时继续回退 mock，保证 `/me` 可用

6. **合作需求发布草稿（新增）**
   - 页面：`/requests` 左侧新增“发布合作需求（草稿）”表单
   - API：`POST /api/requests/drafts`
   - Directus 落库：创建 `partnership_requests` 的 `draft` 记录（自动生成 slug）
   - 失败时 fallback：mock 成功返回，保证单人运营流程不中断

7. **最小登录会话层（新增）**
   - API：`POST /api/auth/session`、`DELETE /api/auth/session`
   - 能力：写入/清理 `qqt_uid` cookie，并让 `/api/me/*` 与动作写链路优先使用请求用户 ID
   - 前台：`/auth` 登录按钮已接会话接口，登录后跳转 `/me`；`/me` 已接退出登录按钮

8. **抓取管道 MVP（第一阶段，新增）**
   - 脚本：
     - `scripts/crawl/fetch-url-to-json.mjs`（单链接抓取并结构化）
     - `scripts/crawl/fetch-batch-from-list.mjs`（按来源列表批量抓取）
     - `scripts/crawl/crawl-report-utils.mjs`（质量评分与来源健康度汇总）
     - `scripts/import/import-submissions-to-directus.mjs`（导入 Directus `submissions` 待审核池）
     - `scripts/import/retry-failed-imports.mjs`（失败导入回放重试）
     - `scripts/sync/crawl-and-import.mjs`（抓取+导入一键执行）
     - `scripts/sync/run-crawl-cron.sh`（定时任务入口）
     - `scripts/sync/notify-failures.mjs`（失败告警 webhook）
   - 去重：导入前按 `external_link` + `title` 去重
   - 限速：批量抓取支持 `--delayMs`（默认 1200ms）
   - 质量评分：单条抓取结果新增 `quality.score / grade / warnings`
   - 健康度统计：批量抓取输出 `_batch-report.json`，导入输出 `_import-report.json`
   - 失败队列：导入失败可输出到 `--failLog`（默认 `tmp/crawl-failures.json`）
   - 样例来源：`scripts/crawl/sources.sample.txt`
   - 实测：已导入 `submissions.id=4/5`，重复内容可跳过

9. **后台审核增强（并行子任务，已完成）**
   - API：`POST /api/admin/submissions/[id]/review`、`POST /api/admin/requests/[id]/review`
   - 能力：审核动作会从请求 cookie 读取 `qqt_uid` 作为 `reviewed_by`，不再固定写入 `admin-mock`
   - 前端：`/admin` 审核队列已支持批量通过/拒绝、驳回原因、审核说明展示、中文操作日志，并消费后端返回的 `reviewedBy/reviewedAt/reviewNote`

抓取脚本快速用法：

```bash
node scripts/crawl/fetch-url-to-json.mjs --url=https://socialbeta.com/ --out=tmp/crawl/one.json
node scripts/crawl/fetch-batch-from-list.mjs --list=scripts/crawl/sources.sample.txt --outDir=tmp/crawl
DIRECTUS_ADMIN_EMAIL=admin@qiuqiutech.com DIRECTUS_ADMIN_PASSWORD=ChangeThisAdminPassword123! NEXT_PUBLIC_DIRECTUS_URL=http://127.0.0.1:8055 node scripts/sync/crawl-and-import.mjs --list=scripts/crawl/sources.sample.txt --outDir=tmp/crawl-sync
DIRECTUS_ADMIN_EMAIL=admin@qiuqiutech.com DIRECTUS_ADMIN_PASSWORD=ChangeThisAdminPassword123! node scripts/import/import-submissions-to-directus.mjs --inDir=tmp/crawl-sync --baseUrl=http://127.0.0.1:8055 --failLog=tmp/crawl-failures.json
DIRECTUS_ADMIN_EMAIL=admin@qiuqiutech.com DIRECTUS_ADMIN_PASSWORD=ChangeThisAdminPassword123! scripts/sync/run-crawl-cron.sh scripts/crawl/sources.sample.txt tmp/crawl-cron crawler-bot
DIRECTUS_ADMIN_EMAIL=admin@qiuqiutech.com DIRECTUS_ADMIN_PASSWORD=ChangeThisAdminPassword123! node scripts/import/retry-failed-imports.mjs --failLog=tmp/crawl-failures.json --sourceDir=tmp/crawl-sync --retryDir=tmp/crawl-retry
QQT_CRAWL_ALERT_WEBHOOK=https://example.com/webhook node scripts/sync/notify-failures.mjs --failLog=tmp/crawl-failures.json
```

新增 Directus 写入鉴权封装：

- `web/src/lib/directus-auth.ts`
  - 优先使用 `DIRECTUS_STATIC_TOKEN`；否则用 `DIRECTUS_ADMIN_EMAIL/DIRECTUS_ADMIN_PASSWORD` 调 `/auth/login` 获取 token（带缓存）
  - 已增加请求超时保护（6 秒），避免 Directus 不可达时页面长期阻塞

补充稳定性修复（2026-05-08）：

- `web/src/lib/cms-client.ts` 已增加 CMS 读取超时保护（6 秒）与失败快速 fallback
- `web/src/lib/directus-auth.ts` 已增加登录/鉴权请求超时保护（6 秒）
- 目的：避免首页 SSR 因上游不可达而持续 loading，保证 tab 可正常跳转

新增环境变量（见 `web/.env.example`）：

- `NEXT_PUBLIC_USE_DIRECTUS=true`
- `NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055`
- `DIRECTUS_STATIC_TOKEN=...`（或 admin 邮箱/密码）
- `QIUQIUTECH_CURRENT_USER_ID=me`（当前未接真实登录态，写入用占位 user id）

本地验证方式（Directus 模式）：

1. 启动 `cms/` 的 Directus（见 `cms/README.md`）
2. 在 Directus 建好 `submissions`、`partnership_requests`、`match_applications` 的核心字段（见 `docs/data-model.md`）
3. 打开 `NEXT_PUBLIC_USE_DIRECTUS=true` 并配置鉴权
4. 访问：
   - `/submit` 保存草稿 → `submissions` 出现新 `draft`
   - `/requests/brand-looking-for-popup-cocreation-team` 提交申请 → `match_applications` 出现新 `pending`

当前前端已经预置：

- 首页与频道页 `title / description / keywords`
- canonical / Open Graph / Twitter metadata
- `robots.ts`
- `sitemap.ts`
- 站点级 JSON-LD 结构化数据
- 标签展示按内容发布时写入的数据动态渲染，只有栏目类型这类 taxonomy 保持固定

## 当前代码组织

```text
web/src/
├─ app/
│  ├─ page.tsx                 # 首页
│  ├─ contents/                # 营销内容
│  ├─ events/                  # 营销事件
│  ├─ playbooks/               # 营销玩法
│  ├─ topics/                  # 专题策展
│  ├─ requests/                # 合作对接
│  ├─ submit/                  # 我要投稿
│  ├─ rankings/                # 榜单趋势
│  ├─ auth/                    # 登录
│  ├─ me/                      # 用户中心
│  └─ admin/                   # 后台入口骨架
├─ components/
│  ├─ site-shell.tsx           # 全站导航、页脚、基础壳层
│  └─ platform-ui.tsx          # 平台级页面骨架组件
└─ lib/
   └─ site-data.ts             # 当前演示数据与页面结构数据
```

## 接手开发建议顺序

建议后续接手严格按这个顺序推进：

1. 固化信息架构与页面模块
2. 抽离真实数据模型
3. 确认后台底座方案
4. 建 Directus collections / PostgreSQL
5. 接内容系统
6. 接投稿系统
7. 接合作对接系统
8. 接后台审核流
9. 接抓取导入
10. 最后再做 SEO、搜索、数据统计与体验细修

## 接手时必须先读

1. `QiuQiuTech_Full_Development_Brief_v2.md`（外部文件，建议放到仓库 `docs/brief/` 后再引用）
2. [docs/ai-handoff.md](docs/ai-handoff.md)
3. [docs/README.md](docs/README.md)
4. [web/README.md](web/README.md)
5. [cms/README.md](cms/README.md)
6. [docs/deployment-plan.md](docs/deployment-plan.md)
7. [docs/seo-content-publishing.md](docs/seo-content-publishing.md)
8. [docs/directus-initialization-checklist.md](docs/directus-initialization-checklist.md)
9. [docs/directus-collections-matrix.md](docs/directus-collections-matrix.md)

## 注意事项

- 当前 `docs/` 下有一批早期 v1 文档，它们仍有参考价值，但**不能作为当前实现的最终真值源**
- 当前真实实现以：
  - 最新用户要求
  - `QiuQiuTech_Full_Development_Brief_v2.md`
  - 当前 `web/src/` 代码状态
  为准
- 现在还不是 monorepo，也还没拆成 `web / admin / api` 三层工程，只是先把前台平台框架跑起来了
- 以后每次同步 Git，默认需要同步更新 `docs/ai-handoff.md`，把最新进展、当前状态、下一步和整体规划一起提交

## 其他 AI 接手禁忌（未完成项重点）

1. 不要把 `docs/todo-live.md` 以外的文件当任务真值源。任务状态冲突时，只能以 `todo-live` 为准并同轮纠偏文档。
2. 不要删除现有 fallback 机制（`source=directus/fallback` + `reason`）。在 T07/T08 未完成前，fallback 是生产可用性的保护层。
3. 不要绕过现有 SQL bootstrap 方案去强依赖 `/collections` API。当前已知该接口权限存在 `FORBIDDEN`，会阻塞联调节奏。
4. 不要把标签、趋势词、合作标签写死到页面常量。标签必须优先来自发布数据或 CMS 返回。
5. 不要在未接真实认证前把 `QIUQIUTECH_CURRENT_USER_ID` 相关兜底逻辑删掉。现阶段会话层是过渡态，删兜底会直接导致动作链路不可用。
6. 不要在未完成审核流字段对齐前重构 `submissions/partnership_requests` 字段名。字段漂移会破坏已有 5 条写链路 smoke。
7. 不要只改代码不更新文档。每轮必须同步 `README.md`、`web/README.md`、`docs/ai-handoff.md`、`docs/current-build-status.md`、`docs/README.md`。
8. 不要在未验证前宣称“可上线”。至少需要 `npm --prefix web run lint`、`npm --prefix web run build`、`web/scripts/e2e-actions-smoke.sh` 三项通过。

## 其他 AI 交付格式（强制）

后续任何 AI 接手后，每轮提交必须同时满足：

1. 回报格式固定四段：
   - 本轮完成
   - 验证结果（命令 + 关键输出）
   - 文档同步清单
   - 下一步
2. 文档必更清单：
   - `docs/todo-live.md`
   - `README.md`
   - `web/README.md`
   - `docs/current-build-status.md`
   - `docs/ai-handoff.md`
   - `docs/README.md`（追加流水）
3. 若本轮有联调或回归，必须更新：`docs/e2e-validation-log.md`
4. 文档路径必须通过可移植性校验：`scripts/check-doc-portability.sh`
5. 建议执行一键校验：`scripts/validate-handoff.sh`

执行契约文档（建议接手前先读）：

- [AI-Execution-Contract.md](docs/AI-Execution-Contract.md)

## 下一阶段建议

下一阶段最值得直接推进的是两件事：

1. 起 Directus 本地实例并建立核心 collections
2. 把前台演示数据换成真实 schema 与服务端数据流

在这之后建议立刻推进：

1. 后台审核流（`draft -> pending_review -> approved/published`）接口与最小运营面板
2. 用户中心 `/me` 继续细化 Directus 字段映射（公司、认证、状态文案、时间格式）
3. 再开始抓取 scripts 层（避免写入与审核未稳定就进入抓取复杂度）

## 下一步动作清单（给下一位 AI）

按顺序执行即可：

1. **起 CMS 并校验集合**（状态：`⏳ 进行中`）
   - 启动 `cms/`（Directus + PostgreSQL）
   - 确认集合至少存在：`submissions`、`partnership_requests`、`match_applications`、`saved_items`、`notifications`、`user_profiles`
2. **验证写链路全通**（状态：`⏳ 进行中`）
   - `/submit` -> 草稿写入 `submissions`
   - `/requests` -> 草稿写入 `partnership_requests`
   - `/requests/[slug]` -> 申请写入 `match_applications`
   - `/contents/[slug]` -> 收藏切换写入 `saved_items`
   - `/me` -> 通知已读更新 `notifications.is_read`
  - 联调记录模板：`docs/e2e-validation-log.md`（已补）
3. **做审核流 API（最小版）**（状态：`✅ 已完成（最小版）`）
   - 新增后台 API：`submit review` / `approve` / `reject` / `publish`
   - 先只处理 `submissions` 与 `partnership_requests`
   - 已完成：`POST /api/admin/submissions/[id]/review`、`POST /api/admin/requests/[id]/review`
   - 验收标准（完成即改为 `✅`）：
     - 在 `web/src/app/api/admin/` 下落地可调用路由（建议：`/submissions/[id]/review`、`/requests/[id]/review`）
     - 至少支持状态流转：`draft -> pending_review -> approved/rejected -> published`
     - 每次状态变更写入：`reviewed_by`、`reviewed_at`、`review_note`（占位也可，但字段必须统一）
     - 失败返回统一错误结构：`{ success: false, message }`
4. **挂后台最小审核台**（状态：`✅ 已完成（最小版）`）
   - 在 `/admin` 增加待审核列表与状态切换按钮
   - 确保每次状态变更有时间和操作者字段（即使先用占位）
   - 已完成：`/admin` 页面已接最小审核队列组件并打通 API 调用
   - 已完成：`GET /api/admin/submissions/review-queue`、`GET /api/admin/requests/review-queue`（Directus 优先 + fallback）
   - 验收标准（完成即改为 `✅`）：
     - `/admin` 至少可区分两类队列：`submissions`、`partnership_requests`
     - 每条记录可执行：`通过`、`拒绝`、`发布`（不满足状态前置条件时按钮禁用）
     - 操作后有前端反馈：成功提示 / 失败提示 / fallback 提示
     - 页面可见最新状态、更新时间、操作者（占位 user id 可接受）
5. **反馈文案与运营可用性增强**（状态：`✅ 已完成（当前轮）`）
   - 已完成：审核台支持状态筛选（全部/草稿/待审核/通过/拒绝/发布）
   - 已完成：审核队列 API 支持 `status` 服务端筛选参数
   - 已完成：审核台默认视图调整为“待审核”
   - 已完成：审核台支持分页（默认每页 4 条）
   - 已完成：审核操作日志面板（success/fallback/error）
6. **文档同步（必须）**（状态：`✅ 已完成（本次）`）
   - 更新 `README.md`
   - 更新 `web/README.md`
   - 更新 `docs/ai-handoff.md`
   - 更新 `docs/current-build-status.md`

## 每轮常规动作（必须执行）

以后每次你说“继续”或“同步进展”，默认都执行这 4 步：

1. 对照根 `README.md` 的 To Do 看板检查状态变化
2. 更新 `web/README.md` 的工程执行状态
3. 对齐 `docs/ai-handoff.md` 与 `docs/current-build-status.md`
4. 回写本轮同步记录到 `docs/README.md`

## To Do 状态看板（README 对齐版）

最后更新：2026-05-09（本轮）

说明：详细任务拆分、实时进展、并行协作状态请以 [docs/todo-live.md](docs/todo-live.md) 为准；本节仅保留摘要。

状态说明：

- `✅ 已完成`：本仓库已有实现与文档记录
- `⏳ 进行中`：已有部分实现，仍缺联调或稳定性验证
- `⬜ 未开始`：尚未进入开发

| 模块 | 当前状态 | 说明 |
| --- | --- | --- |
| 投稿草稿写入 `submissions` | ✅ 已完成 | 已有 `/submit` 表单 + `/api/submissions/drafts` + Directus fallback |
| 合作申请写入 `match_applications` | ✅ 已完成 | 已有详情页申请表单 + `/api/requests/[slug]/apply` |
| 收藏切换写入 `saved_items` | ✅ 已完成 | 已支持 `targetType/targetId` 去重切换 |
| 通知全部已读写入 `notifications` | ✅ 已完成 | `/me` 已挂动作按钮与批量更新逻辑 |
| 合作需求草稿写入 `partnership_requests` | ✅ 已完成 | `/requests` 已有草稿发布表单 |
| `/me` 多集合聚合读取 | ✅ 已完成 | `user_dashboard` 不存在时自动聚合 |
| CMS 本地实例 + 集合核验 | ✅ 已完成（本地方案） | 已通过 `cms/sql/bootstrap-minimal-business-schema.sql` 完成最小业务集合初始化 |
| 五条写链路端到端联调记录 | ✅ 已完成 | 二次复测 5/5 返回 `source=directus`，留痕见 `docs/e2e-validation-log.md` |
| 审核流 API（最小版） | ✅ 已完成 | 两条核心路由已落地并被 `/admin` 最小审核队列调用 |
| `/admin` 最小审核台 | ✅ 已完成（增强版） | 队列读取与状态操作已打通，现支持批量通过/拒绝、驳回原因、审核说明展示、请求级操作者透传与中文操作日志 |
| 审核运营增强（筛选/分页/日志） | ✅ 已完成（增强版） | 后台审核台已具备状态筛选、分页、批量审核与操作留痕能力 |
| `/admin` 抓取报告可视化（最小版） | ✅ 已完成（增强版） | 已可读取最新 `_batch-report.json` / `_import-report.json`，展示来源健康度、质量均分、导入摘要、异常提示、失败重试建议与导入失败样本 |
| `/admin` 真实进展边界梳理 | ✅ 已完成 | 已明确只有审核流和抓取报告为真实接通，其余大块仍为静态占位说明层 |
| 首页样式加载 fallback | ✅ 已完成 | 已绕过 `/_next/static/css/app/layout.css` 404，恢复首页与频道页样式加载 |
| 后台中文化 / logo / 外链修正 | ✅ 已完成 | 后台可见英文已中文化，后台主 logo 改为“大鸟无文字”，合作申请默认作品集链接改为站内 `/me` |
| 前台站内搜索（增强版） | ✅ 已完成（增强版） | 已支持类型筛选计数、排序、分组空态引导与移动端搜索入口样式优化（仍基于现有内容服务层） |
| 前后台 Tab icon 统一 | ✅ 已完成 | 前台首页与 Directus 后台浏览器 Tab icon 已统一为同一套“仅鸟头”标；前端文件级 icon 与 metadata icon 已同步改为透明 64x64 输出 |
| 首页 Hero 与登录页语言系统统一 | ✅ 已完成 | 首页麦当劳案例位已改为真实 Hero 轮播，采用浮动箭头；标签规则收敛为“一个主类型 + 两个以内主题标签 + 一句辅助说明”，并继续向 `/auth` 的品牌引导区 + 任务面板语言系统对齐 |
| Directus 后台品牌/语言基线 | ✅ 已完成（本地实例） | 项目名/logo/favicon 已切为 QiuQiuTech，默认语言与管理员语言已切为 `zh-CN` |
| Directus 后台初始化脚本（品牌/语言） | ✅ 已完成 | `node cms/scripts/apply-branding-and-language.mjs` 可重复执行后台品牌与中文语言初始化 |
| Directus 后台初始化脚本（角色/策略基线） | ✅ 已完成 | `node cms/scripts/seed-roles-and-policies.mjs` 可创建/复用 `Member`、`Verified Member`、`Operator` 与对应 policy/access |
| Directus 后台基础初始化入口 | ✅ 已完成 | `node cms/scripts/init-local-foundation.mjs` 可一键串行执行品牌/语言与角色/策略基线初始化 |
| Directus 后台基础基线自检 | ✅ 已完成 | `node cms/scripts/verify-local-foundation.mjs` 可校验品牌/语言/角色/policy/access 是否已对齐 |
| 浏览器本地预览 | ✅ 已完成 | 开发服务可通过 `http://127.0.0.1:3000` 访问 |
| 内容读取链路（Directus 优先，第一阶段） | ✅ 已完成 | `cms-client` 已完成 snake_case 兼容映射，`/` `/contents` `/topics` `/requests` 连通性复测均 `200` |
| 最小会话登录链路（T07 第一阶段） | ⏳ 进行中 | 已有 `GET/POST/DELETE /api/auth/session`、请求级 userId 注入与升级后的高保真 `/auth` 登录界面；本轮已补 `user_profiles` 最小资料同步写入、注册面板“机构/城市”可选录入与 `/me` 私有聚合读取，待在 `NEXT_PUBLIC_USE_DIRECTUS=true` 下完成真实资料联调，并继续接微信扫码与真实账号体系 |
| 抓取管道 MVP（T08） | ✅ 已完成（MVP） | 已有链接抓取/批量抓取/导入待审核池/去重/失败重试/cron 入口/告警脚本，并补齐质量评分、来源健康度统计与批次报告输出 |

补充：

- `/auth` 本轮已按 C 端展示优先做收瘦，减少说明层与内部过程式表达，保留更轻量的登录动作与差异化价值信息
- `/auth` 登录信息架构已重构为“直接登录 / 去注册”双入口；登录内部再区分账号密码、手机验证码、微信扫码
- 首页 Hero 本轮已重构为真实轮播组件，采用浮动箭头切换，并把标签表达收束为“主类型 + 主题标签”两层，避免首页与登录页出现互相打架的语义体系
- 当前本地前端开发入口为 [http://127.0.0.1:3000](http://127.0.0.1:3000)
- T07 本轮已继续向真实用户资料前进：`POST /api/auth/session` 在 Directus 模式下会同步 `user_profiles` 最小资料，`/me` 聚合读取改为优先走带鉴权的私有查询；当前运行中的本地服务若仍为 `NEXT_PUBLIC_USE_DIRECTUS=false`，则用户中心继续回退 mock 兜底

### 下一步执行建议（本周）

1. 将审核台从当前最小 cookie 会话继续升级到真实登录态与后台账号体系
2. 补齐联调截图与后台 UI 侧证据（当前已有 API + 数据留痕）
3. 追踪 `/collections` API 的权限根因（不阻塞当前开发链路）
4. 将抓取报告从 `tmp/` 读文件升级为可持久化任务中心与人工处理动作
5. 将 Directus 初始化从“品牌/语言 + 角色/策略”继续扩展到集合、字段、细粒度权限与种子数据全套脚本

补充：

- 前台本地开发已切换为 `webpack` 模式，原因是路径迁移后 Turbopack 对旧 `.next` 输出目录反复触发 HMR 写入异常，表现为首页持续刷新、tab 点击无响应。
- 首页标签页标题已参考 SocialBeta 调整为“品牌名｜核心定位”，当前为 `QiuQiuTech｜营销行业实时洞察与合作对接平台`；内页继续保持“页面名 | 品牌名”。
- 前台与后台品牌资源已进一步收敛为透明底版本：前台头部使用“鸟头 + 文字”，后台主 logo 使用“大鸟无文字”，Chrome Tab / favicon 使用“仅鸟头”。
- 前台搜索框此前是静态占位，不是 bug；当前已补成最小可用版，支持 `/search?q=` 搜索 `contents/topics/requests`。
- 本地 Directus 后台基础初始化当前推荐顺序为：SQL 最小业务集合 -> `node cms/scripts/init-local-foundation.mjs` -> `node cms/scripts/verify-local-foundation.mjs`。
