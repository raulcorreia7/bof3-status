import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const USAGE = "Usage: node render/publish.ts [report-file]";
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(USAGE);
  process.exit(0);
}
const source = resolve(
  process.argv[2] ?? fileURLToPath(new URL("../../decomp/build/report.json", import.meta.url)),
);
if (!existsSync(source)) {
  console.error(
    `No report at ${source}. Run "meson compile -C build/meson report" in decomp/, or pass the report file.`,
  );
  console.error(USAGE);
  process.exit(1);
}
const target = fileURLToPath(new URL("../data/report.json", import.meta.url));
const json = JSON.stringify(JSON.parse(readFileSync(source, "utf8")));
writeFileSync(target, json);
console.log(`wrote data/report.json (${Buffer.byteLength(json)} bytes)`);
