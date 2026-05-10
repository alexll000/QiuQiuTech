#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

async function loadEnvFile(envPath) {
  const text = await fs.readFile(envPath, "utf8");
  const pairs = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      if (idx < 0) return null;
      return [line.slice(0, idx), line.slice(idx + 1)];
    })
    .filter(Boolean);
  return Object.fromEntries(pairs);
}

async function getToken(baseUrl, envVars) {
  const staticToken = envVars.ADMIN_TOKEN || process.env.ADMIN_TOKEN || "";
  if (staticToken) {
    return staticToken;
  }

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

async function ensureFile(baseUrl, token, absolutePath) {
  const filename = path.basename(absolutePath);
  const existing = await directusFetch(
    baseUrl,
    token,
    `/files?filter[filename_download][_eq]=${encodeURIComponent(filename)}&limit=1`,
  );
  const existedId = existing?.data?.[0]?.id;
  if (existedId) {
    return existedId;
  }

  const bytes = await fs.readFile(absolutePath);
  const form = new FormData();
  form.set("title", filename);
  form.set("file", new Blob([bytes]), filename);

  const uploaded = await directusFetch(baseUrl, token, "/files", {
    method: "POST",
    body: form,
  });
  const uploadedId = uploaded?.data?.id;
  if (!uploadedId) {
    throw new Error(`Failed to upload file: ${filename}`);
  }
  return uploadedId;
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
  const logoPath = getArg(
    "--logo",
    path.resolve(process.cwd(), "web/public/qiuqiutech-admin-logo.png"),
  );
  const faviconPath = getArg(
    "--favicon",
    path.resolve(process.cwd(), "web/public/qiuqiutech-bird-mark.png"),
  );
  const projectName = getArg("--projectName", "QiuQiuTech");
  const projectDescriptor = getArg("--projectDescriptor", "球球科技后台管理系统");
  const defaultLanguage = getArg("--defaultLanguage", "zh-CN");
  const projectColor = getArg("--projectColor", "#123a8f");

  const [projectLogoId, publicFaviconId] = await Promise.all([
    ensureFile(baseUrl, token, logoPath),
    ensureFile(baseUrl, token, faviconPath),
  ]);

  await directusFetch(baseUrl, token, "/settings", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_name: projectName,
      project_descriptor: projectDescriptor,
      project_color: projectColor,
      project_logo: projectLogoId,
      public_favicon: publicFaviconId,
      default_language: defaultLanguage,
    }),
  });

  const adminEmail = envVars.ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@qiuqiutech.com";
  const users = await directusFetch(
    baseUrl,
    token,
    `/users?fields=id,email,first_name,last_name,language&filter[email][_eq]=${encodeURIComponent(
      adminEmail,
    )}&limit=1`,
  );
  const adminId = users?.data?.[0]?.id;
  if (adminId) {
    await directusFetch(baseUrl, token, `/users/${adminId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: projectName,
        last_name: "Admin",
        language: defaultLanguage,
      }),
    });
  }

  const verifySettings = await directusFetch(baseUrl, token, "/settings");
  console.log(
    JSON.stringify(
      {
        success: true,
        baseUrl,
        project_name: verifySettings?.data?.project_name,
        project_descriptor: verifySettings?.data?.project_descriptor,
        default_language: verifySettings?.data?.default_language,
        project_logo: verifySettings?.data?.project_logo,
        public_favicon: verifySettings?.data?.public_favicon,
        admin_email: adminEmail,
        admin_language: defaultLanguage,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("[apply-branding-and-language] failed:", error.message);
  process.exit(1);
});
