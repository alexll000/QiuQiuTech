#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

async function main() {
  const failLog = getArg("--failLog", "tmp/crawl-failures.json");
  const webhook = getArg("--webhook", process.env.QQT_CRAWL_ALERT_WEBHOOK || "");
  const dryRun = getArg("--dryRun", "false") === "true";

  const absFailLog = path.resolve(process.cwd(), failLog);
  let text = "";
  try {
    text = await fs.readFile(absFailLog, "utf8");
  } catch {
    console.log(`[notify] fail log not found: ${absFailLog}`);
    return;
  }

  const failures = JSON.parse(text);
  if (!Array.isArray(failures) || failures.length === 0) {
    console.log("[notify] no failures.");
    return;
  }

  const lines = failures.slice(0, 8).map((x) => `- ${x.file}: status=${x.status}`);
  const content = [
    "QiuQiuTech 抓取导入失败告警",
    `时间: ${new Date().toISOString()}`,
    `失败数: ${failures.length}`,
    ...lines,
    `日志: ${absFailLog}`,
  ].join("\n");

  if (dryRun || !webhook) {
    console.log("[notify] dry-run or missing webhook:");
    console.log(content);
    return;
  }

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: content }),
  });
  if (!res.ok) {
    throw new Error(`webhook failed: ${res.status} ${res.statusText}`);
  }
  console.log("[notify] sent.");
}

main().catch((error) => {
  console.error("[notify-failures] failed:", error.message);
  process.exit(1);
});

