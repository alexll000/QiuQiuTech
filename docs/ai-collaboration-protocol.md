# AI Collaboration Protocol

最后更新：2026-05-09 12:20 (UTC+8)

## 目标

让多 AI 并行推进时保持同一主方向，不发生重复开发、状态漂移和回归覆盖。

补充：执行层强制契约见 [AI-Execution-Contract.md](docs/AI-Execution-Contract.md)。

## 单一真值

- 任务拆分与状态：`docs/todo-live.md`
- 阶段结论：`docs/current-build-status.md`
- 接手路线：`docs/ai-handoff.md`

## Frontend Experience 并行协作约定（新增）

涉及前端 UI、公开页面、组件层、交互层或页面结构改动时，统一使用以下系统名：

- `QiuQiuTech Frontend Experience Workbench`

它指的是一整套前端体验工作流，而不是单个工具：

1. Storybook 作为 UI 审查台
2. `web/src/components/ui/*` 作为 primitives 入口
3. `web/src/components/*.stories.tsx` / `web/src/stories/*.stories.tsx` 作为模式与页面状态基线
4. 页面结构、信息层级、CTA 主次和用户路径也属于这一体系的审查范围

后续 AI 接棒时默认遵守：

1. 先看现有 story 和 primitive，再决定是否新增
2. 不要直接在页面里临时造新的按钮、输入框、标签、卡片体系
3. 关键公开前台模块先补 story，再接页面
4. 如果页面实现和 Storybook 基线冲突，先修基线，再修页面

## 执行规则

1. 开工前在 `todo-live` 更新认领状态（任务 ID + 时间）。
2. 只在自己认领的范围内改动，跨模块改动必须补“影响说明”。
3. 每完成一步，都要补：
   - 当前状态
   - 证据文件
   - 下一步
4. 文档同步顺序固定：
   - 先 `todo-live`
   - 再 `README.md` / `web/README.md` 摘要
   - 最后 `current-build-status.md` / `ai-handoff.md`

## 高权限产品护栏

以下规则适用于所有后续 AI 与人工协作，优先级高于局部页面偏好：

1. 禁止把开发态、测试态、mock/fallback、内部身份或实现边界直接暴露到公开前台。
2. 当账户、登录、注册、用户中心等页面存在结构歧义时，必须优先按用户任务重组，而不是继续叠加技术入口。
3. 发现公开前台出现“体验账号、会话 ID、账号标识、mock 审核队列、admin-mock”这类表达时，不能视为普通文案问题，必须按系统级错误处理。
4. 若实现层必须保留 fallback 或调试开关，只能保留在代码、日志、接口返回或后台受控区域，不能让 C 端承担技术解释成本。
5. 本规则不仅约束登录页，也约束首页、用户中心、投稿、合作、审核相关的所有公开触点。

## 强制文档更新清单（每轮必做）

以下 5 个文件，本轮只要有代码改动就必须更新，缺一项视为未完成：

1. `docs/todo-live.md`：更新任务状态、证据、下一步
2. `README.md`：更新状态看板摘要或关键新增能力
3. `web/README.md`：更新工程执行层状态/优先级
4. `docs/current-build-status.md`：更新阶段结论与未完成项
5. `docs/ai-handoff.md`：更新接手说明与本轮关键变更

补充：

- `docs/README.md` 必须追加一条“本轮同步记录”流水。
- 若本轮包含联调或构建验证，必须同步 `docs/e2e-validation-log.md`。
- 本轮必须执行文档路径可移植性检查：`scripts/check-doc-portability.sh`。

## 禁止结束条件（DoD Guardrail）

满足任一条件，禁止把任务标记为“完成”：

1. 只改了代码，未同步上述文档清单。
2. 声称功能完成，但没有最小可复现验证命令或验证结果。
3. 把状态写成“已完成”，但 `todo-live` 仍显示“进行中/未开始”。
4. 把 fallback、去重、审核状态流等关键保护逻辑删除且未提供替代方案。

## 其他 AI 回报模板（统一格式）

每轮回复建议固定包含 4 行：

1. 本轮完成：`<功能/脚本/页面>`
2. 验证结果：`<命令 + 关键输出>`
3. 文档同步：`<更新的文件列表>`
4. 下一步：`<明确的一条或两条>`

## 冲突处理

若发现文档或实现冲突，按优先级处理：

1. 最新用户明确要求
2. `QiuQiuTech_Full_Development_Brief_v2.md`
3. `docs/todo-live.md`
4. 当前代码实现
