import { NextResponse } from "next/server";
import { listReviewQueue, type ReviewQueueStatusFilter } from "@/lib/admin-review-service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get("status") || "all";
  const allowed: ReviewQueueStatusFilter[] = [
    "all",
    "draft",
    "pending_review",
    "under_review",
    "approved",
    "rejected",
    "published",
    "closed",
    "archived",
  ];
  const status = allowed.includes(rawStatus as ReviewQueueStatusFilter)
    ? (rawStatus as ReviewQueueStatusFilter)
    : "all";
  const result = await listReviewQueue("request", { status });
  return NextResponse.json(result);
}
