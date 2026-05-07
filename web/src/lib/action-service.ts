import type {
  ActionResult,
  RequestApplicationPayload,
  SaveDraftPayload,
} from "@/lib/cms-types";
import {
  mockApplyToRequest,
  mockMarkNotificationRead,
  mockSaveSubmissionDraft,
  mockToggleSavedItem,
} from "@/lib/mock-action-service";

export async function toggleSavedItem(): Promise<ActionResult> {
  return mockToggleSavedItem();
}

export async function markNotificationRead(): Promise<ActionResult> {
  return mockMarkNotificationRead();
}

export async function saveSubmissionDraft(
  payload: SaveDraftPayload,
): Promise<ActionResult & { draftId: string }> {
  return mockSaveSubmissionDraft(payload);
}

export async function applyToRequest(
  payload: RequestApplicationPayload,
): Promise<ActionResult & { applicationId: string }> {
  return mockApplyToRequest(payload);
}
