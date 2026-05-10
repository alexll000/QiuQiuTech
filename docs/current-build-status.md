# Current Build Status

最后更新：2026-05-09 17:32 (UTC+8)

## 当前阶段

QiuQiuTech 目前已经从「纯骨架」进入：

**前台高保真框架 + 动态派生展示层 + Directus 接入前准备阶段。**

补充（2026-05-07 晚间）：**投稿草稿与合作申请已具备可填写表单 + 本地 API + Directus 落库骨架**（开启 Directus 后生效，失败可回退 mock）。

## 已完成

### 1. 前台信息架构

已具备公开站点主路由：

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

以及内容 / 专题 / 合作详情页。

### 2. 前端体验框架

以下页面已经从早期说明式页面，推进为更接近真实产品的高保真结构：

- 首页
- 内容中心
- 营销事件
- 玩法拆解
- 专题策展
- 合作对接
- 投稿中心
- 榜单趋势
- 后台运营台入口

本轮新增一层 Frontend Experience Workbench 基线：

- `web/.storybook/*` 已接入 Storybook 10
- `web/components.json` 已作为 shadcn-compatible 配置入口
- `web/src/lib/utils.ts` 已提供统一 `cn()`
- `web/src/components/ui/button.tsx` 已作为第一个基础 primitive
- 已补品牌 token、按钮状态、表单控件、搜索、表单工作台、首页 Hero 与平台模式组件 stories，后续前端开发不再只靠页面内联堆样式
- 这套体系在仓库内统一命名为 `QiuQiuTech Frontend Experience Workbench`

### 3. 数据展示逻辑

前台已经不再完全依赖静态说明常量。

当前已开始做“从内容与合作数据中派生展示模块”的页面包括：

- 首页精选案例
- 首页趋势关键词
- 首页玩法关键词
- 首页实时事件
- 首页合作卡
- 内容中心标签展示
- 合作广场标签展示
- 专题页内容数 / 合作数 / 标签
- 榜单页品牌 / 关键词 / 内容 / 合作信号
- 用户中心账户工作台数据
- 投稿中心与合作申请流程蓝图
- 收藏 / 通知已读 / 保存草稿 / 申请合作的本地动作接口壳层
- 收藏 / 保存草稿 / 申请合作 / 通知已读动作已挂入对应页面
- `/submit` 投稿草稿表单已接入，可调用 `/api/submissions/drafts` 保存草稿（Directus 模式可落 `submissions`）
- `/requests/[slug]` 合作申请表单已接入，可调用 `/api/requests/[slug]/apply` 创建申请（Directus 模式可落 `match_applications`）
- 收藏动作已支持携带 target 信息并调用 `/api/me/saved-items/toggle`（Directus 模式可落 `saved_items`）
- 通知中心“标记全部已读”已支持调用 `/api/me/notifications/read`（Directus 模式可更新 `notifications.is_read`）
- `/me` 用户中心数据读取已升级：优先读 `user_dashboard`，缺失时自动聚合 `user_profiles/submissions/saved_items/match_applications/notifications`
- `/requests` 已新增合作需求草稿表单，可调用 `/api/requests/drafts`（Directus 模式可落 `partnership_requests` 草稿）
- 最小审核 API 已上线：`/api/admin/submissions/[id]/review`、`/api/admin/requests/[id]/review`
- 审核队列 API 已上线：`/api/admin/submissions/review-queue`、`/api/admin/requests/review-queue`
- `/admin` 已接最小审核台：支持队列读取、状态流转操作、success/fallback/error 反馈
- `/admin` 审核台已补运营增强：状态筛选、分页、批量通过/拒绝、驳回原因、审核说明展示、中文操作日志，并默认展示“待审核”
- 最小会话登录链路已补：`POST/DELETE /api/auth/session`，`/api/me/*` 与动作写链路已支持请求级用户 ID
- `POST /api/auth/session` 本轮已支持在 Directus 模式下同步 `user_profiles` 最小资料（昵称/手机号/来源等）
- `/auth` 注册面板本轮已新增可选“所属机构 / 所在城市”输入，可直接进入用户资料同步链路
- `/me` 的 `account-service` 本轮已切到优先使用带鉴权的私有聚合查询，减少因 public permission 不足导致整个用户中心回退 mock
- 登录页面已接会话动作：`/auth` 可触发登录写 cookie，`/me` 已可执行退出登录
- `/auth` 登录界面已升级为高保真结构：补齐账号体验/微信扫码双入口、体验账号快捷填充、前置校验与状态反馈
- `/api/auth/session` 已补 `GET` 会话识别；`/auth` 已补验证码体验、注册体验与当前会话清理入口
- 前端开发服务已确认恢复：`http://127.0.0.1:3000` 当前可正常访问 `/`、`/auth`、`/me`
- `/auth` 展示层已从“说明型页面”收敛为更轻量的 C 端登录入口，减少冗余说明卡片与内部流程表达
- `/auth` 信息架构已重构为“直接登录 / 去注册”双入口，登录内部仅保留账号密码、手机验证码、微信扫码三种方式
- `/auth` 已补各登录方式的适用说明与登录/注册互跳引导，整体更接近正式产品入口
- `/auth` 已继续移除开发场景痕迹与容易分散注意力的说明层，结构更接近公开站登录页
- `/auth` 已进一步优化为“品牌引导区 + 登录任务面板”的结构，排版与层级更接近正式上线页
- 已把“公开前台禁止暴露内部开发状态、账户流程必须按用户任务组织”提升为系统级硬约束，并同步进入工程/UI/协作文档
- 首页 Hero 本轮已重构为真实轮播组件，采用浮动箭头切换；标签与说明层级已按“一个主类型 + 两个以内主题标签 + 一句辅助说明”收口，并继续向登录页语言系统对齐
- 头部搜索框已接最小版搜索：跳转 `/search?q=`，聚合 `contents/topics/requests` 三类结果
- 首页首屏本轮已进一步向产品入口收口，围绕“看什么 / 升温什么 / 去哪里行动”组织信息层级，而不是只做图表 + 案例堆叠

### 4. SEO 基建

已具备：

- metadata
- canonical
- Open Graph
- Twitter metadata
- `robots.ts`
- `sitemap.ts`
- JSON-LD

并且 `auth / me / admin` 已做 `noIndex`。

### 5. 品牌资源

已处理：

- header logo
- favicon
- app icon
- apple icon

当前已统一为透明底资源：

- 前台头部：鸟头 + 文字版本
- 后台主 logo：仅鸟头大图版本
- Chrome tab / favicon / app icon / apple icon：仅鸟头版本
- 前台首页 Tab 与 Directus 后台 Tab 已对齐为同一套“仅鸟头” icon；前端文件级 icon 与 metadata icon 已统一为透明 64x64 输出

### 6. Git 交接文档

本轮已补入：

- `docs/ai-handoff.md`
- 根目录 `README.md` 的接手说明更新
- `docs/README.md` 的文档真值顺序更新

现在仓库已经明确约定：以后每次同步 Git，都需要同时同步最新进展、当前状态、下一步和整体规划。

### 7. Directus 读链路灰度补强（本轮）

- `web/src/lib/cms-client.ts` 已补服务端鉴权重试：当公开 `GET /items/*` 因 `401/403` 失败时，会自动改走带管理员 token 的服务端请求，再决定是否回退 mock。
- 这让当前 `NEXT_PUBLIC_USE_DIRECTUS=true` 的运行态不再完全依赖“公开权限刚好配对”，更接近真实联调环境。
- 本轮同时确认：当前 Directus 侧仍不是所有集合都已真正打通。实际探测里：
  - `partnership_requests` 可通过鉴权正常读取
  - `contents`、`homepage_payload` 仍返回 `FORBIDDEN`
- 结论：前台当前仍处于“部分 Directus 真读 + 部分 fallback/mock 兜底”的灰度状态，下一步需要继续补齐 Directus schema/permission 真值，而不是只看页面 200。

## 当前未完成

### 1. 真实 CMS 数据接入

虽然前端已具备：

- `cms-types.ts`
- `cms-client.ts`
- `content-service.ts`

当前仍以 mock data + 派生逻辑为主做页面兜底，但本地联调环境已通过 SQL bootstrap 接入最小 Directus 业务集合。

### 2. 投稿真实表单

现在投稿页是高保真结构页面，还没接：

- 真实表单字段提交
- 图片上传
- 审核状态查询

### 3. 合作申请真实流程

当前合作页展示逻辑已有，但还没接：

- 发布合作卡
- 联系方式保护
- 后台审核流（最小版已接入，待补权限与审计留痕深度）

### 4. 抓取运营闭环

`scripts/` 已进入第一阶段可执行状态：

- `scripts/crawl/fetch-url-to-json.mjs`：单链接抓取与字段结构化
- `scripts/crawl/fetch-batch-from-list.mjs`：按来源列表批量抓取
- `scripts/crawl/crawl-report-utils.mjs`：结构化质量评分与来源健康度汇总
- `scripts/import/import-submissions-to-directus.mjs`：导入 `submissions` 待审核池
- `scripts/sync/crawl-and-import.mjs`：抓取 + 导入一键执行（含去重）
- `scripts/import/retry-failed-imports.mjs`：失败日志回放重试
- `scripts/sync/run-crawl-cron.sh`：定时任务执行入口

当前补充能力：

- 单条抓取结果新增 `quality.score / grade / warnings`
- 批量抓取新增 `_batch-report.json`，可查看每个来源的 `successRate / avgQualityScore / healthLevel`
- 导入阶段新增 `_import-report.json`，可查看 imported / skipped / failed 汇总

本轮已实测导入：`submissions.id=4/5`，重复内容可跳过。

### 5. 后台抓取报告可视化（最小版）

`/admin` 已新增最小抓取报告面板：

- 读取仓库根 `tmp/` 下最新 `_batch-report.json`
- 读取仓库根 `tmp/` 下最新 `_import-report.json`
- 展示来源健康度、质量均分、批次成功率、导入摘要与异常提醒

当前实现落点：

- `web/src/lib/crawl-report-service.ts`
- `web/src/components/admin-crawl-ops-panel.tsx`
- `web/src/app/admin/page.tsx`

本轮补充：

- 新增失败重试建议区，固定展示当前标准重试命令
- 新增导入失败样本区，优先展示最近失败文件与状态码

### 5.1 后台真实进展边界（新增）

当前 `/admin` 并不是完整后台，只完成了第一阶段最小运营闭环：

- 真实接通：`AdminReviewQueue`、`AdminCrawlOpsPanel`
- 静态占位：顶部运行状态卡、左侧导航、首页/专题展示位区块、Operator Notes、其余后台模块入口

这部分要特别注意：

- 如果后续 AI 仅看页面视觉，很容易误以为“后台已经做完”
- 当前真实状态应按 `docs/todo-live.md` 的 `T03`、`T13`、`T18` 理解，而不是按视觉面积判断

### 6. Directus 后台品牌与中文语言基线

本地 Directus 实例当前已完成：

- `project_name`：`QiuQiuTech`
- `project_descriptor`：`球球科技后台管理系统`
- `project_logo` / `public_favicon`：已替换为项目品牌资源
- `default_language`：`zh-CN`
- 管理员用户 `language`：`zh-CN`

补充：

- 已新增 `cms/scripts/apply-branding-and-language.mjs`
- 可通过 `node cms/scripts/apply-branding-and-language.mjs` 幂等复用品牌资源并重放后台品牌/语言设置
- 该脚本当前默认将后台 `project_logo` 指向 `web/public/qiuqiutech-admin-logo.png`

### 7. Directus 后台初始化脚本化（第一阶段）

当前已脚本化：

- 项目名
- 项目描述
- 项目主色
- 后台 logo / favicon
- 默认语言
- 管理员语言
- `Member` 角色
- `Verified Member` 角色
- `Operator` 角色
- 对应第一阶段 policy
- 对应 role-policy access 绑定

本轮新增：

- `cms/scripts/seed-roles-and-policies.mjs`
- `cms/scripts/init-local-foundation.mjs`
- `cms/scripts/verify-local-foundation.mjs`

当前推荐执行方式：

- 先执行 SQL 最小业务集合初始化
- 再执行 `node cms/scripts/init-local-foundation.mjs`
- 最后执行 `node cms/scripts/verify-local-foundation.mjs`

当前尚未脚本化：

- 更细粒度权限规则
- 更多集合/字段
- 更完整的后台种子数据

### 8. 真实账户体系

虽然现在已经有：

- `account-service.ts`
- `mock-account-service.ts`
- `/auth`
- `/me`

但还没有接：

- 真实登录态
- 真实用户资料
- 真实收藏 / 通知 / 合作申请接口

补充（2026-05-09）：

- 用户最小资料同步已前进一步：注册/登录会在 Directus 模式下尝试写入 `user_profiles`
- 当前运行中的本地服务若仍为 `NEXT_PUBLIC_USE_DIRECTUS=false`，则 `/api/me/dashboard` 继续返回 mock 兜底数据；这是当前联调环境开关导致的预期表现，不是回归

### 9. 构建稳定性复核

2026-05-07 本地执行 `npm run build` 时，`/me` 页曾出现一次预渲染报错：

- `ReferenceError: label is not defined`

本轮已对该页统计卡的渲染键值逻辑做了收敛处理，并已重新执行 build 验证通过。当前可以把“前端可生产构建”视为已验证结论。

补充（2026-05-08 晚间）：

- 本地开发环境曾出现 Turbopack HMR panic，错误指向旧机器绝对路径 `<old-machine-path>/web/.next/...`
- 表现为：首页持续刷新、tab 点击无响应
- 当前已切换 `web/package.json` 的 `dev` 脚本为 `next dev --webpack`，并清理 `.next` 后重启
- 验证：`HEAD /`、`HEAD /contents`、`GET /` 均返回 `200`
- 首页 metadata 已参考 SocialBeta 收敛：首页使用“品牌名｜核心定位”，频道页保留“页面名 | 品牌名”

### 10. 站内搜索（增强版，非全文检索）

当前已补齐搜索增强版（仍在现有内容服务层内）：

- ~~头部搜索框~~ → 改为**弹出式搜索面板**（`SiteSearchPanel` 组件）
  - 点击头部"搜索"按钮 → 弹出下拉面板（不跳转全页）
  - SocialBeta 式搜索入口：头部仅保留“搜索”触发按钮
  - 展开层改为“标题 + 输入框 + 深色搜索按钮 + 热门搜索”结构
  - 热门标签快速搜索
  - 实时搜索结果（防抖 300ms，调用 `/api/search`）
  - 键盘导航支持（↑↓ 选择，Enter 跳转，ESC 关闭）
  - 移动端与桌面端共用同一套展开层结构
- 新增 `/search` 页面（搜索结果页保留）
- 支持通过 `q` 参数聚合搜索：
  - `contents`
  - `topics`
  - `requests`
- 已支持类型筛选计数（全部/内容/专题/合作）
- 已支持排序（相关度/最近更新/标题 A-Z/标题 Z-A）
- 已补分组空态建议与全局空结果引导词

当前限制：

- 还不是 Directus 全文检索
- 还没有搜索联想
- 还没有热词推荐

## 当前最适合继续推进的顺序

1. 起 Directus 本地实例
2. 建 collections
3. 对齐前台真实字段
4. 接内容列表 / 详情
5. 接投稿表单与状态
6. 接合作卡与申请流
7. 将抓取报告升级为可持久化任务中心与人工处理动作

## To Do 状态对齐说明（新增）

最后同步：2026-05-09 11:20 (UTC+8)

- 任务状态标记以根 `README.md` 的「To Do 状态看板（README 对齐版）」为准
- `web/README.md` 维护工程执行层状态，语义与根 README 保持一致
- 根 `README.md` 与 `web/README.md` 已新增“每轮常规动作（必须执行）”作为固定流程
- 当前与根 README 对齐结论：审核流 API（最小版）`✅`，`/admin` 最小审核台 `✅（增强版）`
- 联调记录模板已新增：`docs/e2e-validation-log.md`，当前处于“模板完成、实测待补”阶段
- 浏览器本地预览已验证可访问：`http://127.0.0.1:3000`
- 本文档主要承载阶段性结论与风险项，不重复维护独立状态枚举，避免多源漂移
- 项目当前有效根目录：`$QIQIUTECH_ROOT`（已完成路径迁移对齐）
- 任务拆分与实时状态请以 `docs/todo-live.md` 为准
- 已补首页稳定性防护：CMS 与 Directus 请求增加 6 秒超时，防止上游不可达造成首页持续 loading
- Directus 联调现状：`/collections` API 仍有权限问题，但已通过 `cms/sql/bootstrap-minimal-business-schema.sql` 解除本地开发阻塞并完成 5/5 真实落库联调
- 内容读取联调进展：已补 `contents/topics/homepage_payload` 最小结构与兼容映射；`/` `/contents` `/topics` `/requests` 连通性复测均 `200`
- 本轮验证结果：`npm --prefix web run lint` 与 `npm --prefix web run build` 通过；动作链路 smoke 复测 5/5 全部 `source=directus`
- 登录态进展：`/auth` 已接最小会话接口并可写入 cookie；当前仍是过渡方案，后续需接微信扫码/真实账号体系
- 抓取进展：T08 MVP 已完成，CLI + cron 链路已补齐去重、失败日志、失败回放、webhook 告警、质量评分、来源健康度统计与批次/导入报告输出；后续可把报告接入后台可视化。
- 后台抓取可视化进展：T13 已完成增强版，`/admin` 可直接消费最新抓取/导入报告，并展示失败重试建议与导入失败样本；后续再升级为持久化任务中心与人工处理动作。
- Directus 后台基线进展：T14 已完成（本地实例），后台品牌与中文语言已对齐；后续需补成可重复执行初始化脚本，避免另一台电脑重新出现默认 Directus 品牌。
- Directus 初始化脚本进展：T15 已完成第一阶段，品牌/语言可通过脚本幂等重放；后续继续脚本化角色、权限、集合与种子数据。
- 本地开发稳定性进展：已避开 Turbopack 旧路径 HMR 异常，当前开发模式以 `webpack` 为准；首页标签页标题已调整为 `QiuQiuTech`。
- 页面标题进展：已参考 SocialBeta 对齐首页/内页标题逻辑，首页为 `QiuQiuTech｜营销行业实时洞察与合作对接平台`，内页继续使用“页面名 | 品牌名”。
- 首页联调进展：麦当劳案例位已从静态大卡改为真实 Hero 轮播；标签规则与信息层级已继续向 `/auth` 对齐，减少 demo 感、重复标签与逻辑矛盾。

## 2026-05-09 下午补充

### 搜索 UI 参考 SocialBeta 风格（已完成）

- 已参考 SocialBeta 搜索界面风格设计实现
- 核心设计特点：
  - 头部“搜索”触发按钮
  - 弹出式搜索面板（非全页跳转）
  - 搜索框：标题区 + 横向输入框 + 右侧深色「搜索」按钮
  - 热门搜索：文本式 `#` 关键词
  - 实时搜索结果内嵌显示
- 新增文件：
  - `web/src/components/site-search-panel.tsx` - 弹出式搜索面板组件
  - `web/src/components/site-search-panel.stories.tsx` - 搜索面板 Storybook 基线
  - `docs/search-socialbeta-style.html` - 设计参考截图

### 图片处理工具链

- 主力方案：`uv run --with Pillow python3`（Pillow 图片处理库）
- 示例命令：
  ```bash
  uv run --with Pillow python3 << 'EOF'
  from PIL import Image
  img = Image.open("input.png")
  cropped = img.crop((0, 0, width, height))  # (left, top, right, bottom)
  cropped.save("output.png")
  EOF
  ```
- 场景：图片裁剪、元素移除、尺寸调整

### 全站阴影系统升级：风格 A（深色投影浮起）

已完成（2026-05-09 晚间）。

**设计原则**：双层阴影结构（近景浅 + 远景深），颜色基准统一为 `rgba(18, 36, 96)`，opacity 整体提升，有明显浮起感。

**更新范围（18+ 文件）**：
- `web/src/app/globals.css`：`--shadow-sm/md/lg/xl` token 全面更新，`@theme inline` 注册
- `web/src/components/ui/button.tsx`：primary / destructive / teal 变体阴影
- `web/src/components/layout/site-shell.tsx`：header / footer / CTA 按钮阴影
- 15+ 个 page 文件：home / contents / submit / admin / playbooks / requests / search / rankings / me / events / topics 等
- 10+ 个组件：home-hero-carousel / platform-ui / auth-modal / marketing-heat-trend-card 等

**技术要点**：
- 颜色基准统一 `rgba(22, 43, 117)` → `rgba(18, 36, 96)`
- 双层阴影结构（近景浅 + 远景深）
- 彩色按钮保留色系，只更新阴影结构
- 批量替换使用 Node 脚本分批执行

### 首页重设计（v2 / v3）

已完成（2026-05-09）。

**v2 方向稿**（`docs/homepage-redesign-v2.md`）：
- 趋势区域空白 → 填充热门话题标签
- 抽象文案 → 改为务实语言（"发现营销机会，对接优质资源"）

**v3 最终方向稿**（`docs/homepage-redesign-v3-final.md`）：
- UI 设计不统一 → 定义统一规范（色彩/字体/间距/圆角/阴影）
- 保留核心功能（营销热度趋势 + 精选营销项目 + 精选案例）
- Hero 文案升级："发现营销机会，对接优质资源" + "每日更新 100+ 品牌案例"
- 精选案例区升级为 Tab 切换组件（全部/短视频/社交媒体/电商/品牌营销）

### 标签设计系统

已完成（`docs/tab-design-system.md`）。
- Tab 组件设计规范（视觉/交互/动效）
- 与首页重设计 v3 协同落地

### 搜索 UI 参考 SocialBeta 风格

- 核心设计特点：
  - 头部"搜索"触发按钮
  - 弹出式搜索面板（非全页跳转）
  - 搜索框：标题区 + 横向输入框 + 右侧深色「搜索」按钮
  - 热门搜索：文本式 `#` 关键词
  - 实时搜索结果内嵌显示
- 新增文件：
  - `web/src/components/site-search-panel.tsx` - 弹出式搜索面板组件
  - `web/src/components/site-search-panel.stories.tsx` - 搜索面板 Storybook 基线
  - `docs/search-socialbeta-style.html` - 设计参考截图
