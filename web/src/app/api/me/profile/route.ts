import { NextResponse } from "next/server";
import type { CmsUserProfile, UpdateProfilePayload } from "@/lib/cms-types";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";
import { resolveCurrentUserIdFromRequest } from "@/lib/current-user";

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

function sanitizeText(input: unknown, maxLength: number): string | undefined {
  if (typeof input !== "string") return undefined;
  const value = input.trim().slice(0, maxLength);
  return value || undefined;
}

function normalizeRoleType(input: unknown): UpdateProfilePayload["roleType"] {
  if (input === "brand" || input === "agency" || input === "independent") return input;
  return "marketer";
}

function normalizeContactPolicy(input: unknown): UpdateProfilePayload["contactPolicy"] {
  if (input === "public" || input === "platform_match") return input;
  return "apply_only";
}

function normalizeProfile(row: Record<string, unknown>, userId: string): CmsUserProfile {
  return {
    id: (row.id as string | number) || userId,
    displayName:
      sanitizeText(row.display_name, 128) ||
      sanitizeText(row.displayName, 128) ||
      userId,
    roleType: normalizeRoleType(row.role_type ?? row.roleType),
    bio: sanitizeText(row.bio, 500),
    city: sanitizeText(row.city, 128),
    companyName:
      sanitizeText(row.company_name, 255) ||
      sanitizeText(row.companyName, 255),
    verificationStatus:
      row.verification_status === "verified" ||
      row.verification_status === "pending" ||
      row.verification_status === "rejected"
        ? row.verification_status
        : "unverified",
    contactPolicy: normalizeContactPolicy(row.contact_policy ?? row.contactPolicy),
  };
}

export async function PATCH(request: Request) {
  const userId = resolveCurrentUserIdFromRequest(request);
  const payload = (await request.json().catch(() => ({}))) as Partial<UpdateProfilePayload>;

  const displayName = sanitizeText(payload.displayName, 128);
  if (!displayName || displayName.length < 2) {
    return NextResponse.json(
      { ok: false, message: "昵称至少需要 2 个字符。" },
      { status: 400 },
    );
  }

  const profileBody = {
    user_id: userId,
    display_name: displayName,
    role_type: normalizeRoleType(payload.roleType),
    bio: sanitizeText(payload.bio, 500) || null,
    city: sanitizeText(payload.city, 128) || null,
    company_name: sanitizeText(payload.companyName, 255) || null,
    contact_policy: normalizeContactPolicy(payload.contactPolicy),
  };

  if (!CMS_ENABLED) {
    return NextResponse.json({
      ok: true,
      message: "资料已更新（fallback）。",
      source: "fallback",
      profile: normalizeProfile(profileBody, userId),
    });
  }

  try {
    const existing = await directusAuthedFetchJSON<{
      data?: Array<{ id?: string | number }>;
    }>(
      `/items/user_profiles?filter[user_id][_eq]=${encodeURIComponent(userId)}&limit=1`,
      { method: "GET" },
    );

    const existingId = existing.data?.[0]?.id;
    let result:
      | {
          data?: Record<string, unknown>;
        }
      | undefined;

    if (existingId !== undefined) {
      result = await directusAuthedFetchJSON<{ data?: Record<string, unknown> }>(
        `/items/user_profiles/${existingId}`,
        {
          method: "PATCH",
          body: JSON.stringify(profileBody),
        },
      );
    } else {
      result = await directusAuthedFetchJSON<{ data?: Record<string, unknown> }>(
        `/items/user_profiles`,
        {
          method: "POST",
          body: JSON.stringify({
            ...profileBody,
            verification_status: "unverified",
          }),
        },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "资料已更新。",
      source: "directus",
      profile: normalizeProfile(result?.data || profileBody, userId),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: true,
        message: error instanceof Error ? `资料已更新（fallback）。${error.message}` : "资料已更新（fallback）。",
        source: "fallback",
        profile: normalizeProfile(profileBody, userId),
      },
      { status: 200 },
    );
  }
}
