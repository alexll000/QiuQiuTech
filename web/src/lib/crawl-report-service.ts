import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { unstable_noStore as noStore } from "next/cache";

interface CrawlHealthSource {
  sourceName: string;
  total: number;
  success: number;
  failed: number;
  successRate: number;
  avgQualityScore: number;
  minQualityScore: number | null;
  maxQualityScore: number | null;
  healthLevel: "healthy" | "watch" | "risk";
  lastFetchedAt: string | null;
  lastErrorAt: string | null;
  urls: string[];
  recentFailures: Array<{
    url: string;
    message: string;
    at: string | null;
  }>;
}

interface CrawlBatchReport {
  generatedAt: string;
  overview: {
    total: number;
    success: number;
    failed: number;
    successRate: number;
    avgQualityScore: number;
    sourceCount: number;
  };
  failures: Array<{
    sourceName: string;
    sourceUrl: string;
    error: string;
    at: string | null;
  }>;
  sources: CrawlHealthSource[];
  batch?: {
    listPath: string;
    outDir: string;
    delayMs: number;
  };
}

interface ImportReport {
  generatedAt: string;
  overview: {
    total: number;
    imported: number;
    skipped: number;
    failed: number;
  };
  importedIds: Array<string | number>;
  failures: Array<{
    file: string;
    status: number;
    response?: unknown;
    at: string;
  }>;
}

export interface CrawlOpsSnapshot {
  batchReport: CrawlBatchReport | null;
  importReport: ImportReport | null;
}

export async function getCrawlOpsSnapshot(): Promise<CrawlOpsSnapshot> {
  noStore();

  const tmpRoot = path.resolve(process.cwd(), "..", "tmp");
  const [batchFile, importFile] = await Promise.all([
    findLatestReportFile(tmpRoot, "_batch-report.json"),
    findLatestReportFile(tmpRoot, "_import-report.json"),
  ]);

  const [batchReport, importReport] = await Promise.all([
    readJsonFile<CrawlBatchReport>(batchFile),
    readJsonFile<ImportReport>(importFile),
  ]);

  return {
    batchReport,
    importReport,
  };
}

async function readJsonFile<T>(file: string | null): Promise<T | null> {
  if (!file) return null;
  try {
    const text = await readFile(file, "utf8");
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

async function findLatestReportFile(root: string, filename: string): Promise<string | null> {
  let latestFile: string | null = null;
  let latestMtimeMs = 0;

  async function walk(dir: string, depth: number) {
    if (depth > 4) return;

    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
        continue;
      }
      if (!entry.isFile() || entry.name !== filename) {
        continue;
      }
      const details = await stat(fullPath);
      if (!latestFile || details.mtimeMs > latestMtimeMs) {
        latestFile = fullPath;
        latestMtimeMs = details.mtimeMs;
      }
    }
  }

  await walk(root, 0);
  return latestFile;
}
