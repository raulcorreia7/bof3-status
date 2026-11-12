import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { browse } from "../src/model/browse.ts";
import { modelFromReport } from "../src/model/report.ts";
import { HOME } from "../src/model/route.ts";

const file = JSON.parse(readFileSync(new URL("../data/report.json", import.meta.url), "utf8"));
const model = modelFromReport(file);

test("address sorting is numeric across images", () => {
  const rows = browse(model, { ...HOME, q: "area", sort: "address", dir: "asc" });
  const firstNull = rows.findIndex((fn) => fn.address === null);
  assert.ok(firstNull > 0);
  const addressed = rows.slice(0, firstNull).map((fn) => fn.address!);
  assert.ok(addressed.every((address, index) => index === 0 || address >= addressed[index - 1]));
  assert.ok(rows.slice(firstNull).every((fn) => fn.address === null));
});
