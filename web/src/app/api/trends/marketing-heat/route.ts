import { NextRequest, NextResponse } from "next/server";
import { getMarketingHeatTrend } from "@/lib/marketing-heat-trend";

export async function GET(request: NextRequest) {
  const window = request.nextUrl.searchParams.get("window") || "24h";
  const normalized = window === "7d" || window === "30d" ? window : "24h";

  try {
    const payload = await getMarketingHeatTrend({ window: normalized });
    return NextResponse.json({ success: true, ...payload });
  } catch (error) {
    console.error("[marketing-heat] failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

