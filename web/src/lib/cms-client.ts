import "server-only";

import type {
  CmsContentDetail,
  CmsContentSummary,
  CmsHomepagePayload,
  CmsNotificationSummary,
  CmsSavedItemSummary,
  CmsSubmissionSummary,
  CmsUserDashboard,
  CmsUserProfile,
  CmsRequestSummary,
  CmsTopicSummary,
  CmsMatchApplicationSummary,
} from "@/lib/cms-types";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";

const CMS_BASE_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
const CURRENT_USER_ID = process.env.QIUQIUTECH_CURRENT_USER_ID || "me";
const CMS_FETCH_TIMEOUT_MS = 6000;

interface DirectusSingleResponse<T> {
  data: T;
}

interface DirectusListResponse<T> {
  data: T[];
}

function canRetryWithAuthedFetch(path: string, init?: RequestInit) {
  const method = (init?.method || "GET").toUpperCase();
  return method === "GET" && path.startsWith("/items/");
}

function normalizeTopic(item: Record<string, unknown>) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    intro: item.intro,
    topicType: item.topicType ?? item.topic_type,
    coverImage: item.coverImage ?? item.cover_image ?? null,
  };
}

function normalizeContent(item: Record<string, unknown>) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary ?? "",
    contentType: item.contentType ?? item.content_type ?? "case",
    sourceName: item.sourceName ?? item.source_name ?? undefined,
    brandName: item.brandName ?? item.brand_name ?? undefined,
    publishedAt: item.publishedAt ?? item.published_at ?? undefined,
    coverImage: item.coverImage ?? item.cover_image ?? null,
    industry: item.industry ?? null,
    tags: item.tags ?? [],
    body: item.body ?? undefined,
    sourceUrl: item.sourceUrl ?? item.source_url ?? undefined,
    seoTitle: item.seoTitle ?? item.seo_title ?? undefined,
    seoDescription: item.seoDescription ?? item.seo_description ?? undefined,
    topics: item.topics ?? [],
  };
}

function normalizeRequest(item: Record<string, unknown>) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    requestType: item.requestType ?? item.request_type ?? "brand_to_marketer",
    summary: item.summary ?? "",
    city: item.city ?? undefined,
    budgetRange: item.budgetRange ?? item.budget_range ?? undefined,
    contactPolicy: item.contactPolicy ?? item.contact_policy ?? "apply_only",
    publishedAt: item.publishedAt ?? item.published_at ?? undefined,
    industry: item.industry ?? null,
    tags: item.tags ?? [],
  };
}

function normalizeHomepagePayload(item: Record<string, unknown>): CmsHomepagePayload {
  const asArray = <T>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);
  return {
    heroSpotlight: (item.heroSpotlight ?? item.hero_spotlight ?? null) as
      | CmsHomepagePayload["heroSpotlight"]
      | null,
    selectedCaseCards: asArray<CmsHomepagePayload["selectedCaseCards"] extends Array<infer T> ? T : never>(
      item.selectedCaseCards ?? item.selected_case_cards,
    ),
    realtimeTrendSeries: asArray<
      CmsHomepagePayload["realtimeTrendSeries"] extends Array<infer T> ? T : never
    >(item.realtimeTrendSeries ?? item.realtime_trend_series),
    realtimeEventsFeed: asArray<
      CmsHomepagePayload["realtimeEventsFeed"] extends Array<infer T> ? T : never
    >(item.realtimeEventsFeed ?? item.realtime_events_feed),
    requestCards: asArray<CmsHomepagePayload["requestCards"] extends Array<infer T> ? T : never>(
      item.requestCards ?? item.request_cards,
    ),
    playbookTags: asArray<string>(item.playbookTags ?? item.playbook_tags),
    trendKeywords: asArray<string>(item.trendKeywords ?? item.trend_keywords),
    submissionShowcase: asArray<
      CmsHomepagePayload["submissionShowcase"] extends Array<infer T> ? T : never
    >(item.submissionShowcase ?? item.submission_showcase),
    valueHighlights: asArray<[string, string]>(item.valueHighlights ?? item.value_highlights),
  };
}

async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CMS_FETCH_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${CMS_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
      next: { revalidate: 120 },
      signal: controller.signal,
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    throw new Error(
      isTimeout
        ? `CMS request timeout after ${CMS_FETCH_TIMEOUT_MS}ms: ${path}`
        : `CMS request failed: ${path}`,
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    if (
      canRetryWithAuthedFetch(path, init) &&
      [401, 403].includes(response.status)
    ) {
      try {
        return await directusAuthedFetchJSON<T>(path, {
          method: init?.method || "GET",
          headers: init?.headers,
        });
      } catch (authedError) {
        const message =
          authedError instanceof Error ? `; authed retry failed: ${authedError.message}` : "";
        throw new Error(
          `CMS request failed: ${response.status} ${response.statusText}${message}`,
        );
      }
    }

    throw new Error(`CMS request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

function buildListQuery(params: Record<string, string>) {
  return new URLSearchParams(params).toString();
}

async function cmsFetchList<T>(path: string, params?: Record<string, string>) {
  const query = params ? `?${buildListQuery(params)}` : "";
  const response = await cmsFetch<DirectusListResponse<T>>(`${path}${query}`);
  return response.data;
}

async function cmsFetchSingleton<T>(path: string) {
  const response = await cmsFetch<DirectusSingleResponse<T>>(path);
  return response.data;
}

async function cmsFetchFirstBySlug<T>(collection: string, slug: string) {
  const items = await cmsFetchList<T>(`/items/${collection}`, {
    "filter[slug][_eq]": slug,
    limit: "1",
  });

  return items[0] || null;
}

export async function getHomepagePayload(): Promise<CmsHomepagePayload> {
  const raw = await cmsFetchSingleton<Record<string, unknown>>("/items/homepage_payload");
  return normalizeHomepagePayload(raw);
}

export async function getPublishedContents(): Promise<CmsContentSummary[]> {
  const raw = await cmsFetchList<Record<string, unknown>>("/items/contents", {
    sort: "-published_at",
    "filter[status][_eq]": "published",
  });
  return raw.map((item) => normalizeContent(item)) as unknown as CmsContentSummary[];
}

export async function getContentBySlug(slug: string): Promise<CmsContentDetail | null> {
  const raw = await cmsFetchFirstBySlug<Record<string, unknown>>("contents", slug);
  return raw ? (normalizeContent(raw) as unknown as CmsContentDetail) : null;
}

export async function getPublishedTopics(): Promise<CmsTopicSummary[]> {
  const raw = await cmsFetchList<Record<string, unknown>>("/items/topics", {
    sort: "-date_updated",
    "filter[status][_eq]": "published",
  });
  return raw.map((item) => normalizeTopic(item)) as unknown as CmsTopicSummary[];
}

export async function getTopicBySlug(slug: string): Promise<CmsTopicSummary | null> {
  const raw = await cmsFetchFirstBySlug<Record<string, unknown>>("topics", slug);
  return raw ? (normalizeTopic(raw) as unknown as CmsTopicSummary) : null;
}

export async function getPublishedRequests(): Promise<CmsRequestSummary[]> {
  const raw = await cmsFetchList<Record<string, unknown>>("/items/partnership_requests", {
    sort: "-published_at",
    "filter[status][_eq]": "published",
  });
  return raw.map((item) => normalizeRequest(item)) as unknown as CmsRequestSummary[];
}

export async function getRequestBySlug(slug: string): Promise<CmsRequestSummary | null> {
  const raw = await cmsFetchFirstBySlug<Record<string, unknown>>("partnership_requests", slug);
  return raw ? (normalizeRequest(raw) as unknown as CmsRequestSummary) : null;
}

export async function getCurrentUserProfile(): Promise<CmsUserProfile | null> {
  return getCurrentUserProfileByUserId(CURRENT_USER_ID);
}

export async function getCurrentUserProfileByUserId(
  userId: string,
): Promise<CmsUserProfile | null> {
  const items = await cmsFetchList<CmsUserProfile>("/items/user_profiles", {
    "filter[user_id][_eq]": userId,
    limit: "1",
  });
  return items[0] || null;
}

export async function getMySubmissions(): Promise<CmsSubmissionSummary[]> {
  return getMySubmissionsByUserId(CURRENT_USER_ID);
}

export async function getMySubmissionsByUserId(
  userId: string,
): Promise<CmsSubmissionSummary[]> {
  return cmsFetchList<CmsSubmissionSummary>("/items/submissions", {
    sort: "-date_updated",
    "filter[submitter_user_id][_eq]": userId,
  });
}

export async function getMySavedItems(): Promise<CmsSavedItemSummary[]> {
  return getMySavedItemsByUserId(CURRENT_USER_ID);
}

export async function getMySavedItemsByUserId(
  userId: string,
): Promise<CmsSavedItemSummary[]> {
  return cmsFetchList<CmsSavedItemSummary>("/items/saved_items", {
    sort: "-date_created",
    "filter[user_id][_eq]": userId,
  });
}

export async function getMyMatchApplications(): Promise<CmsMatchApplicationSummary[]> {
  return getMyMatchApplicationsByUserId(CURRENT_USER_ID);
}

export async function getMyMatchApplicationsByUserId(
  userId: string,
): Promise<CmsMatchApplicationSummary[]> {
  return cmsFetchList<CmsMatchApplicationSummary>("/items/match_applications", {
    sort: "-date_updated",
    "filter[applicant_user_id][_eq]": userId,
  });
}

export async function getMyNotifications(): Promise<CmsNotificationSummary[]> {
  return getMyNotificationsByUserId(CURRENT_USER_ID);
}

export async function getMyNotificationsByUserId(
  userId: string,
): Promise<CmsNotificationSummary[]> {
  return cmsFetchList<CmsNotificationSummary>("/items/notifications", {
    sort: "-date_created",
    "filter[user_id][_eq]": userId,
  });
}

export async function getUserDashboard(): Promise<CmsUserDashboard> {
  return cmsFetchSingleton<CmsUserDashboard>("/items/user_dashboard");
}

export { CMS_BASE_URL, CURRENT_USER_ID };
