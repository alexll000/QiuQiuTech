# E2E Validation Log

最后更新：2026-05-08（本轮）

## 用途

用于记录以下链路的端到端联调结果（本地 API / Directus 模式）：

1. 投稿草稿保存（`/submit` -> `/api/submissions/drafts`）
2. 合作需求草稿发布（`/requests` -> `/api/requests/drafts`）
3. 合作申请提交（`/requests/[slug]` -> `/api/requests/[id]/apply`）
4. 收藏切换（`/contents/[slug]` -> `/api/me/saved-items/toggle`）
5. 通知全部已读（`/me` -> `/api/me/notifications/read`）
6. 审核动作（`/admin` -> `/api/admin/*/review`）

## 环境信息模板

- 执行人：
- 日期：
- 分支：
- 模式：`mock` / `directus`
- 关键环境变量：
  - `NEXT_PUBLIC_USE_DIRECTUS=`
  - `NEXT_PUBLIC_DIRECTUS_URL=`
  - `QIUQIUTECH_CURRENT_USER_ID=`

## 联调记录模板（复制后逐条填写）

### Case: <链路名称>

- 状态：`✅ 通过` / `⏳ 待复测` / `❌ 失败`
- 页面入口：
- 请求接口：
- 输入数据：
- 预期结果：
- 实际结果：
- 数据留痕（Directus 集合/ID）：
- 截图路径：
- 备注：

## 当前记录

### Case: 投稿草稿保存

- 状态：`✅ 通过（Directus）`
- 页面入口：`/submit`
- 请求接口：`POST /api/submissions/drafts`
- 输入数据：`submissionType=case,title=E2E 测试投稿草稿`
- 预期结果：返回成功并写入 `submissions`
- 实际结果：返回 `ok=true,source=directus,draftId=2`
- 数据留痕（Directus 集合/ID）：`submissions.id=2`
- 备注：由 `web/scripts/e2e-actions-smoke.sh` 执行验证。

### Case: 合作需求草稿发布

- 状态：`✅ 通过（Directus）`
- 页面入口：`/requests`
- 请求接口：`POST /api/requests/drafts`
- 输入数据：`title=E2E 合作需求草稿,requestType=brand_to_marketer`
- 预期结果：返回成功并写入 `partnership_requests`
- 实际结果：返回 `ok=true,source=directus,draftId=3`
- 数据留痕（Directus 集合/ID）：`partnership_requests.id=3`
- 备注：由 `web/scripts/e2e-actions-smoke.sh` 执行验证。

### Case: 合作申请提交

- 状态：`✅ 通过（Directus）`
- 页面入口：`/requests/[slug]`
- 请求接口：`POST /api/requests/[slug]/apply`
- 输入数据：`intro + portfolioUrl + contactPreference`
- 预期结果：返回成功并写入 `match_applications`
- 实际结果：返回 `ok=true,source=directus,applicationId=1`
- 数据留痕（Directus 集合/ID）：`match_applications.id=1`
- 备注：`applyToRequest` 已改为后端鉴权读取 `partnership_requests`。

### Case: 收藏切换

- 状态：`✅ 通过（Directus）`
- 页面入口：`/contents/[slug]`
- 请求接口：`POST /api/me/saved-items/toggle`
- 输入数据：`targetType=content,targetId=weekly-marketing-cases-observation`
- 预期结果：首次返回“已加入收藏”，再次调用返回“已取消收藏”
- 实际结果：返回 `ok=true,source=directus,message=已取消收藏`
- 数据留痕（Directus 集合/ID）：`saved_items` 已发生 create/delete 切换
- 备注：由 `web/scripts/e2e-actions-smoke.sh` 连续执行验证。

### Case: 通知全部已读

- 状态：`✅ 通过（Directus）`
- 页面入口：`/me`
- 请求接口：`POST /api/me/notifications/read`
- 输入数据：无
- 预期结果：返回成功并批量更新 `notifications.is_read`
- 实际结果：返回 `ok=true,source=directus,message=当前没有未读通知`
- 数据留痕（Directus 集合/ID）：`notifications` 读链路成功
- 备注：当前无未读种子数据，批量更新分支可在补数据后复测。

### Case: 审核动作流转

- 状态：`🟨 部分通过（API 可用，真实落库待补）`
- 页面入口：`/admin`
- 请求接口：
  - `POST /api/admin/submissions/[id]/review`
  - `POST /api/admin/requests/[id]/review`
- 备注：当前接口可调用，真实集合与审核字段权限待完成后补全落库证据。

## 本轮环境与阻塞记录（2026-05-08）

- Directus 健康检查：`GET /server/health` 返回 `200 {"status":"ok"}`
- Directus 管理员登录：`POST /auth/login` 成功返回 `access_token`
- 阻塞点：使用管理员 token 调用 `POST /collections` 创建业务集合返回 `FORBIDDEN`
- 影响：当前 5 条动作链路在 `NEXT_PUBLIC_USE_DIRECTUS=true` 下仍触发 fallback，返回 mock ID
- 处理建议：
  1. 先在 Directus 后台 UI 完成业务集合创建（按 `docs/directus-initialization-checklist.md`）
  2. 或为当前管理员角色开放 schema/collection 管理权限后再走 API 自动建表

## 联调脚本记录（2026-05-08 12:20）

- 脚本：`web/scripts/e2e-actions-smoke.sh`
- 执行：`./web/scripts/e2e-actions-smoke.sh`
- 结果：5 条链路均返回 `ok=true`，但 `source=fallback`
- 核心原因：
  - `Directus request failed: 401 Unauthorized ... TOKEN_EXPIRED`（静态 token 过期）
  - `CMS request failed: 403 Forbidden`（业务集合未就绪或权限未放行）
- 结论：当前应优先使用 `DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD` 动态登录换 token，不建议本地联调使用过期静态 token。

## 二次复测记录（2026-05-08 12:28）

- 脚本：`web/scripts/e2e-actions-smoke.sh`
- 结果：5/5 动作链路返回 `source=directus`
- 说明：当前本地开发已可执行“真实落库联调”，但集合初始化仍依赖 `cms/sql/bootstrap-minimal-business-schema.sql` 方案（而非 `/collections` API）。

## 三次复测记录（2026-05-08，本轮）

- 脚本：`web/scripts/e2e-actions-smoke.sh`
- 结果：5/5 动作链路返回 `source=directus`
- 最新留痕：
  - `submissions.draftId=3`
  - `partnership_requests.draftId=5`
  - `match_applications.applicationId=2`
- 同轮补充验证：`npm --prefix web run lint`、`npm --prefix web run build` 均通过；`/` `/contents` `/topics` `/requests` 连通性复测均返回 `200`。
