# QiuQiuTech 首页架构可视化图

## 1. 整体布局结构图

```mermaid
graph TB
    subgraph 首页布局
        A[顶部导航栏<br/>固定]
        B[Hero 轮播区<br/>可配置 3-5 张]
        C[实时趋势 + 今日热榜<br/>双栏布局]
        D[精选案例区<br/>Tab 分类切换]
        E[策略主题区<br/>玩法标签云 + 趋势关键词]
        F[专题策展区<br/>横向滚动]
        G[合作需求精选<br/>需求卡片 + CTA]
        H[用户投稿精选<br/>UGC 展示 + CTA]
        I[平台价值说明<br/>4 个价值点]
        J[订阅区域<br/>邮箱 + 二维码]
        K[页脚 Footer]
        
        A --> B
        B --> C
        C --> D
        D --> E
        E --> F
        F --> G
        G --> H
        H --> I
        I --> J
        J --> K
    end
    
    style A fill:#e3f2fd
    style B fill:#bbdefb
    style C fill:#90caf9
    style D fill:#64b5f6
    style E fill:#42a5f5
    style F fill:#2196f3
    style G fill:#1e88e5
    style H fill:#1976d2
    style I fill:#1565c0
    style J fill:#0d47a1
    style K fill:#0d47a1
```

## 2. 组件层次结构图

```mermaid
graph TD
    subgraph Homepage[首页组件树]
        HP[Homepage]
        
        subgraph Hero[Hero 轮播区]
            HC[HeroCarousel]
            HCard1[HeroCard 1]
            HCard2[HeroCard 2]
            HCard3[HeroCard 3]
            HC --> HCard1
            HC --> HCard2
            HC --> HCard3
        end
        
        subgraph Trend[实时趋势区]
            TS[TrendSection]
            TC[TrendChart]
            TT[TimeTab<br/>24h/7d/30d]
            HR[HotRanking<br/>Top 10]
            TS --> TC
            TS --> TT
            TS --> HR
        end
        
        subgraph Cases[精选案例区]
            FC[FeaturedCases]
            CT[CategoryTabs<br/>分类切换]
            SC[SpotlightCard<br/>焦点大卡]
            CG[CaseGrid<br/>卡片网格]
            FC --> CT
            FC --> SC
            FC --> CG
        end
        
        subgraph Strategy[策略主题区]
            SS[StrategySection]
            PT[PlaybookTags<br/>玩法标签云]
            TK[TrendKeywords<br/>趋势关键词]
            SS --> PT
            SS --> TK
        end
        
        subgraph Topics[专题策展区]
            TPS[TopicsSection]
            TPC[TopicCarousel<br/>横向滚动]
            TPS --> TPC
        end
        
        subgraph Requests[合作需求区]
            RS[RequestsSection]
            RC[RequestCards<br/>需求卡片]
            RCT[CTA Button<br/>发布需求]
            RS --> RC
            RS --> RCT
        end
        
        subgraph Submissions[用户投稿区]
            SUBS[SubmissionsSection]
            SCards[SubmissionCards<br/>投稿卡片]
            SCT[CTA Button<br/>提交投稿]
            SUBS --> SCards
            SUBS --> SCT
        end
        
        subgraph Value[平台价值区]
            VS[ValueSection]
            VC1[Value Card 1]
            VC2[Value Card 2]
            VC3[Value Card 3]
            VC4[Value Card 4]
            VS --> VC1
            VS --> VC2
            VS --> VC3
            VS --> VC4
        end
        
        subgraph Subscribe[订阅区]
            SUB[SubscribeSection]
            SF[SubscribeForm]
            QR[QR Code]
            SUB --> SF
            SUB --> QR
        end
        
        HP --> Hero
        HP --> Trend
        HP --> Cases
        HP --> Strategy
        HP --> Topics
        HP --> Requests
        HP --> Submissions
        HP --> Value
        HP --> Subscribe
    end
    
    style HP fill:#1e88e5,color:#fff
    style Hero fill:#64b5f6
    style Trend fill:#64b5f6
    style Cases fill:#64b5f6
    style Strategy fill:#64b5f6
    style Topics fill:#64b5f6
    style Requests fill:#64b5f6
    style Submissions fill:#64b5f6
    style Value fill:#64b5f6
    style Subscribe fill:#64b5f6
```

## 3. 数据流向图

```mermaid
graph LR
    subgraph DataSources[数据源]
        D1[Directus CMS<br/>placements 配置]
        D2[Directus CMS<br/>contents 内容]
        D3[Directus CMS<br/>connections 对接需求]
        D4[AI 抓取引擎<br/>实时数据]
        D5[UGC 提交<br/>用户投稿]
    end
    
    subgraph API[API 层]
        A1[Homepage API<br/>聚合接口]
        A2[Content API<br/>内容接口]
        A3[Request API<br/>对接接口]
    end
    
    subgraph Components[前端组件]
        C1[HeroCarousel]
        C2[TrendChart]
        C3[FeaturedCases]
        C4[RequestsSection]
        C5[SubmissionsSection]
    end
    
    D1 --> A1
    D2 --> A2
    D3 --> A3
    D4 --> A1
    D5 --> A2
    
    A1 --> C1
    A1 --> C2
    A2 --> C3
    A2 --> C5
    A3 --> C4
    
    style DataSources fill:#e3f2fd
    style API fill:#bbdefb
    style Components fill:#90caf9
```

## 4. Tab 切换交互状态图

```mermaid
stateDiagram-v2
    [*] --> 全部Tab
    全部Tab --> 联名营销Tab: 点击
    全部Tab --> 社媒传播Tab: 点击
    全部Tab --> 事件营销Tab: 点击
    全部Tab --> 跨界合作Tab: 点击
    
    联名营销Tab --> 全部Tab: 点击
    联名营销Tab --> 社媒传播Tab: 点击
    联名营销Tab --> 事件营销Tab: 点击
    
    社媒传播Tab --> 全部Tab: 点击
    社媒传播Tab --> 联名营销Tab: 点击
    社媒传播Tab --> 事件营销Tab: 点击
    
    事件营销Tab --> 全部Tab: 点击
    事件营销Tab --> 联名营销Tab: 点击
    事件营销Tab --> 社媒传播Tab: 点击
    
    跨界合作Tab --> 全部Tab: 点击
    跨界合作Tab --> 联名营销Tab: 点击
    
    note right of 全部Tab
        显示所有精选案例
        按推荐权重排序
    end note
    
    note right of 联名营销Tab
        只显示联名营销类案例
        按发布时间排序
    end note
    
    note right of 社媒传播Tab
        只显示社媒传播类案例
        按发布时间排序
    end note
```

## 5. 实时趋势时间维度切换图

```mermaid
graph LR
    subgraph TimeTabs[时间维度 Tab]
        T24[24h<br/>默认]
        T7[7d]
        T30[30d]
    end
    
    subgraph Data[数据聚合]
        D24[最近 24 小时数据]
        D7[最近 7 天数据]
        D30[最近 30 天数据]
    end
    
    subgraph Chart[趋势图]
        C1[趋势线 1<br/>品牌联名]
        C2[趋势线 2<br/>社媒传播]
        C3[趋势线 3<br/>事件营销]
    end
    
    T24 --> D24: 点击
    T7 --> D7: 点击
    T30 --> D30: 点击
    
    D24 --> C1
    D24 --> C2
    D24 --> C3
    
    D7 --> C1
    D7 --> C2
    D7 --> C3
    
    D30 --> C1
    D30 --> C2
    D30 --> C3
    
    style T24 fill:#2196f3,color:#fff
    style T7 fill:#e3f2fd
    style T30 fill:#e3f2fd
```

## 6. 内容分类体系图

```mermaid
graph TD
    subgraph Navigation[导航栏一级分类]
        N1[内容中心]
        N2[案例库]
        N3[玩法库]
        N4[对接广场]
        N5[专题]
    end
    
    subgraph ContentCenter[内容中心二级分类]
        C1[营销快讯]
        C2[创意案例]
        C3[数据报告]
        C4[营销玩法]
        C5[人物观点]
        C6[专题策划]
    end
    
    subgraph Tags[标签体系]
        T1[行业标签<br/>食品饮料/美妆个护/服饰鞋包]
        T2[玩法标签<br/>联名营销/跨界合作/社媒传播]
        T3[平台标签<br/>抖音/小红书/微信/B站/微博]
        T4[品牌标签<br/>瑞幸/喜茶/完美日记]
    end
    
    N1 --> C1
    N1 --> C2
    N1 --> C3
    N1 --> C4
    N1 --> C5
    N1 --> C6
    
    C2 --> T1
    C2 --> T2
    C2 --> T3
    C2 --> T4
    
    C4 --> T2
    C4 --> T3
    
    style Navigation fill:#1e88e5,color:#fff
    style ContentCenter fill:#42a5f5,color:#fff
    style Tags fill:#90caf9
```

## 7. 配置优先级图

```mermaid
graph TB
    subgraph P0[第一阶段 P0 - 核心板块]
        P0_1[Hero 轮播]
        P0_2[实时趋势图]
        P0_3[今日热榜]
        P0_4[精选案例 Tab]
        P0_5[合作需求精选]
    end
    
    subgraph P1[第二阶段 P1 - 扩展板块]
        P1_1[策略主题区]
        P1_2[趋势关键词]
        P1_3[专题策展]
        P1_4[用户投稿精选]
    end
    
    subgraph P2[第三阶段 P2 - 优化板块]
        P2_1[平台价值说明]
        P2_2[订阅区域]
        P2_3[动效优化]
        P2_4[性能优化]
    end
    
    style P0 fill:#4caf50,color:#fff
    style P1 fill:#ff9800,color:#fff
    style P2 fill:#9e9e9e,color:#fff
```

## 8. 响应式布局断点图

```mermaid
graph LR
    subgraph Breakpoints[响应式断点]
        B1[Mobile<br/>&lt; 768px]
        B2[Tablet<br/>768-1024px]
        B3[Desktop<br/>&gt; 1024px]
    end
    
    subgraph Layout[布局变化]
        L1[单栏布局<br/>纵向堆叠]
        L2[双栏布局<br/>部分并排]
        L3[多栏布局<br/>充分利用宽度]
    end
    
    B1 --> L1
    B2 --> L2
    B3 --> L3
    
    style B1 fill:#f44336,color:#fff
    style B2 fill:#ff9800,color:#fff
    style B3 fill:#4caf50,color:#fff
```

## 9. 技术栈架构图

```mermaid
graph TB
    subgraph Frontend[前端技术栈]
        F1[Next.js 15<br/>App Router]
        F2[React 19<br/>Server Components]
        F3[TypeScript<br/>类型安全]
        F4[shadcn/ui<br/>基础组件]
        F5[Lucide React<br/>图标库]
    end
    
    subgraph Visualization[可视化组件]
        V1[Recharts<br/>趋势图]
        V2[Framer Motion<br/>动效]
    end
    
    subgraph Data[数据获取]
        D1[Directus SDK<br/>CMS 数据]
        D2[SWR<br/>数据缓存]
        D3[Server Actions<br/>服务端获取]
    end
    
    subgraph Deployment[部署]
        DEP1[Vercel<br/>自动部署]
        DEP2[Storybook<br/>组件文档]
    end
    
    Frontend --> Visualization
    Frontend --> Data
    Data --> Deployment
    
    style Frontend fill:#1e88e5,color:#fff
    style Visualization fill:#42a5f5,color:#fff
    style Data fill:#64b5f6,color:#fff
    style Deployment fill:#90caf9
```

## 10. 用户交互流程图

```mermaid
sequenceDiagram
    participant U as 用户
    participant H as 首页
    participant T as Tab 组件
    participant A as API
    participant D as Directus
    
    U->>H: 访问首页
    H->>A: 请求首页数据
    A->>D: 聚合数据
    D-->>A: 返回数据
    A-->>H: 返回首页数据
    H-->>U: 渲染首页
    
    U->>T: 点击分类 Tab
    T->>A: 请求分类数据
    A->>D: 查询分类内容
    D-->>A: 返回分类数据
    A-->>T: 返回分类数据
    T->>H: 更新内容展示
    H-->>U: 显示分类内容
    
    U->>H: 点击时间维度 Tab
    H->>A: 请求趋势数据
    A->>D: 查询趋势数据
    D-->>A: 返回趋势数据
    A-->>H: 返回趋势数据
    H->>H: 更新趋势图
    H-->>U: 显示新趋势图
```
