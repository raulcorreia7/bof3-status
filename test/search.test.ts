import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { browse } from "../src/model/browse.ts";
import { modelFromReport } from "../src/model/report.ts";
import { HOME } from "../src/model/route.ts";

const file = JSON.parse(readFileSync(new URL("../data/report.json", import.meta.url), "utf8"));
const model = modelFromReport(file);
const search = (q: string) => browse(model, { ...HOME, q });

test("a displayed 0x address finds its function", () => {
  const found = search("0x801EEC60");
  assert.equal(found.length, 1);
  assert.equal(found[0].name, "func_801EEC60");
});

test("the address keeps its existing forms", () => {
  assert.equal(search("801EEC60")[0]?.name, "func_801EEC60");
  assert.equal(search("func_801EEC60")[0]?.name, "func_801EEC60");
  assert.equal(search("0X801EEC60")[0]?.name, "func_801EEC60");
  assert.equal(search("0x00000000").length, 0);
});
