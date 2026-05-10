import { NextResponse } from "next/server";
import { saveSubmissionDraft } from "@/lib/action-service";
import type { SaveDraftPayload } from "@/lib/cms-types";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveDraftPayload;
  const userId = resolveCurrentUserIdFromRequest(request);
  const result = await saveSubmissionDraft(payload, userId);
  return NextResponse.json(result);
}
