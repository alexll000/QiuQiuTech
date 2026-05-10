#!/usr/bin/env node

import { spawn } from "node:child_process";
import path from "node:path";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

function run(script, args = []) {
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
  const list = getArg("--list", "scripts/crawl/sources.sample.txt");
  const outDir = getArg("--outDir", "tmp/crawl");
  const type = getArg("--type", "case");
  const submitterUserId = getArg("--submitterUserId", "crawler-bot");
  const delayMs = getArg("--delayMs", "1200");
  const failLog = getArg("--failLog", "tmp/crawl-failures.json");
  const crawlReportOut = getArg("--crawlReportOut", path.join(outDir, "_batch-report.json"));
  const importReportOut = getArg("--importReportOut", path.join(outDir, "_import-report.json"));

  const crawlScript = path.resolve(process.cwd(), "scripts/crawl/fetch-batch-from-list.mjs");
  const importScript = path.resolve(process.cwd(), "scripts/import/import-submissions-to-directus.mjs");

  await run(crawlScript, [
    `--list=${list}`,
    `--outDir=${outDir}`,
    `--type=${type}`,
    `--delayMs=${delayMs}`,
    `--reportOut=${crawlReportOut}`,
  ]);
  await run(importScript, [
    `--inDir=${outDir}`,
    `--submitterUserId=${submitterUserId}`,
    `--failLog=${failLog}`,
    `--reportOut=${importReportOut}`,
  ]);
}

main().catch((error) => {
  console.error("[crawl-and-import] failed:", error.message);
  process.exit(1);
});
