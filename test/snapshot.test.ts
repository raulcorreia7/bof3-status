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

test("the badge colour follows the share thresholds", () => {
  assert.ok(badge(withShare(10)).includes("#b3402f"));
  assert.ok(badge(withShare(33)).includes("#d29922"));
  assert.ok(badge(withShare(66)).includes("#2ea043"));
});

test("the badge is as wide as its two halves", () => {
  const svg = badge(withShare(50));
  const [key, value] = [...svg.matchAll(/<rect (?:x="[\d.]+" )?width="([\d.]+)"/g)].map((m) =>
    Number(m[1])
  );
  assert.equal(
    Number(/<svg [^>]*width="([\d.]+)"/.exec(svg)?.[1]),
    Math.round((key! + value!) * 100) / 100,
  );
});

test("the poster is one well-formed SVG that names the project", () => {
  const svg = renderPoster(model);
  assert.match(svg, /^<svg [^>]*viewBox="0 0 \d+ \d+"/);
  assert.ok(svg.trimEnd().endsWith("</svg>"));
  assert.ok(svg.includes(POSTER.title));
  assert.equal(svg.match(/<svg /g)?.length, 1);
  assert.equal(renderPoster(model), svg);
});

test("the poster escapes text from the report", () => {
  const svg = renderPoster(model);
  assert.ok(!/<text[^>]*>[^<]*&(?!amp;|lt;|gt;|quot;|#)/.test(svg));
});
