import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("the tilted avatar image overscans its frame at the maximum pointer angle", () => {
  const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
  const rule = css.match(/\.avatar-tilt\s*\{([\s\S]*?)\}/)?.[1] ?? "";
  const transform = rule.match(/transform:\s*([^;]+);/)?.[1] ?? "";
  const overscan = Number(transform.match(/scale\(([\d.]+)\)/)?.[1] ?? 1);
  const minimumForElevenDegrees = 1 / Math.cos((11 * Math.PI) / 180);
  assert.ok(
    overscan >= minimumForElevenDegrees,
    `scale ${overscan} cannot cover the frame at 11°; requires at least ${minimumForElevenDegrees.toFixed(4)}`,
  );
});
