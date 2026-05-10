import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import SelectedCasesWithTabs from "@/components/selected-cases-with-tabs";
import { getHomepageData } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";
import MarketingHeatTrendCard from "@/components/marketing-heat-trend-card";
import {
  playbookTags as fallbackPlaybookTags,
  realtimeEventsFeed as fallbackRealtimeEventsFeed,
  realtimeTrendSeries as fallbackRealtimeTrendSeries,
  requestCards as fallbackRequestCards,
  selectedCaseCards as fallbackSelectedCaseCards,
  submissionShowcase as fallbackSubmissionShowcase,
  trendKeywords as fallbackTrendKeywords,
  valueHighlights as fallbackValueHighlights,
} from "@/lib/site-data";
import ProjectCarousel from "@/components/project-carousel";

export const metadata = buildMetadata({
  title: "QiuQiuTech｜营销行业实时洞察与合作对接平台",
  description: "QiuQiuTech 是一个聚合营销内容、营销事件、营销玩法与合作对接的公开 Web 平台。",
  path: "/",
  keywords: [
    "营销内容平台",
    "品牌营销案例",
    "营销事件追踪",
    "营销玩法拆解",
    "品牌合作对接",
  ],
});

function dedupeTags(values: string[]) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const normalized = value.trim().toLowerCase();
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

export default async function Home() {
  const homepage = await getHomepageData();
  const heroSpotlight = homepage.heroSpotlight ?? null;
  const selectedCaseCards = homepage.selectedCaseCards ?? fallbackSelectedCaseCards;
  const realtimeTrendSeries = homepage.realtimeTrendSeries ?? fallbackRealtimeTrendSeries;
  const realtimeEventsFeed = homepage.realtimeEventsFeed ?? fallbackRealtimeEventsFeed;
  const requestCards = homepage.requestCards ?? fallbackRequestCards;
  const playbookTags = homepage.playbookTags ?? fallbackPlaybookTags;
  const trendKeywords = homepage.trendKeywords ?? fallbackTrendKeywords;
  const submissionShowcase = homepage.submissionShowcase ?? fallbackSubmissionShowcase;
  const valueHighlights = homepage.valueHighlights ?? fallbackValueHighlights;
  const heroSlides = [
    {
      title: heroSpotlight?.title || "瑞幸咖啡×茅台联名爆款",
      label: heroSpotlight?.label || "精选案例",
      partners:
        (heroSpotlight?.partners || []).filter(Boolean).slice(0, 2).length > 0
          ? (heroSpotlight?.partners || []).filter(Boolean).slice(0, 2)
          : ["Featured Brand", "QiuQiuTech"],
      tags: dedupeTags(
        (heroSpotlight?.tags || []).filter(Boolean).slice(0, 3).length > 0
          ? (heroSpotlight?.tags || []).filter(Boolean).slice(0, 3)
          : ["Campaign", "品牌传播"],
      ),
      summary:
        "把高热案例收进更克制的展示结构里，让标题、主图和信息卡各自分工清晰。",
      statValue: heroSpotlight?.statValue || "3天破1亿",
      statNote: heroSpotlight?.statNote || "销售额突破 1 亿元",
      href: selectedCaseCards[0]?.href || "/contents",
      paletteClass: selectedCaseCards[0]?.palette || "from-[#273f77] via-[#3d6f84] to-[#d3e6d9]",
    },
    ...selectedCaseCards.slice(0, 3).map((item) => ({
      title: item.title,
      label: item.tag,
      partners: [item.byline.replace(/^by\s+/i, ""), "QiuQiuTech"],
      tags: dedupeTags([item.tag]),
      summary: item.summary,
      statValue: "精选收录",
      statNote: "适合承担首页主视觉、专题封面与内容入口。",
      href: item.href,
      paletteClass: item.palette,
    })),
  ];
  const dedupedHeroSlides = heroSlides.filter(
    (slide, index, array) => array.findIndex((item) => item.title === slide.title) === index,
  );

  return (
    <SiteShell activePath="/">
      {/* ========== SECTION 1: 品牌叙事 + 趋势 ========== */}
      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr] xl:items-stretch">
        {/* 左列：叙事区 */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8 h-full flex flex-col">
          {/* 顶部标签 */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-[var(--teal)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">
              Marketing Intelligence
            </span>
          </div>

          {/* 标题区 */}
          <div className="mt-5 max-w-2xl">
            <h1 className="text-[2.2rem] font-bold leading-[1.2] tracking-tight text-[var(--navy)]">
              发现营销机会
            </h1>
            <p className="mt-3 text-[15px] leading-[1.85] text-[var(--copy-soft)]">
              每日更新 100+ 品牌案例、热点趋势、合作需求
            </p>
          </div>

          {/* 趋势图 */}
          <MarketingHeatTrendCard
            initialWindow="24h"
            initialSeries={realtimeTrendSeries}
            initialHotTopics={trendKeywords}
          />
        </div>

        {/* 右列：实时事件 */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8 xl:h-full">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-6 bg-[var(--teal)]" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--teal)]">PROJECT SHOWCASE</p>
                <p className="mt-1 text-[15px] font-semibold tracking-tight text-[var(--navy)]">精选营销项目</p>
              </div>
            </div>
            <Link href="/contents" className="group text-[13px] font-medium text-[var(--teal)] hover:text-[var(--teal-deep)] transition-colors flex items-center gap-1">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[var(--teal-deep)] after:transition-all after:duration-300 group-hover:after:w-full">
                更多
              </span>
              <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          </div>

          {/* 精选项目轮播 */}
          <ProjectCarousel slides={dedupedHeroSlides.map((slide, i) => ({
            ...slide,
            score: i === 0 ? "98.5" : undefined,
          }))} />

          {/* 次级项目卡片 */}
          <div className="mb-4 mt-5 grid grid-cols-2 gap-3">
            <Link href="/contents" className="group block">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5">
                <div className="relative h-[100px] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop&auto=format" 
                    alt="品牌联名项目"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <span className="absolute bottom-2 left-2 text-[11px] font-semibold text-white">品牌联名</span>
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[var(--copy)] line-clamp-1">更多联名项目合集</h4>
                  <p className="mt-1 text-[11px] text-[var(--copy-soft)]">查看全部联名案例</p>
                </div>
              </div>
            </Link>
            <Link href="/requests" className="group block">
              <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)] transition-all hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5">
                <div className="relative h-[100px] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1553028826-f4804a6dba3b?w=400&h=200&fit=crop&auto=format" 
                    alt="合作需求"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                  <span className="absolute bottom-2 left-2 text-[11px] font-semibold text-white">合作需求</span>
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-semibold text-[var(--copy)] line-clamp-1">品牌寻找共创团队</h4>
                  <p className="mt-1 text-[11px] text-[var(--copy-soft)]">发布合作需求</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-[var(--copy)]">实时营销事件</p>
              <p className="mt-1 text-[13px] text-[var(--copy-soft)]">高密度列表，快速扫描</p>
            </div>
            <Link href="/events" className="text-[13px] font-medium text-[var(--teal)] hover:text-[var(--teal-deep)] transition-colors">
              更多 →
            </Link>
          </div>

          <div className="space-y-3">
            {realtimeEventsFeed.map((item) => (
              <article key={item.title}
                className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-[13px] font-semibold text-white"
                      style={{backgroundColor: item.accent}}>
                      {item.rank}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold tracking-tight text-[var(--copy)]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-[12px] text-[var(--copy-soft)]">{item.meta}</p>
                    </div>
                  </div>
                  <span className="text-xl font-semibold tracking-tight text-[var(--teal)]">{item.lift}</span>
                </div>
                {/* 迷你趋势柱 */}
                <div className="mt-3 flex items-end gap-1">
                  {[12, 16, 14, 20, 22, 28].map((h, i) => (
                    <span key={i}
                      className="w-2 rounded-full bg-gradient-to-t from-[#26a7a3] to-[#9ee3df]"
                      style={{height: h}}/>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: 精选案例（带 Tab） ========== */}
      <SelectedCasesWithTabs
        cases={selectedCaseCards.map((item) => ({
          ...item,
          category: (item as { category?: string }).category || "品牌营销",
        }))}
      />
      {/* ========== SECTION 3: 策略主题 + 投稿精选 ========== */}
      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        {/* 策略主题 */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-[var(--teal)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--teal)]">Strategy Framework</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--navy)]">
              玩法与趋势关键词
            </h2>
            <p className="mt-2 text-[13px] text-[var(--copy-soft)]">方法论入口，持续更新</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* 玩法 */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copy-muted)]">玩法维度</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {playbookTags.map((tag) => (
                  <span key={tag}
                    className="rounded-[var(--radius-full)] border border-[var(--border)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--copy)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            {/* 关键词 */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--teal-soft)] bg-[var(--teal-soft)] p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--copy-muted)]">趋势关键词</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {trendKeywords.map((tag) => (
                  <span key={tag}
                    className="rounded-[var(--radius-full)] bg-white/80 border border-white/60 px-3 py-1.5 text-[12px] font-medium text-[var(--teal-deep)]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 专题链接 */}
          <div className="mt-5 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4">
            <p className="text-[12px] text-[var(--copy-soft)]">更多策略专题</p>
            <Link href="/topics" className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--teal)] hover:text-[var(--teal-deep)] transition-colors">
              进入策略库 →
            </Link>
          </div>
        </div>

        {/* 投稿精选 */}
        <div className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <div className="h-px w-5 bg-[var(--yellow)]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--copy-muted)]">Creator Showcase</p>
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-[var(--navy)]">
              用户投稿精选
            </h2>
            <p className="mt-2 text-[13px] text-[var(--copy-soft)]">审核后进入精选与专题推荐</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {submissionShowcase.map((item, index) => (
              <article key={item.title}
                className={`rounded-[var(--radius-lg)] border p-4 ${
                  index === 1
                    ? "border-[#d6e4ff] bg-[#f4f8ff]"
                    : index === 2
                      ? "border-[var(--yellow-soft)] bg-[var(--yellow-soft)]"
                      : "border-[var(--border)] bg-[var(--surface-muted)]"
                }`}>
                <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--copy-muted)]">{item.meta}</p>
                <h3 className="mt-2 text-[14px] font-semibold tracking-tight text-[var(--copy)]">{item.title}</h3>
                <p className="mt-2 text-[12px] leading-6 text-[var(--copy-soft)]">
                  审核通过后可进入栏目列表与首页精选位
                </p>
              </article>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <Button asChild size="sm" variant="secondary">
              <Link href="/submit">发布投稿</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/me">查看我的投稿</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: 合作需求 CTA ========== */}
      <section className="rounded-[var(--radius-2xl)] border border-transparent bg-[linear-gradient(135deg,#0d1c52,#173685,#177f90)] p-7 text-white shadow-[var(--shadow-xl)] sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* 左：叙事 */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-white/40" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">合作广场</span>
            </div>
            <h2 className="mt-4 text-[2rem] font-semibold tracking-tight leading-[1.15]">
              让合作自然发生
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/68">
              品牌方与营销人可在平台发布合作需求、查看精选合作卡——内容之外的第二增长入口。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-[var(--navy)] hover:bg-white/90 shadow-[var(--shadow-md)]">
                <Link href="/requests">浏览合作需求</Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white border border-white/30 hover:bg-white/10">
                <Link href="/requests">发布合作需求</Link>
              </Button>
            </div>
          </div>

          {/* 右：需求卡 */}
          <div className="space-y-3">
            {requestCards.slice(0, 2).map((item) => (
              <Link key={item.title} href="/requests"
                className="block rounded-[var(--radius-xl)] border border-white/12 bg-white/8 p-5 hover:bg-white/14 transition-all">
                <div className="flex items-center gap-2">
                  <span className="rounded-[var(--radius-full)] bg-white/15 px-3 py-1 text-[11px] font-medium text-white/80">
                    {item.type}
                  </span>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-white/65">{item.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: 平台价值 ========== */}
      <section className="rounded-[var(--radius-2xl)] border border-[var(--border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {valueHighlights.map(([title, note], index) => (
            <div key={title}
              className="flex items-start gap-4 rounded-[var(--radius-lg)] px-1 py-2">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border text-[15px] font-semibold ${
                index === 0
                  ? "border-[#d6e4ff] bg-[#f4f8ff] text-[var(--navy)]"
                  : index === 1
                    ? "border-[var(--teal-soft)] bg-[var(--teal-soft)] text-[var(--teal)]"
                    : index === 2
                      ? "border-[var(--yellow-soft)] bg-[var(--yellow-soft)] text-[#b4832a]"
                      : "border-[var(--border)] bg-[var(--surface-muted)] text-[var(--copy)]"
              }`}>
                0{index + 1}
              </div>
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-[var(--copy)]">{title}</p>
                <p className="mt-1 text-[12px] text-[var(--copy-soft)]">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
