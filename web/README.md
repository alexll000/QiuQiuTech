# QiuQiuTech Web

这是 QiuQiuTech 当前实际开发中的前端工程。

它基于：

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- App Router

## 这部分代码现在负责什么

当前 `web/` 负责：

- 前台整站框架
- 首页主视觉与频道页高保真方向稿
- SEO 基础设施（metadata / robots / sitemap / JSON-LD）
- 内容 / 事件 / 玩法 / 专题 / 对接 / 投稿 / 榜单 / 登录 / 用户中心 / 后台入口页面
- 基础详情页演示
- 品牌色、导航、页脚和平台级页面骨架组件

当前 `web/` 还**不负责**：

- 真实数据库
- 真实后台审核逻辑
- 抓取任务执行
- 真实登录态
- 真实 API

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
```

## 当前目录结构

```text
web/
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
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
│  │  └─ auth-modal.tsx
│  └─ lib/
│     ├─ site-data.ts
│     ├─ content-service.ts
│     ├─ account-service.ts
│     ├─ cms-client.ts
│     ├─ cms-types.ts
│     ├─ form-blueprints.ts
│     ├─ mock-account-service.ts
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
- `/auth`：登录 / 注册占位
- `/me`：用户中心
- `/admin`：后台入口骨架

### 已有演示详情页

- `/contents/[slug]`
- `/requests/[slug]`
- `/topics/[slug]`

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
- 账号登录与微信扫码登录入口
- 后续顶部弹窗登录复用

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
- 后台也要品牌统一，但不能做成花哨 demo

## 开发注意事项

1. 当前路由命名以最新 brief 为准，不再使用旧的 `/content`、`/connect`
2. 如果你看到 `docs/` 里还有旧文档，先以根目录 `README` 和外部最新 brief 为准
3. 当前项目还没拆成 `web / admin / api` 三工程，后台只是前端骨架入口
4. 接真实数据前，尽量继续复用 `platform-ui.tsx` 这一层，不要每个页面重新写一套

## 下一步最合理的开发顺序

1. 设计并落库真实数据模型
2. 选定后台底座方案
3. 接 Directus + PostgreSQL
4. 接内容系统 API
5. 接投稿审核流
6. 接合作对接流
7. 再补搜索、SEO、数据看板与后台真实交互
