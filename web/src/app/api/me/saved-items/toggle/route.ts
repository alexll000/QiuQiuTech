import { NextResponse } from "next/server";
import { toggleSavedItem } from "@/lib/action-service";
import type { ToggleSavedItemPayload } from "@/lib/cms-types";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function POST(request: Request) {
  const payload = (await request.json()) as ToggleSavedItemPayload;
  const userId = resolveCurrentUserIdFromRequest(request);
  const result = await toggleSavedItem(payload, userId);
  return NextResponse.json(result);
}
