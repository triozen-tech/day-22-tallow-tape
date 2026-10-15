"use client";

import { useEffect, useRef, useState } from "react";

/** Pure function of scroll: calls `cb(rect, vh)` every animation frame while the element is near the screen. */
export function useScrollFrame<T extends HTMLElement>(cb: (r: DOMRect, vh: number, el: T) => void, deps: unknown[] = []) {
  const ref = useRef<T>(null);
  const f = useRef(cb);
  f.current = cb;
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -300 || r.top > vh + 300) return;
      f.current(r, vh, el);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const sstep = (a: number, b: number, x: number) => {
  const m = clamp((x - a) / (b - a));
  return m * m * (3 - 2 * m);
};
let _st: boolean | null = null;
export const isStatic = () => (typeof window === "undefined" ? false : (_st ??= new URLSearchParams(window.location.search).has("static")));

/** Seeded 0..1 values for waveform bars. */
export function bars(n: number, seed = 1) {
  return Array.from({ length: n }, (_, i) => {
    const a = Math.sin(i * 1.7 + seed) * 0.5 + Math.sin(i * 0.43 + seed * 2.1) * 0.35 + Math.sin(i * 3.1 + seed) * 0.15;
    return 0.18 + 0.82 * Math.abs(a);
  });
}

/** true after mount when the page is opened with ?static=1 (state, so the server and first client render agree). */
export function useStatic() {
  const [s, set] = useState(false);
  useEffect(() => set(isStatic()), []);
  return s;
}
