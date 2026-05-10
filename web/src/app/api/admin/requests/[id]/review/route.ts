import { NextResponse } from "next/server";
import { reviewRequestById, type AdminReviewAction } from "@/lib/admin-review-service";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

interface ReviewRoutePayload {
  action: AdminReviewAction;
  note?: string;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as ReviewRoutePayload;
    const result = await reviewRequestById({
      id,
      action: payload.action,
      note: payload.note,
      reviewerId: resolveCurrentUserIdFromRequest(request),
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, message: "请求参数无效。", fallback: false },
      { status: 400 },
    );
  }
}
