import {
  contentCards,
  contentDetails,
  eventCards,
  heroSpotlight,
  latestEvents,
  playbookCards,
  rankingCards,
  realtimeEventsFeed,
  realtimeTrendSeries,
  requestCards,
  requestDetails,
  selectedCaseCards,
  submissionShowcase,
  topicCards,
  topicDetails,
  trendKeywords,
  valueHighlights,
  playbookTags,
} from "@/lib/site-data";
import type {
  CmsContentDetail,
  CmsContentSummary,
  CmsRequestSummary,
  CmsTopicSummary,
} from "@/lib/cms-types";

function mapContentSummary(item: (typeof contentDetails)[number]): CmsContentSummary {
  return {
    id: item.slug,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    contentType:
      item.type === "案例"
        ? "case"
        : item.type === "趋势观察"
          ? "trend"
          : item.type === "品牌动态"
            ? "brand_news"
            : item.type === "报告解读"
              ? "report"
              : "feature",
    sourceName: item.source,
    brandName: item.brand,
    publishedAt: "2026-05-07",
    industry: item.industry
      ? {
          id: item.industry,
          name: item.industry,
          slug: item.industry,
        }
      : null,
    tags: item.tags.map((tag) => ({
      id: tag,
      name: tag,
      slug: tag,
    })),
  };
}

function mapContentDetail(item: (typeof contentDetails)[number]): CmsContentDetail {
  return {
    ...mapContentSummary(item),
    body: item.body.join("\n\n"),
    sourceUrl: "#",
    seoTitle: item.title,
    seoDescription: item.summary,
  };
}

function mapTopicSummary(
  item: (typeof topicDetails)[number] | (typeof topicCards)[number],
): CmsTopicSummary {
  const title = item.title;
  const slug =
    "slug" in item
      ? item.slug
      : title === "季度盘点"
        ? "quarterly-recap-topic"
        : "festival-marketing-topic";
  return {
    id: slug,
    title,
    slug,
    intro: "intro" in item ? item.intro : item.description,
  };
}

function mapRequestSummary(
  item: (typeof requestDetails)[number] | (typeof requestCards)[number],
): CmsRequestSummary {
  if ("slug" in item) {
    const contactPolicy =
      item.contactMode === "public"
        ? "public"
        : item.contactMode === "platform_match"
          ? "platform_match"
          : "apply_only";

    return {
      id: item.slug,
      title: item.title,
      slug: item.slug,
      requestType:
        item.requestType === "品牌找营销人"
          ? "brand_to_marketer"
          : item.requestType === "品牌找品牌"
            ? "brand_to_brand"
            : item.requestType === "营销人找合作方"
              ? "marketer_to_partner"
              : item.requestType === "代理公司 / 工作室合作"
                ? "agency_collab"
                : "platform_match",
      summary: item.summary,
      city: item.city,
      budgetRange: item.budget,
      contactPolicy,
      publishedAt: "2026-05-07",
      industry: {
        id: item.industry,
        name: item.industry,
        slug: item.industry,
      },
      tags: item.tags?.map((tag) => ({
        id: tag,
        name: tag,
        slug: tag,
      })),
    };
  }

  return {
    id: item.title,
    title: item.title,
    slug:
      item.type === "品牌找品牌"
        ? "brand-looking-for-brand-partner"
        : "brand-looking-for-popup-cocreation-team",
    requestType:
      item.type === "品牌找营销人"
        ? "brand_to_marketer"
        : item.type === "品牌找品牌"
          ? "brand_to_brand"
          : item.type === "营销人找合作方"
            ? "marketer_to_partner"
            : item.type === "代理公司 / 工作室合作"
              ? "agency_collab"
              : "platform_match",
    summary: item.detail,
    city: item.detail.split(" · ")[0],
    contactPolicy:
      item.detail.includes("public")
        ? "public"
        : item.detail.includes("platform_match")
          ? "platform_match"
          : "apply_only",
    publishedAt: "2026-05-07",
  };
}

export async function getMockContents(): Promise<CmsContentSummary[]> {
  return contentDetails.map(mapContentSummary);
}

export async function getMockContentBySlug(slug: string): Promise<CmsContentDetail | null> {
  const item = contentDetails.find((entry) => entry.slug === slug);
  return item ? mapContentDetail(item) : null;
}

export async function getMockTopics(): Promise<CmsTopicSummary[]> {
  return topicDetails.map(mapTopicSummary);
}

export async function getMockTopicBySlug(slug: string): Promise<CmsTopicSummary | null> {
  const item = topicDetails.find((entry) => entry.slug === slug);
  return item ? mapTopicSummary(item) : null;
}

export async function getMockTopicCards(): Promise<(typeof topicCards)> {
  return topicCards;
}

export async function getMockRequests(): Promise<CmsRequestSummary[]> {
  return requestDetails.map(mapRequestSummary);
}

export async function getMockRequestBySlug(slug: string): Promise<(typeof requestDetails)[number] | null> {
  return requestDetails.find((entry) => entry.slug === slug) || null;
}

export async function getMockRequestCards(): Promise<(typeof requestCards)> {
  return requestCards;
}

export async function getMockContentCards(): Promise<(typeof contentCards)> {
  return contentCards;
}

export async function getMockHomepageData() {
  return {
    heroSpotlight,
    selectedCaseCards,
    realtimeTrendSeries,
    realtimeEventsFeed,
    latestEvents,
    topicCards,
    requestCards,
    playbookTags,
    trendKeywords,
    submissionShowcase,
    valueHighlights,
  };
}

export async function getMockEventCards(): Promise<(typeof eventCards)> {
  return eventCards;
}

export async function getMockPlaybookCards(): Promise<(typeof playbookCards)> {
  return playbookCards;
}

export async function getMockRankingCards(): Promise<(typeof rankingCards)> {
  return rankingCards;
}
