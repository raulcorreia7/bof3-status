import assert from "node:assert/strict";
import { test } from "node:test";
import {
  formatHash,
  HOME,
  parseHash,
  SECTION_IDS,
  sectionHash,
  sectionOfHash,
} from "../src/model/route.ts";

test("a section hash opens the home page and names the section", () => {
  assert.deepEqual(parseHash("#find"), HOME);
  for (const id of SECTION_IDS) assert.equal(sectionOfHash(`#${id}`), id);
  assert.equal(sectionOfHash("#find?q=cure"), "find");
  assert.equal(sectionOfHash("#image/emi%2Fbattle%2Fbattle%2F15"), null);
  assert.equal(sectionOfHash("#?q=cure"), null);
  assert.equal(sectionOfHash("#content"), null);
});

test("a section hash carries the search parameters", () => {
  const route = { ...HOME, q: "cure", sort: "size" as const, dir: "desc" as const };
  assert.equal(sectionHash(route, "find"), "#find?q=cure&sort=size&dir=desc");
  assert.equal(sectionHash(HOME, "map"), "#map");
  assert.equal(sectionHash({ ...HOME, fn: "exe/slus_004_22/func_80164028" }, "find"), "#find");
});

test("page hashes keep their existing form", () => {
  const page = parseHash(
    "#image/emi%2Fbattle%2Fbattle%2F15?fn=emi%2Fbattle%2Fbattle%2F15%2Ffunc_80096A74",
  );
  assert.equal(
    formatHash(page),
    "#image/emi%2Fbattle%2Fbattle%2F15?fn=emi%2Fbattle%2Fbattle%2F15%2Ffunc_80096A74",
  );
});
