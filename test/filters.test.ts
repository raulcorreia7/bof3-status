import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { browse } from "../src/model/browse.ts";
import { modelFromReport } from "../src/model/report.ts";
import { formatHash, HOME, parseHash } from "../src/model/route.ts";
import { searchTable } from "../src/selectors.ts";
import { DARK } from "../src/theme/tokens.ts";

const file = JSON.parse(readFileSync(new URL("../data/report.json", import.meta.url), "utf8"));
const model = modelFromReport(file);

test("filters survive a URL round trip", () => {
  const route = parseHash("#?st=pure&part=battle&image=emi%2Fbattle%2Fbattle%2F15");
  assert.equal(route.st, "pure");
  assert.equal(route.part, "battle");
  assert.equal(route.image, "emi/battle/battle/15");
  assert.equal(formatHash(route), "#?st=pure&part=battle&image=emi%2Fbattle%2Fbattle%2F15");
});

test("filters narrow the game functions", () => {
  const battle = browse(model, { ...HOME, st: "pure", part: "battle" });
  assert.ok(battle.length > 0);
  assert.ok(battle.every((fn) => fn.status === "pure"));
  assert.ok(battle.every((fn) => model.targetById.get(fn.target)?.group === "battle"));

  const oneImage = browse(model, { ...HOME, image: "emi/battle/battle/15" });
  assert.ok(oneImage.length > 0);
  assert.ok(oneImage.every((fn) => fn.target === "emi/battle/battle/15"));

  assert.equal(browse(model, { ...HOME, q: "zzzz", st: "pure" }).length, 0);
});

test("a filter alone shows the table", () => {
  const table = searchTable({ model, route: { ...HOME, st: "pure" }, tokens: DARK, limit: 200 });
  assert.equal(table.rows.length, 200);
  assert.match(table.message, /^Showing 200 of /);
  assert.ok(table.more);
});
