import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { inspector } from "../src/inspect.ts";
import { modelFromReport } from "../src/model/report.ts";
import { formatHash, HOME, parseHash } from "../src/model/route.ts";
import { DARK } from "../src/theme/tokens.ts";

const file = JSON.parse(readFileSync(new URL("../data/report.json", import.meta.url), "utf8"));
const model = modelFromReport(file);
const ctx = (route: typeof HOME) => ({ model, route, tokens: DARK, limit: 200 });

test("the selected function survives the URL", () => {
  const hash =
    "#fn/emi%2Fetc%2Fcommu02%2F08%2F794?f=emi%2Fetc%2Fcommu02%2F08%2F794%23func_801D3568";
  const route = parseHash(hash);
  assert.equal(route.f, "emi/etc/commu02/08/794#func_801D3568");
  assert.equal(formatHash(route), hash);
});
