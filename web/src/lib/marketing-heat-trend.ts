import "server-only";

import { directusAuthedFetchJSON } from "@/lib/directus-auth";

type WindowKey = "24h" | "7d" | "30d";

const CATEGORY_LABELS = ["Campaign", "品牌动态", "联名", "内容营销", "趋势观察"] as const;
type CategoryLabel = (typeof CATEGORY_LABELS)[number];

const CATEGORY_COLORS: Record<CategoryLabel, string> = {
  Campaign: "#256FE6",
  品牌动态: "#FF5A5F",
  联名: "#F6B90A",
  内容营销: "#27B1AA",
  趋势观察: "#8B62E8",
};

const EXCLUDED_TOPIC_TAGS = new Set<string>(CATEGORY_LABELS);

type DirectusListResponse<T> = { data: T[] };

type SubmissionRow = {
  date_updated?: string;
  title?: string;
  summary?: string;
  status?: string;
};

function nowMs() {
  return Date.now();
}

function windowToSince(window: WindowKey) {
  const hours = window === "24h" ? 24 : window === "7d" ? 24 * 7 : 24 * 30;
  return new Date(nowMs() - hours * 60 * 60 * 1000);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const STOPWORDS_ZH = new Set<string>([
  "我们",
  "他们",
  "你们",
  "因为",
  "所以",
  "但是",
  "以及",
  "如何",
  "一个",
  "一种",
  "这个",
  "那个",
  "进行",
  "通过",
  "成为",
  "正在",
  "可以",
  "更多",
  "最新",
  "本周",
  "今天",
  "昨日",
  "近日",
  "专题",
  "精选",
  "案例",
  "项目",
  "文章",
  "品牌",
  "营销",
  "活动",
  "趋势",
  "观察",
  "洞察",
  "内容",
  "广告",
  "创意",
  "发布",
  "上线",
  "复盘",
  "盘点",
  "解读",
  "报告",
  "行业",
  "平台",
  "推荐",
  "合作",
  "联名",
  "搜索",
]);

const STOPWORDS_EN = new Set<string>([
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "that",
  "this",
  "your",
  "you",
  "our",
  "how",
  "why",
  "what",
  "when",
  "where",
  "week",
  "daily",
  "latest",
  "brand",
  "brands",
  "marketing",
  "campaign",
  "campaigns",
  "creative",
  "creativity",
  "report",
  "analysis",
  "trend",
  "trends",
  "media",
  "insight",
  "insights",
  "including",
  "editors",
  "coverage",
  "reporters",
]);

const TOPIC_BLACKLIST = new Set<string>([
  "Brief",
  "Search",
  "News",
  "Read",
  "Story",
  "Sponsored",
  "Homepage",
  "SocialBeta",
  "Digitaling",
  "DIGITALING",
  "数英网",
  "数英",
  "梅花网",
  "梅花",
  "Meihua",
  "TOPYS",
  "Adweek",
  "CampaignBrief",
  "Results",
  "columnists",
]);

// 命中任意子串就过滤：用于“数英项目 / 广告门案例库 / SocialBeta招聘”等组合词
const TOPIC_BLACKLIST_SUBSTRINGS = [
  "socialbeta",
  "digitaling",
  "数英",
  "梅花",
  "topys",
  "adweek",
  "campaignbrief",
  "addog",
  "adguider",
  "广告门",
  "市场部网",
  "麦迪逊邦",
  "胖鲸",
  "36氪",
  "brandstar",
  "weibo",
  "微博",
] as const;

function uniqueStrings(items: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of items) {
    const value = (raw || "").trim();
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function normalizeAllTo100(series: Record<CategoryLabel, number[]>) {
  const globalMax = Math.max(
    0,
    ...CATEGORY_LABELS.flatMap((label) => series[label]),
  );
  if (globalMax <= 0) {
    return CATEGORY_LABELS.reduce(
      (acc, label) => {
        acc[label] = series[label].map(() => 0);
        return acc;
      },
      {} as Record<CategoryLabel, number[]>,
    );
  }
  return CATEGORY_LABELS.reduce(
    (acc, label) => {
      acc[label] = series[label].map((v) => Math.round((v / globalMax) * 100));
      return acc;
    },
    {} as Record<CategoryLabel, number[]>,
  );
}

function smooth(values: number[], strength = 0.55) {
  if (values.length < 3) return values;
  // 简单三点平滑：v' = (1-s)*v + s*(prev+v+next)/3
  const s = clamp(strength, 0, 0.9);
  return values.map((v, i) => {
    const prev = values[i - 1] ?? v;
    const next = values[i + 1] ?? v;
    const avg = (prev + v + next) / 3;
    return Math.round((1 - s) * v + s * avg);
  });
}

function bucketIndex(dateMs: number, sinceMs: number, untilMs: number, points: number) {
  const span = Math.max(1, untilMs - sinceMs);
  const ratio = clamp((dateMs - sinceMs) / span, 0, 0.999999);
  return Math.floor(ratio * points);
}

function formatAxisDate(date: Date, withTime = false) {
  if (withTime) {
    return date.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return date.toLocaleDateString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
  });
}

function windowAxisLabels(window: WindowKey, since: Date, until: Date, points: number) {
  const span = Math.max(1, until.getTime() - since.getTime());
  const labels: string[] = [];
  for (let i = 0; i < points; i += 1) {
    const ratio = i / (points - 1);
    const ts = since.getTime() + span * ratio;
    const bucketDate = new Date(ts);
    if (window === "24h") {
      labels.push(formatAxisDate(bucketDate, true));
    } else {
      labels.push(formatAxisDate(bucketDate, false));
    }
  }
  return labels;
}

function normalizeTextForTokens(input: string) {
  return (input || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\p{Script=Han}#]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTokens(text: string) {
  const cleaned = normalizeTextForTokens(text);
  const tokens: string[] = [];

  // 1) Hashtags: #xxx
  const hashtagMatches = cleaned.match(/#[\p{L}\p{N}\p{Script=Han}_-]{2,24}/gu) || [];
  for (const tag of hashtagMatches) {
    tokens.push(tag.replace(/^#/, ""));
  }

  // 2) English words (len>=3)
  const enMatches = cleaned.match(/[A-Za-z][A-Za-z0-9_-]{2,24}/g) || [];
  for (const w of enMatches) {
    const low = w.toLowerCase();
    if (STOPWORDS_EN.has(low)) continue;
    if (TOPIC_BLACKLIST.has(w)) continue;
    tokens.push(w);
  }

  // 3) Chinese sequences (len>=2)
  const zhMatches = cleaned.match(/[\p{Script=Han}]{2,12}/gu) || [];
  for (const w of zhMatches) {
    if (STOPWORDS_ZH.has(w)) continue;
    tokens.push(w);
  }

  // 去重（保留原大小写/原文）
  return uniqueStrings(tokens);
}

function shouldCountTopicToken(token: string) {
  const trimmed = (token || "").trim();
  if (!trimmed) return false;
  if (trimmed.length < 2) return false;
  // 中文 token 过长通常是描述句而不是话题
  if (isChineseToken(trimmed) && trimmed.length > 6) return false;
  // 过滤“平台名 + 泛词”的组合（子串命中）
  const low = trimmed.toLowerCase();
  if (TOPIC_BLACKLIST_SUBSTRINGS.some((s) => low.includes(s))) return false;
  // 过滤纯数字与常见 HTML entity 残留（8211/8220 等）
  if (/^\d+$/.test(trimmed)) return false;
  // 过滤仅由短横线/下划线组成的噪声
  if (/^[-_]+$/.test(trimmed)) return false;
  // 过滤明显的描述性/导航性短语碎片
  if (/[，。、；：]/.test(trimmed)) return false;
  if (/(平台|宝库|聚焦|等)$/.test(trimmed)) return false;
  // 过滤“xx项目/xx案例/xx文章/xx招聘”等泛后缀
  if (/(项目|案例|文章|招聘|入口|官网|导航|下载|合集)$/.test(trimmed)) return false;
  if (/(行业|营销作品|在线对接|下载|登录|注册)/.test(trimmed)) return false;
  if (/搜索/.test(trimmed)) return false;
  // 过滤站点/导航黑名单
  if (TOPIC_BLACKLIST.has(trimmed)) return false;
  if (TOPIC_BLACKLIST.has(trimmed.toLowerCase())) return false;
  if (STOPWORDS_ZH.has(trimmed)) return false;
  if (STOPWORDS_EN.has(trimmed.toLowerCase())) return false;
  return true;
}

function isChineseToken(token: string) {
  return /[\p{Script=Han}]/u.test(token);
}

async function fetchSubmissionsSince(sinceISO: string) {
  // 使用 authed fetch：避免公开读取权限不足导致 403。
  const query = new URLSearchParams({
    limit: "500",
    sort: "-date_updated",
    fields: "date_updated,title,summary,status",
    "filter[date_updated][_gte]": sinceISO,
    "filter[status][_nin]": "draft,archived",
  }).toString();

  try {
    const res = await directusAuthedFetchJSON<DirectusListResponse<SubmissionRow>>(
      `/items/submissions?${query}`,
      { method: "GET" },
    );
    return Array.isArray(res?.data) ? res.data : [];
  } catch {
    // Directus 不可达/无鉴权配置时，趋势数据回退为空数组，避免影响页面渲染。
    return [];
  }
}

export async function getMarketingHeatTrend({ window }: { window: WindowKey }) {
  // 与首页 UI 的横轴刻度保持一致：7 个点（00:00 ~ 24:00 / 近7天 / 近30天周刻度）
  const points = 7;
  const until = new Date();
  const since = windowToSince(window);
  const axisLabels = windowAxisLabels(window, since, until, points);

  const rows = await fetchSubmissionsSince(since.toISOString());

  const sinceMs = since.getTime();
  const untilMs = until.getTime();

  const rawSeries: Record<CategoryLabel, number[]> = {
    Campaign: Array.from({ length: points }, () => 0),
    品牌动态: Array.from({ length: points }, () => 0),
    联名: Array.from({ length: points }, () => 0),
    内容营销: Array.from({ length: points }, () => 0),
    趋势观察: Array.from({ length: points }, () => 0),
  };

  const topicScore = new Map<string, number>();
  const topicPrevScore = new Map<string, number>();
  const topicRecentScore = new Map<string, number>();
  const midPointMs = sinceMs + (untilMs - sinceMs) / 2;

  for (const row of rows) {
    const createdAt = row.date_updated ? new Date(row.date_updated).getTime() : NaN;
    if (!Number.isFinite(createdAt)) continue;

    const idx = bucketIndex(createdAt, sinceMs, untilMs, points);
    const text = `${row.title || ""} ${row.summary || ""}`.toLowerCase();

    // 分类：用标题/摘要关键词判定（因为最小 Directus schema 不一定包含 tags/date_created）
    const hit = (label: CategoryLabel) => {
      if (label === "Campaign") return /campaign|活动|战役|项目|上线|发布会|campaigns/.test(text);
      if (label === "品牌动态") return /品牌动态|代言|任命|更名|logo|cm0|cmo|brand marketing|brand/.test(text);
      if (label === "联名") return /联名|跨界|合作|collab|co-?brand|联乘/.test(text);
      if (label === "内容营销") return /内容营销|短片|tvc|海报|social|社媒|创意|视频|creativity|content/.test(text);
      return /趋势|观察|洞察|report|analysis|trend|insight/.test(text);
    };

    for (const cat of CATEGORY_LABELS) {
      if (hit(cat)) rawSeries[cat][idx] += 1;
    }

    // 热门话题：用通用 token 抽取 + 频次统计（过滤 5 大分类词/停用词）
    const tokens = extractTokens(`${row.title || ""} ${row.summary || ""}`);
    for (const token of tokens) {
      if (EXCLUDED_TOPIC_TAGS.has(token)) continue;
      if (!shouldCountTopicToken(token)) continue;
      topicScore.set(token, (topicScore.get(token) || 0) + 1);
      if (createdAt < midPointMs) {
        topicPrevScore.set(token, (topicPrevScore.get(token) || 0) + 1);
      } else {
        topicRecentScore.set(token, (topicRecentScore.get(token) || 0) + 1);
      }
    }
  }

  const normalized = normalizeAllTo100(rawSeries);
  const series = CATEGORY_LABELS.map((label) => ({
    label,
    color: CATEGORY_COLORS[label],
    values: smooth(normalized[label]),
  }));

  const hotTopics = [...topicScore.entries()]
    .sort((a, b) => {
      // 同频时优先中文词（更贴合你期望的“话题”呈现）
      if (b[1] !== a[1]) return b[1] - a[1];
      const aZh = isChineseToken(a[0]);
      const bZh = isChineseToken(b[0]);
      if (aZh !== bZh) return bZh ? 1 : -1;
      return a[0].localeCompare(b[0], "zh-CN");
    })
    .slice(0, 8)
    .map(([name]) => name);
  const hotTopicStats = hotTopics.map((name) => {
    const prev = topicPrevScore.get(name) || 0;
    const recent = topicRecentScore.get(name) || 0;
    const deltaRate = prev > 0 ? Number((((recent - prev) / prev) * 100).toFixed(1)) : null;
    return {
      name,
      count: topicScore.get(name) || 0,
      deltaRate,
      isNew: prev === 0 && recent > 0,
    };
  });

  const bucketTotals = Array.from({ length: points }, (_, idx) =>
    CATEGORY_LABELS.reduce((sum, label) => sum + rawSeries[label][idx], 0),
  );
  const latestBucketTotal = bucketTotals[points - 1] ?? 0;
  const previousBucketTotal = bucketTotals[points - 2] ?? 0;
  const periodChangeRate =
    previousBucketTotal > 0
      ? Number((((latestBucketTotal - previousBucketTotal) / previousBucketTotal) * 100).toFixed(1))
      : null;

  return {
    window,
    generatedAt: new Date().toISOString(),
    series,
    // 给 tooltip / 运营看板用的原始计数（按桶）
    rawSeries,
    axisLabels,
    latestBucketTotal,
    previousBucketTotal,
    periodChangeRate,
    hotTopics,
    hotTopicStats,
    totalSubmissions: rows.length,
  };
}

