import type {
  ActionResult,
  RequestApplicationPayload,
  RequestDraftPayload,
  SaveDraftPayload,
  ToggleSavedItemPayload,
} from "@/lib/cms-types";

export async function mockToggleSavedItem(
  payload?: ToggleSavedItemPayload,
): Promise<ActionResult> {
  void payload;
  return {
    ok: true,
    message: "收藏状态已更新。",
    source: "fallback",
  };
}

export async function mockMarkNotificationRead(): Promise<ActionResult> {
  return {
    ok: true,
    message: "通知已标记为已读。",
    source: "fallback",
  };
}

export async function mockSaveSubmissionDraft(
  payload: SaveDraftPayload,
): Promise<ActionResult & { draftId: string }> {
  return {
    ok: true,
    message: `已保存《${payload.title || "未命名内容"}》草稿。`,
    draftId: "draft-mock-001",
    source: "fallback",
  };
}

export async function mockApplyToRequest(
  payload: RequestApplicationPayload,
): Promise<ActionResult & { applicationId: string }> {
  return {
    ok: true,
    message: `已向 ${payload.requestSlug} 提交合作申请。`,
    applicationId: "application-mock-001",
    source: "fallback",
  };
}

export async function mockSaveRequestDraft(
  payload: RequestDraftPayload,
): Promise<ActionResult & { draftId: string }> {
  return {
    ok: true,
    message: `已保存合作需求草稿《${payload.title || "未命名需求"}》。`,
    draftId: "request-draft-mock-001",
    source: "fallback",
  };
}
