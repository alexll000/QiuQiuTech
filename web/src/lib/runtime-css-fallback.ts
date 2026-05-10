import fs from "node:fs";
import path from "node:path";

function findCssHrefInDir(absoluteDir: string, publicBase: string) {
  if (!fs.existsSync(absoluteDir)) return null;

  const files = fs
    .readdirSync(absoluteDir)
    .filter((item) => item.endsWith(".css"))
    .sort();

  const preferred =
    files.find((item) => item.startsWith("src_app_globals_")) ??
    files.find((item) => item.includes("globals")) ??
    files[0];

  return preferred ? `${publicBase}/${preferred}` : null;
}

export function getRuntimeCssFallbackHref() {
  const appRoot = process.cwd();
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    return (
      findCssHrefInDir(
        path.join(appRoot, ".next/static/chunks"),
        "/_next/static/chunks",
      ) ??
      findCssHrefInDir(
        path.join(appRoot, ".next/dev/static/chunks"),
        "/_next/dev/static/chunks",
      ) ??
      null
    );
  }

  return (
    findCssHrefInDir(
      path.join(appRoot, ".next/dev/static/chunks"),
      "/_next/dev/static/chunks",
    ) ??
    findCssHrefInDir(
      path.join(appRoot, ".next/static/chunks"),
      "/_next/static/chunks",
    ) ??
    null
  );
}
