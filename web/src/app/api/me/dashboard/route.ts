import { NextResponse } from "next/server";
import { getCurrentUserDashboard } from "@/lib/account-service";

export async function GET() {
  const data = await getCurrentUserDashboard();
  return NextResponse.json(data);
}
