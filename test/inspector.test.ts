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

test("a function in a multi-function file is selected in the panel", () => {
  const unit = "emi/etc/commu02/08/794";
  const fn = "func_801D3568";
  const view = inspector(ctx({ ...HOME, fn: unit, f: `${unit}#${fn}` }))!;
  const selected = view.selected!;
  assert.ok(selected);
  const field = (label: string) => selected.fields.find((item) => item.label === label)!.value[0];
  assert.equal(field("Name").text, fn);
  assert.equal(field("Address").text, "0x801D3568");
  assert.equal(field("Size").text, "60 B");
  assert.equal(field("Status").status, "pure");
  assert.equal(view.fields.find((item) => item.label === "Address")!.value[0].text, "0x801D1394");
});

test("a single-function file stays a file panel", () => {
  const unit = "emi/battle/batl_end/00/func_801EEC60";
  const view = inspector(ctx({ ...HOME, fn: unit, f: `${unit}#func_801EEC60` }))!;
  assert.equal(view.selected, undefined);
  assert.equal(view.title, unit);
});

test("the selected function survives the URL", () => {
  const hash =
    "#fn/emi%2Fetc%2Fcommu02%2F08%2F794?f=emi%2Fetc%2Fcommu02%2F08%2F794%23func_801D3568";
  const route = parseHash(hash);
  assert.equal(route.f, "emi/etc/commu02/08/794#func_801D3568");
  assert.equal(formatHash(route), hash);
});
