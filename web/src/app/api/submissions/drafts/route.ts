import { NextResponse } from "next/server";
import { saveSubmissionDraft } from "@/lib/action-service";
import type { SaveDraftPayload } from "@/lib/cms-types";

export async function POST(request: Request) {
  const payload = (await request.json()) as SaveDraftPayload;
  const result = await saveSubmissionDraft(payload);
  return NextResponse.json(result);
}
