# QiuQiuTech CMS

这个目录预留给 QiuQiuTech 的 Directus 后台。

当前阶段还没有把 Directus 实例正式跑起来，但接入方向已经明确：

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

## 启动后第一批要做的事

1. 配置管理员账号
2. 替换后台 logo 和系统名称
3. 按 `docs/data-model.md` 建核心 collections
4. 按 `docs/roles-permissions.md` 配角色权限
5. 按 `docs/homepage-module-mapping.md` 建展示位和首页模块配置
6. 确保 `contents`、`topics`、`partnership_requests` 都有 `slug` 与 `status` 字段

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

## 当前注意事项

- 这不是最终的生产部署方案
- 当前是本地开发骨架
- 后续正式部署时要补：
  - 对象存储
  - 反向代理
  - 邮件服务
  - 备份策略
  - 搜索增强
