"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { loading } from "@/lib/loading";
import { clipProgress, ensureClip } from "@/lib/frames";
import { V } from "../clips";

/** I29 split shutter loader: the wordmark sits across a centre seam with a counter; when the first frames are in, the two
 *  halves slide apart (power4.inOut, ~1 s) and open on the first frame of V1. Shows for ~1.2 s at least. */
export default function Shutter() {
  const [gone, setGone] = useState(false);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      loading.markFinished();
      return;
    }
    ensureClip(V[0]);
    const t0 = performance.now();
    let raf = 0;
    let exiting = false;
    const numbers = () => root.current?.querySelectorAll<HTMLElement>("[data-n]") ?? [];
    const bars = () => root.current?.querySelectorAll<HTMLElement>("[data-bar]") ?? [];
    const exit = () => {
      exiting = true;
      gsap
        .timeline()
        .to(left.current, { xPercent: -100, duration: 1.0, ease: "power4.inOut" }, 0)
        .to(right.current, { xPercent: 100, duration: 1.0, ease: "power4.inOut" }, 0)
        .add(() => loading.markFinished(), 0.15)
        .add(() => setGone(true), 1.05);
    };
    const tick = () => {
      if (exiting) return;
      const el = (performance.now() - t0) / 1000;
      const real = el > 7 ? 1 : Math.min(1, clipProgress(V[0]) / 0.3);
      const shown = Math.min(real, el / 0.8);
      const txt = String(Math.round(shown * 100)).padStart(3, "0");
      numbers().forEach((n) => (n.textContent = txt));
      bars().forEach((b) => (b.style.transform = `scaleX(${shown})`));
      if (shown >= 1) return exit();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (gone) return null;

  const content = (
    <div className="flex h-full w-[100vw] flex-col items-center justify-center" style={{ paddingLeft: "var(--rail)" }}>
      <div className="mono cap mb-5 flex items-center gap-3 text-muted"><span className="rec-dot" /> REC · loading the room</div>
      <div className="font-display text-[clamp(96px,17vw,250px)] leading-[0.9] text-fg">TALLOW &amp; TAPE</div>
      <div className="mt-8 flex items-center gap-5">
        <span className="mono text-[13px] tracking-[0.2em] text-accent" data-n>000</span>
        <div className="h-px w-[220px] bg-line"><div data-bar className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} /></div>
      </div>
    </div>
  );

  return (
    <div ref={root} data-loader aria-hidden className="fixed inset-0 z-[100] pointer-events-none">
      <div ref={left} className="absolute left-0 top-0 h-screen w-1/2 overflow-hidden bg-bg" style={{ borderRight: "1px solid var(--line)" }}>
        <div className="h-full" style={{ width: "100vw" }}>{content}</div>
      </div>
      <div ref={right} className="absolute right-0 top-0 h-screen w-1/2 overflow-hidden bg-bg">
        <div className="h-full" style={{ width: "100vw", marginLeft: "-50vw" }}>{content}</div>
      </div>
    </div>
  );
}
