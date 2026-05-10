#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

async function getToken(baseUrl) {
  const staticToken = process.env.DIRECTUS_STATIC_TOKEN || "";
  if (staticToken) return staticToken;

  const email = process.env.DIRECTUS_ADMIN_EMAIL || "";
  const password = process.env.DIRECTUS_ADMIN_PASSWORD || "";
  if (!email || !password) {
    throw new Error("Missing DIRECTUS_STATIC_TOKEN or DIRECTUS_ADMIN_EMAIL/PASSWORD");
  }

  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  const token = json?.data?.access_token || json?.access_token;
  if (!res.ok || !token) {
    throw new Error(`Directus login failed: ${res.status} ${JSON.stringify(json)}`);
  }
  return token;
}

async function listJsonFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

async function main() {
  const inDir = getArg("--inDir", "tmp/crawl");
  const baseUrl = getArg(
    "--baseUrl",
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055",
  );
  const submitterUserId = getArg(
    "--submitterUserId",
    process.env.QIUQIUTECH_CURRENT_USER_ID || "crawler-bot",
  );
  const failLogPath = getArg("--failLog", "tmp/crawl-failures.json");
  const reportOut = getArg("--reportOut", path.join(inDir, "_import-report.json"));

  const absDir = path.resolve(process.cwd(), inDir);
  const files = await listJsonFiles(absDir);
  if (!files.length) {
    throw new Error(`No json files found in ${absDir}`);
  }

  const token = await getToken(baseUrl);
  let okCount = 0;
  let skippedCount = 0;
  const failures = [];
  const importedIds = [];

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    const item = JSON.parse(raw);
    const s = item?.submission || {};
    const payload = {
      title: s.title || "未命名抓取内容",
      submission_type: s.submission_type || "case",
      summary: s.summary || "",
      status: s.status || "pending_review",
      submitter_user_id: submitterUserId,
      tags: Array.isArray(s.tags) ? s.tags : [],
      external_link: item.source_url || null,
      cover_image: s.cover_image || null,
      // 备注：最小 schema 里不强依赖 body 字段，避免导入失败。
    };

    const dedupeRes = await fetch(
      `${baseUrl}/items/submissions?filter[_or][0][external_link][_eq]=${encodeURIComponent(
        payload.external_link || "",
      )}&filter[_or][1][title][_eq]=${encodeURIComponent(payload.title)}&limit=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const dedupeJson = await dedupeRes.json().catch(() => ({}));
    const existed = Array.isArray(dedupeJson?.data) && dedupeJson.data.length > 0;
    if (existed) {
      const existedId = dedupeJson.data[0]?.id ?? "unknown";
      console.log(`[import] skip duplicate ${path.basename(file)} -> submissions.id=${existedId}`);
      skippedCount += 1;
      continue;
    }

    const res = await fetch(`${baseUrl}/items/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error(`[import] failed ${path.basename(file)} -> ${res.status}`, json);
      failures.push({
        file: path.basename(file),
        status: res.status,
        response: json,
        at: new Date().toISOString(),
      });
      continue;
    }

    okCount += 1;
    const id = json?.data?.id ?? "unknown";
    importedIds.push(id);
    console.log(`[import] ok ${path.basename(file)} -> submissions.id=${id}`);
  }

  if (failures.length) {
    const absFailLog = path.resolve(process.cwd(), failLogPath);
    await fs.mkdir(path.dirname(absFailLog), { recursive: true });
    await fs.writeFile(absFailLog, JSON.stringify(failures, null, 2), "utf8");
    console.log(`[import] failures saved: ${absFailLog}`);
  }

  const absReportOut = path.resolve(process.cwd(), reportOut);
  await fs.mkdir(path.dirname(absReportOut), { recursive: true });
  await fs.writeFile(
    absReportOut,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        overview: {
          total: files.length,
          imported: okCount,
          skipped: skippedCount,
          failed: failures.length,
        },
        importedIds,
        failures,
      },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`[import] report: ${absReportOut}`);
  console.log(`[import] done: imported=${okCount} skipped=${skippedCount} failed=${failures.length}`);
}

main().catch((error) => {
  console.error("[import-submissions-to-directus] failed:", error.message);
  process.exit(1);
});
