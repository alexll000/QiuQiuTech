# Docs Guide

这个目录下同时存在两类文档：

1. **当前有效文档**
2. **历史阶段文档**

接手时不要把它们混在一起看。

## 当前优先阅读顺序

### 1. 外部最新开发 Brief

主真值源：

- [QiuQiuTech_Full_Development_Brief_v2.md](/Users/stonework/Downloads/QiuQiuTech_Full_Development_Brief_v2.md)

这份文档当前优先级最高，尤其是：

- 栏目命名
- 信息架构
- 数据模型方向
- 权限与审核流
- 后台栏目要求

### 2. 当前仓库总说明

- [README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/README.md)

### 3. 当前 AI 交接文档

- [ai-handoff.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/ai-handoff.md)

这份文档现在负责：

- 最新进展
- 当前真实状态
- 下一步开发顺序
- 整体路线图
- 下一个 AI 接手注意事项

### 4. 当前前端工程说明

- [web/README.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/web/README.md)

## 本目录中文档定位

### 仍有参考价值

- [QiuQiuTech-design-system-v1.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-design-system-v1.md)  
  用于看设计语言、视觉原则、品牌方向。

- [QiuQiuTech-skills-and-stack.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-skills-and-stack.md)  
  用于看之前的技能与技术栈建议。

### 当前开发文档

- [current-build-status.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/current-build-status.md)
- [ai-handoff.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/ai-handoff.md)
- [architecture.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/architecture.md)
- [backend-plan.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/backend-plan.md)
- [data-model.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/data-model.md)
- [roles-permissions.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/roles-permissions.md)
- [homepage-module-mapping.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/homepage-module-mapping.md)
- [deployment-plan.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/deployment-plan.md)
- [seo-content-publishing.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/seo-content-publishing.md)
- [directus-initialization-checklist.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-initialization-checklist.md)
- [directus-collections-matrix.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/directus-collections-matrix.md)

### 历史阶段资料

以下文档主要是前期讨论或旧阶段产物，**不能直接当成当前实现真值**：

- [QiuQiuTech-Brief.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-Brief.md)
- [QiuQiuTech-platform-brief-v1.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-platform-brief-v1.md)
- [QiuQiuTech-prd-v1.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-prd-v1.md)
- [QiuQiuTech-sitemap-and-page-modules-v1.md](/Users/stonework/Downloads/Trae/codeX/QiuQiuTech/docs/QiuQiuTech-sitemap-and-page-modules-v1.md)

这些文档的问题主要是：

- 仍然使用旧路由，如 `/content`、`/connect`
- 页面模块和当前代码已不完全一致
- 部分内容比最新 brief 更早，容易误导后续开发

## 当前实现真值

如果文档和代码冲突，当前应按以下顺序判断：

1. 最新用户明确要求
2. `QiuQiuTech_Full_Development_Brief_v2.md`
3. `docs/ai-handoff.md`
4. 当前 `web/src/` 已实现结构
5. `docs/` 中仍有参考价值的文档
6. 历史 v1 文档

## 建议后续整理方式

后面如果继续整理文档，建议把历史资料移入：

```text
docs/archive/
```

并额外补三份真正面向开发的文档：

1. `architecture.md`
2. `backend-plan.md`
3. `data-model.md`

## Git 同步约定

以后只要做“更新 Git / 同步 GitHub”，默认至少同步这四块内容：

1. 代码最新状态
2. `current-build-status.md`
3. `ai-handoff.md`
4. README 中的接手说明
