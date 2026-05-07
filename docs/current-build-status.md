# Current Build Status

最后更新：2026-05-07

## 当前阶段

QiuQiuTech 目前已经从「纯骨架」进入：

**前台高保真框架 + 动态派生展示层 + Directus 接入前准备阶段。**

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

### 2. UI 框架

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

当前使用的是 logo mark 路线，不再是默认图标。

### 6. Git 交接文档

本轮已补入：

- `docs/ai-handoff.md`
- 根目录 `README.md` 的接手说明更新
- `docs/README.md` 的文档真值顺序更新

现在仓库已经明确约定：以后每次同步 Git，都需要同时同步最新进展、当前状态、下一步和整体规划。

## 当前未完成

### 1. 真实 CMS 数据接入

虽然前端已具备：

- `cms-types.ts`
- `cms-client.ts`
- `content-service.ts`

但目前仍以 mock data + 派生逻辑为主，还没有真正连上 Directus 实例和 collections。

### 2. 投稿真实表单

现在投稿页是高保真结构页面，还没接：

- 真实表单字段提交
- 图片上传
- 草稿保存
- 审核状态查询

### 3. 合作申请真实流程

当前合作页展示逻辑已有，但还没接：

- 发布合作卡
- 申请合作
- 联系方式保护
- 后台审核流

### 4. 抓取脚本

`scripts/` 层还未正式创建与接入，抓取和导入仍是文档与架构准备状态。

### 5. 真实账户体系

虽然现在已经有：

- `account-service.ts`
- `mock-account-service.ts`
- `/auth`
- `/me`

但还没有接：

- 真实登录态
- 真实用户资料
- 真实收藏 / 通知 / 合作申请接口

### 6. 构建稳定性复核

2026-05-07 本地执行 `npm run build` 时，`/me` 页曾出现一次预渲染报错：

- `ReferenceError: label is not defined`

本轮已对该页统计卡的渲染键值逻辑做了收敛处理，并已重新执行 build 验证通过。当前可以把“前端可生产构建”视为已验证结论。

## 当前最适合继续推进的顺序

1. 起 Directus 本地实例
2. 建 collections
3. 对齐前台真实字段
4. 接内容列表 / 详情
5. 接投稿表单与状态
6. 接合作卡与申请流
7. 再接抓取与同步脚本
