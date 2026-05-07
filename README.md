# QiuQiuTech

QiuQiuTech 是一个面向品牌方、市场人、营销从业者、代理公司与独立操盘手的营销行业平台。

它不是传统资讯站、论坛或招聘站，而是一个：

**以结构化内容为入口、以投稿审核为增长机制、以合作撮合为差异化价值的营销行业平台。**

## 当前状态

当前最新开发交接真值源：

- [docs/ai-handoff.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/ai-handoff.md)
- [docs/current-build-status.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/current-build-status.md)

当前仓库已经完成的是：

- 一套可运行的前台站点框架
- 首页高保真方向稿
- 内容中心 / 合作对接 / 投稿中心的高保真 UI 方向稿
- 首页与核心频道页 SEO 元数据基础层
- 登录 / 用户中心 / 后台入口骨架
- 基础内容详情 / 专题详情 / 合作详情演示数据

当前还没有完成的是：

- 真实后端 API
- Directus collections 与真实数据库落地
- 抓取管道
- 投稿表单与审核工作流落库
- 合作申请与后台真实操作

也就是说，**现在是“可继续正式开发的产品框架阶段”**，不是最终可上线版本。

## 当前技术栈

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- App Router

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

常用检查命令：

```bash
cd web
npm run lint
npm run build
```

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

1. [QiuQiuTech_Full_Development_Brief_v2.md](/Users/stonework/Downloads/QiuQiuTech_Full_Development_Brief_v2.md)
2. [docs/ai-handoff.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/ai-handoff.md)
3. [docs/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/README.md)
4. [web/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/README.md)
5. [cms/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/cms/README.md)
6. [docs/deployment-plan.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/deployment-plan.md)
7. [docs/seo-content-publishing.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/seo-content-publishing.md)
8. [docs/directus-initialization-checklist.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-initialization-checklist.md)
9. [docs/directus-collections-matrix.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-collections-matrix.md)

## 注意事项

- 当前 `docs/` 下有一批早期 v1 文档，它们仍有参考价值，但**不能作为当前实现的最终真值源**
- 当前真实实现以：
  - 最新用户要求
  - `QiuQiuTech_Full_Development_Brief_v2.md`
  - 当前 `web/src/` 代码状态
  为准
- 现在还不是 monorepo，也还没拆成 `web / admin / api` 三层工程，只是先把前台平台框架跑起来了
- 以后每次同步 Git，默认需要同步更新 `docs/ai-handoff.md`，把最新进展、当前状态、下一步和整体规划一起提交

## 下一阶段建议

下一阶段最值得直接推进的是两件事：

1. 起 Directus 本地实例并建立核心 collections
2. 把前台演示数据换成真实 schema 与服务端数据流
