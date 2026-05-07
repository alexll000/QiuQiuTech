import Link from "next/link";
import { SectionTitle, SiteShell } from "@/components/site-shell";
import { getHomepageData } from "@/lib/content-service";
import { buildMetadata } from "@/lib/seo";
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

export const metadata = buildMetadata({
  title: "首页",
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

const chartTimes = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];

function buildChartLine(values: number[]) {
  const width = 520;
  const height = 220;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
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

  return (
    <SiteShell activePath="/">
      <section className="grid gap-5 xl:grid-cols-[0.98fr_1.02fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-[0_18px_52px_rgba(22,43,117,0.06)] sm:p-7">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-navy-strong sm:text-5xl lg:text-[3.75rem] lg:leading-[1.04]">
              营销行业实时洞察
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-copy-soft sm:text-[1.08rem]">
              追踪全网营销事件，把握行业趋势脉搏
            </p>
          </div>

          <div className="mt-7 rounded-[26px] border border-border bg-[#fbfcfe] p-5 shadow-[0_10px_30px_rgba(22,43,117,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-navy-strong">营销事件热度趋势</p>
                <p className="mt-1 text-sm text-copy-soft">热度指数</p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-white p-1 text-xs font-medium text-copy-soft">
                <span className="rounded-full bg-[#edf3ff] px-3 py-1 text-navy-strong">24小时</span>
                <span className="px-2">7天</span>
                <span className="px-2">30天</span>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] border border-[#eef2f8] bg-white p-4">
              <svg viewBox="0 0 520 220" className="h-[206px] w-full">
                {[0, 1, 2, 3, 4].map((line) => (
                  <line
                    key={`h-${line}`}
                    x1="0"
                    x2="520"
                    y1={line * 55}
                    y2={line * 55}
                    stroke="rgba(22,43,117,0.08)"
                    strokeDasharray="4 6"
                  />
                ))}
                {chartTimes.map((_, index) => {
                  const x = (index / (chartTimes.length - 1)) * 520;
                  return (
                    <line
                      key={`v-${x}`}
                      x1={x}
                      x2={x}
                      y1="0"
                      y2="220"
                      stroke="rgba(22,43,117,0.06)"
                      strokeDasharray="4 8"
                    />
                  );
                })}
                {realtimeTrendSeries.map((item) => (
                  <polyline
                    key={item.label}
                    fill="none"
                    stroke={item.color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={buildChartLine(item.values)}
                  />
                ))}
              </svg>
              <div className="mt-3 flex justify-between text-[11px] text-copy-soft">
                {chartTimes.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-xs text-copy-soft">
                {realtimeTrendSeries.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[26px] border border-border bg-white p-5 shadow-[0_12px_36px_rgba(22,43,117,0.05)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-navy-strong">实时营销事件</p>
              </div>
              <Link href="/events" className="text-sm font-medium text-copy-soft hover:text-navy-strong">
                更多
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {realtimeEventsFeed.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-4 rounded-[22px] border border-[#edf1f7] bg-[#fbfcff] px-4 py-4 md:grid-cols-[auto_1fr_auto]"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold text-white"
                    style={{ backgroundColor: item.accent }}
                  >
                    {item.rank}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-navy-strong">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-copy-soft">{item.meta}</p>
                  </div>
                  <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                    <span className="text-xl font-semibold tracking-tight text-teal">{item.lift}</span>
                    <div className="flex items-end gap-1">
                      {[12, 16, 14, 20, 22, 29].map((height, index) => (
                        <span
                          key={`${item.rank}-${index}`}
                          className="w-2 rounded-full bg-[linear-gradient(180deg,#9ee3df_0%,#26a7a3_100%)]"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <article className="overflow-hidden rounded-[32px] border border-border bg-white p-6 shadow-[0_20px_60px_rgba(22,43,117,0.08)] sm:p-7">
          <div className="grid h-full gap-6 lg:grid-cols-[0.84fr_1.16fr]">
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-sm font-medium text-navy-strong">
                    <span className="rounded-full border border-border bg-white px-3 py-1">
                      {heroSpotlight?.partners?.[0] || "luckin coffee"}
                    </span>
                    <span className="text-copy-soft">×</span>
                    <span className="rounded-full border border-border bg-white px-3 py-1">
                      {heroSpotlight?.partners?.[1] || "MOUTAI"}
                    </span>
                  </div>
                  <span className="rounded-full bg-[#0d173f] px-3 py-1 text-xs font-medium text-white">
                    {heroSpotlight?.label || "精选案例"}
                  </span>
                </div>

                <h2 className="mt-8 text-[2.15rem] font-semibold tracking-tight text-navy-strong sm:text-[2.7rem] sm:leading-[1.06]">
                  {heroSpotlight?.title || "瑞幸咖啡×茅台联名爆款"}
                </h2>

                <div className="mt-6 flex flex-wrap gap-2">
                  {(heroSpotlight?.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-sm font-medium text-navy-strong"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[26px] border border-[#edf0f6] bg-[#fffdfa] p-5">
                <div className="border-b border-border pb-4">
                  <p className="text-sm font-medium text-copy-soft">成功战绩</p>
                </div>
                <p className="mt-5 text-[3.25rem] font-semibold tracking-tight text-[#b4832a]">
                  {heroSpotlight?.statValue || "3天破1亿"}
                </p>
                <p className="mt-2 text-base text-copy-soft">
                  {heroSpotlight?.statNote || "销售额突破 1 亿元"}
                </p>
              </div>
            </div>

            <div className="relative min-h-[500px] overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_30%_18%,rgba(98,132,255,0.65),transparent_20%),linear-gradient(180deg,#15275f_0%,#0f1840_100%)]">
              <div className="absolute inset-y-0 left-[-12%] w-[54%] rounded-r-[180px] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(244,247,253,0.88))]" />
              <div className="absolute right-[-18px] top-10 h-56 w-56 rounded-full border border-white/18 bg-white/10 blur-[2px]" />
              <div className="absolute right-20 top-14 h-1.5 w-1.5 rounded-full bg-white/80 shadow-[0_0_0_12px_rgba(255,255,255,0.06),28px_54px_0_rgba(255,255,255,0.4),-18px_92px_0_rgba(255,255,255,0.28),84px_116px_0_rgba(255,255,255,0.18)]" />
              <div className="absolute bottom-14 left-[18%] h-20 w-12 rounded-[12px] border border-white/20 bg-[linear-gradient(180deg,#dce5ff_0%,#9db4ff_100%)] shadow-[0_12px_26px_rgba(10,18,44,0.28)]" />
              <div className="absolute bottom-10 left-[28%] h-[250px] w-[155px] rounded-[80px_80px_34px_34px] bg-[linear-gradient(180deg,#ffffff_0%,#f1f4fb_20%,#1a3f8d_20%,#173985_100%)] shadow-[0_20px_50px_rgba(10,18,44,0.35)]">
                <div className="absolute left-1/2 top-3 h-10 w-24 -translate-x-1/2 rounded-full bg-[#f3f5fb]" />
                <div className="absolute left-1/2 top-[96px] h-[92px] w-[70px] -translate-x-1/2 rounded-[50%] border-[10px] border-white border-t-transparent" />
                <div className="absolute left-1/2 top-[128px] h-[18px] w-[18px] -translate-x-1/2 rounded-full bg-white" />
              </div>
              <div className="absolute bottom-10 right-[11%] h-[270px] w-[112px] rounded-[18px] bg-[linear-gradient(180deg,#d82224_0%,#d82224_18%,#ffffff_18%,#ece7df_52%,#d82224_52%,#b91114_100%)] shadow-[0_24px_50px_rgba(10,18,44,0.34)]">
                <div className="absolute left-1/2 top-[-18px] h-9 w-14 -translate-x-1/2 rounded-t-[14px] rounded-b-[8px] bg-[#d82224]" />
                <div className="absolute left-1/2 top-[88px] h-28 w-16 -translate-x-1/2 rotate-[24deg] rounded-[10px] border border-black/8 bg-white/15" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(9,16,42,0.32)_100%)]" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-2xl text-navy-strong shadow-[0_8px_20px_rgba(22,43,117,0.08)]">
              ‹
            </button>
            <div className="text-xl font-semibold tracking-tight text-navy-strong">
              {heroSpotlight?.slides || "1 / 5"}
            </div>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-2xl text-navy-strong shadow-[0_8px_20px_rgba(22,43,117,0.08)]">
              ›
            </button>
          </div>
        </article>
      </section>

      <section className="rounded-[32px] border border-border bg-white p-6 shadow-[0_16px_42px_rgba(22,43,117,0.05)] sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-teal" />
            <h2 className="text-3xl font-semibold tracking-tight text-navy-strong">精选案例</h2>
          </div>
          <Link href="/contents" className="text-sm font-medium text-copy-soft hover:text-navy-strong">
            更多
          </Link>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {selectedCaseCards.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_10px_30px_rgba(22,43,117,0.04)]"
            >
              <div className={`relative h-44 bg-gradient-to-br ${item.palette}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.6),transparent_42%)]" />
                <div className="absolute bottom-3 left-3 rounded-full bg-white/82 px-3 py-1 text-xs font-medium text-navy-strong backdrop-blur-sm">
                  {item.tag}
                </div>
                <div className="absolute bottom-5 right-5 h-20 w-14 rounded-[12px] border border-white/40 bg-white/40 shadow-[0_12px_25px_rgba(22,43,117,0.16)]" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold tracking-tight text-navy-strong group-hover:text-teal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-copy-soft">{item.summary}</p>
                <p className="mt-4 text-sm text-copy-soft">{item.byline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-white px-6 py-5 shadow-[0_14px_36px_rgba(22,43,117,0.05)] sm:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {valueHighlights.map(([title, note], index) => (
            <div key={title} className="flex items-center gap-4 rounded-[20px] px-1 py-2">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full border text-lg font-semibold ${
                  index === 0
                    ? "border-[#d7e7ff] bg-[#f4f8ff] text-navy-strong"
                    : index === 1
                      ? "border-[#d8efe9] bg-[#f4fbf8] text-teal"
                      : index === 2
                        ? "border-[#f5e4b5] bg-[#fff8e6] text-[#b4832a]"
                        : "border-border bg-[#fbfcfe] text-navy-strong"
                }`}
              >
                0{index + 1}
              </div>
              <div>
                <p className="text-lg font-semibold tracking-tight text-navy-strong">{title}</p>
                <p className="mt-1 text-sm text-copy-soft">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-border bg-white p-6 shadow-[0_16px_42px_rgba(22,43,117,0.05)] sm:p-7">
          <SectionTitle
            eyebrow="Hot Playbooks"
            title="热门玩法与趋势关键词"
            description="把值得继续点开的策略主题、渠道打法和高频关键词，作为首页里的方法论入口。"
          />

          <div className="mt-7 grid gap-4 lg:grid-cols-[0.52fr_0.48fr]">
            <div className="rounded-[24px] border border-border bg-[#fbfcff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">玩法维度</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {playbookTags.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-strong"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#d8efe9] bg-[#f4fbf8] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">趋势关键词</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {trendKeywords.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-teal"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-border bg-white p-6 shadow-[0_16px_42px_rgba(22,43,117,0.05)] sm:p-7">
          <SectionTitle
            eyebrow="User Submissions"
            title="用户投稿精选"
            description="通过审核的投稿进入首页精选、专题推荐和详情页推荐流，与抓取内容形成互补。"
          />

          <div className="mt-7 grid gap-3 md:grid-cols-3">
            {submissionShowcase.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-[22px] border p-5 ${
                  index === 1 ? "border-[#d7e7ff] bg-[#f4f8ff]" : "border-border bg-[#fbfcff]"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.16em] text-copy-soft">{item.meta}</p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight text-navy-strong">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-copy-soft">
                  审核通过后可进入栏目列表、首页精选位和专题推荐位。
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-border bg-[#162b75] p-6 text-white shadow-[0_22px_60px_rgba(22,43,117,0.2)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/72">
              Partnership Requests
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              合作需求与资源共创
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/74">
              品牌方与市场人可在平台发布合作需求、申请联系与查看精选合作卡，形成内容之外的第二增长入口。
            </p>
          </div>

          <div className="grid gap-3">
            {requestCards.slice(0, 2).map((item) => (
              <Link
                key={item.title}
                href="/requests/brand-looking-for-popup-cocreation-team"
                className="rounded-[22px] border border-white/10 bg-white/8 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white/82">
                    {item.type}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">{item.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
