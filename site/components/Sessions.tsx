"use client";

import { useEffect, useRef, useState } from "react";
import { sessions } from "../content";
import { bars, clamp, useStatic, isStatic, sstep, useScrollFrame } from "./hooks";

const N = 46;
const WAVES = sessions.map((_, i) => bars(N, i * 3 + 2));
const A0 = -6, A1 = 18; // tonearm angle (deg) at the outer / inner groove
const armFor = (tr: number) => A0 + (A1 - A0) * ((tr + 0.5) / sessions.length);

/** THE NEEDLE DROP (signature): scroll swings the tonearm onto the record and across it; the record turns with the scroll (and by itself),
 *  the tracks light up as the needle reaches them and their waveform fills. Hovering a track slides its record out of the sleeve (U02)
 *  and sends the needle there. Pure function of scroll when not hovered. */
export default function Sessions() {
  const [active, setActive] = useState(0);
  const hovRef = useRef<number | null>(null);
  const lastHov = useRef(-1e9);
  const arm = useRef<SVGGElement>(null);
  const rec = useRef<SVGGElement>(null);
  const waves = useRef<(HTMLDivElement | null)[]>([]);
  const lastActive = useRef(0);
  const stat = useStatic();

  const setHover = (k: number | null) => { hovRef.current = k; if (k === null) lastHov.current = performance.now(); };

  const ref = useScrollFrame<HTMLElement>((r, vh) => {
    const run = Math.max(1, r.height - vh);
    const p = isStatic() ? 0.5 : clamp(-r.top / run);
    const h = hovRef.current;
    const dropT = sstep(0, 0.1, p);
    const body = clamp((p - 0.1) / 0.9);
    const tr = Math.min(sessions.length - 1, Math.floor(body * sessions.length));
    const tp = clamp(body * sessions.length - tr);
    let ang = -30 + (A0 + 30) * dropT + (A1 - A0) * body;
    let track = tr, prog = tp;
    if (h !== null) { ang = armFor(h); track = h; prog = (performance.now() / 6000) % 1; }
    if (arm.current) {
      arm.current.style.transition = h !== null || performance.now() - lastHov.current < 700 ? "transform 0.6s cubic-bezier(0.3,0.7,0.2,1)" : "none";
      arm.current.style.transform = `rotate(${ang.toFixed(2)}deg)`;
    }
    if (rec.current) rec.current.style.transform = `rotate(${(p * 900).toFixed(1)}deg)`;
    if (track !== lastActive.current) { lastActive.current = track; setActive(track); }
    waves.current.forEach((w, k) => {
      if (!w) return;
      const on = k === track;
      const kids = w.children;
      for (let i = 0; i < kids.length; i++) (kids[i] as HTMLElement).style.opacity = on ? (i / kids.length < prog ? "1" : "0.38") : "0.45";
    });
  }, [stat]);

  useEffect(() => { waves.current.forEach((w, k) => w?.classList.toggle("live", k === active)); }, [active]);

  return (
    <section ref={ref} id="sessions" data-record-time="4.6" data-record-align="bottom" data-record-hold="1.8" data-record-label="sessions" className="pl-rail relative bg-bg" style={{ height: stat ? "100vh" : "240vh" }}>
      <div className="sticky top-0 grid h-screen grid-cols-[1fr_620px] items-center overflow-hidden border-t border-line">
        <div className="flex h-full items-center justify-center px-8">
          <svg viewBox="0 0 700 640" className="h-[82vh] max-h-[760px] w-full" role="img" aria-label="Record player">
            <rect x="20" y="20" width="660" height="600" fill="#17100e" stroke="#3a2e27" />
            <g ref={rec} style={{ transformOrigin: "300px 320px" }}>
              <g className="spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx="300" cy="320" r="250" fill="#070504" />
                {Array.from({ length: 10 }, (_, i) => <circle key={i} cx="300" cy="320" r={110 + i * 14} fill="none" stroke="#eadbc0" strokeOpacity={0.06 + (i % 3) * 0.02} />)}
                <path d="M300 320 L300 72 A248 248 0 0 1 470 140 Z" fill="#eadbc0" fillOpacity="0.05" />
                <path d="M300 320 L300 568 A248 248 0 0 1 130 500 Z" fill="#eadbc0" fillOpacity="0.05" />
                <circle cx="300" cy="320" r="78" fill="#d4432b" />
                <circle cx="300" cy="320" r="60" fill="none" stroke="#0e0a09" strokeOpacity="0.45" />
                <line x1="300" y1="262" x2="300" y2="282" stroke="#0e0a09" strokeWidth="3" />
                <circle cx="300" cy="320" r="6" fill="#0e0a09" />
              </g>
            </g>
            <g ref={arm} style={{ transformOrigin: "600px 70px", transform: "rotate(-30deg)" }}>
              <line x1="600" y1="70" x2="540" y2="420" stroke="#eadbc0" strokeWidth="7" strokeLinecap="round" />
              <circle cx="600" cy="70" r="36" fill="#2a1f1a" stroke="#eadbc0" strokeWidth="2" />
              <circle cx="600" cy="70" r="9" fill="#ffc46b" />
              <rect x="525" y="408" width="30" height="20" fill="#ffc46b" transform="rotate(10 540 420)" />
              <line x1="540" y1="428" x2="538" y2="438" stroke="#eadbc0" strokeWidth="2" />
            </g>
          </svg>
        </div>
        <div className="h-full border-l border-line py-[11vh]">
          <div className="px-9">
            <div className="mono cap flex items-center gap-3 text-muted"><span className="rec-dot" /> Now playing · made-up sessions</div>
            <h2 className="font-display mt-3 text-[132px] leading-[0.86] text-fg">Session log.</h2>
          </div>
          <div className="mt-8 border-t border-line">
            {sessions.map((s, i) => (
              <div key={s.n} className={`row-s grid cursor-pointer grid-cols-[100px_1fr_auto] items-center gap-4 px-9 py-4 ${active === i ? "on" : ""}`}
                onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} data-cursor="Play" {...(i === 1 ? { "data-hover-demo": "", "data-hover-hold": "1.6" } : {})}>
                <div className="relative h-[54px]">
                  <span className="disc" />
                  <span className="sleeve font-display text-[26px] text-bg">{s.n}</span>
                </div>
                <div>
                  <div className="font-display text-[50px] leading-[0.95]">{s.title}</div>
                  <div className="mono cap mt-1 text-[10px] opacity-70">{s.genre} · {s.len}</div>
                </div>
                <div ref={(el) => { waves.current[i] = el; }} className="wave w-[190px]" aria-hidden>
                  {WAVES[i].map((h, k) => <span key={k} style={{ height: `${h * 100}%`, ["--d" as string]: `${0.8 + (k % 5) * 0.17}s`, ["--dl" as string]: `${-k * 0.09}s` }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
