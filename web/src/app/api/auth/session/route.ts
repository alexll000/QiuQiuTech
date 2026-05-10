import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { directusAuthedFetchJSON } from "@/lib/directus-auth";

type SessionPayload = {
  userId?: string;
  displayName?: string;
  phone?: string;
  companyName?: string;
  city?: string;
  roleType?: "brand" | "marketer" | "agency" | "independent";
  authSource?: "password" | "code" | "wechat" | "register";
};

const CMS_ENABLED = process.env.NEXT_PUBLIC_USE_DIRECTUS === "true";

function sanitizeUserId(input: unknown): string {
  if (typeof input !== "string") return "me";
  const v = input.trim().slice(0, 64);
  return v || "me";
}

function sanitizeText(input: unknown, maxLength: number): string | undefined {
  if (typeof input !== "string") return undefined;
  const value = input.trim().slice(0, maxLength);
  return value || undefined;
}

async function syncUserProfile(userId: string, payload: SessionPayload) {
  if (!CMS_ENABLED) return;

  const displayName =
    sanitizeText(payload.displayName, 128) || sanitizeText(payload.userId, 128) || userId;
  const profileBody = {
    user_id: userId,
    display_name: displayName,
    role_type: payload.roleType || "marketer",
    company_name: sanitizeText(payload.companyName, 255) || null,
    city: sanitizeText(payload.city, 128) || null,
    phone: sanitizeText(payload.phone, 32) || null,
    auth_source: payload.authSource || null,
    contact_policy: "apply_only",
  };

  const existing = await directusAuthedFetchJSON<{
    data?: Array<{ id?: string | number }>;
  }>(
    `/items/user_profiles?filter[user_id][_eq]=${encodeURIComponent(userId)}&limit=1`,
    { method: "GET" },
  );

  const existingId = existing.data?.[0]?.id;
  if (existingId !== undefined) {
    await directusAuthedFetchJSON(`/items/user_profiles/${existingId}`, {
      method: "PATCH",
      body: JSON.stringify(profileBody),
    });
    return;
  }

  await directusAuthedFetchJSON(`/items/user_profiles`, {
    method: "POST",
    body: JSON.stringify({
      ...profileBody,
      verification_status: "unverified",
    }),
  });
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as SessionPayload;
  const userId = sanitizeUserId(payload.userId);

  try {
    await syncUserProfile(userId, payload);
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        userId,
        message: error instanceof Error ? error.message : "登录态写入成功，但资料同步失败。",
      },
      { status: 500 },
    );
  }

  const response = NextResponse.json({
    ok: true,
    userId,
    message: "登录态已更新。",
  });

  response.cookies.set("qqt_uid", encodeURIComponent(userId), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function GET() {
  const cookieStore = await cookies();
  const rawUserId = cookieStore.get("qqt_uid")?.value || cookieStore.get("qiuqiutech_uid")?.value || "";
  const userId = sanitizeUserId(rawUserId);
  const isLoggedIn = Boolean(rawUserId);

  return NextResponse.json({
    ok: true,
    isLoggedIn,
    userId: isLoggedIn ? userId : "",
    message: isLoggedIn ? "已检测到当前会话。" : "当前没有活跃会话。",
  });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, message: "已退出登录。" });
  response.cookies.set("qqt_uid", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });
  return response;
}
