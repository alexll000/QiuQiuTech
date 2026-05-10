const CMS_BASE_URL =
  process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";
const DIRECTUS_FETCH_TIMEOUT_MS = 6000;

type DirectusLoginResponse = {
  data?: { access_token?: string } & Record<string, unknown>;
  access_token?: string;
};

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

function nowMs() {
  return Date.now();
}

function getEnv(name: string) {
  return process.env[name] || "";
}

async function fetchAccessTokenFromLogin(): Promise<string> {
  const email = getEnv("DIRECTUS_ADMIN_EMAIL");
  const password = getEnv("DIRECTUS_ADMIN_PASSWORD");

  if (!email || !password) {
    throw new Error(
      "Missing DIRECTUS_ADMIN_EMAIL/DIRECTUS_ADMIN_PASSWORD (or set DIRECTUS_STATIC_TOKEN).",
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DIRECTUS_FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${CMS_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    throw new Error(
      isTimeout
        ? `Directus login timeout after ${DIRECTUS_FETCH_TIMEOUT_MS}ms`
        : "Directus login request failed",
    );
  } finally {
    clearTimeout(timeout);
  }

  const json = (await res.json()) as DirectusLoginResponse;

  if (!res.ok) {
    throw new Error(
      `Directus login failed: ${res.status} ${res.statusText} ${JSON.stringify(
        json,
      )}`,
    );
  }

  const token = json?.data?.access_token || json?.access_token;
  if (!token) {
    throw new Error(`Directus login response missing access token: ${JSON.stringify(json)}`);
  }

  // Directus token TTL 在不同部署可能返回不同字段，这里用保守值缓存。
  const expiresAt = nowMs() + 55 * 60 * 1000;
  cachedAccessToken = { token, expiresAt };
  return token;
}

async function getAccessToken(): Promise<string> {
  const staticToken = getEnv("DIRECTUS_STATIC_TOKEN");
  if (staticToken) return staticToken;

  if (cachedAccessToken && cachedAccessToken.expiresAt > nowMs() + 30_000) {
    return cachedAccessToken.token;
  }

  return fetchAccessTokenFromLogin();
}

export async function directusAuthedFetchJSON<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
  const token = await getAccessToken();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DIRECTUS_FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${CMS_BASE_URL}${path}`, {
      ...init,
      headers: {
        ...(init.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });
  } catch (error) {
    const isTimeout = error instanceof Error && error.name === "AbortError";
    throw new Error(
      isTimeout
        ? `Directus request timeout after ${DIRECTUS_FETCH_TIMEOUT_MS}ms: ${path}`
        : `Directus request failed: ${path}`,
    );
  } finally {
    clearTimeout(timeout);
  }

  const text = await res.text();
  const json = text ? (JSON.parse(text) as T) : ({} as T);

  if (!res.ok) {
    throw new Error(
      `Directus request failed: ${res.status} ${res.statusText} ${text}`,
    );
  }

  return json;
}

export { CMS_BASE_URL };
