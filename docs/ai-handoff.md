# AI Handoff

最后更新：2026-05-07

## 这份文档的用途

这份文档是 QiuQiuTech 当前面向下一个 AI 接手开发的主交接文档。

以后每次同步 Git / GitHub，都默认要更新这里，至少补齐：

1. 最新进展
2. 当前真实状态
3. 下一步计划
4. 整体路线图
5. 已验证和未验证项

## 项目目标

QiuQiuTech 的目标不是做普通资讯站，而是做一个以营销内容为入口、以投稿审核为增长机制、以合作撮合为差异化价值的公开 Web 平台。

核心主线仍然是：

1. 营销内容
2. 用户投稿并审核发布
3. 品牌 / 市场人 / 代理公司 / 独立操盘手之间的合作对接

## 当前仓库结构

```text
QiuQiuTech/
├─ cms/    # Directus 本地启动骨架、环境示例和后台说明
├─ docs/   # 产品、技术、部署、交接文档
└─ web/    # Next.js 前台工程，当前实际开发主体
```

## 最新进展

截至 2026-05-07，已经推进到：

1. 前台公开站点主路由全部补齐，包括首页、内容、事件、玩法、专题、合作、投稿、榜单、登录、用户中心和后台入口骨架。
2. 页面层已经从纯说明式占位推进到高保真产品方向稿，且整体品牌风格已统一到深蓝 / 青绿 / 暖黄体系。
3. SEO 基础设施已经建好，包括 metadata、canonical、Open Graph、Twitter metadata、`robots.ts`、`sitemap.ts`、站点级 JSON-LD。
4. 内容页、专题页、合作页已有演示详情结构，首页和部分频道页已有从数据中派生展示模块的逻辑，不再完全依赖纯静态介绍文案。
5. Directus 接入准备层已经补入 `cms-client.ts`、`cms-types.ts`、`content-service.ts` 等前端契约代码，`cms/` 目录也已补齐基础启动文件。
6. 本轮已补充 Git 同步约定，后续仓库提交不只同步代码，也同步项目状态、路线图和 AI 交接信息。

## 当前真实状态

### 已完成

- `web/` 可作为当前前台主工程继续开发。
- 公开站点的信息架构和主导航已基本固定。
- 多个页面已具备统一壳层、统一组件、统一品牌风格。
- Directus 作为第一阶段后台路线已经明确。
- 项目文档已经能支撑下一位 AI 快速理解目标、结构和开发顺序。

### 正在进行但未闭环

- 真实 CMS 数据还未真正连上前台。
- 投稿真实表单、合作真实流程、审核流、登录态仍未落库。
- 抓取脚本与导入流程还停留在文档设计阶段。

### 当前已验证项

2026-05-07 本地验证结果：

- `web` 的 `npm run lint` 已通过。
- `web` 的 `npm run build` 已通过。
- `/me` 页此前的预渲染报错 `ReferenceError: label is not defined` 已在本轮修正，当前静态构建恢复正常。

### 当前未验证项

- Directus 本地实例是否已完整启动并能被前台读取。
- `NEXT_PUBLIC_USE_DIRECTUS=true` 时首页、列表页、详情页是否都能按预期回退和读取。
- 投稿、合作、用户中心、后台入口是否具备真实可提交的数据流。

## 当前最重要的产品判断

1. 当前阶段重点不是继续堆更多页面，而是把现有页面的真实数据链路接上。
2. 前端页面结构已经足够支撑下一阶段开发，后续重心应该转向数据模型、后台 collection、审核流和 API 接线。
3. `docs/` 下的历史 v1 文档只能做参考，不能覆盖当前 README、最新 brief 和当前代码结构。

## 下一步计划

建议严格按这个顺序往下做：

1. 起本地 Directus + PostgreSQL，确认后台底座能稳定运行。
2. 按 `directus-collections-matrix.md` 和 `data-model.md` 建 collections。
3. 对齐 `cms-types.ts` 与 Directus 字段，避免前台和 CMS 契约分叉。
4. 先接首页、内容列表、内容详情、专题列表、专题详情。
5. 再接合作需求列表 / 详情与申请流。
6. 再接投稿表单、审核状态查询、驳回原因回显。
7. 最后补抓取导入、榜单数据、搜索和后台指标。

## 整体路线图

### Stage 1: 前台框架固化

- 完成主路由和高保真页面框架
- 完成品牌视觉和 SEO 基建
- 为 CMS 接入预留数据契约层

当前基本处于这个阶段的尾声。

### Stage 2: CMS 落地

- 起 Directus
- 建 PostgreSQL
- 建内容、专题、投稿、合作、展示位等 collections
- 前台开始替换 mock data

这是当前最应该推进的阶段。

### Stage 3: 审核与协作流程

- 投稿审核
- 合作审核
- 用户中心真实状态
- 后台运营入口真实化

### Stage 4: 内容供给和增长系统

- 抓取与导入
- 榜单趋势与数据聚合
- 搜索与筛选增强
- SEO 细修与发布节奏

## 下一个 AI 接手时先做什么

先读：

1. [README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/README.md)
2. [docs/ai-handoff.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/ai-handoff.md)
3. [docs/current-build-status.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/current-build-status.md)
4. [docs/directus-collections-matrix.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-collections-matrix.md)
5. [docs/data-model.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/data-model.md)
6. [web/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/README.md)
7. [cms/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/cms/README.md)

然后先检查：

1. `web` 是否能 `npm run lint`
2. `web` 是否能 `npm run build`
3. Directus 是否已启动
4. 当前是否继续使用 mock data

## Git / GitHub 同步约定

以后用户说“更新 Git”或“同步 GitHub”，默认动作是：

1. 更新代码
2. 更新 `docs/current-build-status.md`
3. 更新 `docs/ai-handoff.md`
4. 更新根目录 `README.md` 中的接手说明
5. 把“最新进展 / 当前状态 / 下一步 / 整体规划 / 已验证项”一起提交

不要只推代码，不更新交接信息。
