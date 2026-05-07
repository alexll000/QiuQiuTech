# Deployment Plan

## 1. 发布目标

QiuQiuTech 最终是一个对外公开发布的 Web 平台。

这意味着部署目标不是：

- 仅本地演示
- 仅后台管理
- 仅内部运营工具

而是：

- 公开前台可访问
- 搜索引擎可索引
- 后台可独立登录管理
- 内容与合作需求可以稳定上线

## 2. 建议部署结构

```text
Public Internet
     ↓
  CDN / Reverse Proxy
     ↓
 ┌───────────────┬─────────────────┐
 │ web           │ cms             │
 │ Next.js       │ Directus        │
 │ public site   │ admin backend   │
 └───────────────┴─────────────────┘
            ↓
       PostgreSQL
            ↓
      Object Storage
```

## 3. 前台部署建议

前台 `web/`：

- 优先部署在支持 Next.js SSR / App Router 的环境
- 需要稳定的 Node 运行环境
- 需要图片优化和缓存策略

推荐形态：

- Vercel
- 自建 Node + Nginx
- Docker 部署

## 4. 后台部署建议

后台 `cms/`：

- Directus 独立部署
- 独立域名或子域名
- 不建议和前台完全混在同一服务进程里

建议域名结构：

- `www.qiuqiutech.com` -> 前台
- `cms.qiuqiutech.com` -> Directus 后台

## 5. 数据层建议

### 数据库

- PostgreSQL

### 媒体资源

开发阶段：

- 本地 volume

正式环境：

- S3
- Cloudflare R2
- 其他对象存储

## 6. 第一阶段上线要求

### 必须具备

- 前台首页可访问
- 内容列表 / 详情页可访问
- 专题页可访问
- 合作对接页可访问
- Directus 后台可登录
- 基础内容发布流程可跑通

### 可后补

- 复杂搜索
- 推荐算法
- 自动抓取
- 邮件通知
- 多环境监控面板

## 7. 推荐上线顺序

### Stage 1

- 前台静态演示数据版本
- 内部评审

### Stage 2

- 接 Directus 内容数据
- 接专题与展示位

### Stage 3

- 接投稿审核
- 接合作需求审核

### Stage 4

- 接抓取导入
- 接榜单与数据统计

## 8. 部署注意事项

- 前台和后台应分开域名 / 子域名
- 媒体资源必须走稳定对象存储
- SEO 页必须可访问且可索引
- 后台入口不应暴露在前台主导航之外的公开路径说明中
