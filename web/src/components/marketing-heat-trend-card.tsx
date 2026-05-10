"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";

type WindowKey = "24h" | "7d" | "30d";

type SeriesItem = {
  label: string;
  color: string;
  values: number[];
};

type ApiResponse = {
  success: boolean;
  window: WindowKey;
  series: SeriesItem[];
  hotTopics: string[];
  generatedAt: string;
  totalSubmissions?: number;
  rawSeries?: Record<string, number[]>;
  axisLabels?: string[];
  latestBucketTotal?: number;
  previousBucketTotal?: number;
  periodChangeRate?: number | null;
  hotTopicStats?: Array<{
    name: string;
    count: number;
    deltaRate: number | null;
    isNew: boolean;
  }>;
};

const WINDOWS: Array<{ key: WindowKey; label: string }> = [
  { key: "24h", label: "24h" },
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
];

const REAL_LABEL_SET = new Set(["Campaign", "品牌动态", "联名", "内容营销", "趋势观察"]);

function strokeStyle(label: string) {
  // 当多条线数值接近时，使用不同虚线样式减少“叠成一条”的视觉错觉
  if (label === "Campaign") return { dash: "", width: 2.6, opacity: 1 };
  if (label === "品牌动态") return { dash: "6 6", width: 2.4, opacity: 0.95 };
  if (label === "联名") return { dash: "2 6", width: 2.4, opacity: 0.95 };
  if (label === "内容营销") return { dash: "10 6", width: 2.3, opacity: 0.92 };
  return { dash: "4 10", width: 2.3, opacity: 0.92 };
}

function inferRelatedCategories(topic: string | null) {
  if (!topic) return new Set<string>();
  const text = topic.toLowerCase();
  const result = new Set<string>();
  if (/联名|跨界|合作|collab|co-?brand/.test(text)) {
    result.add("联名");
    result.add("Campaign");
  }
  if (/品牌|代言|更名|logo|brand/.test(text)) {
    result.add("品牌动态");
  }
  if (/内容|短片|海报|社媒|视频|creative|content/.test(text)) {
    result.add("内容营销");
  }
  if (/趋势|观察|洞察|report|analysis|trend|insight/.test(text)) {
    result.add("趋势观察");
  }
  if (/campaign|战役|活动|项目/.test(text)) {
    result.add("Campaign");
  }
  return result;
}

function sanitizeInitialSeries(input: SeriesItem[]) {
  if (!Array.isArray(input) || input.length === 0) return [];
  // 如果首屏传入的 series 不是 5 个真实分类（例如演示的“联名营销/新品上市/节点营销…”），
  // 直接视为非真实数据，不展示折线，避免“闪一下假曲线”。
  const labels = input.map((s) => s.label);
  const looksReal = labels.length === 5 && labels.every((l) => REAL_LABEL_SET.has(l));
  return looksReal ? input : [];
}

function buildChartLine(values: number[]) {
  const width = 520;
  // SVG viewBox 高度为 140，这里必须对齐，否则线条会“漂”
  const height = 140;
  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function windowToAxisLabels(window: WindowKey) {
  if (window === "24h") return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
  if (window === "7d") return ["-6d", "-5d", "-4d", "-3d", "-2d", "-1d", "Today"];
  return ["W-6", "W-5", "W-4", "W-3", "W-2", "W-1", "Now"];
}

export function MarketingHeatTrendCard({
  initialWindow = "24h",
  initialSeries,
  initialHotTopics,
}: {
  initialWindow?: WindowKey;
  initialSeries: SeriesItem[];
  initialHotTopics: string[];
}) {
  const [windowKey, setWindowKey] = useState<WindowKey>(initialWindow);
  const [series, setSeries] = useState<SeriesItem[]>(() => sanitizeInitialSeries(initialSeries));
  const [hotTopics, setHotTopics] = useState<string[]>(() =>
    sanitizeInitialSeries(initialSeries).length ? initialHotTopics : [],
  );
  const [hotTopicStats, setHotTopicStats] = useState<
    Array<{ name: string; count: number; deltaRate: number | null; isNew: boolean }>
  >([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [rawSeries, setRawSeries] = useState<Record<string, number[]> | null>(null);
  const [axisOverride, setAxisOverride] = useState<string[] | null>(null);
  const [periodChangeRate, setPeriodChangeRate] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isVisible, setIsVisible] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [hoverY, setHoverY] = useState<number>(0);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [topicCases, setTopicCases] = useState<
    Array<{ slug: string; title: string; summary: string; sourceName?: string; href: string }>
  >([]);
  const [topicCasesLoading, setTopicCasesLoading] = useState(false);
  const inflightAbortRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef(0);

  const axisLabels = useMemo(
    () => axisOverride?.length === 7 ? axisOverride : windowToAxisLabels(windowKey),
    [windowKey, axisOverride],
  );

  const displayedSeries = useMemo(() => {
    if (!activeCategory) return series;
    return series.filter((s) => s.label === activeCategory);
  }, [series, activeCategory]);

  async function refresh(next: WindowKey) {
    // 只保留最后一次请求：发起新请求前取消旧请求
    inflightAbortRef.current?.abort();
    const controller = new AbortController();
    inflightAbortRef.current = controller;
    const reqSeq = ++requestSeqRef.current;
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`/api/trends/marketing-heat?window=${next}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    const json = (await res.json()) as ApiResponse;
    if (!json.success) return;
    // 若已经有更新请求发出，则丢弃旧响应，避免乱序覆盖 UI
    if (reqSeq !== requestSeqRef.current) return;
    setSeries(Array.isArray(json.series) ? json.series : []);
    setHotTopics(Array.isArray(json.hotTopics) ? json.hotTopics : []);
    setHotTopicStats(Array.isArray(json.hotTopicStats) ? json.hotTopicStats : []);
    setLastUpdated(json.generatedAt || null);
    setTotal(typeof json.totalSubmissions === "number" ? json.totalSubmissions : null);
    setRawSeries(json.rawSeries && typeof json.rawSeries === "object" ? json.rawSeries : null);
    setAxisOverride(Array.isArray(json.axisLabels) ? json.axisLabels : null);
    setPeriodChangeRate(typeof json.periodChangeRate === "number" ? json.periodChangeRate : null);
    setActiveCategory(null);
  }

  function manualRefresh() {
    startTransition(async () => {
      try {
        await refresh(windowKey);
      } catch {
        // ignore
      }
    });
  }

  function switchWindow(next: WindowKey) {
    if (next === windowKey) return;
    setWindowKey(next);

    startTransition(async () => {
      try {
        await refresh(next);
      } catch {
        // 保持旧数据，避免交互中断
      }
    });
  }

  // 页面可见性：切到后台 tab 就暂停自动刷新
  useEffect(() => {
    function onVisibilityChange() {
      setIsVisible(document.visibilityState === "visible");
    }
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // 首屏挂载后主动拉一次真实数据，覆盖任何演示初始值。
  useEffect(() => {
    startTransition(async () => {
      try {
        await refresh(windowKey);
      } catch {
        // ignore
      }
    });
    // 仅在初次挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 自动刷新：默认每 60 秒刷新一次当前窗口（保持看板感）
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isVisible) return;
      if (isPending) return;
      startTransition(async () => {
        try {
          await refresh(windowKey);
        } catch {
          // ignore
        }
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [windowKey, isPending, isVisible]);

  const hoverBucketTotal = useMemo(() => {
    if (hoverIndex === null || !rawSeries) return null;
    return displayedSeries.reduce((sum, item) => sum + (rawSeries[item.label]?.[hoverIndex] ?? 0), 0);
  }, [hoverIndex, rawSeries, displayedSeries]);
  const relatedCategories = useMemo(() => inferRelatedCategories(activeTopic), [activeTopic]);
  const hasRelatedHighlight = relatedCategories.size > 0;

  async function loadTopicCases(topic: string) {
    setTopicCasesLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(topic)}&type=contents&limit=6`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        },
      );
      const data = (await res.json()) as {
        success?: boolean;
        contents?: Array<{ slug: string; title: string; summary: string; sourceName?: string; href: string }>;
      };
      if (!data.success) {
        setTopicCases([]);
        return;
      }
      setTopicCases(Array.isArray(data.contents) ? data.contents : []);
    } catch {
      setTopicCases([]);
    } finally {
      setTopicCasesLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface-muted)] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-[3px] bg-[var(--teal)]" />
          <p className="text-sm font-semibold text-[var(--navy)]">营销热度趋势</p>
          <span className="ml-1 text-[10px] text-[var(--copy-muted)]">
            {lastUpdated ? `${new Date(lastUpdated).toLocaleString("zh-CN")}` : ""}
          </span>
          {periodChangeRate !== null && (
            <span
              className={`ml-1 rounded-full px-2 py-0.5 text-[10px] ${
                periodChangeRate >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
              }`}
            >
              较上一时段 {periodChangeRate >= 0 ? "+" : ""}
              {periodChangeRate}%
            </span>
          )}
        </div>
        <div
          className="grid h-8 w-[134px] grid-cols-3 items-center rounded-[var(--radius-full)] border border-[var(--border)] bg-white p-1 text-[10px]"
          aria-busy={isPending}
        >
          {WINDOWS.map((item) => {
            const active = item.key === windowKey;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => switchWindow(item.key)}
                className={
                  active
                    ? "inline-flex h-6 w-full items-center justify-center rounded-full bg-[var(--navy)] text-white font-medium"
                    : "inline-flex h-6 w-full items-center justify-center rounded-full text-[var(--copy-soft)] font-medium hover:text-[var(--navy)] transition-colors"
                }
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={manualRefresh}
          disabled={isPending}
          className="ml-2 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-2 py-1 text-[10px] text-[var(--copy-soft)] hover:text-[var(--navy)] transition-colors disabled:opacity-50"
          aria-label="手动刷新趋势"
          title="刷新当前窗口数据"
        >
          <svg
            className={isPending ? "h-3 w-3 animate-spin" : "h-3 w-3"}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 3v4H9" />
            <path d="M3 13v-4h4" />
            <path d="M6.5 4.2a5 5 0 016.3 2.1M9.5 11.8a5 5 0 01-6.3-2.1" />
          </svg>
          刷新
        </button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-white p-3">
        <div className="relative">
          <div className="flex items-stretch gap-2">
            <div className="flex h-[120px] w-8 flex-col justify-between pb-[2px] pt-[2px] text-right text-[10px] text-[var(--copy-muted)]">
              {[100, 75, 50, 25, 0].map((tick) => (
                <span key={tick} className="leading-none">
                  {tick}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 520 140" className="h-[120px] w-full">
          {[0, 1, 2, 3, 4].map((line) => (
            <line
              key={`h-${line}`}
              x1="0"
              x2="520"
              y1={line * 35}
              y2={line * 35}
              stroke="rgba(18,36,96,0.07)"
              strokeDasharray="4 6"
            />
          ))}
          {axisLabels.map((_, index) => {
            const x = (index / (axisLabels.length - 1)) * 520;
            return (
              <line
                key={`v-${index}`}
                x1={x}
                x2={x}
                y1="0"
                y2="140"
                stroke="rgba(18,36,96,0.05)"
                strokeDasharray="4 8"
              />
            );
          })}

          {hoverIndex !== null && (
            <line
              x1={(hoverIndex / (axisLabels.length - 1)) * 520}
              x2={(hoverIndex / (axisLabels.length - 1)) * 520}
              y1="0"
              y2="140"
              stroke="rgba(38,167,163,0.55)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          )}

          {displayedSeries.map((item) => (
            (() => {
              const style = strokeStyle(item.label);
              const isRelated = relatedCategories.has(item.label);
              const lineOpacity = hasRelatedHighlight ? (isRelated ? 1 : 0.22) : style.opacity;
              const lineWidth = hasRelatedHighlight ? (isRelated ? style.width + 0.6 : 1.6) : style.width;
              return (
            <polyline
              key={item.label}
              fill="none"
              stroke={item.color}
              strokeWidth={lineWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={style.dash || undefined}
              points={buildChartLine(item.values)}
              opacity={isPending ? 0.65 : lineOpacity}
            />
              );
            })()
          ))}

          {/* hover 点位 */}
          {hoverIndex !== null &&
            displayedSeries.map((item) => {
              const v = item.values[hoverIndex] ?? 0;
              const x = (hoverIndex / (axisLabels.length - 1)) * 520;
              const y = 140 - (v / 100) * 140;
              return (
                <circle
                  key={`dot-${item.label}`}
                  cx={x}
                  cy={y}
                  r={3.2}
                  fill={item.color}
                  stroke="white"
                  strokeWidth={1.5}
                  opacity={0.95}
                />
              );
            })}

          {/* 交互层 */}
          <rect
            x="0"
            y="0"
            width="520"
            height="140"
            fill="transparent"
            onMouseLeave={() => setHoverIndex(null)}
            onMouseMove={(e) => {
              const rect = (e.currentTarget as SVGRectElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              // y 暂不使用（预留后续做 tooltip 避让）
              const ratio = Math.max(0, Math.min(1, x / rect.width));
              const idx = Math.round(ratio * (axisLabels.length - 1));
              setHoverIndex(idx);
              setHoverX(e.clientX);
              setHoverY(e.clientY);
            }}
          />
            </svg>
          </div>

          {hoverIndex !== null && (
            <div
              className="pointer-events-none fixed z-[80] w-[320px] rounded-2xl border border-white/10 bg-[#0f172a]/95 p-3 text-white shadow-[0_8px_32px_rgba(18,36,96,0.20),0_24px_72px_rgba(18,36,96,0.14)]"
              style={{
                left: Math.min(globalThis.innerWidth - 340, Math.max(16, hoverX + 14)),
                top: Math.min(globalThis.innerHeight - 260, Math.max(16, hoverY - 14)),
              }}
            >
              <div className="mb-2 text-[12px] font-semibold text-white/90">
                {axisLabels[hoverIndex]}
                {hoverBucketTotal !== null ? (
                  <span className="ml-2 text-white/55">该时段总量 {hoverBucketTotal}</span>
                ) : total !== null ? (
                  <span className="ml-2 text-white/55">案例 {total}</span>
                ) : null}
              </div>
              <div className="space-y-1">
                {displayedSeries.map((item) => {
                  const raw = rawSeries?.[item.label]?.[hoverIndex] ?? null;
                  const rawCount = typeof raw === "number" ? raw : null;
                  const score = item.values[hoverIndex] ?? 0;
                  const percent =
                    rawCount !== null && hoverBucketTotal && hoverBucketTotal > 0
                      ? `${((rawCount / hoverBucketTotal) * 100).toFixed(1)}%`
                      : null;
                  return (
                    <div key={`tip-${item.label}`} className="flex items-center justify-between gap-3 text-[12px]">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="truncate text-white/85">{item.label}</span>
                      </div>
                      <div className="shrink-0 text-white/85 tabular-nums">
                        {rawCount !== null ? (
                          <span>
                            {rawCount}
                            {percent ? <span className="ml-2 text-white/60">{percent}</span> : null}
                          </span>
                        ) : (
                          score
                        )}
                      </div>
                    </div>
                  );
                })}
                {hoverBucketTotal !== null && total !== null && total >= hoverBucketTotal && (
                  <div className="mt-1 border-t border-white/10 pt-2 flex items-center justify-between gap-3 text-[12px]">
                    <span className="text-white/70">其它时段</span>
                    <span className="text-white/75 tabular-nums">
                      {Math.max(0, total - hoverBucketTotal)}
                      <span className="ml-2 text-white/55">
                        {total > 0 ? `${(((total - hoverBucketTotal) / total) * 100).toFixed(1)}%` : "0%"}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="ml-10 mt-2 flex justify-between text-[10px] text-[var(--copy-muted)]">
          {axisLabels.map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-[var(--copy-soft)]">
          {series.map((item) => {
            const dimmed = activeCategory !== null && activeCategory !== item.label;
            const related = hasRelatedHighlight && relatedCategories.has(item.label);
            const onlyThis = activeCategory === item.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveCategory((prev) => (prev === item.label ? null : item.label))}
                className="flex items-center gap-1.5 transition-opacity hover:text-[var(--navy)]"
                style={{ opacity: dimmed ? 0.28 : 1 }}
                title={activeCategory ? "点击恢复全部分类" : "点击只看该分类"}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                {item.label}
                {onlyThis ? (
                  <span className="rounded bg-[#e8f1ff] px-1 text-[10px] text-[#256FE6]">仅看</span>
                ) : null}
                {related ? (
                  <span className="rounded bg-emerald-100 px-1 text-[10px] text-emerald-700">相关</span>
                ) : null}
              </button>
            );
          })}
          {!series.length && (
            <span className="text-[11px] text-[var(--copy-muted)]">
              {isPending ? "正在同步真实数据…" : "暂无趋势数据（等待抓取批次导入）"}
            </span>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--copy-muted)] mb-2">
            热门话题
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(hotTopicStats.length
              ? hotTopicStats
              : (hotTopics || []).slice(0, 8).map((name) => ({
                  name,
                  count: 0,
                  deltaRate: null,
                  isNew: false,
                }))
            ).map((topic) => (
              <button
                key={topic.name}
                type="button"
                onClick={() => {
                  if (activeTopic === topic.name) {
                    setActiveTopic(null);
                    setTopicCases([]);
                    return;
                  }
                  setActiveTopic(topic.name);
                  void loadTopicCases(topic.name);
                }}
                className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--surface-muted)] border border-transparent px-2 py-0.5 text-[11px] text-[var(--copy)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-colors cursor-pointer"
              >
                <span>#{topic.name}</span>
                {topic.isNew ? (
                  <span className="rounded bg-emerald-100 px-1 text-[10px] text-emerald-700">new</span>
                ) : typeof topic.deltaRate === "number" ? (
                  <span
                    className={`text-[10px] ${
                      topic.deltaRate > 0
                        ? "text-rose-500"
                        : topic.deltaRate < 0
                          ? "text-sky-600"
                          : "text-[var(--copy-muted)]"
                    }`}
                  >
                    {topic.deltaRate > 0 ? "↑" : topic.deltaRate < 0 ? "↓" : "→"}
                    {Math.abs(topic.deltaRate)}%
                  </span>
                ) : null}
              </button>
            ))}
            {!hotTopics.length && (
              <span className="text-[11px] text-[var(--copy-muted)]">
                {isPending ? "更新中…" : "暂无话题数据"}
              </span>
            )}
          </div>
        </div>

        {activeTopic && (
          <div className="mt-3 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-muted)] p-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold text-[var(--navy)]">#{activeTopic} 相关案例</p>
              <Link
                href={`/search?q=${encodeURIComponent(activeTopic)}`}
                className="text-[11px] text-[var(--teal)] hover:text-[var(--teal-deep)]"
              >
                查看全部
              </Link>
            </div>
            {topicCasesLoading ? (
              <p className="text-[11px] text-[var(--copy-muted)]">正在加载案例…</p>
            ) : topicCases.length ? (
              <div className="space-y-2">
                {topicCases.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.href}
                    className="block rounded-[8px] border border-transparent bg-white px-3 py-2 hover:border-[var(--teal)]"
                  >
                    <p className="line-clamp-1 text-[12px] font-medium text-[var(--copy)]">{item.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-[var(--copy-muted)]">
                      {item.sourceName || "QiuQiuTech"} · {item.summary}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[var(--copy-muted)]">暂无相关案例，换个话题试试。</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketingHeatTrendCard;

