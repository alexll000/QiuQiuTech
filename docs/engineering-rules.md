# Engineering Rules

最后更新：2026-05-08 10:05 (UTC+8)

## 目标

约束实现边界，确保多 AI 并行开发时代码风格、架构方向和可维护性一致。

## 硬规则

1. 页面层不直接访问 Directus，必须走 `src/lib/*-service.ts`。
2. API 路由统一返回：
   - 成功：`{ success: true, data, meta? }`
   - 失败：`{ success: false, message, code? }`
3. 所有状态流转写操作必须记录：
   - `updated_at`
   - `updated_by`（无真实登录态时允许占位）
   - `note`（有驳回/审核动作时必填）
4. 新增数据对象必须先更新：
   - `docs/content-data-contract.md`
   - `docs/directus-collections-matrix.md`
5. 禁止在页面组件内写死标签数据；标签来自发布数据或 CMS 返回。
6. 提交前必须通过：
   - `npm --prefix web run lint`
   - `npm --prefix web run build`

## 高权限产品约束

以下规则优先级高于局部页面实现习惯，默认适用于所有公开前台页面；后台中凡是面向业务使用者长期可见的区域，也应尽量遵守：

1. 禁止把开发态、测试态、联调态、内部态信息直接暴露给 C 端用户。
   - 包括但不限于：体验账号、测试账号、mock/fallback 字样、会话 ID、内部 reviewer 占位值、开发环境说明、实现边界提示。
2. 禁止按“技术实现方式”组织页面信息架构，必须先按“用户任务”组织。
   - 例如登录页应先区分“登录 / 注册”，再区分具体登录方式，而不是把登录方式、测试入口、当前会话状态混在同一层级。
3. 禁止使用开发语境字段名直接面向 C 端展示。
   - 例如“账号标识”“体验入口”“mock 审核队列”等表述必须改写为用户可理解的话术。
4. 公开前台允许存在技术兜底，但兜底机制必须隐藏在实现层，不得把技术细节抛给用户。
   - 可以保留 fallback 逻辑，不能把 `fallback/mock/admin-mock` 直接显示在用户界面。
5. 若页面已处于用户完成状态，优先跳转或弱提示，不要让状态信息占据主视觉区。
   - 例如已登录态不应把登录页主界面变成“状态说明页”。

## 目录边界

- `web/src/app/*`：路由与页面编排
- `web/src/components/*`：纯视图组件与交互组件
- `web/src/lib/*`：服务层、数据契约、调用封装
- `web/src/app/api/*`：BFF 契约与动作入口
- `docs/*`：规则、状态、交接与实施文档

## 变更流程

1. 在 `docs/todo-live.md` 认领任务。
2. 先改文档契约，再改代码。
3. 完成后补联调证据（必要时写入 `docs/e2e-validation-log.md`）。
4. 回写 `todo-live` 状态，再同步 README 摘要。
