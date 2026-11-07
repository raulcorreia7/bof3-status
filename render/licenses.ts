// Fails when an installed package carries a licence that licenses.json does not allow.
// Usage: node render/licenses.ts   (--help prints this line)
//
// licenses.json lists the allowed licences and, per package name, the one licence that package may
// carry besides them. A package listed there passes at any version; a new licence on it fails.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log("Usage: node render/licenses.ts");
  process.exit(0);
}

const policy: { allowed: string[]; packages: Record<string, string> } = JSON.parse(
  readFileSync(fileURLToPath(new URL("../licenses.json", import.meta.url)), "utf8"),
);
const checker = fileURLToPath(
  new URL("../node_modules/.bin/license-checker-rseidelsohn", import.meta.url),
);
const installed: Record<string, { licenses?: string | string[] }> = JSON.parse(
  execFileSync(checker, ["--json"], { encoding: "utf8", maxBuffer: 1 << 26 }),
);

const refused: string[] = [];
const counts = new Map<string, number>();
for (const [id, { licenses }] of Object.entries(installed)) {
  const name = id.slice(0, id.lastIndexOf("@"));
  const license = [licenses ?? "UNKNOWN"].flat().join(" OR ");
  counts.set(license, (counts.get(license) ?? 0) + 1);
  if (!policy.allowed.includes(license) && policy.packages[name] !== license) {
    refused.push(`${id}: ${license}`);
  }
}
for (const [license, count] of [...counts].sort()) console.log(`${license}: ${count}`);
if (refused.length > 0) {
  console.error(`Licences not in licenses.json:\n${refused.join("\n")}`);
  process.exit(1);
}
