# SEO And Publishing Notes

## 1. QiuQiuTech 是公开内容网站

所以内容页不是简单渲染页面，而是需要按可索引站点标准开发。

## 2. 应优先做成可索引的页面

### 内容页

- `/contents/[slug]`

### 专题页

- `/topics/[slug]`

### 榜单页

- `/rankings`

### 合作需求页

- `/requests/[slug]`

## 3. 每类页面需要的 SEO 字段

### 内容页

- `title`
- `seo_title`
- `summary`
- `seo_description`
- `cover_image`
- `published_at`
- `updated_at`
- `tags`
- `brand_name`

### 专题页

- `title`
- `seo_title`
- `intro`
- `seo_description`
- `cover_image`

### 合作需求页

虽然主要是平台功能页，也建议具备：

- `title`
- `summary`
- `industry`
- `city`
- `published_at`

## 4. 页面实现要求

- 干净 slug
- SSR 或 SSG 可用
- metadata 独立生成
- 不要把正文内容完全放在客户端请求后才出现

## 5. 首页不是 SEO 主战场，但仍要规范

首页应具备：

- 品牌标题
- 平台定位描述
- 清晰模块结构
- 合理的内部链接结构

## 6. 内容发布约束

为了避免后续内容页质量很差，后台发布时建议要求：

- 标题明确
- 摘要可读
- 封面图完整
- 标签清晰
- 来源可追溯

## 7. 后续建议

下一阶段接真实数据时，应优先补：

1. `generateMetadata`
2. canonical
3. Open Graph
4. structured data
5. sitemap
