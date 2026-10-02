const clamp = (value) => Math.max(0, Math.min(1, value));

export function avatarFrame(progress, reduced = false) {
  const p = reduced ? 0 : clamp(progress);
  return {
    scale: 1 - p * 0.16,
    x: p * 8,
    y: p * 3,
    radius: 50 - p * 17,
    turn: p * 8,
  };
}
