import { NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/action-service";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function POST(request: Request) {
  const userId = resolveCurrentUserIdFromRequest(request);
  const result = await markNotificationRead(userId);
  return NextResponse.json(result);
}
