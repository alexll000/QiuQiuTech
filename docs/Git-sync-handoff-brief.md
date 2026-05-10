# Git Sync Handoff Brief

最后更新：2026-05-09 12:40 (UTC+8)

## 用途

这份 Brief 用于把当前 QiuQiuTech 项目的 Git 同步规则、交接要求和接手方式，直接复制给其他 AI 对话框。

目标不是只让 AI 帮忙 push 代码，而是让它在每次同步 Git / GitHub 时，都把项目的真实开发状态、下一步计划和接手信息一起维护好。

补充：

当前前端体验开发统一走：

- `QiuQiuTech Frontend Experience Workbench`

这意味着后续 AI 在同步 Git 时，不只要同步代码和 UI，还要同步页面结构、状态设计、CTA 主次和前端体验收口的真实进展。

## 项目基础信息

- 项目名：`QiuQiuTech`
- 当前 GitHub 仓库：`alexll000/QiuQiuTech`
- 当前主分支：`main`
- 当前仓库根目录：
  `$QIQIUTECH_ROOT`

## 你接手这个项目时的核心任务

如果用户说：

- “更新 git”
- “同步 GitHub”
- “把项目同步到 GitHub”
- “更新一下仓库”

都不要理解成只 push 代码。

默认要一起完成的是：

1. 同步最新代码
2. 更新项目当前进展
3. 更新项目最新进展
4. 更新下一步计划
5. 更新整体规划
6. 更新给下一个 AI 的交接文档
7. 检查仓库是否缺少关键源码、文档、配置样板

## 固定动作

每次做 Git 同步，固定按这个顺序执行：

1. 查看仓库状态：
   - `git status --short --ignored`
2. 检查未跟踪文件里是否有真实业务文件：
   - 源码
   - 文档
   - API route
   - `.env.example`
3. 区分三类文件：
   - 必须同步：源码、文档、README、配置样板
   - 不该同步：`node_modules`、`.next`、缓存、系统垃圾文件
   - 需要谨慎处理：私有配置、密钥、本地运行数据
4. 更新文档：
   - [README.md](README.md)
   - [docs/current-build-status.md](docs/current-build-status.md)
   - [docs/ai-handoff.md](docs/ai-handoff.md)
   - 必要时更新相关专题文档
5. 提交前做一次完整性检查：
   - 本地真实文件和 Git 已跟踪文件是否存在关键差异
6. commit
7. push
8. push 后核对远端最新 commit

## 这类文件必须优先保证不漏

### 代码

- `web/src/` 下的页面、组件、服务层、API route
- `cms/` 下的启动和环境说明

### 文档

- 根目录 `README.md`
- `docs/ai-handoff.md`
- `docs/current-build-status.md`
- `docs/directus-initialization-checklist.md`
- `web/README.md`

### 配置样板

- `web/.env.example`
- `cms/.env.example`

## 这类文件默认不要进 Git

- `web/node_modules`
- `web/.next`
- `.DS_Store`
- `.workbuddy`
- 本地 `.env`
- 本地数据库、缓存、构建输出

## 当前项目状态摘要

截至 2026-05-09，当前仓库已经具备：

1. `web/` 前台工程主框架
2. 首页、内容、事件、玩法、专题、合作、投稿、榜单、登录、用户中心、后台入口骨架
3. SEO 基建
4. Directus 接入预留层
5. AI 交接文档
6. 本地 API 契约路由
7. 最小审核台与抓取报告面板
8. `QiuQiuTech Frontend Experience Workbench`

已验证：

- `web` 的 `npm run lint` 通过
- `web` 的 `npm run build` 通过

未完成重点：

1. 继续补首页与关键页面的前端体验收口
2. Directus 真实读链路继续替换 fallback
3. 投稿真实表单补上传与审核状态查询
4. 用户中心真实账户数据继续接通
5. 抓取报告升级为持久化任务中心

## 另一个 AI 接手时先读哪些文件

1. [README.md](README.md)
2. [docs/Latest-conversation-brief.md](docs/Latest-conversation-brief.md)
3. [docs/ai-handoff.md](docs/ai-handoff.md)
4. [docs/current-build-status.md](docs/current-build-status.md)
5. [docs/Git-sync-handoff-brief.md](docs/Git-sync-handoff-brief.md)
6. [docs/directus-initialization-checklist.md](docs/directus-initialization-checklist.md)
7. [web/README.md](web/README.md)
8. [cms/README.md](cms/README.md)

## 另一台电脑继续开发的最低启动方式

前台：

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

CMS：

```bash
cd cms
cp .env.example .env
docker compose up -d
```

## 对接手 AI 的明确要求

不要把“同步 Git”理解成机械 push。

这个用户要的是：

- 仓库可继续开发
- 文档可交接
- 状态可追踪
- 下一个 AI 拉下来后能迅速接手

如果发现本地还有未提交的真实业务文件，必须先补进去再 push，不要带着漏项结束。
