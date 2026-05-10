import { NextResponse } from "next/server";
import { applyToRequest } from "@/lib/action-service";
import type { RequestApplicationPayload } from "@/lib/cms-types";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const userId = resolveCurrentUserIdFromRequest(request);
  const payload = (await request.json()) as Omit<RequestApplicationPayload, "requestSlug">;
  const result = await applyToRequest({
    requestSlug: slug,
    ...payload,
  }, userId);
  return NextResponse.json(result);
}
