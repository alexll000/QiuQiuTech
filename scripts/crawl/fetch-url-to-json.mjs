#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { scoreSubmissionQuality } from "./crawl-report-utils.mjs";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  if (!hit) return fallback;
  return hit.slice(name.length + 1).trim();
}

function parseCsv(input) {
  return (input || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function stripHtmlTags(input) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(input) {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function pickMeta(html, names) {
  for (const n of names) {
    const re = new RegExp(
      `<meta[^>]+(?:name|property)=["']${n}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    );
    const m = html.match(re);
    if (m?.[1]) return decodeHtmlEntities(m[1].trim());
  }
  return "";
}

function pickTitle(html) {
  const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return m?.[1] ? decodeHtmlEntities(stripHtmlTags(m[1])) : "未命名抓取内容";
}

function pickBodyExcerpt(html, maxLen = 800) {
  const m = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = m?.[1] || html;
  const text = decodeHtmlEntities(stripHtmlTags(body));
  return text.slice(0, maxLen);
}

function inferTags(title, description) {
  const seed = `${title} ${description}`.toLowerCase();
  const tags = [];
  if (/campaign|活动|事件/.test(seed)) tags.push("营销事件");
  if (/brand|品牌/.test(seed)) tags.push("品牌营销");
  if (/case|案例/.test(seed)) tags.push("营销案例");
  if (/social|社媒|小红书|抖音|微博/.test(seed)) tags.push("社媒");
  return tags.length ? tags : ["行业观察"];
}

function uniqueStrings(items) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const value = typeof item === "string" ? item.trim() : "";
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function toSlug(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function main() {
  const url = getArg("--url");
  const out = getArg("--out", "");
  const type = getArg("--type", "case");
  const extraTags = parseCsv(getArg("--extraTags", ""));

  if (!url) {
    console.error(
      "Usage: node scripts/crawl/fetch-url-to-json.mjs --url=<https://...> [--type=case] [--extraTags=a,b] [--out=./tmp.json]",
    );
    process.exit(1);
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; QiuQiuTechCrawler/0.1; +https://qiuqiutech.local)",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const title = pickTitle(html);
  const description =
    pickMeta(html, ["description", "og:description", "twitter:description"]) ||
    pickBodyExcerpt(html, 180);
  const coverImage = pickMeta(html, ["og:image", "twitter:image"]);
  const excerpt = pickBodyExcerpt(html, 1200);
  const tags = uniqueStrings([...extraTags, ...inferTags(title, description)]);

  const payload = {
    source_url: url,
    source_name: new URL(url).hostname,
    fetched_at: new Date().toISOString(),
    submission: {
      title,
      slug: toSlug(title) || `content-${Date.now()}`,
      summary: description.slice(0, 220),
      submission_type: type,
      tags,
      cover_image: coverImage || null,
      body_excerpt: excerpt,
      status: "pending_review",
    },
  };

  payload.quality = scoreSubmissionQuality(payload.submission);

  const serialized = JSON.stringify(payload, null, 2);
  if (out) {
    const abs = path.resolve(process.cwd(), out);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, serialized, "utf8");
    console.log(`Saved: ${abs}`);
  } else {
    console.log(serialized);
  }
}

main().catch((error) => {
  console.error("[fetch-url-to-json] failed:", error.message);
  process.exit(1);
});
