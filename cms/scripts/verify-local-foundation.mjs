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

async function directusFetch(baseUrl, token, pathname) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Directus request failed ${pathname}: ${response.status} ${JSON.stringify(json)}`);
  }
  return json;
}

function summarizeCheck(label, ok, actual, expected) {
  return { label, ok, actual, expected };
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

  const settingsRes = await directusFetch(baseUrl, token, "/settings");
  const usersRes = await directusFetch(baseUrl, token, "/users?filter[email][_eq]=admin@qiuqiutech.com&fields=email,language");
  const rolesRes = await directusFetch(baseUrl, token, "/roles?fields=id,name");
  const policiesRes = await directusFetch(baseUrl, token, "/policies?fields=id,name,app_access,admin_access");
  const accessRes = await directusFetch(baseUrl, token, "/access?fields=id,role,policy");

  const settings = settingsRes?.data ?? {};
  const adminUser = usersRes?.data?.[0] ?? null;
  const roles = rolesRes?.data ?? [];
  const policies = policiesRes?.data ?? [];
  const access = accessRes?.data ?? [];
  const fileIds = [settings.project_logo, settings.public_favicon].filter(Boolean);
  const filesRes = fileIds.length
    ? await directusFetch(
        baseUrl,
        token,
        `/files?filter[id][_in]=${encodeURIComponent(fileIds.join(","))}&fields=id,filename_download`,
      )
    : { data: [] };
  const fileMap = new Map((filesRes?.data ?? []).map((item) => [item.id, item.filename_download]));

  const requiredRoles = ["Member", "Verified Member", "Operator"];
  const requiredPolicies = [
    "Member App Access",
    "Verified Member App Access",
    "Operator App Access",
  ];

  const roleMap = new Map(roles.map((item) => [item.name, item.id]));
  const policyMap = new Map(policies.map((item) => [item.name, item]));

  const checks = [
    summarizeCheck("project_name", settings.project_name === "QiuQiuTech", settings.project_name, "QiuQiuTech"),
    summarizeCheck(
      "project_descriptor",
      settings.project_descriptor === "球球科技后台管理系统",
      settings.project_descriptor,
      "球球科技后台管理系统",
    ),
    summarizeCheck("default_language", settings.default_language === "zh-CN", settings.default_language, "zh-CN"),
    summarizeCheck(
      "project_logo",
      fileMap.get(settings.project_logo) === "qiuqiutech-admin-logo.png",
      fileMap.get(settings.project_logo) || settings.project_logo || null,
      "qiuqiutech-admin-logo.png",
    ),
    summarizeCheck(
      "public_favicon",
      fileMap.get(settings.public_favicon) === "qiuqiutech-bird-mark.png",
      fileMap.get(settings.public_favicon) || settings.public_favicon || null,
      "qiuqiutech-bird-mark.png",
    ),
    summarizeCheck(
      "admin_language",
      adminUser?.language === "zh-CN",
      adminUser?.language || null,
      "zh-CN",
    ),
  ];

  for (const roleName of requiredRoles) {
    checks.push(summarizeCheck(`role:${roleName}`, roleMap.has(roleName), roleMap.get(roleName) || null, "exists"));
  }

  for (const policyName of requiredPolicies) {
    const policy = policyMap.get(policyName);
    checks.push(summarizeCheck(`policy:${policyName}`, Boolean(policy), policy?.id || null, "exists"));
    if (policy) {
      checks.push(summarizeCheck(`policy:${policyName}:app_access`, policy.app_access === true, policy.app_access, true));
    }
  }

  const requiredAccessPairs = [
    ["Member", "Member App Access"],
    ["Verified Member", "Verified Member App Access"],
    ["Operator", "Operator App Access"],
  ];

  for (const [roleName, policyName] of requiredAccessPairs) {
    const roleId = roleMap.get(roleName);
    const policyId = policyMap.get(policyName)?.id;
    const hasAccess = access.some((item) => item.role === roleId && item.policy === policyId);
    checks.push(
      summarizeCheck(`access:${roleName}->${policyName}`, hasAccess, hasAccess ? "exists" : null, "exists"),
    );
  }

  const failed = checks.filter((item) => !item.ok);

  console.log(
    JSON.stringify(
      {
        success: failed.length === 0,
        baseUrl,
        failedCount: failed.length,
        checks,
      },
      null,
      2,
    ),
  );

  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[verify-local-foundation] failed:", error.message);
  process.exit(1);
});
