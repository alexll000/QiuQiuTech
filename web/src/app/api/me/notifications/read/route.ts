import { NextResponse } from "next/server";
import { markNotificationRead } from "@/lib/action-service";

export async function POST() {
  const result = await markNotificationRead();
  return NextResponse.json(result);
}
