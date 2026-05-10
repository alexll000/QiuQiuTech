# QiuQiuTech CMS

这个目录承载 QiuQiuTech 的 Directus 后台。

当前阶段本地 Directus 实例已经可启动、可登录，且已完成第一批基础初始化脚本沉淀：

- 后台底座：Directus
- 数据库：PostgreSQL
- 文件存储：本地开发先走 volume，后续切对象存储
- 前台：现有 `web/` 继续保留

## 这个目录后续负责什么

`cms/` 负责：

- 内容管理
- 投稿审核
- 合作需求审核
- 标签与行业管理
- 专题策展管理
- 展示位管理
- 用户与认证管理
- Dashboard 看板

## 当前已准备内容

- `docker-compose.yml`
- `.env.example`

这两个文件用于快速起本地 Directus + PostgreSQL。

## 本地启动方式

### 1. 复制环境变量

```bash
cd cms
cp .env.example .env
```

### 2. 启动

```bash
docker compose up -d
```

### 3. 默认地址

- Directus: [http://localhost:8055](http://localhost:8055)
- PostgreSQL: `localhost:5432`

### 4. 本地最小业务集合初始化（推荐）

```bash
cd "$QIQIUTECH_ROOT"
docker exec -i qiqiutech-postgres psql -U directus -d qiqiutech < cms/sql/bootstrap-minimal-business-schema.sql
```

该脚本会创建本地联调所需最小集合：

- `submissions`
- `partnership_requests`
- `match_applications`
- `saved_items`
- `notifications`

并写入一条 `partnership_requests` 种子数据用于合作申请联调。

### 5. 后台基础初始化（推荐）

先执行一键脚本：

```bash
cd "$QIQIUTECH_ROOT"
node cms/scripts/init-local-foundation.mjs
```

该脚本会顺序执行：

- `apply-branding-and-language.mjs`
- `seed-roles-and-policies.mjs`

执行完成后，本地 Directus 会具备：

- QiuQiuTech 项目名 / 描述 / logo / favicon
- 默认语言 `zh-CN`
- 管理员用户语言 `zh-CN`
- `Member`
- `Verified Member`
- `Operator`
- 对应第一阶段 app access policy 与 role-policy access 绑定

如需单独重放某一步，也可以分别执行下面两个脚本。

### 6. 仅重放品牌与中文语言基线

```bash
cd "$QIQIUTECH_ROOT"
node cms/scripts/apply-branding-and-language.mjs
```

该脚本会幂等执行以下动作：

- 上传并复用 `web/public/qiuqiutech-admin-logo.png`
- 上传并复用 `web/public/qiuqiutech-bird-mark.png`
- 后台主 logo 默认使用“大鸟无文字”透明底版本
- favicon / tab icon 默认使用“仅鸟头”透明底版本
- 将 Directus `project_name` 设为 `QiuQiuTech`
- 将 `project_descriptor` 设为 `球球科技后台管理系统`
- 将 `default_language` 设为 `zh-CN`
- 将管理员用户语言设为 `zh-CN`

### 7. 仅重放角色与策略基线

```bash
cd "$QIQIUTECH_ROOT"
node cms/scripts/seed-roles-and-policies.mjs
```

该脚本会幂等执行以下动作：

- 创建或复用 `Member` 角色
- 创建或复用 `Verified Member` 角色
- 创建或复用 `Operator` 角色
- 创建或复用对应 policy
- 创建或复用 role-policy access 关联

### 8. 验证本地后台基础基线

```bash
cd "$QIQIUTECH_ROOT"
node cms/scripts/verify-local-foundation.mjs
```

该脚本会校验：

- `project_name`
- `project_descriptor`
- `default_language`
- `project_logo`
- `public_favicon`
- 管理员语言
- `Member` / `Verified Member` / `Operator`
- 对应 policy 与 access 关联

## 启动后第一批要做的事

1. 配置管理员账号
2. 执行 `cms/sql/bootstrap-minimal-business-schema.sql`
3. 执行 `node cms/scripts/init-local-foundation.mjs`
4. 按 `docs/data-model.md` 建核心 collections
5. 继续扩展 `docs/roles-permissions.md` 对应的细粒度权限
6. 按 `docs/homepage-module-mapping.md` 建展示位和首页模块配置
7. 确保 `contents`、`topics`、`partnership_requests` 都有 `slug` 与 `status` 字段

## 和前台如何配合

### 当前阶段

前台 `web/` 里仍然使用 `site-data.ts` 作为演示数据源。

### 后续阶段

逐步替换为 Directus 数据：

1. 首页
2. 营销内容列表与详情
3. 专题策展
4. 合作对接
5. 投稿状态与用户中心

当前前台默认按这些约定读取：

- Directus REST 返回结构为 `{ data: ... }`
- 列表页读取 `published` 状态
- 详情页统一按 `slug` 查询
- 用户中心与会话层当前还会读取 `user_profiles.user_id / display_name / role_type / city / company_name / verification_status / contact_policy`，本地最小 bootstrap 已补齐这些字段

## 当前注意事项

- 这不是最终的生产部署方案
- 当前是本地开发骨架
- 后续正式部署时要补：
  - 对象存储
  - 反向代理
  - 邮件服务
  - 备份策略
  - 搜索增强
