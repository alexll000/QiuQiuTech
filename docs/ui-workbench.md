# Frontend Experience Workbench

最后更新：2026-05-09（并行协作命名补充）

## 系统名称

这套前端体验提效体系在仓库内统一命名为：

**`QiuQiuTech Frontend Experience Workbench`**

如需写全称，可使用：

**`QiuQiuTech Frontend Experience Workbench（Storybook + shadcn-compatible primitives）`**

以后和其他 AI、协作者或 handoff 文档沟通时，统一使用这个名字，不再分别用“storybook 那套”“UI 提效工具”“组件工作台”这类模糊说法。

## 目标

把前端开发从“直接改页面”升级为“两层并行”：

1. 页面继续在 `web/src/app/*` 里开发
2. 基础组件、版式模式、页面状态和产品逻辑先在 Storybook 里固定

这样做的目的不是多一套工具，而是降低四类返工：

- 页面越改越散
- 同一个按钮/卡片每页一套
- 只做默认态，遗漏空态、长文案态、移动端态
- 页面看起来能用，但产品逻辑、信息层级和 CTA 主次始终不稳定

## 能覆盖什么

`QiuQiuTech Frontend Experience Workbench` 不只管 UI，还统一承接 4 层问题：

1. UI 层：按钮、输入框、卡片、标签、布局模式
2. 页面层：首页、列表页、详情页、登录页、表单页
3. 状态层：默认态、空态、错误态、长文案态、移动端态
4. 产品逻辑层：信息层级、用户路径、CTA 主次、模块承接关系

## 当前已接入

位置：`web/`

- `components.json`
- `.storybook/main.ts`
- `.storybook/preview.ts`
- `src/lib/utils.ts`
- `src/components/ui/button.tsx`
- `src/stories/foundations.stories.tsx`
- `src/components/ui/button.stories.tsx`
- `src/components/platform-ui.stories.tsx`

## 本地命令

```bash
cd web
npm install
npm run storybook
```

默认地址：

- [http://localhost:6006](http://localhost:6006)

静态构建：

```bash
cd web
npm run build-storybook
```

产物目录：

- `web/storybook-static/`

## 当前工作流

以后新增或重做公开前台 UI，默认按这个顺序：

1. 先判断是不是已有 primitive / pattern 能承接
2. 若没有，先补到 `src/components/ui/*` 或 `src/components/*`
3. 为关键视觉或交互状态补 story
4. 再接入真实页面
5. 页面改完后至少复看 Storybook 和实际页面各一次

## 给其他 AI 的标准说明

并行接棒时，默认这样说明：

1. 当前前端体验开发统一走 `QiuQiuTech Frontend Experience Workbench`
2. 不要直接在页面里临时拼新的按钮、输入框、标签、卡片样式
3. 优先复用或扩展 `web/src/components/ui/*`
4. 关键页面模块先在 Storybook 里补 story，再接入真实页面
5. 公开前台模块至少审 4 类状态：
   - 默认态
   - 长文案态
   - 空态 / 弱数据态
   - 移动端可读性
6. 如果页面实现和 Storybook 基线冲突，先修基线，再修页面

一句话版：

> 这个项目前端现在统一按 `QiuQiuTech Frontend Experience Workbench` 开发：不仅管 UI，还管页面结构、状态设计、CTA 主次、用户路径和前端体验收口。先 Storybook，后页面；先 primitives，后业务模块。

## 并行接棒必读文件

其他 AI 接手 UI 相关任务前，默认先读：

1. `docs/ui-workbench.md`
2. `docs/ui-governance.md`
3. `docs/ai-collaboration-protocol.md`
4. `web/README.md`

## 当前纳入 workbench 的范围

当前已纳入 `QiuQiuTech Frontend Experience Workbench` 的模块：

- brand tokens
- button
- form controls
- site search form
- platform UI
- home hero carousel
- forms workbench

## 当前约束

1. Storybook 不是第二套设计系统，必须复用当前品牌 token 和页面语言。
2. 不允许为了 story 演示再造一套脱离产品语境的组件样式。
3. 公开前台的关键模块默认至少要覆盖：
   - 默认态
   - 空态 / 无结果态
   - 长文案态
   - 移动端可读性
4. 组件命名与路径继续跟随当前仓库别名：`@/components/*`、`@/lib/*`

## 后续优先补齐

建议下一批优先进入 workbench 的模块：

1. 顶部导航与搜索条
2. 内容卡片 / 合作卡片 / 专题卡片
3. 表单输入、选择器、标签、空态
4. `/auth`、`/submit`、`/requests` 的关键状态页
