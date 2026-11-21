import assert from "node:assert/strict";
import { test } from "node:test";
import { HOME, parseHash, SECTION_IDS, sectionHash, sectionOfHash } from "../src/model/route.ts";

test("a section hash carries the search parameters", () => {
  const route = { ...HOME, q: "cure", sort: "size" as const, dir: "desc" as const };
  assert.equal(sectionHash(route, "find"), "#find?q=cure&sort=size&dir=desc");
  assert.equal(sectionHash(HOME, "map"), "#map");
  assert.equal(sectionHash({ ...HOME, fn: "exe/slus_004_22/func_80164028" }, "find"), "#find");
});
