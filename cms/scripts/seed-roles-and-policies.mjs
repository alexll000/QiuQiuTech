#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

async function loadEnvFile(envPath) {
  const text = await fs.readFile(envPath, "utf8");
  return Object.fromEntries(
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return index < 0 ? null : [line.slice(0, index), line.slice(index + 1)];
      })
      .filter(Boolean),
  );
}

async function getToken(baseUrl, envVars) {
  const staticToken = envVars.ADMIN_TOKEN || process.env.ADMIN_TOKEN || "";
  if (staticToken) return staticToken;

  const email = envVars.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";
  const password = envVars.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || "";
  if (!email || !password) {
    throw new Error("Missing ADMIN_TOKEN or ADMIN_EMAIL/ADMIN_PASSWORD");
  }

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json().catch(() => ({}));
  const token = json?.data?.access_token || json?.access_token;
  if (!response.ok || !token) {
    throw new Error(`Directus login failed: ${response.status} ${JSON.stringify(json)}`);
  }
  return token;
}

async function directusFetch(baseUrl, token, pathname, init = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Directus request failed ${pathname}: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

async function ensureRole(baseUrl, token, role) {
  const existing = await directusFetch(
    baseUrl,
    token,
    `/roles?filter[name][_eq]=${encodeURIComponent(role.name)}&fields=id,name,policies`,
  );
  const current = existing?.data?.[0];
  if (current?.id) {
    return current.id;
  }

  const created = await directusFetch(baseUrl, token, "/roles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: role.name,
      icon: role.icon,
      description: role.description,
    }),
  });
  return created?.data?.id;
}

async function ensurePolicy(baseUrl, token, policy) {
  const existing = await directusFetch(
    baseUrl,
    token,
    `/policies?filter[name][_eq]=${encodeURIComponent(policy.name)}&fields=id,name`,
  );
  const current = existing?.data?.[0];
  if (current?.id) {
    return current.id;
  }

  const created = await directusFetch(baseUrl, token, "/policies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: policy.name,
      icon: policy.icon,
      description: policy.description,
      admin_access: policy.admin_access,
      app_access: policy.app_access,
    }),
  });
  return created?.data?.id;
}

async function ensureAccess(baseUrl, token, roleId, policyId, sort) {
  const existing = await directusFetch(
    baseUrl,
    token,
    `/access?filter[role][_eq]=${encodeURIComponent(roleId)}&filter[policy][_eq]=${encodeURIComponent(
      policyId,
    )}&fields=id,role,policy`,
  );
  const current = existing?.data?.[0];
  if (current?.id) {
    return current.id;
  }

  const created = await directusFetch(baseUrl, token, "/access", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: roleId,
      policy: policyId,
      sort,
    }),
  });
  return created?.data?.id;
}

async function main() {
  const cmsDir = path.resolve(process.cwd(), "cms");
  const envPath = getArg("--env", path.join(cmsDir, ".env"));
  const envVars = await loadEnvFile(envPath);
  const baseUrl =
    getArg("--baseUrl", "") ||
    envVars.PUBLIC_URL ||
    process.env.PUBLIC_URL ||
    "http://127.0.0.1:8055";
  const token = await getToken(baseUrl, envVars);

  const defs = [
    {
      role: {
        name: "Member",
        icon: "person",
        description: "普通注册用户。可收藏、投稿、发布合作需求与申请联系。",
      },
      policy: {
        name: "Member App Access",
        icon: "person",
        description: "允许普通注册用户登录并使用前台账户能力。",
        admin_access: false,
        app_access: true,
      },
    },
    {
      role: {
        name: "Verified Member",
        icon: "verified_user",
        description: "已认证用户。用于承载更高可信度与后续认证标识。",
      },
      policy: {
        name: "Verified Member App Access",
        icon: "verified_user",
        description: "允许认证用户登录并承载后续认证能力。",
        admin_access: false,
        app_access: true,
      },
    },
    {
      role: {
        name: "Operator",
        icon: "support_agent",
        description: "运营与审核人员。用于审核、内容维护、专题与展示位运营。",
      },
      policy: {
        name: "Operator App Access",
        icon: "support_agent",
        description: "允许运营人员登录后台应用，后续叠加更细权限。",
        admin_access: false,
        app_access: true,
      },
    },
  ];

  const results = [];
  for (let i = 0; i < defs.length; i += 1) {
    const item = defs[i];
    const roleId = await ensureRole(baseUrl, token, item.role);
    const policyId = await ensurePolicy(baseUrl, token, item.policy);
    const accessId = await ensureAccess(baseUrl, token, roleId, policyId, i + 10);
    results.push({
      role: item.role.name,
      roleId,
      policy: item.policy.name,
      policyId,
      accessId,
    });
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        baseUrl,
        results,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("[seed-roles-and-policies] failed:", error.message);
  process.exit(1);
});
