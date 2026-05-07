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

const CMS_BASE_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

interface DirectusSingleResponse<T> {
  data: T;
}

interface DirectusListResponse<T> {
  data: T[];
}

async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${CMS_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    next: { revalidate: 120 },
  });

  if (!response.ok) {
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
  return cmsFetchSingleton<CmsHomepagePayload>("/items/homepage_payload");
}

export async function getPublishedContents(): Promise<CmsContentSummary[]> {
  return cmsFetchList<CmsContentSummary>("/items/contents", {
    sort: "-published_at",
    "filter[status][_eq]": "published",
  });
}

export async function getContentBySlug(slug: string): Promise<CmsContentDetail | null> {
  return cmsFetchFirstBySlug<CmsContentDetail>("contents", slug);
}

export async function getPublishedTopics(): Promise<CmsTopicSummary[]> {
  return cmsFetchList<CmsTopicSummary>("/items/topics", {
    sort: "-date_updated",
    "filter[status][_eq]": "published",
  });
}

export async function getTopicBySlug(slug: string): Promise<CmsTopicSummary | null> {
  return cmsFetchFirstBySlug<CmsTopicSummary>("topics", slug);
}

export async function getPublishedRequests(): Promise<CmsRequestSummary[]> {
  return cmsFetchList<CmsRequestSummary>("/items/partnership_requests", {
    sort: "-published_at",
    "filter[status][_eq]": "published",
  });
}

export async function getRequestBySlug(slug: string): Promise<CmsRequestSummary | null> {
  return cmsFetchFirstBySlug<CmsRequestSummary>("partnership_requests", slug);
}

export async function getCurrentUserProfile(): Promise<CmsUserProfile | null> {
  return cmsFetchSingleton<CmsUserProfile>("/items/user_profiles/me");
}

export async function getMySubmissions(): Promise<CmsSubmissionSummary[]> {
  return cmsFetchList<CmsSubmissionSummary>("/items/submissions", {
    sort: "-date_updated",
  });
}

export async function getMySavedItems(): Promise<CmsSavedItemSummary[]> {
  return cmsFetchList<CmsSavedItemSummary>("/items/saved_items", {
    sort: "-date_created",
  });
}

export async function getMyMatchApplications(): Promise<CmsMatchApplicationSummary[]> {
  return cmsFetchList<CmsMatchApplicationSummary>("/items/match_applications", {
    sort: "-date_updated",
  });
}

export async function getMyNotifications(): Promise<CmsNotificationSummary[]> {
  return cmsFetchList<CmsNotificationSummary>("/items/notifications", {
    sort: "-date_created",
  });
}

export async function getUserDashboard(): Promise<CmsUserDashboard> {
  return cmsFetchSingleton<CmsUserDashboard>("/items/user_dashboard");
}

export { CMS_BASE_URL };
