"use client";

import { useEffect, useRef } from "react";
import FrameScrub from "@/components/video/FrameScrub";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CLIP_AT, PX, SEGS, STILL_AT, V, W } from "../clips";
import { heroLabels, hook } from "../content";
import { bars, sstep } from "./hooks";

const HOLD = 520; // px the last frame (the mic) rests before Rooms
const METER = bars(9, 4);

/** HR28 hero: the glide through the studio (V1..V5 on one scroll). Title splits apart (M370), hook line sweeps in (M134). */
export default function Hero() {
  const top = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLDivElement>(null);
  const hookEl = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const code = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const par = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const idx = useRef(-1);

  const onProgress = (p: number, still: boolean) => {
    const vh = window.innerHeight;
    const q = still ? 0.09 : p;
    const s = sstep(0.0, 0.14, q);
    const fade = still ? 1 : 1 - sstep(0.14, 0.2, q);
    if (top.current) { top.current.style.transform = `translateY(${(-s * 0.4 * vh).toFixed(1)}px)`; top.current.style.opacity = String(fade); }
    if (bot.current) { bot.current.style.transform = `translateY(${(s * 0.4 * vh).toFixed(1)}px)`; bot.current.style.opacity = String(fade); }
    if (hookEl.current) hookEl.current.style.opacity = String(still ? 1 : 1 - sstep(0.3, 0.38, p));
    if (hint.current) hint.current.style.opacity = String(still ? 0 : 1 - sstep(0.0, 0.03, p));
    let i = 0;
    CLIP_AT.forEach((a, k) => { if (p >= a - 0.004) i = k; });
    if (i !== idx.current) { idx.current = i; if (label.current) label.current.textContent = heroLabels[i]; }
    if (code.current) {
      const sec = (still ? STILL_AT : Math.min(1, p)) * (W / 24);
      code.current.textContent = `00:${String(Math.floor(sec)).padStart(2, "0")}:${Math.floor((sec % 1) * 10)}`;
    }
  };

  // hook line: a linear clip sweep with a block caret riding its edge, as the shutter seam opens (shutter:open)
  useEffect(() => {
    const el = hookEl.current;
    if (!el) return;
    if (prefersReducedMotion()) { el.style.setProperty("--w", "100%"); return; }
    el.style.setProperty("--w", "0%");
    const run = () => { gsap.to(el, { "--w": "100%", duration: 0.5, ease: "none" }); };
    if ((window as unknown as { __shutterOpen?: boolean }).__shutterOpen) { run(); return; }
    window.addEventListener("shutter:open", run, { once: true });
    return () => window.removeEventListener("shutter:open", run);
  }, []);

  // pointer nudge: the picture leans a few px toward the mouse
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = stage.current!;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const mv = (e: MouseEvent) => { const r = el.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - 0.5) * -16; ty = ((e.clientY - r.top) / r.height - 0.5) * -9; };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      if (par.current) par.current.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(1.035)`;
    };
    el.addEventListener("mousemove", mv);
    raf = requestAnimationFrame(tick);
    return () => { el.removeEventListener("mousemove", mv); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="top" data-record-time="9" data-record-align="bottom" data-record-hold="0.85" data-record-label="hero" className="relative" style={{ height: `${Math.round(W * PX + 900 + HOLD)}px` }}>
      <div ref={stage} className="sticky top-0 h-screen overflow-hidden bg-bg">
        <div ref={par} className="absolute inset-0" style={{ transform: "scale(1.035)" }}>
          <FrameScrub segs={SEGS} clipOrder={V} stillAt={STILL_AT} hold={HOLD} snapJoins={false} onProgress={onProgress} />
        </div>
        <div className="lamp-flicker" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,10,9,0.72) 0%, rgba(14,10,9,0) 24%, rgba(14,10,9,0) 62%, rgba(14,10,9,0.8) 100%)" }} />

        <div className="mono cap absolute left-[88px] right-12 top-7 flex justify-between text-fg">
          <span>Recording · Mixing · Mastering · Rehearsal</span>
          <span>Open 10:00 – 22:00</span>
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(14,10,9,0.4) 0%, rgba(14,10,9,0.4) 48%, rgba(14,10,9,0) 78%)", maskImage: "linear-gradient(180deg, transparent 12%, #000 30%, #000 92%, transparent 100%)", WebkitMaskImage: "linear-gradient(180deg, transparent 12%, #000 30%, #000 92%, transparent 100%)" }} />

        <div ref={top} className="pointer-events-none absolute left-[88px] right-12 bottom-[calc(50%+44px)] will-change-transform">
          <div className="font-display text-[min(13.6vw,21.6vh)] leading-[0.86] text-fg">Studios <span className="text-accent">sound</span></div>
        </div>
        <div ref={bot} className="pointer-events-none absolute left-[88px] right-12 top-[calc(50%-26px)] will-change-transform">
          <div className="font-display text-[min(13.6vw,21.6vh)] leading-[0.86] text-fg">like this.</div>
        </div>

        <div ref={hookEl} className="mono absolute bottom-[16vh] left-[88px] inline-block whitespace-nowrap text-[42px] leading-[1.35] text-fg" style={{ ["--w" as string]: "0%", color: "#eadbc0" }}>
          <span className="block" style={{ clipPath: "inset(0 calc(100% - var(--w)) 0 0)", borderBottom: "3px solid var(--accent)", paddingBottom: 4, textShadow: "0 2px 14px rgba(14,10,9,0.9)" }}>{hook}</span>
          <span className="caret absolute top-0 h-full w-[13px] bg-lamp" style={{ left: "var(--w)", background: "var(--lamp)" }} />
        </div>

        <div className="mono cap absolute bottom-7 left-[88px] right-12 flex items-end justify-between text-fg">
          <div className="flex items-center gap-3"><span className="rec-dot" /> REC · <span ref={label}>{heroLabels[0]}</span> · <span ref={code}>00:00:0</span></div>
          <div ref={hint} className="text-muted">Scroll ↓</div>
          <div className="flex h-9 items-end gap-[3px]" aria-hidden>
            {METER.map((h, i) => (
              <span key={i} className="bar block w-[5px] bg-accent" style={{ height: `${h * 100}%`, ["--d" as string]: `${0.8 + (i % 4) * 0.23}s`, ["--dl" as string]: `${-i * 0.17}s` }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
