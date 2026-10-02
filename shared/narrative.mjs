const clamp = (value) => Math.max(0, Math.min(1, value));
const ease = (value) => value * value * (3 - 2 * value);

// Keep both neighboring panels mounted. Scroll position, not a timed enter
// animation, controls the reversible handoff between them. Panels travel in
// separate vertical slots, so different sentences never overlap during a scrub.
export function narrativeFrame(progress, reduced = false) {
  const p = clamp(progress);
  const base = Math.min(4, Math.floor(p * 5));
  const local = clamp(p * 5 - base);
  const blend = base === 4 ? 0 : ease(clamp((local - 0.275) / 0.675));
  const active = Math.min(4, base + (blend >= 0.5 ? 1 : 0));
  const panels = Array.from({ length: 5 }, (_, index) => {
    const weight = index === base ? 1 - blend : index === base + 1 ? blend : 0;
    return {
      opacity: reduced ? Number(index === active) : weight,
      y: reduced ? 0 : index === base ? -100 * blend : 100 * (1 - blend),
    };
  });
  return { active, panels };
}
