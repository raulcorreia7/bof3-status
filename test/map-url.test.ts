import assert from "node:assert/strict";
import { test } from "node:test";
import { formatHash, HOME, parseHash } from "../src/model/route.ts";

test("the map view survives the URL", () => {
  assert.equal(parseHash("#?by=image").by, "image");
  assert.equal(parseHash("#map?by=image").by, "image");
  assert.equal(parseHash("").by, "part");
  assert.equal(formatHash({ ...HOME, by: "image" }), "#?by=image");
  assert.equal(formatHash(HOME), "");
});
