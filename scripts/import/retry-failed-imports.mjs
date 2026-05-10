#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

function runNode(script, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      stdio: "inherit",
      env: process.env,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(script)} exited with code ${code}`));
    });
  });
}

async function main() {
  const failLog = getArg("--failLog", "tmp/crawl-failures.json");
  const sourceDir = getArg("--sourceDir", "tmp/crawl");
  const retryDir = getArg("--retryDir", "tmp/crawl-retry");
  const submitterUserId = getArg("--submitterUserId", "crawler-bot");
  const baseUrl = getArg("--baseUrl", process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://127.0.0.1:8055");

  const absFailLog = path.resolve(process.cwd(), failLog);
  const absSourceDir = path.resolve(process.cwd(), sourceDir);
  const absRetryDir = path.resolve(process.cwd(), retryDir);
  await fs.mkdir(absRetryDir, { recursive: true });

  let text = "";
  try {
    text = await fs.readFile(absFailLog, "utf8");
  } catch {
    console.log(`[retry] fail log not found: ${absFailLog}`);
    return;
  }
  const failures = JSON.parse(text);
  if (!Array.isArray(failures) || failures.length === 0) {
    console.log("[retry] no failures to retry.");
    return;
  }

  let copied = 0;
  for (const item of failures) {
    const file = item?.file;
    if (!file || typeof file !== "string") continue;
    const src = path.join(absSourceDir, file);
    const dst = path.join(absRetryDir, file);
    try {
      await fs.copyFile(src, dst);
      copied += 1;
    } catch {
      // 忽略缺失文件，继续其他重试项。
    }
  }

  if (!copied) {
    console.log("[retry] no retryable files found.");
    return;
  }

  const importScript = path.resolve(process.cwd(), "scripts/import/import-submissions-to-directus.mjs");
  await runNode(importScript, [
    `--inDir=${retryDir}`,
    `--submitterUserId=${submitterUserId}`,
    `--baseUrl=${baseUrl}`,
    `--failLog=${failLog}`,
  ]);
}

main().catch((error) => {
  console.error("[retry-failed-imports] failed:", error.message);
  process.exit(1);
});
