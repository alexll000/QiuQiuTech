import { NextResponse } from "next/server";
import { getCurrentUserDashboard } from "@/lib/account-service";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function GET(request: Request) {
  const userId = resolveCurrentUserIdFromRequest(request);
  const data = await getCurrentUserDashboard(userId);
  return NextResponse.json(data);
}
