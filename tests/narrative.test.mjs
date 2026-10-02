import test from "node:test";
import assert from "node:assert/strict";
import { narrativeFrame } from "../shared/narrative.mjs";

test("narrative always has visible copy and at most two neighboring panels", () => {
  for (let step = 0; step <= 1000; step++) {
    const frame = narrativeFrame(step / 1000);
    assert.ok(
      Math.abs(frame.panels.reduce((sum, p) => sum + p.opacity, 0) - 1) < 1e-9,
    );
    assert.ok(frame.panels.filter((p) => p.opacity > 0).length <= 2);
    assert.ok(frame.panels[frame.active].opacity >= 0.5);
    const visible = frame.panels.filter(panel => panel.opacity > 0);
    if (visible.length === 2) {
      assert.ok(Math.abs(visible[1].y - visible[0].y - 100) < 1e-9, 'Neighboring text panels must not overlap');
    }
  }
});
test("copy responds early and stays continuous at chapter boundaries", () => {
  assert.ok(narrativeFrame(0.075).panels[1].opacity > 0);
  for (const boundary of [0.2, 0.4, 0.6, 0.8]) {
    const before = narrativeFrame(boundary - 0.00001);
    const after = narrativeFrame(boundary + 0.00001);
    before.panels.forEach((panel, i) =>
      assert.ok(Math.abs(panel.opacity - after.panels[i].opacity) < 0.001),
    );
  }
});
test("reverse scrolling retraces the same state and reduced motion keeps one static panel", () => {
  const forward = narrativeFrame(0.13);
  narrativeFrame(0.8);
  assert.deepEqual(narrativeFrame(0.13), forward);
  for (const p of [0, 0.1, 0.3, 0.6, 0.9, 1]) {
    const frame = narrativeFrame(p, true);
    assert.equal(frame.panels.filter((panel) => panel.opacity === 1).length, 1);
    assert.ok(frame.panels.every((panel) => panel.y === 0));
  }
});
