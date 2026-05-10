import type {
  CmsMatchApplicationSummary,
  CmsNotificationSummary,
  CmsSavedItemSummary,
  CmsSubmissionSummary,
  CmsUserDashboard,
  CmsUserProfile,
} from "@/lib/cms-types";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";
import { resolveCurrentUserIdFallback } from "@/lib/current-user";
import { getMockUserDashboard } from "@/lib/mock-account-service";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

function asRecord(input: unknown): Record<string, unknown> {
  return typeof input === "object" && input !== null
    ? (input as Record<string, unknown>)
    : {};
}

function asString(input: unknown, fallback = ""): string {
  return typeof input === "string" && input.trim() ? input : fallback;
}

function normalizeProfile(input: unknown, fallback: CmsUserProfile): CmsUserProfile {
  const row = asRecord(input);
  return {
    ...fallback,
    id: (row.id as string | number) || fallback.id,
    displayName:
      asString(row.displayName) ||
      asString(row.display_name) ||
      fallback.displayName,
    roleType: (row.roleType as CmsUserProfile["roleType"]) || fallback.roleType,
    bio: asString(row.bio) || fallback.bio,
    city: asString(row.city) || fallback.city,
    companyName:
      asString(row.companyName) ||
      asString(row.company_name) ||
      fallback.companyName,
    verificationStatus:
      (row.verificationStatus as CmsUserProfile["verificationStatus"]) ||
      (row.verification_status as CmsUserProfile["verificationStatus"]) ||
      fallback.verificationStatus,
    contactPolicy:
      (row.contactPolicy as CmsUserProfile["contactPolicy"]) ||
      (row.contact_policy as CmsUserProfile["contactPolicy"]) ||
      fallback.contactPolicy,
  };
}

function roleLabel(roleType?: CmsUserProfile["roleType"]): string {
  if (roleType === "brand") return "品牌方";
  if (roleType === "agency") return "代理公司";
  if (roleType === "independent") return "独立操盘手";
  return "市场人";
}

function verificationLabel(status?: CmsUserProfile["verificationStatus"]): string {
  if (status === "verified") return "已认证";
  if (status === "pending") return "审核中";
  if (status === "rejected") return "认证未通过";
  return "未认证";
}

function submissionTypeLabel(type: CmsSubmissionSummary["submissionType"]): string {
  if (type === "event") return "营销事件";
  if (type === "playbook") return "玩法拆解";
  return "案例内容";
}

function submissionStatusLabel(status: CmsSubmissionSummary["status"]): string {
  if (status === "pending_review") return "待审核";
  if (status === "under_review") return "审核中";
  if (status === "approved") return "已通过";
  if (status === "rejected") return "已拒绝";
  if (status === "published") return "已发布";
  if (status === "closed") return "已关闭";
  if (status === "archived") return "已归档";
  return "草稿";
}

function applicationStatusLabel(status: CmsMatchApplicationSummary["status"]): string {
  if (status === "accepted") return "已接受";
  if (status === "connected") return "已建立联系";
  if (status === "rejected") return "已拒绝";
  if (status === "closed") return "已关闭";
  return "处理中";
}

function formatDateLabel(value?: string): string {
  if (!value) return "暂无";
  try {
    return new Date(value).toLocaleDateString("zh-CN");
  } catch {
    return value;
  }
}

function normalizeSubmissions(rows: unknown[]): CmsSubmissionSummary[] {
  return rows.map((item, index) => {
    const row = asRecord(item);
    return {
      id: (row.id as string | number) || `submission-${index}`,
      title: asString(row.title, "未命名投稿"),
      submissionType:
        (row.submissionType as CmsSubmissionSummary["submissionType"]) ||
        (row.submission_type as CmsSubmissionSummary["submissionType"]) ||
        "case",
      status: (row.status as CmsSubmissionSummary["status"]) || "draft",
      updatedAt:
        asString(row.updatedAt) ||
        asString(row.updated_at) ||
        asString(row.date_updated),
      reviewNote: asString(row.reviewNote) || asString(row.review_note),
    };
  });
}

function normalizeSavedItems(rows: unknown[]): CmsSavedItemSummary[] {
  return rows.map((item, index) => {
    const row = asRecord(item);
    const targetType =
      (row.targetType as CmsSavedItemSummary["targetType"]) ||
      (row.target_type as CmsSavedItemSummary["targetType"]) ||
      "content";
    const href =
      asString(row.href) ||
      (targetType === "topic"
        ? `/topics/${asString(row.target_id, "unknown")}`
        : targetType === "request"
          ? `/requests/${asString(row.target_id, "unknown")}`
          : `/contents/${asString(row.target_id, "unknown")}`);

    return {
      id: (row.id as string | number) || `saved-${index}`,
      targetType,
      title: asString(row.title, "未命名收藏"),
      href,
      savedAt:
        asString(row.savedAt) ||
        asString(row.saved_at) ||
        asString(row.date_created),
    };
  });
}

function normalizeApplications(rows: unknown[]): CmsMatchApplicationSummary[] {
  return rows.map((item, index) => {
    const row = asRecord(item);
    return {
      id: (row.id as string | number) || `application-${index}`,
      requestTitle:
        asString(row.requestTitle) ||
        asString(row.request_title) ||
        asString(row.title) ||
        "合作申请",
      status: (row.status as CmsMatchApplicationSummary["status"]) || "pending",
      updatedAt:
        asString(row.updatedAt) ||
        asString(row.updated_at) ||
        asString(row.date_updated),
      city: asString(row.city),
    };
  });
}

function normalizeNotifications(rows: unknown[]): CmsNotificationSummary[] {
  return rows.map((item, index) => {
    const row = asRecord(item);
    return {
      id: (row.id as string | number) || `notification-${index}`,
      title: asString(row.title, "系统通知"),
      body: asString(row.body, "暂无详情"),
      isRead: Boolean(row.isRead ?? row.is_read),
      createdAt:
        asString(row.createdAt) ||
        asString(row.created_at) ||
        asString(row.date_created),
    };
  });
}

async function listPrivateItems<T>(collection: string, params?: Record<string, string>) {
  const query = new URLSearchParams(params);
  const path = query.size
    ? `/items/${collection}?${query.toString()}`
    : `/items/${collection}`;
  const result = await directusAuthedFetchJSON<{ data?: T[] }>(path, { method: "GET" });
  return result.data || [];
}

async function getPrivateUserProfileByUserId(userId: string) {
  const items = await listPrivateItems<Record<string, unknown>>("user_profiles", {
    "filter[user_id][_eq]": userId,
    limit: "1",
  });
  return items[0] || null;
}

async function getPrivateSubmissionsByUserId(userId: string) {
  return listPrivateItems<Record<string, unknown>>("submissions", {
    sort: "-date_updated",
    "filter[submitter_user_id][_eq]": userId,
  });
}

async function getPrivateSavedItemsByUserId(userId: string) {
  return listPrivateItems<Record<string, unknown>>("saved_items", {
    sort: "-date_created",
    "filter[user_id][_eq]": userId,
  });
}

async function getPrivateApplicationsByUserId(userId: string) {
  return listPrivateItems<Record<string, unknown>>("match_applications", {
    sort: "-date_updated",
    "filter[applicant_user_id][_eq]": userId,
  });
}

async function getPrivateNotificationsByUserId(userId: string) {
  return listPrivateItems<Record<string, unknown>>("notifications", {
    sort: "-date_created",
    "filter[user_id][_eq]": userId,
  });
}

function buildDerivedOverviewCards(
  profile: CmsUserProfile,
  submissions: CmsSubmissionSummary[],
  applications: CmsMatchApplicationSummary[],
  notifications: CmsNotificationSummary[],
) {
  const latestSubmission = submissions[0];
  const latestApplication = applications[0];
  const latestUnread = notifications.find((item) => !item.isRead) || notifications[0];

  return [
    {
      title: "当前身份",
      description: `${roleLabel(profile.roleType)} · ${verificationLabel(profile.verificationStatus)}`,
    },
    {
      title: "最近投稿",
      description: latestSubmission
        ? `${submissionTypeLabel(latestSubmission.submissionType)} · ${submissionStatusLabel(latestSubmission.status)}`
        : "还没有投稿记录。",
    },
    {
      title: "合作进展",
      description: latestApplication
        ? `${latestApplication.requestTitle} · ${applicationStatusLabel(latestApplication.status)}`
        : "还没有合作申请记录。",
    },
    {
      title: "通知状态",
      description: latestUnread
        ? `${latestUnread.isRead ? "最近一条已读" : "有新的未读通知"} · ${latestUnread.title}`
        : "当前没有通知。",
    },
  ];
}

function buildDerivedRecentActivities(
  submissions: CmsSubmissionSummary[],
  applications: CmsMatchApplicationSummary[],
  notifications: CmsNotificationSummary[],
) {
  const items: CmsUserDashboard["recentActivities"] = [];

  submissions.slice(0, 1).forEach((item) => {
    items.push({
      title: item.title,
      body: `${submissionTypeLabel(item.submissionType)} · 最近更新 ${formatDateLabel(item.updatedAt)}`,
      status: submissionStatusLabel(item.status),
    });
  });

  applications.slice(0, 1).forEach((item) => {
    items.push({
      title: item.requestTitle,
      body: `${item.city || "待确认城市"} · 最近更新 ${formatDateLabel(item.updatedAt)}`,
      status: applicationStatusLabel(item.status),
    });
  });

  notifications.slice(0, 2).forEach((item) => {
    items.push({
      title: item.title,
      body: item.body,
      status: item.isRead ? "已读" : "未读",
    });
  });

  return items.slice(0, 4);
}

function buildDerivedProfileFacts(profile: CmsUserProfile, userId: string) {
  return [
    { label: "昵称", value: profile.displayName || userId },
    { label: "身份", value: roleLabel(profile.roleType) },
    { label: "认证状态", value: verificationLabel(profile.verificationStatus) },
    { label: "所在城市", value: profile.city || "未设置" },
    { label: "所属机构", value: profile.companyName || "未设置" },
    { label: "联系方式策略", value: profile.contactPolicy || "apply_only" },
  ];
}

function mergeDashboard(
  currentUserId: string,
  fallback: CmsUserDashboard,
  profile: CmsUserProfile | null,
  submissions: CmsSubmissionSummary[],
  savedItems: CmsSavedItemSummary[],
  applications: CmsMatchApplicationSummary[],
  notifications: CmsNotificationSummary[],
): CmsUserDashboard {
  const pendingSubmissions = submissions.filter((item) =>
    ["pending_review", "under_review"].includes(item.status),
  ).length;
  const activeApplications = applications.filter((item) =>
    ["pending", "accepted", "connected"].includes(item.status),
  ).length;
  const unreadNotifications = notifications.filter((item) => !item.isRead).length;
  const resolvedProfile = profile || fallback.profile;
  const fallbackPendingSubmissions = fallback.submissions.filter((item) =>
    ["pending_review", "under_review"].includes(item.status),
  ).length;
  const fallbackActiveApplications = fallback.applications.filter((item) =>
    ["pending", "accepted", "connected"].includes(item.status),
  ).length;
  const fallbackUnreadNotifications = fallback.notifications.filter((item) => !item.isRead).length;
  const resolvedSubmissions = submissions.length ? submissions : fallback.submissions;
  const resolvedSavedItems = savedItems.length ? savedItems : fallback.savedItems;
  const resolvedApplications = applications.length ? applications : fallback.applications;
  const resolvedNotifications = notifications.length ? notifications : fallback.notifications;

  return {
    ...fallback,
    profile: resolvedProfile,
    submissions: resolvedSubmissions,
    savedItems: resolvedSavedItems,
    applications: resolvedApplications,
    notifications: resolvedNotifications,
    stats: [
      { label: "待审核投稿", value: String(submissions.length ? pendingSubmissions : fallbackPendingSubmissions).padStart(2, "0") },
      { label: "合作申请中", value: String(applications.length ? activeApplications : fallbackActiveApplications).padStart(2, "0") },
      { label: "待处理通知", value: String(notifications.length ? unreadNotifications : fallbackUnreadNotifications).padStart(2, "0") },
    ],
    overviewCards: buildDerivedOverviewCards(
      resolvedProfile,
      resolvedSubmissions,
      resolvedApplications,
      resolvedNotifications,
    ),
    recentActivities: buildDerivedRecentActivities(
      resolvedSubmissions,
      resolvedApplications,
      resolvedNotifications,
    ),
    profileFacts: buildDerivedProfileFacts(resolvedProfile, currentUserId),
    quickActions: [
      {
        title: "继续投稿",
        note: `当前累计 ${String(resolvedSubmissions.length).padStart(2, "0")} 条投稿记录，可继续补充内容。`,
      },
      {
        title: "跟进合作",
        note: `当前有 ${String(applications.length ? activeApplications : fallbackActiveApplications).padStart(2, "0")} 条合作申请仍在推进。`,
      },
      {
        title: "处理通知",
        note: (notifications.length ? unreadNotifications : fallbackUnreadNotifications) > 0
          ? `还有 ${notifications.length ? unreadNotifications : fallbackUnreadNotifications} 条未读通知待处理。`
          : "当前通知已处理完毕。",
      },
      {
        title: "完善资料",
        note: resolvedProfile.companyName || resolvedProfile.city ? "当前资料已建立基础信息，可继续补充展示内容。" : "建议补充机构与城市信息，方便后续合作匹配。",
      },
    ],
  };
}

export async function getCurrentUserDashboard(userId?: string): Promise<CmsUserDashboard> {
  const currentUserId = userId || resolveCurrentUserIdFallback();
  if (CMS_ENABLED) {
    try {
      const fallback = await getMockUserDashboard();

      const [profileRaw, submissionsRaw, savedRaw, applicationsRaw, notificationsRaw] =
        await Promise.all([
          getPrivateUserProfileByUserId(currentUserId),
          getPrivateSubmissionsByUserId(currentUserId),
          getPrivateSavedItemsByUserId(currentUserId),
          getPrivateApplicationsByUserId(currentUserId),
          getPrivateNotificationsByUserId(currentUserId),
        ]);

      const profile = profileRaw ? normalizeProfile(profileRaw, fallback.profile) : null;
      const submissions = normalizeSubmissions(submissionsRaw as unknown[]);
      const savedItems = normalizeSavedItems(savedRaw as unknown[]);
      const applications = normalizeApplications(applicationsRaw as unknown[]);
      const notifications = normalizeNotifications(notificationsRaw as unknown[]);

      return mergeDashboard(
        currentUserId,
        fallback,
        profile,
        submissions,
        savedItems,
        applications,
        notifications,
      );
    } catch {
      return getMockUserDashboard();
    }
  }

  return getMockUserDashboard();
}
