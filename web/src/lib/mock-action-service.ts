import type {
  ActionResult,
  RequestApplicationPayload,
  SaveDraftPayload,
} from "@/lib/cms-types";

export async function mockToggleSavedItem(): Promise<ActionResult> {
  return {
    ok: true,
    message: "收藏状态已更新。",
  };
}

export async function mockMarkNotificationRead(): Promise<ActionResult> {
  return {
    ok: true,
    message: "通知已标记为已读。",
  };
}

export async function mockSaveSubmissionDraft(
  payload: SaveDraftPayload,
): Promise<ActionResult & { draftId: string }> {
  return {
    ok: true,
    message: `已保存《${payload.title || "未命名内容"}》草稿。`,
    draftId: "draft-mock-001",
  };
}

export async function mockApplyToRequest(
  payload: RequestApplicationPayload,
): Promise<ActionResult & { applicationId: string }> {
  return {
    ok: true,
    message: `已向 ${payload.requestSlug} 提交合作申请。`,
    applicationId: "application-mock-001",
  };
}
