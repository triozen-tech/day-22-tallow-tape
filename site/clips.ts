import type { Seg } from "@/lib/chain";

// Data only: the hero film (V1..V5), frames from `npm run film-frames`. K = keyframe: V1 K1>K2, V2 K2>K3, V3 K3>K4, V4 K4>K5, V5 K5>K6.
export const V = [1, 2, 3, 4, 5].map((n) => `/frames/tallow-tape-v${n}`);

// Scroll weight = frame count (units). Every join fades in over 8 units (~0.3 s of video), except V4>V5.
// V4 is trimmed to end at 6.96 s (where its baked ghost dissolve starts) and V5 starts at 2.38 s (the frame that best matches
// that picture); they meet in one 12-unit (~0.5 s) crossfade, so the viewer sees a single smooth dissolve.
export const SEGS: Seg[] = [
  { clip: V[0], w: 192 },
  { clip: V[1], w: 192 },
  { clip: V[2], w: 192 },
  { clip: V[3], w: 168 },
  { clip: V[4], w: 134, fade: 12 },
];
export const W = SEGS.reduce((a, s) => a + ("w" in s && s.w ? s.w : 0), 0); // 878
/** Scroll px per unit (a frame): the whole film is ~2800 px. */
export const PX = 3.2;
/** ?static=1 shows K3: the start of V3 (unit 384), a few frames in so its fade-in is done. */
export const STILL_AT = (192 * 2 + 4.5) / W;
/** Film position (0..1) where each clip starts. */
export const CLIP_AT = SEGS.reduce<number[]>((a, s, i) => [...a, i ? a[i - 1] + ((SEGS[i - 1] as { w: number }).w / W) : 0], []);
