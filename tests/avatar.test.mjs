import test from "node:test";
import assert from "node:assert/strict";
import { avatarFrame } from "../shared/avatar.mjs";

test("avatar morph stays subtle and clamps scroll input", () => {
  assert.deepEqual(avatarFrame(-1), avatarFrame(0));
  assert.deepEqual(avatarFrame(2), avatarFrame(1));
  const end = avatarFrame(1);
  assert.ok(end.scale >= 0.8);
  assert.ok(end.x <= 8 && end.y <= 3);
  assert.ok(end.radius >= 33);
  assert.ok(end.turn <= 8);
});

test("reduced motion keeps the avatar in its initial form", () => {
  assert.deepEqual(avatarFrame(0.9, true), avatarFrame(0));
});
