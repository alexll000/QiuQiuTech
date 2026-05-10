#!/usr/bin/env node
/**
 * Imports cms/seed/submissions.seed.json into Directus `submissions`.
 * Idempotent: skips rows that already exist (same title + external_link as crawl import).
 *
 * Usage (from repo root):
 *   node scripts/seed/import-submissions-seed.mjs
 *   node scripts/seed/import-submissions-seed.mjs --file=cms/seed/submissions.seed.json
 *
 * Env: DIRECTUS_STATIC_TOKEN or DIRECTUS_ADMIN_EMAIL + DIRECTUS_ADMIN_PASSWORD
 *      NEXT_PUBLIC_DIRECTUS_URL (default http://127.0.0.1:8055)
 */

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

async function main() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055"
  ).replace(/\/$/, "");
  const fileRel = getArg("--file", "cms/seed/submissions.seed.json");
  const absFile = path.resolve(process.cwd(), fileRel);

  const raw = await fs.readFile(absFile, "utf8");
  const parsed = JSON.parse(raw);
  const items = Array.isArray(parsed?.items) ? parsed.items : Array.isArray(parsed) ? parsed : null;
  if (!items?.length) {
    throw new Error(`No items in ${absFile} (expected { items: [...] })`);
  }

  const token = await getToken(baseUrl);
  let ok = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of items) {
    const payload = {
      title: row.title || "未命名",
      submission_type: row.submission_type || "case",
      summary: row.summary || "",
      status: row.status || "pending_review",
      submitter_user_id: row.submitter_user_id || "seed-importer",
      external_link: row.external_link || null,
      ...(row.date_updated ? { date_updated: row.date_updated } : {}),
    };

    const dedupeRes = await fetch(
      `${baseUrl}/items/submissions?filter[_or][0][external_link][_eq]=${encodeURIComponent(
        payload.external_link || "",
      )}&filter[_or][1][title][_eq]=${encodeURIComponent(payload.title)}&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const dedupeJson = await dedupeRes.json().catch(() => ({}));
    const existed = Array.isArray(dedupeJson?.data) && dedupeJson.data.length > 0;
    if (existed) {
      skipped += 1;
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
      console.error(`[seed] fail: ${payload.title?.slice(0, 40)}`, res.status, json);
      failed += 1;
      continue;
    }
    ok += 1;
  }

  console.log(
    `[seed] done from ${path.basename(absFile)}: imported=${ok} skipped(duplicate)=${skipped} failed=${failed}`,
  );
  if (failed) process.exitCode = 1;
}

main().catch((e) => {
  console.error("[import-submissions-seed]", e.message);
  process.exit(1);
});
