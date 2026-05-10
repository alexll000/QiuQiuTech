const DEFAULT_USER_ID = process.env.QIUQIUTECH_CURRENT_USER_ID || "me";
const USER_COOKIE_KEYS = ["qqt_uid", "qiuqiutech_uid"];

function pickCookieUserId(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  for (const pair of cookieHeader.split(";")) {
    const [rawKey, ...rawValue] = pair.trim().split("=");
    const key = rawKey?.trim();
    if (!key || !USER_COOKIE_KEYS.includes(key)) continue;
    const value = decodeURIComponent(rawValue.join("=").trim());
    if (value) return value;
  }

  return null;
}

export function resolveCurrentUserIdFromRequest(request: Request): string {
  const cookieHeader = request.headers.get("cookie");
  const cookieUserId = pickCookieUserId(cookieHeader);
  return cookieUserId || DEFAULT_USER_ID;
}

export function resolveCurrentUserIdFallback(): string {
  return DEFAULT_USER_ID;
}

