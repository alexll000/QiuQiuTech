# Latest Conversation Brief

最后更新：2026-05-09 12:40 (UTC+8)

## 这份 Brief 用来干什么

给下一位 AI 一个最短接棒入口。

先读这份，再按本文末尾的顺序继续深入，不需要先通读全部长文档。

## 当前一句话状态

QiuQiuTech 现在处于：

**前台高保真框架已成型，最小审核流与抓取报告面板已接通，Directus 仍处于“部分真读 + 部分 fallback”的灰度联调阶段。**

## 当前最重要的系统名

前端体验开发统一走：

**`QiuQiuTech Frontend Experience Workbench`**

它不只管 UI，还一起管：

- 页面结构
- 状态设计
- CTA 主次
- 用户路径
- 前端体验收口

对其他 AI 的最短说明：

> 当前前端统一走 `QiuQiuTech Frontend Experience Workbench`：先 Storybook，后页面；先 primitives，后业务模块；不要直接在页面里临时发明一套新 UI，同时要一起处理页面结构、状态设计、CTA 主次和用户路径。

## 本轮已经做完什么

1. 接入了 Storybook 10 + shadcn-compatible primitives，并落成前端体验工作台基线。
2. 把搜索、表单控件、首页 Hero 等高频模块逐步纳入 workbench。
3. 首页做了两轮收口方向：
   - Hero 轮播替代静态大卡
   - 首屏逻辑更明确地围绕"看什么 / 升温什么 / 去哪里行动"
4. 最小审核流、抓取报告面板、登录最小闭环、5 条动作写链路都已落地并有文档记录。
5. **全站阴影系统升级为风格 A（深色投影浮起）**：18+ 文件统一双层阴影，基准色 rgba(18,36,96)，iOS 卡片感。
6. **首页重设计 v2/v3 落地**：务实文案方向、精选案例 Tab 切换组件、趋势区域标签填充。
7. **标签设计系统文档**（`docs/tab-design-system.md`）与首页 v3 协同完成。

## 当前最需要注意的边界

1. **不要把首页、登录页、用户中心再做回 demo 感页面。**
2. **不要在公开前台暴露 mock/fallback/admin-mock/会话 ID/体验账号。**
3. **不要只改视觉，不看页面结构、用户路径和 CTA 主次。**
4. **不要把 `/admin` 视觉面积误判成“后台已经做完”。**
5. **不要删 fallback 保护层，除非真实链路已经完整替代并验证。**

## 下一位 AI 最合理的接手方向

优先顺序建议：

1. 继续做首页第二轮收口，把首页剩余模块统一到同一套语言和层级。
2. 继续把 `auth / submit / requests` 的关键页面状态纳入 Frontend Experience Workbench。
3. 再推进 Directus 真读链路，逐步减少首页和内容页对 fallback 的依赖。

## 接手前先读这 5 份

1. [README.md](../README.md)
2. [web/README.md](../web/README.md)
3. [ui-workbench.md](./ui-workbench.md)
4. [ai-handoff.md](./ai-handoff.md)
5. [todo-live.md](./todo-live.md)
