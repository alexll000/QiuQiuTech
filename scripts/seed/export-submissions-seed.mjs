#!/usr/bin/env node
/**
 * Exports current Postgres `submissions` rows into cms/seed/submissions.seed.json
 * for committing demo/initial data (marketing heat trend).
 *
 * Requires Docker container access to qiqiutech-postgres (adjust env if needed).
 *
 * Usage (from repo root):
 *   node scripts/seed/export-submissions-seed.mjs
 *
 * Env:
 *   SEED_PG_CONTAINER (default: qiqiutech-postgres)
 *   SEED_PG_USER (default: directus)
 *   SEED_PG_DB (default: qiqiutech)
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

async function main() {
  const container = process.env.SEED_PG_CONTAINER || "qiqiutech-postgres";
  const user = process.env.SEED_PG_USER || "directus";
  const db = process.env.SEED_PG_DB || "qiqiutech";

  const sql = `SELECT COALESCE(json_agg(row_to_json(x) ORDER BY x.date_updated DESC), '[]'::json)::text FROM (
    SELECT submission_type, submitter_user_id, title, COALESCE(summary,'') AS summary, external_link, status, date_updated
    FROM submissions
  ) x`;

  let outText;
  try {
    outText = execFileSync(
      "docker",
      ["exec", container, "psql", "-U", user, "-d", db, "-t", "-A", "-c", sql],
      { encoding: "utf8" },
    ).trim();
  } catch (e) {
    console.error(
      "[export-submissions-seed] docker exec failed. Is the Postgres container running?",
      e.message,
    );
    process.exit(1);
  }

  const arr = JSON.parse(outText);
  const envelope = {
    version: 1,
    generatedAt: new Date().toISOString(),
    description:
      "Marketing heat trend seed: submissions rows for local/demo installs (safe to commit; no secrets).",
    rowCount: arr.length,
    items: arr,
  };

  const outPath = path.resolve(process.cwd(), "cms/seed/submissions.seed.json");
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, JSON.stringify(envelope, null, 2), "utf8");
  console.log(`[export-submissions-seed] wrote ${envelope.rowCount} rows -> ${outPath}`);
}

main().catch((e) => {
  console.error("[export-submissions-seed]", e);
  process.exit(1);
});
