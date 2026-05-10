import type { PublishStatus } from "@/lib/cms-types";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

type ReviewTarget = "submission" | "request";

export type AdminReviewAction = "submit_review" | "approve" | "reject" | "publish";

export interface AdminReviewResult {
  success: boolean;
  message: string;
  status?: PublishStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  note?: string;
  fallback?: boolean;
}

export interface AdminReviewQueueItem {
  id: string;
  title: string;
  summary: string;
  status: PublishStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type ReviewQueueStatusFilter = PublishStatus | "all";

interface ReviewPayload {
  id: string;
  action: AdminReviewAction;
  note?: string;
  reviewerId?: string;
}

const STATUS_FLOW: Record<PublishStatus, PublishStatus[]> = {
  draft: ["pending_review"],
  pending_review: ["approved", "rejected"],
  under_review: ["approved", "rejected"],
  approved: ["published"],
  rejected: ["pending_review"],
  published: [],
  closed: [],
  archived: [],
};

function getNextStatus(action: AdminReviewAction): PublishStatus {
  if (action === "submit_review") return "pending_review";
  if (action === "approve") return "approved";
  if (action === "reject") return "rejected";
  return "published";
}

function normalizeStatus(value: unknown): PublishStatus {
  const status = typeof value === "string" ? value : "draft";
  if (status in STATUS_FLOW) return status as PublishStatus;
  return "draft";
}

function canTransition(from: PublishStatus, to: PublishStatus) {
  return STATUS_FLOW[from]?.includes(to) ?? false;
}

function collectionByTarget(target: ReviewTarget): string {
  return target === "submission" ? "submissions" : "partnership_requests";
}

function mockQueueByTarget(target: ReviewTarget): AdminReviewQueueItem[] {
  if (target === "submission") {
    return [
      {
        id: "submission-mock-001",
        title: "品牌节点 campaign 案例投稿",
        summary: "待审核素材完整性、案例摘要与标签结构。",
        status: "draft",
      },
      {
        id: "submission-mock-002",
        title: "季度营销复盘投稿",
        summary: "待确认可公开字段与来源说明。",
        status: "pending_review",
      },
    ];
  }

  return [
    {
      id: "request-mock-001",
      title: "品牌寻找快闪共创团队",
      summary: "需校验联系方式策略与预算字段。",
      status: "pending_review",
    },
    {
      id: "request-mock-002",
      title: "联名合作需求草稿",
      summary: "已建草稿，待提交审核。",
      status: "draft",
    },
  ];
}

export async function listReviewQueue(
  target: ReviewTarget,
  options?: { status?: ReviewQueueStatusFilter },
): Promise<{
  success: boolean;
  items: AdminReviewQueueItem[];
  fallback?: boolean;
  message?: string;
}> {
  const statusFilter = options?.status || "all";
  const applyStatusFilter = (items: AdminReviewQueueItem[]) =>
    statusFilter === "all" ? items : items.filter((item) => item.status === statusFilter);

  if (!CMS_ENABLED) {
    return { success: true, items: applyStatusFilter(mockQueueByTarget(target)), fallback: true };
  }

  try {
    const collection = collectionByTarget(target);
    const statusQuery =
      statusFilter === "all"
        ? ""
        : `&filter[status][_eq]=${encodeURIComponent(statusFilter)}`;
    const res = await directusAuthedFetchJSON<{
      data?: Array<{
        id?: string | number;
        title?: string;
        summary?: string;
        status?: string;
        review_note?: string;
        reviewed_at?: string;
        reviewed_by?: string;
      }>;
    }>(
      `/items/${collection}?fields=id,title,summary,status,review_note,reviewed_at,reviewed_by&sort=-date_updated&limit=20${statusQuery}`,
      { method: "GET" },
    );

    const items = (res.data || []).map((item, index) => ({
      id: String(item.id ?? `${collection}-${index}`),
      title: item.title || "未命名条目",
      summary: item.summary || "暂无摘要",
      status: normalizeStatus(item.status),
      reviewNote: item.review_note || undefined,
      reviewedAt: item.reviewed_at || undefined,
      reviewedBy: item.reviewed_by || undefined,
    }));

    return { success: true, items: applyStatusFilter(items) };
  } catch {
    return {
      success: true,
      items: applyStatusFilter(mockQueueByTarget(target)),
      fallback: true,
      message: "真实数据暂时不可用，当前展示的是临时审核队列。",
    };
  }
}

async function reviewByTarget(
  target: ReviewTarget,
  payload: ReviewPayload,
): Promise<AdminReviewResult> {
  const nextStatus = getNextStatus(payload.action);
  const note = (payload.note || "").trim();

  if (payload.action === "reject" && !note) {
    return {
      success: false,
      message: "驳回必须填写原因（review_note）。",
    };
  }

  if (!CMS_ENABLED) {
    return {
      success: true,
      message: `${target === "submission" ? "投稿" : "合作需求"}审核动作已暂存，稍后会继续同步真实数据。`,
      status: nextStatus,
      note,
      fallback: true,
    };
  }

  try {
    const collection = collectionByTarget(target);
    const item = await directusAuthedFetchJSON<{
      data?: { id?: string | number; status?: string };
    }>(`/items/${collection}/${encodeURIComponent(payload.id)}?fields=id,status`, {
      method: "GET",
    });

    const currentStatus = normalizeStatus(item?.data?.status);
    if (!canTransition(currentStatus, nextStatus)) {
      return {
        success: false,
        message: `状态流转不合法：${currentStatus} -> ${nextStatus}`,
      };
    }

    const reviewedAt = new Date().toISOString();
    const reviewedBy = payload.reviewerId || process.env.QIUQIUTECH_CURRENT_USER_ID || "system-review";
    await directusAuthedFetchJSON(`/items/${collection}/${encodeURIComponent(payload.id)}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: nextStatus,
        reviewed_by: reviewedBy,
        reviewed_at: reviewedAt,
        review_note: note || `${payload.action} by ${reviewedBy}`,
      }),
    });

    return {
      success: true,
      status: nextStatus,
      reviewedAt,
      reviewedBy,
      note,
      message: `${target === "submission" ? "投稿" : "合作需求"}已更新为 ${nextStatus}。`,
    };
  } catch {
    return {
      success: true,
      message: `${target === "submission" ? "投稿" : "合作需求"}审核动作已暂存，稍后会继续同步真实数据。`,
      status: nextStatus,
      note,
      fallback: true,
    };
  }
}

export async function reviewSubmissionById(payload: ReviewPayload): Promise<AdminReviewResult> {
  return reviewByTarget("submission", payload);
}

export async function reviewRequestById(payload: ReviewPayload): Promise<AdminReviewResult> {
  return reviewByTarget("request", payload);
}
