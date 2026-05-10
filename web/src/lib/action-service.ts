import type {
  ActionResult,
  RequestApplicationPayload,
  RequestDraftPayload,
  SaveDraftPayload,
  ToggleSavedItemPayload,
} from "@/lib/cms-types";
import {
  mockApplyToRequest,
  mockMarkNotificationRead,
  mockSaveRequestDraft,
  mockSaveSubmissionDraft,
  mockToggleSavedItem,
} from "@/lib/mock-action-service";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";
import { resolveCurrentUserIdFallback } from "@/lib/current-user";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

function getCurrentUserId(userId?: string): string {
  return userId || resolveCurrentUserIdFallback();
}

function safeString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export async function toggleSavedItem(
  payload: ToggleSavedItemPayload,
  userId?: string,
): Promise<ActionResult> {
  if (!CMS_ENABLED) return mockToggleSavedItem(payload);

  try {
    const currentUserId = getCurrentUserId(userId);
    const items = await directusAuthedFetchJSON<{
      data?: Array<{ id: string | number }>;
    }>(
      `/items/saved_items?filter[user_id][_eq]=${encodeURIComponent(
        currentUserId,
      )}&filter[target_type][_eq]=${encodeURIComponent(
        payload.targetType,
      )}&filter[target_id][_eq]=${encodeURIComponent(payload.targetId)}&limit=1`,
      { method: "GET" },
    );

    const existing = items?.data?.[0];

    if (existing?.id !== undefined) {
      await directusAuthedFetchJSON(`/items/saved_items/${existing.id}`, {
        method: "DELETE",
      });
      return { ok: true, message: "已取消收藏。", source: "directus" };
    }

    await directusAuthedFetchJSON(`/items/saved_items`, {
      method: "POST",
      body: JSON.stringify({
        user_id: currentUserId,
        target_type: payload.targetType,
        target_id: payload.targetId,
        title: safeString(payload.title) || undefined,
        href: safeString(payload.href) || undefined,
      }),
    });

    return { ok: true, message: "已加入收藏。", source: "directus" };
  } catch (error) {
    const fallback = await mockToggleSavedItem(payload);
    return {
      ...fallback,
      source: "fallback",
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

export async function markNotificationRead(userId?: string): Promise<ActionResult> {
  if (!CMS_ENABLED) return mockMarkNotificationRead();

  try {
    const currentUserId = getCurrentUserId(userId);
    const unread = await directusAuthedFetchJSON<{
      data?: Array<{ id: string | number }>;
    }>(
      `/items/notifications?filter[user_id][_eq]=${encodeURIComponent(
        currentUserId,
      )}&filter[is_read][_eq]=false&limit=200`,
      { method: "GET" },
    );

    const ids = (unread?.data || []).map((item) => item.id);
    if (!ids.length) {
      return { ok: true, message: "当前没有未读通知。", source: "directus" };
    }

    await Promise.all(
      ids.map((id) =>
        directusAuthedFetchJSON(`/items/notifications/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ is_read: true }),
        }),
      ),
    );

    return { ok: true, message: "通知已标记为已读。", source: "directus" };
  } catch (error) {
    const fallback = await mockMarkNotificationRead();
    return {
      ...fallback,
      source: "fallback",
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

export async function saveSubmissionDraft(
  payload: SaveDraftPayload,
  userId?: string,
): Promise<ActionResult & { draftId: string }> {
  if (!CMS_ENABLED) return mockSaveSubmissionDraft(payload);

  try {
    const currentUserId = getCurrentUserId(userId);

    const requestBody: Record<string, unknown> = {
      submission_type: payload.submissionType,
      submitter_user_id: currentUserId,
      title: payload.title,
      summary: safeString(payload.summary) || "",
      // 允许把来源链接落在 external_link（如果你的 Directus 字段使用同名）
      external_link: safeString(payload.sourceUrl) || null,
      status: "draft",
    };

    const res = await directusAuthedFetchJSON<{
      data?: { id?: string | number };
    }>(`/items/submissions`, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    const draftId =
      (res?.data?.id !== undefined && String(res.data.id)) || "unknown";

    return {
      ok: true,
      message: `已保存《${payload.title || "未命名内容"}》草稿。`,
      draftId,
      source: "directus",
    };
  } catch (error) {
    // 为了不阻塞前台体验：写入链路接入后仍允许灰度（失败即回退 mock）
    const fallback = await mockSaveSubmissionDraft(payload);
    return {
      ...fallback,
      source: "fallback",
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

export async function applyToRequest(
  payload: RequestApplicationPayload,
  userId?: string,
): Promise<ActionResult & { applicationId: string }> {
  if (!CMS_ENABLED) return mockApplyToRequest(payload);

  try {
    const requestLookup = await directusAuthedFetchJSON<{
      data?: Array<{ id: string | number }>;
    }>(
      `/items/partnership_requests?filter[slug][_eq]=${encodeURIComponent(
        payload.requestSlug,
      )}&limit=1`,
      { method: "GET" },
    );
    const request = requestLookup?.data?.[0];
    if (!request) {
      throw new Error(`Request not found by slug: ${payload.requestSlug}`);
    }

    const currentUserId = getCurrentUserId(userId);
    const portfolioUrl = safeString(payload.portfolioUrl);
    const contactPreference = safeString(payload.contactPreference);

    const message = [
      safeString(payload.intro) || "（未填写简介）",
      portfolioUrl ? `作品/案例链接：${portfolioUrl}` : undefined,
      contactPreference
        ? `联系方式策略：${contactPreference}`
        : "联系方式策略：apply_only",
    ]
      .filter(Boolean)
      .join("\n\n");

    const res = await directusAuthedFetchJSON<{
      data?: { id?: string | number };
    }>(`/items/match_applications`, {
      method: "POST",
      body: JSON.stringify({
        request_id: request.id,
        applicant_user_id: currentUserId,
        message,
        status: "pending",
      }),
    });

    const applicationId =
      (res?.data?.id !== undefined && String(res.data.id)) || "unknown";

    return {
      ok: true,
      message: `已向 ${payload.requestSlug} 提交合作申请。`,
      applicationId,
      source: "directus",
    };
  } catch (error) {
    const fallback = await mockApplyToRequest(payload);
    return {
      ...fallback,
      source: "fallback",
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

export async function saveRequestDraft(
  payload: RequestDraftPayload,
  userId?: string,
): Promise<ActionResult & { draftId: string }> {
  if (!CMS_ENABLED) return mockSaveRequestDraft(payload);

  try {
    const currentUserId = getCurrentUserId(userId);
    const title = safeString(payload.title) || "未命名合作需求";
    const summary = safeString(payload.summary) || "";

    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${slugBase || "request"}-${Date.now().toString().slice(-6)}`;

    const res = await directusAuthedFetchJSON<{
      data?: { id?: string | number };
    }>(`/items/partnership_requests`, {
      method: "POST",
      body: JSON.stringify({
        title,
        slug,
        request_type: payload.requestType,
        publisher_user_id: currentUserId,
        summary,
        city: safeString(payload.city) || null,
        budget_range: safeString(payload.budgetRange) || null,
        contact_policy: payload.contactPolicy || "apply_only",
        target_type: safeString(payload.targetType) || "待沟通",
        status: "draft",
      }),
    });

    const draftId =
      (res?.data?.id !== undefined && String(res.data.id)) || "unknown";

    return {
      ok: true,
      message: `已保存合作需求草稿《${title}》。`,
      draftId,
      source: "directus",
    };
  } catch (error) {
    const fallback = await mockSaveRequestDraft(payload);
    return {
      ...fallback,
      source: "fallback",
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}
