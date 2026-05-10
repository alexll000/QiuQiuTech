import { NextResponse } from "next/server";
import { saveRequestDraft } from "@/lib/action-service";
import type { RequestDraftPayload } from "@/lib/cms-types";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function POST(request: Request) {
  const payload = (await request.json()) as RequestDraftPayload;
  const userId = resolveCurrentUserIdFromRequest(request);
  const result = await saveRequestDraft(payload, userId);
  return NextResponse.json(result);
}
