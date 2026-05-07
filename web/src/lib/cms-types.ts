export type ContentType =
  | "case"
  | "trend"
  | "brand_news"
  | "report"
  | "feature";

export type EventType =
  | "campaign"
  | "collab"
  | "seasonal"
  | "launch"
  | "popup"
  | "social_hot";

export type PlaybookType =
  | "strategy"
  | "channel"
  | "content_format"
  | "topic_mechanism"
  | "ip_collab"
  | "growth_creative";

export type TopicType =
  | "festival"
  | "quarterly"
  | "annual"
  | "industry"
  | "brand";

export type RequestType =
  | "brand_to_marketer"
  | "brand_to_brand"
  | "marketer_to_partner"
  | "agency_collab"
  | "platform_match";

export type PublishStatus =
  | "draft"
  | "pending_review"
  | "under_review"
  | "approved"
  | "rejected"
  | "published"
  | "closed"
  | "archived";

export type UserRoleType =
  | "brand"
  | "marketer"
  | "agency"
  | "independent";

export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export type SubmissionType = "case" | "event" | "playbook";

export type MatchApplicationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "connected"
  | "closed";

export interface CmsImage {
  id: string | number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface CmsTag {
  id: string | number;
  name: string;
  slug: string;
}

export interface CmsIndustry {
  id: string | number;
  name: string;
  slug: string;
}

export interface CmsTopicSummary {
  id: string | number;
  title: string;
  slug: string;
  intro?: string;
  topicType?: TopicType;
  coverImage?: CmsImage | null;
}

export interface CmsContentSummary {
  id: string | number;
  title: string;
  slug: string;
  summary: string;
  contentType: ContentType;
  sourceName?: string;
  brandName?: string;
  publishedAt?: string;
  coverImage?: CmsImage | null;
  industry?: CmsIndustry | null;
  tags?: CmsTag[];
}

export interface CmsContentDetail extends CmsContentSummary {
  body?: string;
  sourceUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  topics?: CmsTopicSummary[];
}

export interface CmsRequestSummary {
  id: string | number;
  title: string;
  slug: string;
  requestType: RequestType;
  summary: string;
  city?: string;
  budgetRange?: string;
  contactPolicy?: "public" | "apply_only" | "platform_match";
  publishedAt?: string;
  industry?: CmsIndustry | null;
  tags?: CmsTag[];
}

export interface CmsUserProfile {
  id: string | number;
  displayName: string;
  roleType: UserRoleType;
  bio?: string;
  city?: string;
  companyName?: string;
  verificationStatus?: VerificationStatus;
  contactPolicy?: "public" | "apply_only" | "platform_match";
  avatar?: CmsImage | null;
}

export interface CmsSubmissionSummary {
  id: string | number;
  title: string;
  submissionType: SubmissionType;
  status: PublishStatus;
  updatedAt?: string;
  reviewNote?: string;
}

export interface CmsSavedItemSummary {
  id: string | number;
  targetType: "content" | "topic" | "request";
  title: string;
  href: string;
  savedAt?: string;
}

export interface CmsMatchApplicationSummary {
  id: string | number;
  requestTitle: string;
  status: MatchApplicationStatus;
  updatedAt?: string;
  city?: string;
}

export interface CmsNotificationSummary {
  id: string | number;
  title: string;
  body: string;
  isRead: boolean;
  createdAt?: string;
}

export interface CmsUserDashboard {
  profile: CmsUserProfile;
  stats: Array<{ label: string; value: string }>;
  quickSections: string[];
  overviewCards: Array<{ title: string; description: string }>;
  recentActivities: Array<{ title: string; body: string; status: string }>;
  quickActions: Array<{ title: string; note: string }>;
  profileFacts: Array<{ label: string; value: string }>;
  submissions: CmsSubmissionSummary[];
  savedItems: CmsSavedItemSummary[];
  applications: CmsMatchApplicationSummary[];
  notifications: CmsNotificationSummary[];
}

export interface CmsFieldBlueprint {
  label: string;
  value: string;
  required?: boolean;
  highlighted?: boolean;
}

export interface CmsSubmissionBlueprint {
  title: string;
  description: string;
  icon: "doc" | "horn" | "puzzle";
}

export interface CmsSubmissionCenterData {
  submissionTypes: CmsSubmissionBlueprint[];
  formFields: CmsFieldBlueprint[];
  workflowSteps: Array<{ step: string; title: string; note: string }>;
  benefits: Array<{ title: string; note: string }>;
  statusNotes: Array<{ title: string; note: string }>;
}

export interface CmsRequestApplicationGuide {
  steps: Array<{ title: string; note: string }>;
  safeguards: Array<{ title: string; note: string }>;
}

export interface ActionResult {
  ok: boolean;
  message: string;
}

export interface SaveDraftPayload {
  submissionType: SubmissionType;
  title: string;
  summary?: string;
  tags?: string[];
  sourceUrl?: string;
}

export interface RequestApplicationPayload {
  requestSlug: string;
  intro: string;
  portfolioUrl?: string;
  contactPreference?: "public" | "apply_only" | "platform_match";
}

export interface CmsHomepagePayload {
  heroSpotlight?: {
    label?: string;
    partners?: string[];
    title?: string;
    tags?: string[];
    statValue?: string;
    statNote?: string;
    slides?: string;
  } | null;
  selectedCaseCards?: Array<{
    title: string;
    tag: string;
    summary: string;
    byline: string;
    href: string;
    palette: string;
  }>;
  realtimeTrendSeries?: Array<{
    label: string;
    color: string;
    values: number[];
  }>;
  realtimeEventsFeed?: Array<{
    rank: string;
    brand: string;
    title: string;
    meta: string;
    lift: string;
    accent: string;
  }>;
  latestEvents?: Array<{
    title: string;
    meta: string;
  }>;
  topicCards?: Array<{
    title: string;
    description: string;
    meta: string;
  }>;
  requestCards?: Array<{
    title: string;
    type: string;
    detail: string;
  }>;
  playbookTags?: string[];
  trendKeywords?: string[];
  submissionShowcase?: Array<{
    title: string;
    meta: string;
  }>;
  valueHighlights?: Array<[string, string]>;
}
