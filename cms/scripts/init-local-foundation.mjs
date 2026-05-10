#!/usr/bin/env node

import path from "node:path";
import { spawn } from "node:child_process";

function getArg(name, fallback = "") {
  const hit = process.argv.find((arg) => arg.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1).trim() : fallback;
}

async function runStep(label, scriptPath, forwardedArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...forwardedArgs], {
      cwd: process.cwd(),
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${label} failed: ${stderr.trim() || stdout.trim() || `exit ${code}`}`));
        return;
      }

      const output = stdout.trim();
      let parsed = null;
      if (output) {
        try {
          parsed = JSON.parse(output);
        } catch {
          parsed = { raw: output };
        }
      }

      resolve({
        label,
        script: path.basename(scriptPath),
        result: parsed,
      });
    });
  });
}

async function main() {
  const cmsScriptsDir = path.resolve(process.cwd(), "cms/scripts");
  const envPath = getArg("--env", "");
  const baseUrl = getArg("--baseUrl", "");
  const forwardedArgs = [envPath && `--env=${envPath}`, baseUrl && `--baseUrl=${baseUrl}`].filter(Boolean);

  const steps = [];
  steps.push(
    await runStep(
      "branding-and-language",
      path.join(cmsScriptsDir, "apply-branding-and-language.mjs"),
      forwardedArgs,
    ),
  );
  steps.push(
    await runStep(
      "roles-and-policies",
      path.join(cmsScriptsDir, "seed-roles-and-policies.mjs"),
      forwardedArgs,
    ),
  );

  console.log(
    JSON.stringify(
      {
        success: true,
        steps,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error("[init-local-foundation] failed:", error.message);
  process.exit(1);
});
