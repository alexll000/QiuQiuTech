import type {
  CmsMatchApplicationSummary,
  CmsNotificationSummary,
  CmsSavedItemSummary,
  CmsSubmissionSummary,
  CmsUserDashboard,
  CmsUserProfile,
} from "@/lib/cms-types";
import {
  meOverviewStats,
  meProfileFacts,
  meQuickActions,
  meRecentActivities,
} from "@/lib/form-blueprints";
import { meOverviewCards, userCenterSections } from "@/lib/site-data";

const mockProfile: CmsUserProfile = {
  id: "me",
  displayName: "QiuQiuTech Creator",
  roleType: "marketer",
  bio: "关注品牌内容、节点营销、平台玩法与合作撮合的营销从业者。",
  city: "上海",
  companyName: "QiuQiuTech Studio",
  verificationStatus: "verified",
  contactPolicy: "apply_only",
};

const mockSubmissions: CmsSubmissionSummary[] = [
  {
    id: "submission-1",
    title: "社媒热点如何被重组为节日营销内容",
    submissionType: "playbook",
    status: "under_review",
    updatedAt: "2026-05-07",
  },
  {
    id: "submission-2",
    title: "线下快闪活动的完整传播链路拆解",
    submissionType: "case",
    status: "published",
    updatedAt: "2026-05-05",
  },
  {
    id: "submission-3",
    title: "品牌联名节点传播观察",
    submissionType: "event",
    status: "rejected",
    updatedAt: "2026-05-03",
    reviewNote: "需要补充头图与结果数据。",
  },
];

const mockSavedItems: CmsSavedItemSummary[] = [
  {
    id: "saved-1",
    targetType: "content",
    title: "麦当劳爆改“牡丹楼”式的在地化话题案例",
    href: "/contents/mcdonalds-peony-building-campaign",
    savedAt: "2026-05-06",
  },
  {
    id: "saved-2",
    targetType: "topic",
    title: "节点营销专题",
    href: "/topics/festival-marketing-topic",
    savedAt: "2026-05-05",
  },
];

const mockApplications: CmsMatchApplicationSummary[] = [
  {
    id: "application-1",
    requestTitle: "消费品牌寻线下联名快闪共创团队",
    status: "pending",
    city: "上海",
    updatedAt: "2026-05-07",
  },
  {
    id: "application-2",
    requestTitle: "新消费品牌寻找节日营销联名品牌方",
    status: "connected",
    city: "杭州",
    updatedAt: "2026-05-04",
  },
];

const mockNotifications: CmsNotificationSummary[] = [
  {
    id: "notification-1",
    title: "投稿已进入审核",
    body: "《社媒热点如何被重组为节日营销内容》已进入审核队列。",
    isRead: false,
    createdAt: "2026-05-07",
  },
  {
    id: "notification-2",
    title: "合作申请有新反馈",
    body: "消费品牌寻线下联名快闪共创团队 已查看你的合作申请。",
    isRead: false,
    createdAt: "2026-05-06",
  },
  {
    id: "notification-3",
    title: "专题推荐更新",
    body: "节点营销专题新增 6 条可参考内容。",
    isRead: true,
    createdAt: "2026-05-05",
  },
];

export async function getMockUserDashboard(): Promise<CmsUserDashboard> {
  return {
    profile: mockProfile,
    stats: meOverviewStats.map(([label, value]) => ({ label, value })),
    quickSections: userCenterSections,
    overviewCards: meOverviewCards.map(([title, description]) => ({ title, description })),
    recentActivities: meRecentActivities.map(([title, body, status]) => ({ title, body, status })),
    quickActions: meQuickActions.map(([title, note]) => ({ title, note })),
    profileFacts: meProfileFacts,
    submissions: mockSubmissions,
    savedItems: mockSavedItems,
    applications: mockApplications,
    notifications: mockNotifications,
  };
}
