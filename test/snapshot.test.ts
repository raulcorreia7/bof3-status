import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { modelFromReport } from "../src/model/report.ts";
import { badge } from "../src/snapshot/badge.ts";
import { renderPoster } from "../src/snapshot/poster.ts";
import { POSTER } from "../src/strings.ts";
import type { Model } from "../src/types.ts";

const model = modelFromReport(
  JSON.parse(readFileSync(new URL("../data/report.json", import.meta.url), "utf8")),
);
const withShare = (exact: number): Model => ({
  ...model,
  code: { ...model.code, functions: 100, exact },
});

test("the badge shows the exact share of game functions", () => {
  const svg = badge(withShare(42));
  assert.match(svg, /^<svg [^>]*role="img"[^>]*aria-label="[^"]+: 42\.0%"/);
  assert.ok(svg.includes(`>${POSTER.badge}</text>`));
  assert.ok(svg.includes(">42.0%</text>"));
});
test("the poster escapes text from the report", () => {
  const svg = renderPoster(model);
  assert.ok(!/<text[^>]*>[^<]*&(?!amp;|lt;|gt;|quot;|#)/.test(svg));
});
