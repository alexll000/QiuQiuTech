# QiuQiuTech — 营销行业聚合与对接平台

> 历史阶段文档，仅作参考。当前开发请优先遵循最新的 `QiuQiuTech_Full_Development_Brief_v2.md`、根目录 `README.md` 和当前 `web/src/` 实现。

> **项目代号**: QiuQiuTech  
> **版本**: v1.0.0-Brief（可执行版）  
> **定位**: 营销行业内容聚合 × 用户自主提交 × 品牌对接撮合平台  
> **目标用户**: 品牌方、市场人、营销从业者、广告人、KOL/KOC、MCN机构  

---

## 一、产品定位与核心差异

### 1.1 一句话定义
**「营销人的一站式情报站 + 资源连接器」** —— 既看行业动态，也找合作伙伴。

### 1.2 与三大竞品的核心差异化

| 维度 | 邦连接(睿兽) | SocialBeta | 数英网(Digitaling) | **QiuQiuTech** |
|------|-------------|------------|-------------------|---------------|
| **核心能力** | 投资数据+投融资对接 | 编辑驱动型营销媒体 | 社区+投稿+招聘 | **聚合抓取 + UGC提交 + 品牌C2C对接** |
| **内容来源** | 数据驱动 | 全部编辑生产 | 用户投稿+编辑审核 | **AI抓取 + 运营编辑 + UGC用户提交 三合一** |
| **对接场景** | 投资人↔创业者 | 无对接功能 | 招聘为主 | **品牌↔品牌 / 市场人↔市场人 C2C撮合** |
| **运营门槛** | 重数据团队 | 重编辑团队 | 中等运营 | **轻量：AI抓取降低80%人工成本** |
| **用户角色** | 投资人/创业者 | 读者 | 创作者/求职者 | **读者+创作者+对接需求方 三角色合一** |

### 1.3 三大核心功能模块

```
┌─────────────────────────────────────────────────────────────┐
│                    QiuQiuTech 平台架构                       │
├──────────┬──────────────────┬───────────────────────────────┤
│  内容引擎    │   对接引擎          │   用户系统                   │
│            │                   │                               │
│ • AI抓取聚合 │ • 品牌对接卡        │ • 注册/登录                    │
│ • 运营编辑发布│ • 需求发布          │ • 个人主页/作品集               │
│ • UGC用户提交│ • 在线沟通/私信      │ • 积分/等级体系                │
│ • 内容审核流 │ • 撮合推荐算法       │ • 消息通知                     │
│ • 标签分类体系│ • 对接成功案例墙     │ • 收藏/关注/订阅               │
└──────────┴──────────────────┴───────────────────────────────┘
                              ↓
              ┌───────────────────────────────┐
              │        管理后台 (Admin)         │
              │ • 内容管理(CRUD+审核)           │
              │ • 用户管理                      │
              │ • 对接管理(审核/推荐/下架)       │
              │ • 抓取任务管理                   │
              │ • 数据看板                      │
              │ • 系统配置                      │
              └───────────────────────────────┘
```

---

## 二、前台系统详细需求

### 2.1 首页

#### 布局结构（从上到下）

```
[顶部导航栏 - 固定]
    Logo(QiuQiuTech) | 首页 | 发现 | 对接广场 | 提交内容 | 登录/注册/头像下拉

[Banner轮播区] - 高度400px, 支持3-5张轮播
    - 运营配置的精选内容Banner
    - 支持跳转到专题页/详情页/外部链接

[双栏快捷入口] - 参考 SocialBeta 的"每日精选"+"本周必看"
    左栏: 📰 今日热榜 (Top10列表, 实时更新)
    右栏: 🔥 本周精选 (6宫格卡片, 编辑推荐)

[主内容流 - 信息流瀑布流]
    内容来源混合展示: [抓取标记] / [官方] / [用户投稿]
    每条卡片: 封面图(16:9) + 类型标签 + 标题 + 摘要(120字内) + 来源标注 + 
             发布时间 + 品牌/话题标签(可点击) + 点赞/收藏/分享

[侧边栏 - 右侧固定, 宽300px]
    - 热门标签云 (TOP20, 字号按热度缩放)
    - 活跃对接需求 (最新5条, 卡片式)
    - 平台数据统计 (内容总数/用户数/对接成功数)
    - 二维码(公众号/社群入口)

[底部Footer]
    - 关于我们 | 合作洽谈 | 提交指南 | 隐私政策 | 联系方式
    - 备案号 | 版权声明
```

#### 首页技术要求

- **SSR渲染**, 首屏加载 < 1.5秒
- 无限滚动加载, 每次加载12条
- 响应式布局: Desktop (>1024px) / Tablet (768-1024px) / Mobile (<768px)
- 内容卡片支持 **三种尺寸**: 大卡(Banner位) / 中卡(首条) / 小卡(列表流)

### 2.2 发现页（分类浏览）

#### 分类体系设计

```
一级分类（顶部Tab切换）:
├── 📢 营销快讯        # 行业动态、品牌新闻、Campaign资讯
├── 💡 创意案例        # 广告片、跨界联名、事件营销、社媒玩法
├── 📊 数据报告        # 行业白皮书、消费趋势、平台数据
├── 🎯 营销玩法        # 抖音玩法、小红书种草、直播带货、私域运营
├── 👥 人物观点        # 访谈、行业大佬发言、方法论
└── 🔥 专题策划        # 运营制作的专题聚合页(如"双十一营销盘点")

二级筛选（每个一级分类下）:
├── 时间: 今天/本周/本月/全部
├── 来源: 全部/官方/抓取/用户投稿
├── 排序: 最新/最热/最多收藏
├── 标签: 动态标签云(该分类下热门标签)
└── 关键词搜索
```

#### 详情页规范

```yaml
页面路径: /article/:id 或 /case/:id

头部区域:
  - 标题(H1, 最大字号)
  - 封面大图(宽度100%, 最大高度500px)
  - 元信息行: 作者头像+昵称 | 发布时间 | 阅读量 | 来源标签
  
正文区域:
  - 富文本内容(支持: H2/H3标题、段落、图片、视频嵌入、引用块、表格)
  - 文中标签自动识别为超链接(跳转标签聚合页)
  - 图片支持点击放大(Lightbox)

底部互动区:
  - 点赞 / 收藏 / 分享(微信/微博/复制链接)
  - 标签列表(点击进入标签页)
  - 相关推荐(智能推荐3-5篇)

评论区域(可选v1.1):
  - 评论输入框(需登录)
  - 评论列表(楼层式)
```

### 2.3 对接广场（核心差异化功能）

#### 2.3.1 功能定义

**这是 QiuQiuTech 最核心的差异化功能。** 类似邦连接的"对接"概念，但场景完全不同：

| 维度 | 邦连接 | QiuQiuTech对接 |
|------|--------|---------------|
| **供给侧** | 创业项目 | 品牌方 / 市场人 / KOL / MCN / 代理商 |
| **需求侧** | 投资人(VC/PE) | 品牌方 / 市场人 / 寻找合作方的任何人 |
| **对接目的** | 融资 | **资源置换、联合营销、商务合作、人才对接** |
| **匹配维度** | 赛道/轮次/金额 | **行业/预算/合作类型/地域** |

#### 2.3.2 对接卡片设计

每条对接需求包含以下字段：

```typescript
interface ConnectionCard {
  id: string;
  // === 基本信息 ===
  title: string;           // 需求标题, 如 "新茶饮品牌寻找抖音头部KOL合作"
  type: ConnectionType;    // 见下方枚举
  status: 'active' | 'paused' | 'completed' | 'closed';
  
  // === 发布者信息 ===
  publisher: {
    userId: string;
    companyName?: string;  // 公司名称(可选)
    avatar: string;        // 头像
    name: string;          // 显示名称
    verified: boolean;     // 是否认证
    role: UserRole;        // brand / marketer / kol / agency / other
  };
  
  // === 需求详情 ===
  description: string;     // 需求描述(500字以内)
  industry: string[];      // 所属行业(多选): ["食品饮料", "美妆个护"]
  budget?: BudgetRange;    // 预算范围(可选)
  region: string[];        // 期望地域: ["全国", "华东", "北京"]
  cooperationType: CooperationType[]; // 见下方枚举
  
  // === 附加资料 ===
  coverImage?: string;     // 封面图
  attachments?: string[];  // 附件(PDF/图片等)
  caseLinks?: string[];    // 往期案例链接
  
  // === 元数据 ===
  views: number;           // 浏览量
  likes: number;           // 收藏/感兴趣数
  contactCount: number;    // 已联系人数(仅发布者和本人可见)
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;      // 过期时间(可选)
}

type ConnectionType = 
  | 'brand_seeks_kol'      // 品牌寻KOL
  | 'kol_seeks_brand'      // KOL寻品牌
  | 'brand_seeks_agency'   // 品牌寻代理商
  | 'agency_seeks_brand'   // 代理商寻品牌
  | 'co_marketing'         // 联合营销(品牌×品牌)
  | 'resource_exchange'    // 资源置换
  | 'talent_coop'          // 人才/专家合作
  | 'other';               // 其他

type CooperationType = 
  | 'content_collab'       // 内容合作
  | 'event_coop'           // 活动合作
  | 'channel_coop'         // 渠道合作
  | 'product_coop'         // 产品/商品合作
  | 'media_buy'            // 媒介采买
  | 'creative_service'     // 创意服务
  | 'data_service'         // 数据服务
  | 'other';

type BudgetRange =
  | 'under_10k'           // 1万以下
  | '10k_50k'             // 1-5万
  | '50k_200k'            // 5-20万
  | '200k_500k'           // 20-50万
  | '500k_1m'             // 50-100万
  | 'over_1m';            // 100万以上
```

#### 2.3.3 对接广场页面布局

```
[顶部]: 筛选条件栏
    类型Tab: 全部 | 品牌寻KOL | KOL寻品牌 | 联合营销 | 资源置换 | 代理合作 | 其他
    二级筛: 行业 ▾ | 地域 ▾ | 预算范围 ▾ | 合作类型(多选)
    搜索: 关键词搜索
    
[主体]: 对接卡片网格(2列或3列, 响应式)
    每张卡片显示:
    ┌─────────────────────────────┐
    │ [封面图/默认占位]            │
    │                             │
    │ 🔴 品牌寻KOL                 │ ← 类型标签(彩色)
    │ 新茶饮品牌寻找抖音头...       │ ← 标题(最多2行截断)
    │                             │
    │ 👤 某某科技有限公司 已认证    │ ← 发布者
    │ 📍 华东 | 💰 5-20万         │ ← 行业/预算
    │                             │
    │ 👁 328  ⭐ 45  →            │ ← 浏览/感兴趣/查看详情
    └─────────────────────────────┘

[右侧边栏]:
    - 发布对接需求按钮(CTA, 大号醒目)
    - 对接成功案例(轮播展示)
    - 热门对接类型分布(饼图/柱状图)
```

#### 2.3.4 对接详情页 & 沟通机制

```yaml
详情页路径: /connection/:id

核心内容:
  - 完整的需求描述(富文本)
  - 发布者的公开信息(公司、认证状态、往期案例)
  - 行业/预算/地域/合作类型的完整展示
  - 相似推荐(其他同类对接需求)

沟通方式(二选一, 后台配置):
  方案A - 平台私信:
    - 注册用户可直接发送私信
    - 消息记录保存在平台内
    - 双方可见聊天界面
  
  方案B - 暴露联系方式:
    - 发布者预留联系方式(手机/微信/邮箱)
    - 浏览者需登录后才可见
    - 记录"已联系"次数(供发布者查看效果)

建议v1.0采用方案A, v1.1增加方案B选项。
```

### 2.4 用户提交系统（UGC核心功能）

#### 2.4.1 提交入口与流程

```
非登录用户点击"提交内容":
    → 弹出登录/注册引导
    → 登录后进入提交页面

已登录用户:
    点击导航"提交内容" → 进入提交表单页面
    路径: /submit (支持文章/案例/快讯三种模板)
```

#### 2.4.2 提交表单详细字段

```yaml
通用字段(所有类型必填):
  - 内容类型: 单选(营销快讯 / 创意案例 / 数据报告 / 营销玩法 / 其他)
  - 标题: 必填, 5-60字
  - 封面图: 上传, 要求:
      * 格式: JPG/PNG/WebP
      * 尺寸: 推荐 1200×675 (16:9)
      * 大小: ≤ 5MB
      * 系统自动压缩和裁切提示
  - 正文内容: 富文本编辑器, 要求:
      * 纯文字 ≥ 200字
      * 支持插入图片(单张≤3MB, 总计≤15张)
      * 支持插入视频链接(YouTube/Bilibili/抖音嵌入)
      * 支持插入引用块
  - 来源链接: 选填, 原文出处URL(如果内容来自其他平台)
  - 标签: 必选至少1个, 最多5个
      * 系统提供热门标签推荐(基于已有标签库)
      * 支持自定义创建新标签(需审核)
  - 涉及品牌: 多选, 输入框搜索匹配
      * 如果品牌不存在于品牌库, 可申请新增

案例类型额外字段:
  - 营销类型: 多选(广告片 / 社媒传播 / 事件营销 / 跨界联名 / 直播带货 / 私域运营 / 其他)
  - 执行周期: 如 "2025.03 - 2025.05"
  - 营销效果: 文本描述(可选, 如"曝光量1亿+, GMV破千万")
  - 相关图片: 上传更多过程图/效果图(可选)

快讯类型额外字段:
  - 快讯摘要: 必填, 50-150字, 精炼概述
  - 原闻来源: 必填, 原始新闻/公告的URL
  - 发生时间: 具体日期

提交后动作:
  - 按钮: "提交审核"
  - 弹窗提示: "提交成功! 预计1-2个工作日内完成审核, 请留意站内消息通知。"
  - 用户可在"个人中心 → 我的提交"中查看审核状态
```

#### 2.4.3 审核工作流

```
用户提交 
  → 状态: PENDING(待审核)
  → 后台审核队列(管理员在后台看到所有待审内容)
  
审核操作(管理员):
  ✅ 通过:
    → 状态: APPROVED
    → 自动分配到对应分类频道
    → 可选择是否推送到首页/精选位
    → 系统自动发站内消息通知用户
    → 内容在前台正式上线
  
  ❌ 驳回:
    → 状态: REJECTED
    → 必须填写驳回原因(预置选项+自定义补充):
        * 预置: "内容重复" / "格式不规范" / "涉嫌推广/广告" / "与平台定位不符" / "其他"
    → 系统发站内消息通知用户(含驳回原因)
    → 用户可修改后重新提交
  
  ⚠️ 待修改:
    → 状态: REVISION_REQUIRED
    → 管理员填写修改意见
    → 用户修改后重新进入审核队列
```

### 2.5 用户中心

```
路径: /user/:id (公共主页) 和 /dashboard (个人面板)

=== 公共主页(/user/:id) ===
[头部背景图] + 头像 + 昵称 + 认证标识 + 简介
[Tab切换]:
  ├── Ta的内容     (发布的UGC内容列表)
  ├── Ta的对接口   (发布的对接需求列表)
  └── Ta的收藏     (仅自己可见)

=== 个人面板(/dashboard) ===
左侧菜单:
  ├── 我的提交      (管理自己的UGC内容, 查看各状态)
  ├── 我的对接口    (管理对接需求, 查看/编辑/下架)
  ├── 消息中心      (系统通知 + 审核结果 + 私信)
  ├── 收藏夹        (收藏的内容合集)
  ├── 账户设置      (头像/昵称/密码/简介)
  └── 认证申请      (个人认证/企业认证, v1.1)
```

### 2.6 搜索功能

```
全局搜索入口: 导航栏右侧搜索图标/输入框

搜索范围:
  - 内容(文章/案例/快讯)
  - 对接需求
  - 品牌
  - 用户
  - 标签

搜索结果页(/search?q=keyword):
  - 左侧: 筛选面板(类型/时间/来源/排序)
  - 主体: 混合结果列表(不同类型用不同卡片样式区分)
  - 搜索历史(本地存储)
  - 热门搜索词(后台配置)
```

---

## 三、后台管理系统详细需求

### 3.1 Dashboard 数据概览

```yaml
核心指标卡片(一行4个):
  - 内容总量(今日新增 / 环比)
  - 注册用户数(今日新增 / 环比)
  - 对接需求数(进行中数量)
  - PV/UV(今日 / 环比)

图表区域(一行2个):
  - 内容发布趋势折线图(近30天, 按日)
  - 内容来源占比饼图(抓取/官方/UGC)

快捷操作:
  - 待审核内容数(带红点角标)
  - 待审核对接口数
  - 最新用户注册
  - 最新反馈(如有)
```

### 3.2 内容管理模块 (CMS)

```
功能清单:
├── 内容列表
│   - 表格展示: ID | 封面缩略图 | 标题 | 类型 | 来源 | 状态 | 发布时间 | 操作
│   - 批量操作: 批量删除 / 批量改状态 / 批量分类
│   - 高级筛选: 类型/来源/状态/时间范围/作者/关键词
│   - 分页: 每页20条, 支持跳转
│
├── 内容编辑/新建
│   - 所有的前台提交字段(同2.4.2)
│   - 额外字段:
│     * 来源标记: 官方原创 / AI抓取 / 用户投稿 / 手动录入
│     * SEO设置: 自定义URL slug / meta描述 / 关键词
│     * 推荐权重: 数字(0-100, 控制首页/发现页推荐排序)
│     * 置顶开关: 是/否 + 置顶到期时间
│     * 推送渠道: 首页Banner / 今日热榜 / 微信公众号(预留)
│
├── 审核队列 (重点功能!)
│   - 待审核列表(按提交时间倒序)
│   - 每条显示: 用户信息 + 提交内容预览 + 原文对比
│   - 一键通过 / 一键驳回(含原因选择) / 打回修改
│   - 审核备注(内部可见)
│   - 审核日志(谁在什么时间做了什么操作)
│
├── 分类管理
│   - 一级分类CRUD
│   - 二级分类CRUD
│   - 分类排序拖拽
│   - 分类关联的筛选标签配置
│
├── 标签管理
│   - 标签列表(名称/使用次数/创建时间)
│   - 新建/合并/删除标签
│   - 设置热门标签/推荐标签
│   - 标签颜色/图标设置(可选)
│
├── 品牌库管理
│   - 品牌列表(Logo/名称/行业/关联内容数)
│   - 品牌详情(关联的所有内容)
│   - 新增品牌(手动/AI识别)
│   - 品牌认证(官方认证标识)
│
└── Banner/推荐位管理
    - 首页Banner CRUD(图片/链接/排序/生效时间)
    - 今日热榜手动调整
    - 本周精选配置
    - 专题页Banner配置
```

### 3.3 对接管理模块

```
功能清单:
├── 对接需求列表
│   - 表格: ID | 标题 | 类型 | 发布者 | 状态 | 浏览量 | 联系数 | 发布时间 | 操作
│   - 筛选: 类型/状态/行业/时间/发布者
│
├── 对接审核
│   - 新发布的对接需求需要审核才能上架
│   - 审核要点: 信息完整性/真实性/合规性
│   - 通过/驳回/打回修改(同内容审核流程)
│
├── 对接推荐(人工干预)
│   - 手动将优质对接需求推荐到首页侧边栏
│   - 设置"精选对接"标签
│   - 对接到Banner位的配置
│
├── 对接成功案例
│   - 录入/展示成功对接案例(v1.1, 需双方确认或管理员手动添加)
│   - 用于建立平台信任背书
│
└── 举报处理
    - 用户举报对接需求(虚假/欺诈/违规等)
    - 举报审核: 查实后下架/警告/封号
```

### 3.4 用户管理模块

```
├── 用户列表
│   - 表格: ID | 头像 | 昵称 | 手机号 | 角色 | 状态 | 注册时间 | 最后活跃 | 操作
│   - 筛选: 角色/认证状态/注册时间/状态
│   - 搜索: 昵称/手机号/ID
│
├── 用户详情
│   - 基本信息
│   - 内容发布记录
│   - 对接发布记录
│   - 登录日志
│   - 操作日志
│
├── 认证管理 (v1.1)
│   - 个人认证审核(身份信息/职业证明)
│   - 企业认证审核(营业执照/企业信息)
│   - 认证标识发放
│
└── 权限控制
    - 超级管理员 / 内容编辑 / 对接客服 / 只读观察员
    - 角色权限矩阵(RBAC)
```

### 3.5 抓取任务管理系统

```
├── 抓取源配置
│   - 数据源管理(新增/编辑/启用/禁用数据源)
│   - 每个数据源配置:
│     * 名称: 如"SocialBeta快讯"
│     * 源URL: RSS feed地址 / 页面URL / API接口
│     * 抓取频率: 每30分钟/每小时/每天
│     * 解析规则: CSS选择器/XPath/JSON Path
│     * 字段映射: 源字段 → 目标字段
│     * 内容类型默认值
│     * 自动分类规则
│     * 启用状态
│
├── 抓取任务监控
│   - 任务列表(数据源名/上次执行时间/下次执行时间/状态)
│   - 成功/失败计数
│   - 错误日志查看
│   - 手动触发执行
│
├── 抓取结果审查
│   - 最新抓取到的内容列表
│   - 管理员快速浏览/编辑/丢弃
│   - 批量操作: 批量发布 / 批量丢弃 / 批量编辑
│   - 去重检测(基于标题相似度/URL指纹)
│
└── 抓取统计
    - 各源每日抓取量
    - 采用率(抓取后被发布出去的比例)
    - 内容覆盖度(哪些时间段/分类内容较少)
```

### 3.6 系统设置

```
├── 站点基本设置
│   - 站点名称/QiuQiuTech描述/Logo/ICO/Favicon
│   - SEO基础设置(title/description/keywords)
│   - 备案号/统计代码(百度统计/CNZZ等)
│   - 联系邮箱/客服微信
│
├── 内容设置
│   - 默认分页数量
│   - 是否允许新用户注册
│   - 是否开启用户提交功能
│   - 提交审核模式: 自动发布 / 人工审核 / AI预审+人工复核
│   - 每日提交上限
│   - 敏感词过滤词库管理
│
├── 对接设置
│   - 是否开放对接功能
│   - 对接需求有效期(默认30天)
│   - 每日发布对接上限
│   - 沟通方式配置(私信/暴露联系/两者都支持)
│   - 对接需求发布是否需要审核
│
└── 通知设置
    - 站内消息模板配置
    - 邮件通知配置(SMTP)
    - 审核结果通知开关
    - 营销推送开关
```

---

## 四、数据库设计

### 4.1 ER 核心实体关系

```
User ||--o{ Content          (一对多: 用户发布内容)
User ||--o{ Connection      (一对多: 用户发布对接需求)
User ||--o{ Comment          (一对多: 用户发表评论, v1.1)
Category ||--o{ Content      (一对多: 分类下有多个内容)
Content }o--|| Tag           (多对多: 内容-标签)
Content }o--|| Brand         (多对多: 内容-品牌)
Connection }o--|| Tag        (多对多: 对接-标签)
Message ||--o{ Message       (自关联: 私信对话)
```

### 4.2 核心表结构

```sql
-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE users (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid            VARCHAR(36) UNIQUE NOT NULL,        -- 公开ID
    phone           VARCHAR(20) UNIQUE,                  -- 手机号(用于登录)
    password_hash   VARCHAR(255) NOT NULL,               -- 密码哈希
    nickname        VARCHAR(50) NOT NULL DEFAULT '',     -- 昵称
    avatar          VARCHAR(500),                        -- 头像URL
    bio             TEXT,                                -- 个人简介
    company_name    VARCHAR(100),                        -- 公司名称
    job_title       VARCHAR(50),                         -- 职位
    role            ENUM('brand','marketer','kol','agency','other') DEFAULT 'other',
    is_verified     TINYINT(1) DEFAULT 0,                -- 是否认证
    verify_type     ENUM('personal','enterprise'),       -- 认证类型
    status          ENUM('active','banned','pending') DEFAULT 'active',
    last_login_at   TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_phone (phone),
    INDEX idx_status (status),
    INDEX idx_created (created_at DESC)
);

-- ============================================
-- 2. 内容表
-- ============================================
CREATE TABLE contents (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid            VARCHAR(36) UNIQUE NOT NULL,
    
    -- 内容基本信息
    title           VARCHAR(200) NOT NULL,               -- 标题
    slug            VARCHAR(220) UNIQUE,                 -- URL友好的slug
    summary         TEXT,                                -- 摘要
    body            LONGTEXT NOT NULL,                   -- 正文(HTML/Markdown)
    cover_image     VARCHAR(500),                        -- 封面图URL
    
    -- 分类与来源
    category_id     INT NOT NULL,                        -- 所属分类(FK→categories)
    content_type    ENUM('news','case','report','tactic','column','other'),
    source_type     ENUM('official','crawled','ugc','manual') DEFAULT 'ugc',
    source_url      VARCHAR(500),                        -- 原文URL(抓取/转载时填写)
    author_id       BIGINT,                              -- 作者(FK→users, NULL=抓取/官方)
    
    -- 状态与审核
    status          ENUM('draft','pending','approved','rejected','revision') DEFAULT 'draft',
    review_note     TEXT,                                -- 审核意见
    reviewed_by     BIGINT,                              -- 审核人
    reviewed_at     TIMESTAMP NULL,
    
    -- 展示控制
    is_featured     TINYINT(1) DEFAULT 0,                -- 是否精选
    is_top          TINYINT(1) DEFAULT 0,                -- 是否置顶
    top_until       TIMESTAMP NULL,                      -- 置顶截止
    recommend_score INT DEFAULT 0,                        -- 推荐权重(0-100)
    
    -- SEO
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    
    -- 统计
    view_count      INT UNSIGNED DEFAULT 0,
    like_count      INT UNSIGNED DEFAULT 0,
    favorite_count  INT UNSIGNED DEFAULT 0,
    
    -- 时间戳
    published_at    TIMESTAMP NULL,                      -- 正式发布时间
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_source_type (source_type),
    INDEX idx_published (published_at DESC),
    INDEX idx_recommend (recommend_score DESC, published_at DESC),
    FULLTEXT INDEX ft_title_body (title, body)
);

-- ============================================
-- 3. 对接需求表
-- ============================================
CREATE TABLE connections (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    uuid            VARCHAR(36) UNIQUE NOT NULL,
    
    -- 基本信息
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    type            ENUM('brand_seeks_kol','kol_seeks_brand','brand_seeks_agency',
                       'agency_seeks_brand','co_marketing','resource_exchange',
                       'talent_coop','other'),
    cover_image     VARCHAR(500),
    
    -- 发布者
    publisher_id    BIGINT NOT NULL,                     -- FK→users
    
    -- 需求属性(JSON字段,灵活扩展)
    industries      JSON,                                -- ["食品饮料","美妆"]
    regions         JSON,                                -- ["全国","华东"]
    budget_range    VARCHAR(20),                         -- 预算范围枚举
    cooperation_types JSON,                              -- ["content_collab","event_coop"]
    
    -- 附件
    attachments     JSON,                                -- 附件URL列表
    case_links      JSON,                                -- 往期案例链接
    
    -- 状态
    status          ENUM('draft','pending_review','active','paused','completed','closed') DEFAULT 'draft',
    review_note     TEXT,
    reviewed_by     BIGINT,
    reviewed_at     TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,                      -- 过期时间
    
    -- 统计
    view_count      INT UNSIGNED DEFAULT 0,
    like_count      INT UNSIGNED DEFAULT 0,
    contact_count  INT UNSIGNED DEFAULT 0,               -- 已联系数
    
    -- 推荐
    is_featured     TINYINT(1) DEFAULT 0,
    
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_type (type),
    INDEX idx_publisher (publisher_id),
    INDEX idx_active (status, expires_at, created_at DESC)
);

-- ============================================
-- 4. 分类表
-- ============================================
CREATE TABLE categories (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(50) NOT NULL,
    slug            VARCHAR(50) UNIQUE NOT NULL,
    icon            VARCHAR(50),                          -- emoji或icon名称
    description     VARCHAR(200),
    parent_id       INT DEFAULT 0,                        -- 0=一级分类
    sort_order      INT DEFAULT 0,
    is_active       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_parent (parent_id, sort_order),
    INDEX idx_slug (slug)
);

-- ============================================
-- 5. 标签表
-- ============================================
CREATE TABLE tags (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(50) NOT NULL UNIQUE,
    slug            VARCHAR(50) UNIQUE NOT NULL,
    color           VARCHAR(7) DEFAULT '#666666',        -- HEX色值
    use_count       INT UNSIGNED DEFAULT 0,
    is_hot          TINYINT(1) DEFAULT 0,
    is_recommended  TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FULLTEXT INDEX ft_name (name)
);

-- ============================================
-- 6. 内容-标签关联表
-- ============================================
CREATE TABLE content_tags (
    content_id      BIGINT NOT NULL,
    tag_id          INT NOT NULL,
    PRIMARY KEY (content_id, tag_id),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- ============================================
-- 7. 品牌/公司表
-- ============================================
CREATE TABLE brands (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) unique NOT NULL,
    logo            VARCHAR(500),
    industry        VARCHAR(50),
    description     TEXT,
    is_official_verified TINYINT(1) DEFAULT 0,           -- 官方认证
    content_count   INT UNSIGNED DEFAULT 0,               -- 冗余,便于查询
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FULLTEXT INDEX ft_name (name)
);

-- ============================================
-- 8. 内容-品牌关联表
-- ============================================
CREATE TABLE content_brands (
    content_id      BIGINT NOT NULL,
    brand_id        INT NOT NULL,
    PRIMARY KEY (content_id, brand_id)
);

-- ============================================
-- 9. 抓取源配置表
-- ============================================
CREATE TABLE crawl_sources (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    name            VARCHAR(100) NOT NULL,               -- 如"SocialBeta快讯"
    source_url      VARCHAR(500) NOT NULL,               -- 源URL
    crawl_type      ENUM('rss','html_page','api') DEFAULT 'rss',
    crawl_interval  INT DEFAULT 3600,                     -- 间隔(秒)
    
    -- 解析规则(JSON)
    parse_rules     JSON NOT NULL,                       -- 解析规则配置
    
    -- 字段映射(JSON)
    field_mapping   JSON,                                -- 源→目标字段映射
    
    -- 默认值
    default_category_id INT,                             -- 默认分类
    default_content_type VARCHAR(20),                    -- 默认内容类型
    
    -- 状态
    is_active       TINYINT(1) DEFAULT 1,
    last_crawl_at   TIMESTAMP NULL,
    last_crawl_status ENUM('success','failed','error') DEFAULT NULL,
    total_crawled   INT DEFAULT 0,
    total_accepted  INT DEFAULT 0,
    
    error_message   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 10. 抓取记录表
-- ============================================
CREATE TABLE crawl_logs (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    source_id       INT NOT NULL,
    source_url_path VARCHAR(500),                         -- 具体被抓取的URL
    raw_data        MEDIUMTEXT,                           -- 原始数据(JSON)
    parsed_data     JSON,                                 -- 解析后的数据
    status          ENUM('new','accepted','rejected','duplicate') DEFAULT 'new',
    content_id      BIGINT,                               -- 转化为正式内容的ID
    reject_reason   VARCHAR(200),
    fingerprint     VARCHAR(64),                          -- URL/标题指纹(去重用)
    crawled_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at    TIMESTAMP NULL,
    
    INDEX idx_source (source_id),
    INDEX idx_fingerprint (fingerprint),
    INDEX idx_status (status),
    INDEX idx_crawled (crawled_at DESC)
);

-- ============================================
-- 11. 私信/消息表
-- ============================================
CREATE TABLE messages (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    conversation_id VARCHAR(36) NOT NULL,                 -- 会话ID
    sender_id       BIGINT NOT NULL,
    receiver_id     BIGBIGINT NOT NULL,
    content         TEXT NOT NULL,
    msg_type        ENUM('text','image','system') DEFAULT 'text',
    is_read         TINYINT(1) DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_conversation (conversation_id, created_at),
    INDEX idx_receiver (receiver_id, is_read, created_at DESC)
);

-- ============================================
-- 12. 用户操作表(点赞/收藏/关注)
-- ============================================
CREATE TABLE user_actions (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    target_type     ENUM('content','connection','user') NOT NULL,
    target_id       BIGINT NOT NULL,
    action_type     ENUM('like','favorite','follow') NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY uk_action (user_id, target_type, target_id, action_type),
    INDEX idx_target (target_type, target_id)
);

-- ============================================
-- 13. 审核日志表
-- ============================================
CREATE TABLE review_logs (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    target_type     ENUM('content','connection') NOT NULL,
    target_id       BIGINT NOT NULL,
    reviewer_id     BIGINT NOT NULL,
    action          ENUM('approve','reject','request_revision') NOT NULL,
    note            TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 14. 系统通知表
-- ============================================
CREATE TABLE notifications (
    id              BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id         BIGINT NOT NULL,
    type            ENUM('content_approved','content_rejected',
                       'connection_approved','connection_rejected',
                       'system','message') NOT NULL,
    title           VARCHAR(200) NOT NULL,
    body            TEXT,
    is_read         TINYINT(1) DEFAULT 0,
    related_id      BIGINT,                               -- 关联的内容/对接ID
    related_type    VARCHAR(20),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_read (user_id, is_read, created_at DESC)
);
```

---

## 五、API 接口设计

### 5.1 RESTful API 规范

```yaml
BaseURL: https://api.qiqiutech.com/v1
认证: Bearer Token (JWT)
请求格式: JSON
响应格式: JSON
分页: ?page=1&pageSize=20
```

### 5.2 API 接口列表

#### **认证模块** `/auth/*`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | 手机号+验证码注册 | No |
| POST | /auth/login | 登录获取Token | No |
| POST | /auth/sms/send | 发送短信验证码 | No |
| POST | /auth/refresh | 刷新Token | No |
| GET | /auth/me | 获取当前用户信息 | Yes |
| PUT | /auth/profile | 更新个人信息 | Yes |
| POST | /auth/logout | 登出(黑名单Token) | Yes |

#### **内容模块** `/contents/*` (前台只读 + 用户写)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /contents | 内容列表(分页+筛选) | No |
| GET | /contents/:uuid | 内容详情 | No |
| GET | /contents/:uuid/related | 相关推荐 | No |
| POST | /contents | 用户提交内容 | Yes(Own) |
| PUT | /contents/:uuid | 编辑自己的草稿/待修改 | Yes(Own) |
| DELETE | /contents/:uuid | 删除自己的内容 | Yes(Own) |
| POST | /contents/:uuid/like | 点赞 | Yes |
| DELETE | /contents/:uuid/like | 取消点赞 | Yes |
| POST | /contents/:uuid/favorite | 收藏 | Yes |
| DELETE | /contents/:uuid/favorite | 取消收藏 | Yes |
| GET | /contents/tags/hot | 热门标签 | No |
| GET | /contents/search?q=xxx | 全局搜索 | No |

#### **对接模块** `/connections/*`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /connections | 对接列表(分页+多维筛选) | No |
| GET | /connections/:uuid | 对接详情 | No |
| POST | /connections | 发布对接需求 | Yes |
| PUT | /connections/:uuid | 编辑对接需求 | Yes(Own) |
| PATCH | /connections/:uuid/status | 下架/重新上架 | Yes(Own/Admin) |
| POST | /connections/:uuid/interest | 感兴趣/收藏 | Yes |
| GET | /connections/types/stats | 对接类型统计 | No |

#### **用户模块** `/users/*`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users/:uuid | 用户公开主页 | No |
| GET | /users/:uuid/contents | 用户发布的内容 | No |
| GET | /users/:users/connections | 用户发布的对接 | Yes(Own) |
| GET | /users/me/submissions | 我的提交(含状态) | Yes |
| GET | /users/me/favorites | 我的收藏 | Yes |
| POST | /users/:uuid/follow | 关注用户 | Yes |
| DELETE | /users/:uuid/follow | 取消关注 | Yes |

#### **消息/私信模块** `/messages/*`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /messages/conversations | 会话列表 | Yes |
| GET | /messages/conversations/:cid/messages | 消息记录 | Yes |
| POST | /messages/conversations/:cid/messages | 发送消息 | Yes |
| PUT | /messages/read/:mid | 标记已读 | Yes |
| GET | /notifications | 通知列表 | Yes |
| PUT | /notifications/:nid/read | 标记通知已读 | Yes |
| PUT | /notifications/read-all | 全部已读 | Yes |

#### **文件上传** `/upload/*`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /upload/image | 图片上传(JPG/PNG/WebP, ≤5MB) | Yes |
| POST | /upload/file | 附件上传(PDF/DOC等, ≤10MB) | Yes |
| POST | /upload/avatar | 头像上传 | Yes |

#### **后台管理API** `/admin/*` (需 admin 角色)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/dashboard/overview | 数据概览 |
| GET | /admin/dashboard/charts | 图表数据 |
| GET | /admin/contents | 内容列表(全量) |
| PUT | /admin/contents/:id | 编辑任何内容 |
| DELETE | /admin/contents/:id | 删除内容 |
| POST | /admin/contents/:id/review | 审核内容(通过/驳回/打回) |
| GET | /admin/contents/pending-review | 待审核队列 |
| GET | /admin/connections | 对接列表 |
| POST | /admin/connections/:id/review | 审核对接 |
| PUT | /admin/connections/:id | 编辑对接 |
| DELETE | /admin/connections/:id | 删除对接 |
| GET | /admin/users | 用户列表 |
| PUT | /admin/users/:id/status | 封号/解封 |
| GET | /admin/categories | 分类管理CRUD |
| POST | /admin/categories | 创建分类 |
| PUT | /admin/categories/:id | 更新分类 |
| DELETE | /admin/categories/:id | 删除分类 |
| GET | /admin/tags | 标签管理CRUD |
| POST | /admin/tags | 创建标签 |
| PUT | /admin/tags/:id | 更新标签 |
| DELETE | /admin/tags/:id | 删除标签 |
| GET | /admin/crawl-sources | 抓取源列表 |
| POST | /admin/crawl-sources | 新增抓取源 |
| PUT | /admin/crawl-sources/:id | 配置抓取源 |
| POST | /admin/crawl-sources/:id/trigger | 手动触发抓取 |
| GET | /admin/crawl-sources/:id/logs | 抓取日志 |
| GET | /admin/crawl-logs | 抓取结果列表(待审查) |
| POST | /admin/crawl-logs/:id/accept | 采纳抓取内容并发布 |
| POST | /admin/crawl-logs/:id/reject | 丢弃抓取内容 |
| GET | /admin/settings | 系统配置 |
| PUT | /admin/settings | 更新系统配置 |

### 5.3 标准 API 响应格式

```json
// 成功响应
{
  "code": 0,
  "message": "ok",
  "data": { ... }
}

// 分页响应
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}

// 错误响应
{
  "code": 40001,
  "message": "参数错误: 标题不能为空",
  "data": null
}
```

### 5.4 错误码定义

```yaml
# 通用错误码
0:         成功
40001:     参数错误
40101:     未登录/Token无效
40301:     无权限
40401:     资源不存在
40901:     资源冲突(重复)
42901:     请求过于频繁
50001:     服务器内部错误

# 业务错误码 - 内容
10001:     内容不存在
10002:     内容状态不允许此操作
10003:     非作者无权编辑
10004:     提交次数超限
10005:     内容含有敏感词

# 业务错误码 - 对接
20001:     对接需求不存在
20002:     对接需求已过期
20003:     对接需求已关闭
20004:     不能对自己的需求感兴趣

# 业务错误码 - 用户
30001:     用户已被封禁
30002:     手机号已注册
30003:     验证码错误或过期
30004:     每日短信发送次数已达上限
```

---

## 六、技术栈选型

### 6.1 推荐技术栈

```yaml
前端 (Frontend):
  framework: Next.js 14 (App Router, SSR/SSG)  # 或 Nuxt 3
  language: TypeScript 5.x
  styling: Tailwind CSS 4.x + shadcn/ui组件库
  state: Zustand (全局状态) + TanStack Query (服务端状态)
  editor: TipTap (富文本编辑器, 用于UGC提交)
  image: next/image (自动优化)
  charts: Recharts / ECharts (后台数据看板)
  animation: Framer Motion (微交互)
  form: React Hook Form + Zod (表单校验)

后端 (Backend):
  framework: Node.js + Fastify (或 NestJS)
  language: TypeScript / Node.js 20+
  orm: Prisma (类型安全ORM)
  database: PostgreSQL 15+
  cache: Redis 7 (会话/热点数据/限流)
  search: Meilisearch (全文检索, 替代Elasticsearch更轻量)
  queue: BullMQ (异步任务: 抓取/通知/邮件)
  auth: JWT (access_token 15min + refresh_token 7d)
  file: 本地存储/S3兼容(MinIO/OSS/COS)
  sms: 阿里云SMS / 腾讯云SMS

抓取服务 (Crawler):
  runtime: Node.js独立进程 (或 Python Scrapy)
  core: Cheerio (HTML解析) + RSS Parser (RSS源)
  anti-detect: Puppeteer(可选, JS渲染页面)
  schedule: node-cron (定时调度)
  dedupe: 基于标题SimHash + URL指纹去重

部署 (DevOps):
  container: Docker + Docker Compose (开发环境一键启动)
  ci_cd: GitHub Actions (或 Gitea)
  cdn: Cloudflare (静态资源加速)
  reverse_proxy: Nginx
  monitoring: PM2进程管理 + 日志收集
```

### 6.2 项目目录结构

```
QiuQiuTech/
├── apps/
│   ├── web/                    # Next.js 前端应用
│   │   ├── src/
│   │   │   ├── app/            # App Router页面
│   │   │   │   ├── (public)/   # 公开页面
│   │   │   │   │   ├── page.tsx            # 首页
│   │   │   │   │   ├── discover/page.tsx   # 发现页
│   │   │   │   │   ├── connection/page.tsx # 对接广场
│   │   │   │   │   ├── submit/page.tsx     # 用户提交
│   │   │   │   │   ├── search/page.tsx     # 搜索页
│   │   │   │   │   ├── article/[id]/page.tsx   # 内容详情
│   │   │   │   │   └── connection/[id]/page.tsx # 对接详情
│   │   │   │   ├── (auth)/     # 认证相关
│   │   │   │   │   ├── login/page.tsx
│   │   │   │   │   └── register/page.tsx
│   │   │   │   ├── (dashboard)/ # 用户面板
│   │   │   │   │   └── dashboard/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── submissions/page.tsx
│   │   │   │       ├── connections/page.tsx
│   │   │   │       ├── messages/page.tsx
│   │   │   │       ├── favorites/page.tsx
│   │   │   │       └── settings/page.tsx
│   │   │   │   └── (admin)/    # 后台管理
│   │   │   │       └── admin/
│   │   │   │           ├── page.tsx
│   │   │   │           ├── contents/page.tsx
│   │   │   │           ├── contents/review/page.tsx
│   │   │   │           ├── connections/page.tsx
│   │   │   │           ├── users/page.tsx
│   │   │   │           ├── crawl/page.tsx
│   │   │   │           └── settings/page.tsx
│   │   │   ├── components/    # 共享组件
│   │   │   │   ├── ui/        # shadcn/ui基础组件
│   │   │   │   ├── layout/    # 布局组件(Nav/Footer/Sidebar)
│   │   │   │   ├── content/   # 内容相关组件(卡片/列表/详情)
│   │   │   │   ├── connection/# 对接相关组件
│   │   │   │   ├── forms/     # 表单组件(提交表单)
│   │   │   │   └── admin/     # 后台管理组件
│   │   │   ├── lib/           # 工具函数
│   │   │   ├── hooks/         # 自定义Hooks
│   │   │   ├── stores/        # Zustand状态
│   │   │   ├── types/         # TypeScript类型定义
│   │   │   └── styles/        # 全局样式
│   │   ├── public/            # 静态资源
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   ├── api/                    # 后端API服务
│   │   ├── src/
│   │   │   ├── routes/        # 路由模块
│   │   │   │   ├── auth.route.ts
│   │   │   │   ├── contents.route.ts
│   │   │   │   ├── connections.route.ts
│   │   │   │   ├── users.route.ts
│   │   │   │   ├── messages.route.ts
│   │   │   │   ├── upload.route.ts
│   │   │   │   ├── search.route.ts
│   │   │   │   └── admin/      # 管理后台路由
│   │   │   ├── services/      # 业务逻辑层
│   │   │   │   ├── content.service.ts
│   │   │   │   ├── connection.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── crawl.service.ts
│   │   │   │   ├── search.service.ts
│   │   │   │   └── notification.service.ts
│   │   │   ├── middleware/     # 中间件
│   │   │   │   ├── auth.middleware.ts
│   │   │   │   ├── rbac.middleware.ts
│   │   │   │   ├── rateLimit.middleware.ts
│   │   │   │   └── validate.middleware.ts
│   │   │   ├── utils/         # 工具函数
│   │   │   ├── prisma/        # Prisma Schema + 迁移
│   │   │   └── index.ts       # 入口
│   │   ├── prisma/
│   │   │   └── schema.prisma  # 数据模型
│   │   └── package.json
│   │
│   └── crawler/                # 抓取服务(独立应用)
│       ├── src/
│       │   ├── engines/       # 各平台的解析器
│       │   │   ├── base.engine.ts
│       │   │   ├── rss.engine.ts
│       │   │   ├── socialbeta.engine.ts
│       │   │   ├── digitaling.engine.ts
│       │   │   └── custom.engine.ts
│       │   ├── scheduler.ts   # 定时调度
│       │   ├── deduplicator.ts # 去重器
│       │   ├── indexer.ts     # 写入DB/搜索引擎
│       │   └── index.ts       # 入口
│       └── package.json
│
├── packages/
│   └── shared/                 # 共享类型/常量/工具
│       ├── src/
│       │   ├── types.ts        # 共享TypeScript类型
│       │   ├── constants.ts    # 枚举/常量
│       │   ├── errors.ts       # 错误码定义
│       │   └── validators.ts   # 共享校验规则
│       └── package.json
│
├── docker-compose.yml          # 开发环境编排(PostgreSQL + Redis + MinIO + API + Crawler)
├── .env.example                # 环境变量示例
├── README.md
└── package.json                # Monorepo根
```

---

## 七、页面与交互流程图

### 7.1 用户核心旅程

```
访客(未登录):
  浏览首页 → 浏览内容详情 → 浏览对接广场 → 
  点击"提交内容"/"发布对接" → 登录/注册引导

已注册用户:
  浏览内容 → 收藏/点赞 → 提交内容 → 等待审核 → 
  审核通过收到通知 → 内容上线 → 
  浏览对接广场 → 发布对接需求 → 
  收到联系私信 → 沟通交流 → 达成合作

管理员:
  登录后台 → Dashboard看概览 → 进入审核队列 → 
  逐条审核(通过/驳回/打回) → 配置抓取源 → 
  检查抓取结果 → 批量采纳/丢弃 → 
  管理用户/回复投诉 → 查看数据报表
```

### 7.2 内容流转状态机

```
┌──────────┐   用户保存    ┌──────────┐
│  开始    │ ──────────→   │  DRAFT   │
└──────────┘               │ (草稿)   │
                           └────┬─────┘
                                │ 用户提交
                                ↓
                           ┌──────────┐
                           │ PENDING  │
                           │ (待审核) │
                           └────┬─────┘
                    ┌────────────┼────────────┐
                    │            │            │
                    ↓            ↓            ↓
             ┌──────────┐  ┌──────────┐  ┌──────────────┐
             │APPROVED  │  │ REJECTED │  │REVISION_REQ  │
             │(已通过)  │  │(已驳回)  │  │(待修改)       │
             └────┬─────┘  └──────────┘  └──────┬───────┘
                  │                            │
                  ↓                            │ 用户修改后
           ┌──────────┐                        ↓
           │ ONLINE   │                    ┌──────────┐
           │ (已上线)  │←───────────────────│ PENDING  │
           └──────────┘                    └──────────┘
```

### 7.3 对接需求状态机

```
     ┌──────────┐
     │  DRAFT   │──发布──→ ┌───────────────┐
     │ (草稿)   │         │PENDING_REVIEW │
     └──────────┘         │  (待审核)      │
                           └───────┬───────┘
                                   │ 审核通过
                                   ↓
                           ┌───────────────┐
                           │    ACTIVE     │◄─── 暂停/恢复
                           │   (进行中)     │──→ PAUSED
                           └───┬───────┬───┘
                               │       │
                    过期/手动完成  │   人工关闭
                               ↓       ↓
                         ┌──────────┐ ┌──────────┐
                         │COMPLETED │ │  CLOSED  │
                         └──────────┘ └──────────┘
```

---

## 八、MVP版本规划

### Phase 1 (MVP) — 核心闭环

> **目标**: 验证"内容+对接"核心模式, 单人可运营

**前台功能**:
- [x] 首页(信息流 + Banner + 热榜 + 侧边栏)
- [x] 内容详情页
- [x] 用户注册/登录(手机号+短信验证码)
- [x] 用户提交内容(含表单+富文本+封面上传)
- [x] 对接广场(列表+筛选+详情)
- [x] 发布对接需求
- [x] 用户中心(我的提交/我的对接/账户设置)
- [x] 搜索(基础全文搜索)
- [x] 响应式布局(Mobile适配)

**后台功能**:
- [x] Dashboard数据概览
- [x] 内容CRUD + 审核
- [x] 对接CRUD + 审核
- [x] 用户管理(列表/详情/封号)
- [x] 分类/标签/品牌库管理
- [x] Banner管理
- [x] 系统设置

**抓取服务**:
- [x] RSS源抓取引擎
- [x] HTML页面抓取(Cheerio)
- [x] 定时调度(cron)
- [x] 去重机制
- [x] 抓取结果审查面板
- [x] 预配置3-5个常用数据源

**不包含(Phase 2)**:
- [ ] 评论系统
- [ ] 私信/即时通讯
- [ ] 企业/个人认证
- [ ] APP版本
- [ ] 微信小程序
- [ ] 数据分析高级功能
- [ ] 内容推荐算法
- [ ] 付费会员

### Phase 2 (增长)

- 评论系统 + 互动增强
- 私信/即时通讯(WebSocket)
- 个人/企业认证体系
- 内容推荐算法(协同过滤 + 内容向量)
- 微信小程序
- 数据分析增强(用户行为漏斗/内容效果分析)
- 多语言SEO(面向海外营销人)

### Phase 3 (商业化)

- 付费会员(品牌方高级展示位/优先推荐)
- 对接撮合增值服务(顾问介入撮合, 收取服务费)
- 行业报告付费下载
- 品牌专区/定制化页面
- API开放平台
- AD广告系统(原生信息流广告)

---

## 九、非功能性需求

### 9.1 性能指标

| 指标 | 目标值 |
|------|--------|
| 首页首屏加载(FCP) | < 1.5s |
| 页面完全加载(LCP) | < 2.5s |
| API响应时间(p95) | < 300ms |
| API响应时间(p99) | < 800ms |
| 并发用户支持 | 1000+ (MVP) |
| 数据库查询(简单) | < 50ms |
| 搜索响应 | < 200ms |

### 9.2 安全性

- JWT Token认证, RefreshToken轮换
- SQL注入防护(Prisma ORM参数化)
- XSS防护(React内置 + CSP策略)
- CSRF保护(Token校验)
- 文件上传白名单(MIME Type + Magic Bytes)
- 敏感词过滤(内容提交时)
- 接口限流(Rate Limit: 60次/分钟/IP)
- 管理员操作审计日志
- HTTPS强制
- CORS白名单配置
- 密码bcrypt哈希(cost=12)

### 9.3 SEO优化

- SSR/SSG渲染(Next.js)
- 语义化HTML
- 每页自定义meta(title/description/og标签)
- 结构化数据(JSON-LD: Article/Organization/WebSite)
- Sitemap.xml自动生成
- Robots.txt
- Canonical URL
- 移动端友好(Responsive)
- Core Web Vitals优化
- 面包屑导航

---

## 十、UI/UX 设计规范参考

### 10.1 设计原则

```
1. 内容优先: 减少视觉噪音, 让内容和信息说话
2. 清爽专业: 参考SocialBeta的简洁风, 白色底+少量强调色
3. 信息密度适中: 不追求极简空洞, 也不过度拥挤
4. 卡片式设计: 所有内容单元以卡片呈现, 边界清晰
5. 标签化: 大量使用标签作为信息组织和导航手段
6. 响应式: Mobile First设计思路
```

### 10.2 色彩方案(建议)

```
主色调(Primary):    #2563EB (蓝色系, 专业可信) — 主要按钮/链接/选中态
辅助色(Accent):     #F59E0B (琥珀金) — 强调/热门/推荐标记
成功色(Success):    #10B981 (绿色) — 通过/在线/可用
警告色(Warning):    #EF4444 (红色) — 驳回/错误/紧急
中性色(Neutral):
  - 文字:          #1F2937 (深灰)
  - 次要文字:      #6B7280 (中灰)
  - 边框:          #E5E7EB (浅灰)
  - 背景:          #FFFFFF (白色)
  - 底色:          #F9FAFB (极浅灰)

对接类型色彩:
  品牌寻KOL:       #8B5CF6 (紫色)
  KOL寻品牌:       #EC4899 (粉色)
  联合营销:       #06B6D4 (青色)
  资源置换:       #F97316 (橙色)
  其他:           #64748B (灰蓝)
```

### 10.3 字体规范

```
中文: 思源黑体 (Noto Sans SC) / 苹方 (PingFang SC)
英文/数字: Inter
代码: JetBrains Mono

字号层级:
  H1:  32px/ Bold   (文章标题)
  H2:  24px/ Semibold (章节标题)
  H3:  18px/ Semibold (小节)
  Body: 16px/ Regular (正文)
  Small: 14px/ Regular (次要信息)
  Caption: 12px/ Regular (辅助说明)
```

---

## 十一、第三方服务集成清单

| 服务 | 用途 | 推荐方案 | MVP必需 |
|------|------|---------|---------|
| 短信验证码 | 用户注册/登录 | 阿里云SMS / 腾讯云SMS | ✅ 必须 |
| 对象存储 | 文件/图片存储 | 阿里云OSS / 腾讯云COS / MinIO(自建) | ✅ 必须 |
| CDN | 静态资源加速 | Cloudflare / 阿里CDN | ✅ 必须 |
| 全文搜索 | 内容搜索 | Meilisearch(自托管) / Algolia | ✅ 必须 |
| 邮件(可选) | 通知发送 | Resend / SendGrid / SMTP | Phase 2 |
| 统计分析 | 流量分析 | 百度统计 / Google Analytics | ✅ 建议 |
| 微信生态 | 小程序/社交登录 | 微信开放平台 | Phase 2 |
| 地图(可选) | 品牌地域展示 | 高德地图API | Phase 2 |
| 支付(Phase 3) | 会员/增值服务支付 | 微信支付 / 支付宝 | Phase 3 |

---

## 十二、关键注意事项与风险提示

### 12.1 法律合规

- **内容合规**: 用户生成内容需要《网络内容服务平台协议》框架, 建议接入第三方内容审核API(阿里云/腾讯云内容安全)
- **用户协议/隐私政策**: 必须在上线前准备, 明确数据使用规则
- **ICP备案**: 国内服务器必须ICP备案
- **信息发布资质**: 如果涉及新闻类内容, 需关注《互联网信息服务管理办法》
- **对接功能法律边界**: 平台作为信息撮合方, 需在用户协议中明确免责条款, 不承担交易纠纷责任

### 12.2 运营建议

- **冷启动阶段**: 先用AI抓取填充200-500条高质量内容, 再开放UGC
- **内容质量控制**: 初期严格审核, 建立标杆内容, 引导后续UGC质量
- **对接冷启动**: 自己先发布10-20个真实/模拟对接需求作为种子
- **社区氛围**: 管理员积极互动(评论/点赞), 营造活跃氛围
- **抓取合规**: 尊重robots.txt, 合理设置抓取频率, 避免给源站造成压力
- **版权问题**: 抓取的内容需注明来源, 转载类内容需注意版权风险, 建议设置"原文链接"字段必填

### 12.3 技术风险与应对

| 风险 | 影响 | 应对方案 |
|------|------|---------|
| 抓取源反爬 | 内容中断 | 多源冗余 + 降级策略 + 保留RSS优先 |
| UGC垃圾/ spam | 内容质量下降 | 敏感词过滤 + 新用户限制 + 举报机制 |
| 对接需求虚假 | 信任受损 | 认证体系 + 信用评分 + 保证金(Phase 3) |
| 高并发性能瓶颈 | 用户体验下降 | Redis缓存 + CDN + 数据库读写分离(扩容时) |
| 版权投诉 | 法律风险 | DMCA流程 + 快速下架通道 + 内容来源标注 |

---

## 附录A: 开发排期估算

| 阶段 | 工作内容 | 预估工期 |
|------|---------|---------|
| **Sprint 1** | 项目初始化 + DB设计 + 认证系统 + 基础布局 | 1周 |
| **Sprint 2** | 内容CMS(前台展示 + 后台CRUD + 审核) | 1.5周 |
| **Sprint 3** | UGC提交系统 + 富文本 + 文件上传 | 1周 |
| **Sprint 4** | 对接广场(前台 + 后台 + 搜索) | 1.5周 |
| **Sprint 5** | 抓取服务 + 定时任务 + 结果审查 | 1.5周 |
| **Sprint 6** | 用户中心 + 消息通知 + Dashboard完善 | 1周 |
| **Sprint 7** | UI打磨 + 响应式适配 + 性能优化 | 1周 |
| **Sprint 8** | 测试 + Bug修复 + 部署上线 | 1周 |
| **总计MVP** | | **~9.5周** |

> 注: 以1名全栈开发者为准。如果AI辅助编码, 可缩短至4-6周。

---

## 附录B: 竞品参考对照速查

| 功能点 | 邦连接 | SocialBeta | 数英网 | QiuQiuTech |
|--------|--------|-----------|--------|------------|
| 数据仪表盘 | ★★★★ | ★★☆☆ | ★★★☆ | ★★★★ (学邦连接) |
| 信息流设计 | ★★★☆ | ★★★★ | ★★★★ | ★★★★★ (融合两者优点) |
| Banner轮播 | ★★★☆ | ★★★★ | ★★★★ | ★★★★★ |
| 标签体系 | ★★★☆ | ★★★★★ | ★★★★ | ★★★★★ |
| 用户投稿 | ★☆☆☆ | ☆☆☆☆ | ★★★★★ | ★★★★★ (核心功能) |
| 内容审核流 | ★★☆☆ | 内部流 | ★★★★ | ★★★★★ (完整工作流) |
| AI抓取聚合 | ★★★★(数据) | ☆☆☆☆ | ☆☆☆☆ | ★★★★★ (独创优势) |
| 资源对接 | ★★★★★(投资) | ☆☆☆☆ | ★★☆☆ | ★★★★★(营销C2C) |
| UI整洁度 | ★★★★ | ★★★★★ | ★★★★ | ★★★★★ (学SB) |
| 移动端适配 | ★★★★ | ★★★★ | ★★★★★ | ★★★★ (MVP后再加强) |

---

> **Brief Version**: v1.0.0  
> **Last Updated**: 2026-05-07  
> **Status**: Ready for Development  
> **Next Step**: 基于 Brief 开始 Sprint 1 开发
