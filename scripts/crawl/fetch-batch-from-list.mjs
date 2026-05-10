#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { buildCrawlHealthReport } from "./crawl-report-utils.mjs";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

function parseCsv(input) {
  return (input || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function parseListLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  // 支持：url | type=case | tags=a,b,c
  const parts = trimmed.split("|").map((part) => part.trim()).filter(Boolean);
  const url = parts[0];
  if (!url) return null;

  const meta = {
    url,
    type: "case",
    extraTags: [],
  };

  for (const part of parts.slice(1)) {
    if (part.startsWith("type=")) {
      meta.type = part.slice("type=".length).trim() || meta.type;
      continue;
    }
    if (part.startsWith("tags=")) {
      meta.extraTags = parseCsv(part.slice("tags=".length));
      continue;
    }
  }

  return meta;
}

async function runOne(url, outFile, type) {
  const script = path.resolve(process.cwd(), "scripts/crawl/fetch-url-to-json.mjs");
  const extraTags = arguments.length >= 4 ? arguments[3] : [];
  return new Promise((resolve, reject) => {
    const args = [script, `--url=${url}`, `--out=${outFile}`, `--type=${type}`];
    if (Array.isArray(extraTags) && extraTags.length) {
      args.push(`--extraTags=${extraTags.join(",")}`);
    }
    const child = spawn(
      process.execPath,
      args,
      { stdio: "inherit" },
    );
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`crawl failed for ${url}`));
    });
  });
}

async function safeReadJson(file) {
  const text = await fs.readFile(file, "utf8");
  return JSON.parse(text);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const listPath = getArg("--list");
  const outDir = getArg("--outDir", "tmp/crawl");
  const type = getArg("--type", "case");
  const delayMs = Number(getArg("--delayMs", "1200"));
  const reportOut = getArg("--reportOut", path.join(outDir, "_batch-report.json"));
  const failOnError = getArg("--failOnError", "false") === "true";

  if (!listPath) {
    console.error(
      "Usage: node scripts/crawl/fetch-batch-from-list.mjs --list=./scripts/crawl/sources.txt [--outDir=tmp/crawl] [--type=case]",
    );
    process.exit(1);
  }

  const absList = path.resolve(process.cwd(), listPath);
  const text = await fs.readFile(absList, "utf8");
  const rows = text
    .split("\n")
    .map((line) => parseListLine(line))
    .filter(Boolean);

  await fs.mkdir(path.resolve(process.cwd(), outDir), { recursive: true });

  const successes = [];
  const failures = [];

  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const url = row.url;
    const outFile = path.join(outDir, `${String(i + 1).padStart(3, "0")}.json`);
    // 保持串行，避免对目标站点造成过高请求压力。
    try {
      await runOne(url, outFile, row.type || type, row.extraTags || []);
      const item = await safeReadJson(path.resolve(process.cwd(), outFile));
      successes.push(item);
    } catch (error) {
      failures.push({
        source_url: url,
        source_name: new URL(url).hostname,
        error: error instanceof Error ? error.message : String(error),
        at: new Date().toISOString(),
      });
    }
    if (i < rows.length - 1 && delayMs > 0) {
      await sleep(delayMs);
    }
  }

  const report = buildCrawlHealthReport(successes, failures);
  report.batch = {
    listPath: absList,
    outDir: path.resolve(process.cwd(), outDir),
    delayMs,
  };

  const absReportOut = path.resolve(process.cwd(), reportOut);
  await fs.mkdir(path.dirname(absReportOut), { recursive: true });
  await fs.writeFile(absReportOut, JSON.stringify(report, null, 2), "utf8");

  console.log(
    `[batch] done: ${successes.length}/${rows.length} urls -> ${path.resolve(
      process.cwd(),
      outDir,
    )} (delayMs=${delayMs})`,
  );
  console.log(`[batch] report: ${absReportOut}`);
  if (failures.length) {
    console.log(`[batch] failures: ${failures.length}`);
    if (failOnError) {
      process.exitCode = 1;
    }
  }
}

main().catch((error) => {
  console.error("[fetch-batch-from-list] failed:", error.message);
  process.exit(1);
});
