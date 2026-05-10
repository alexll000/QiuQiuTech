import {
  getContentBySlug,
  getHomepagePayload,
  getPublishedContents,
  getPublishedRequests,
  getPublishedTopics,
  getRequestBySlug,
  getTopicBySlug,
} from "@/lib/cms-client";
import { getMarketingHeatTrend } from "@/lib/marketing-heat-trend";
import type {
  CmsContentDetail,
  CmsContentSummary,
  CmsRequestSummary,
  CmsTopicSummary,
} from "@/lib/cms-types";
import {
  getMockContentBySlug,
  getMockContentCards,
  getMockContents,
  getMockEventCards,
  getMockHomepageData,
  getMockPlaybookCards,
  getMockRankingCards,
  getMockRequestBySlug,
  getMockRequestCards,
  getMockRequests,
  getMockTopicBySlug,
  getMockTopicCards,
  getMockTopics,
} from "@/lib/mock-content-service";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";
const HOMEPAGE_PALETTES = [
  "from-[#273f77] via-[#3d6f84] to-[#d3e6d9]",
  "from-[#d8ecff] via-[#f2f8ff] to-[#a9d4ff]",
  "from-[#cabca7] via-[#f3ece4] to-[#ddd6cb]",
];
const TREND_COLORS = ["#256FE6", "#FF5A5F", "#F6B90A", "#27B1AA", "#8B62E8"];

function uniqueBy<T>(items: T[], getKey: (item: T) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function deriveHotTags(
  contents: CmsContentSummary[],
  requests: CmsRequestSummary[],
  limit: number,
) {
  const scoreMap = new Map<string, number>();

  for (const item of contents) {
    for (const tag of item.tags || []) {
      scoreMap.set(tag.name, (scoreMap.get(tag.name) || 0) + 3);
    }
  }

  for (const item of requests) {
    for (const tag of item.tags || []) {
      scoreMap.set(tag.name, (scoreMap.get(tag.name) || 0) + 2);
    }
  }

  return [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}

function hashSeed(input: string) {
  return [...input].reduce((total, char) => total + char.charCodeAt(0), 0);
}

function deriveTrendSeries(contents: CmsContentSummary[], requests: CmsRequestSummary[]) {
  const hotTags = deriveHotTags(contents, requests, 5);
  return hotTags.map((tag, index) => {
    const seed = hashSeed(tag);
    const baseline = 12 + (seed % 26) + index * 4;
    return {
      label: tag,
      color: TREND_COLORS[index % TREND_COLORS.length],
      values: Array.from({ length: 10 }, (_, pointIndex) => {
        const wave = ((seed + pointIndex * 17) % 22) - 4;
        const rise = pointIndex * (3 + (seed % 4));
        return Math.max(8, Math.min(100, baseline + wave + rise));
      }),
    };
  });
}

async function deriveMarketingHeatSeriesFromSubmissions() {
  try {
    const payload = await getMarketingHeatTrend({ window: "24h" });
    // 即使暂时没有投稿（totalSubmissions=0），也保留 5 条分类折线的归一化结果，
    // 避免首屏误判为「无数据」整张图被清空（此前会在 Directus 短暂空响应时误伤 SSR）。
    return {
      ok: true,
      totalSubmissions: payload.totalSubmissions,
      realtimeTrendSeries: payload.series,
      trendKeywords: payload.hotTopics,
    };
  } catch {
    return {
      ok: false,
      totalSubmissions: 0,
      realtimeTrendSeries: [] as Array<{ label: string; color: string; values: number[] }>,
      trendKeywords: [] as string[],
    };
  }
}

function deriveRealtimeEventsFeed(
  contents: CmsContentSummary[],
  requests: CmsRequestSummary[],
) {
  const combined = [
    ...contents.slice(0, 2).map((item) => ({
      title: item.title,
      meta: `${item.publishedAt ? "近期更新" : "刚刚"}  ·  ${item.sourceName || "QiuQiuTech"}`,
      accent: "#ff5a5f",
    })),
    ...requests.slice(0, 1).map((item) => ({
      title: item.title,
      meta: `${item.city || "全国"}  ·  合作需求更新`,
      accent: "#f6b90a",
    })),
  ].slice(0, 3);

  return combined.map((item, index) => ({
    rank: String(index + 1),
    brand: item.title,
    title: item.title,
    meta: item.meta,
    lift: `+${88 + index * 34}%`,
    accent: index === 1 ? "#ff9f1a" : item.accent,
  }));
}

function deriveHeroSpotlight(contents: CmsContentSummary[]) {
  const lead = contents[0];
  if (!lead) return null;

  return {
    label: lead.contentType === "case" ? "精选案例" : "推荐内容",
    partners: [lead.brandName || "Featured Brand", lead.sourceName || "QiuQiuTech"],
    title: lead.title,
    tags: (lead.tags || []).slice(0, 2).map((tag) => tag.name),
    statValue: `${(lead.tags || []).length || 2} 个核心标签`,
    statNote: lead.industry?.name ? `${lead.industry.name} 赛道持续升温` : "当前重点内容持续获得关注",
    slides: "1 / 5",
  };
}

function deriveSelectedCaseCards(contents: CmsContentSummary[]) {
  const picked = uniqueBy(
    contents.filter((item) => item.contentType === "case" || item.contentType === "trend"),
    (item) => item.slug,
  ).slice(0, 3);

  return picked.map((item, index) => ({
    title: item.title,
    tag: item.tags?.[0]?.name || item.industry?.name || "精选内容",
    summary: item.summary,
    byline: `by ${item.brandName || item.sourceName || "QiuQiuTech"}`,
    href: `/contents/${item.slug}`,
    palette: HOMEPAGE_PALETTES[index % HOMEPAGE_PALETTES.length],
  }));
}

function deriveRequestCards(requests: CmsRequestSummary[]) {
  return requests.slice(0, 3).map((item) => ({
    title: item.title,
    type:
      item.requestType === "brand_to_marketer"
        ? "品牌找营销人"
        : item.requestType === "brand_to_brand"
          ? "品牌找品牌"
          : item.requestType === "marketer_to_partner"
            ? "营销人找合作方"
            : item.requestType === "agency_collab"
              ? "代理公司 / 工作室合作"
              : "平台撮合专区",
    detail: [item.city, item.budgetRange, item.contactPolicy].filter(Boolean).join("  ·  "),
  }));
}

function mapContentTypeLabel(type: CmsContentSummary["contentType"]) {
  if (type === "case") return "案例";
  if (type === "trend") return "趋势观察";
  if (type === "brand_news") return "品牌动态";
  if (type === "report") return "报告解读";
  return "深度特辑";
}

function inferEventType(item: CmsContentSummary) {
  const names = (item.tags || []).map((tag) => tag.name);
  if (names.some((tag) => tag.includes("联名"))) return "联名合作";
  if (names.some((tag) => tag.includes("Campaign"))) return "Campaign";
  if (names.some((tag) => tag.includes("快闪"))) return "快闪活动";
  if (names.some((tag) => tag.includes("节点"))) return "节点营销";
  if (names.some((tag) => tag.includes("社媒"))) return "社媒热点";
  return item.contentType === "case" ? "Campaign" : "品牌动态";
}

function inferPlaybookType(item: CmsContentSummary) {
  const names = (item.tags || []).map((tag) => tag.name);
  if (names.some((tag) => tag.includes("玩法"))) return "玩法拆解";
  if (names.some((tag) => tag.includes("增长"))) return "用户增长创意";
  if (names.some((tag) => tag.includes("内容"))) return "内容形式";
  if (names.some((tag) => tag.includes("传播") || tag.includes("话题"))) return "话题机制";
  if (names.some((tag) => tag.includes("联名") || tag.includes("IP"))) return "IP 联动";
  return item.contentType === "trend" ? "渠道打法" : "玩法拆解";
}

function normalizeSearchText(value?: string | null) {
  return (value || "").trim().toLowerCase();
}

function includesQuery(fields: Array<string | undefined | null>, query: string) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return false;

  return fields.some((field) => normalizeSearchText(field).includes(normalizedQuery));
}

export async function listEventFeed() {
  const contents = await listContents();
  return contents.slice(0, 6).map((item, index) => ({
    id: item.slug,
    type: inferEventType(item),
    title: item.title,
    description: item.summary,
    source: item.sourceName || "QiuQiuTech",
    publishedAt: item.publishedAt || "近期更新",
    tags: (item.tags || []).slice(0, 3).map((tag) => tag.name),
    score: `${96 - index * 7}`,
    href: `/contents/${item.slug}`,
  }));
}

export async function listPlaybookFeed() {
  const contents = await listContents();
  return contents.slice(0, 6).map((item, index) => ({
    id: item.slug,
    type: inferPlaybookType(item),
    title: item.title,
    description: item.summary,
    fitFor: item.industry?.name || "跨行业通用",
    tags: (item.tags || []).slice(0, 3).map((tag) => tag.name),
    meta: index % 2 === 0 ? "热门推荐" : "最新收录",
    href: `/contents/${item.slug}`,
  }));
}

export async function listRankingFeed() {
  const contents = await listContents();
  const requests = await listRequests();
  const hotTags = deriveHotTags(contents, requests, 10);
  const brands = uniqueBy(
    contents.filter((item) => item.brandName).map((item) => item.brandName as string),
    (item) => item,
  ).slice(0, 5);

  return {
    hotBrands: brands,
    hotKeywords: hotTags.slice(0, 6),
    featuredContents: contents.slice(0, 5).map((item) => ({
      title: item.title,
      type: mapContentTypeLabel(item.contentType),
      href: `/contents/${item.slug}`,
    })),
    collaborationSignals: requests.slice(0, 4).map((item) => ({
      title: item.title,
      city: item.city || "全国",
      href: `/requests/${item.slug}`,
    })),
  };
}

export async function listTopicFeed() {
  const topics = await listTopics();
  const contents = await listContents();
  const requests = await listRequests();

  return topics.map((topic, index) => {
    const intro = topic.intro || "";
    const matchedContents = contents.filter((item) => {
      const names = (item.tags || []).map((tag) => tag.name);
      return (
        intro.includes(item.industry?.name || "") ||
        names.some((tag) => intro.includes(tag)) ||
        (index === 0 && item.contentType !== "report")
      );
    });

    return {
      ...topic,
      contentCount: Math.max(6, matchedContents.length * 6 || 12),
      requestCount: Math.max(2, Math.min(8, requests.length + index)),
      highlightTags: uniqueBy(
        matchedContents.flatMap((item) => (item.tags || []).map((tag) => tag.name)),
        (item) => item,
      ).slice(0, 4),
      featuredItems: matchedContents.slice(0, 3).map((item) => ({
        title: item.title,
        href: `/contents/${item.slug}`,
        type: mapContentTypeLabel(item.contentType),
      })),
    };
  });
}

export async function listContents(): Promise<CmsContentSummary[]> {
  if (CMS_ENABLED) {
    try {
      return await getPublishedContents();
    } catch {
      return getMockContents();
    }
  }

  return getMockContents();
}

export async function findContentBySlug(slug: string): Promise<CmsContentDetail | null> {
  if (CMS_ENABLED) {
    try {
      return await getContentBySlug(slug);
    } catch {
      return getMockContentBySlug(slug);
    }
  }

  return getMockContentBySlug(slug);
}

export async function listTopics(): Promise<CmsTopicSummary[]> {
  if (CMS_ENABLED) {
    try {
      return await getPublishedTopics();
    } catch {
      return getMockTopics();
    }
  }

  return getMockTopics();
}

export async function findTopicBySlug(slug: string): Promise<CmsTopicSummary | null> {
  if (CMS_ENABLED) {
    try {
      return await getTopicBySlug(slug);
    } catch {
      return getMockTopicBySlug(slug);
    }
  }

  return getMockTopicBySlug(slug);
}

export async function listRequests(): Promise<CmsRequestSummary[]> {
  if (CMS_ENABLED) {
    try {
      return await getPublishedRequests();
    } catch {
      return getMockRequests();
    }
  }

  return getMockRequests();
}

export async function searchSite(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      query: "",
      total: 0,
      contents: [] as CmsContentSummary[],
      topics: [] as CmsTopicSummary[],
      requests: [] as CmsRequestSummary[],
    };
  }

  const [contents, topics, requests] = await Promise.all([
    listContents(),
    listTopics(),
    listRequests(),
  ]);

  const matchedContents = contents.filter((item) =>
    includesQuery(
      [
        item.title,
        item.summary,
        item.brandName,
        item.sourceName,
        item.industry?.name,
        ...(item.tags || []).map((tag) => tag.name),
      ],
      trimmedQuery,
    ),
  );

  const matchedTopics = topics.filter((item) =>
    includesQuery([item.title, item.intro, item.topicType], trimmedQuery),
  );

  const matchedRequests = requests.filter((item) =>
    includesQuery(
      [
        item.title,
        item.summary,
        item.city,
        item.budgetRange,
        item.requestType,
        item.industry?.name,
        ...(item.tags || []).map((tag) => tag.name),
      ],
      trimmedQuery,
    ),
  );

  return {
    query: trimmedQuery,
    total: matchedContents.length + matchedTopics.length + matchedRequests.length,
    contents: matchedContents,
    topics: matchedTopics,
    requests: matchedRequests,
  };
}

export async function findRequestBySlug(slug: string) {
  if (CMS_ENABLED) {
    try {
      return await getRequestBySlug(slug);
    } catch {
      return getMockRequestBySlug(slug);
    }
  }

  return getMockRequestBySlug(slug);
}

export async function getHomepageData() {
  const contents = await listContents();
  const requests = await listRequests();

  if (CMS_ENABLED) {
    try {
      const payload = await getHomepagePayload();
      const heat = await deriveMarketingHeatSeriesFromSubmissions();
      return {
        ...payload,
        heroSpotlight: payload.heroSpotlight || deriveHeroSpotlight(contents),
        selectedCaseCards:
          payload.selectedCaseCards?.length
            ? payload.selectedCaseCards
            : deriveSelectedCaseCards(contents),
        realtimeTrendSeries:
          payload.realtimeTrendSeries?.length
            ? payload.realtimeTrendSeries
            : heat.ok
              ? heat.realtimeTrendSeries
              : [],
        realtimeEventsFeed:
          payload.realtimeEventsFeed?.length
            ? payload.realtimeEventsFeed
            : deriveRealtimeEventsFeed(contents, requests),
        requestCards:
          payload.requestCards?.length ? payload.requestCards : deriveRequestCards(requests),
        playbookTags:
          payload.playbookTags?.length
            ? payload.playbookTags
            : deriveHotTags(contents, requests, 6),
        trendKeywords:
          payload.trendKeywords?.length
            ? payload.trendKeywords
            : heat.ok
              ? heat.trendKeywords
              : [],
      };
    } catch {
      const payload = await getMockHomepageData();
      return {
        ...payload,
        heroSpotlight: deriveHeroSpotlight(contents),
        selectedCaseCards: deriveSelectedCaseCards(contents),
        realtimeTrendSeries: deriveTrendSeries(contents, requests),
        realtimeEventsFeed: deriveRealtimeEventsFeed(contents, requests),
        requestCards: deriveRequestCards(requests),
        playbookTags: deriveHotTags(contents, requests, 6),
        trendKeywords: deriveHotTags(contents, requests, 8),
      };
    }
  }

  const payload = await getMockHomepageData();
  return {
    ...payload,
    heroSpotlight: deriveHeroSpotlight(contents),
    selectedCaseCards: deriveSelectedCaseCards(contents),
    realtimeTrendSeries: deriveTrendSeries(contents, requests),
    realtimeEventsFeed: deriveRealtimeEventsFeed(contents, requests),
    requestCards: deriveRequestCards(requests),
    playbookTags: deriveHotTags(contents, requests, 6),
    trendKeywords: deriveHotTags(contents, requests, 8),
  };
}

export async function listMockTopicCards() {
  return getMockTopicCards();
}

export async function listMockRequestCards() {
  return getMockRequestCards();
}

export async function listMockContentCards() {
  return getMockContentCards();
}

export async function listMockEventCards() {
  return getMockEventCards();
}

export async function listMockPlaybookCards() {
  return getMockPlaybookCards();
}

export async function listMockRankingCards() {
  return getMockRankingCards();
}
