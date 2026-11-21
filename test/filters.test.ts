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
