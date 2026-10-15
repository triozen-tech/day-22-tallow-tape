"use client";

import { useEffect, useRef, useState } from "react";
import { days, slots } from "../content";
import { bars } from "./hooks";

const R = 88;
const C = 2 * Math.PI * R;
const WAVE = bars(30, 5);
const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

/** CC12 booking: pick a day and a slot, then hold the mic to leave a voice note. The voice note is SIMULATED (an animated ring,
 *  counter and waveform only): the page never asks for a microphone and uses no media or audio API. A quick tap runs a 3 s demo take. */
export default function Booking() {
  const [day, setDay] = useState(4);
  const [slot, setSlot] = useState(1);
  const [phase, setPhase] = useState<"idle" | "rec" | "done">("idle");
  const [t, setT] = useState(0);
  const [sent, setSent] = useState(false);
  const run = useRef({ start: 0, down: false, tap: false, raf: 0, last: 0 });

  const stop = (final: boolean) => {
    cancelAnimationFrame(run.current.raf);
    run.current.down = false;
    if (final) setPhase("done");
  };
  const loop = () => {
    const r = run.current;
    const el = (performance.now() - r.start) / 1000;
    setT(el);
    r.last = el;
    const limit = r.tap ? 3.2 : 12;
    if (el >= limit || (!r.down && !r.tap)) return stop(true);
    r.raf = requestAnimationFrame(loop);
  };
  const down = () => {
    if (phase === "rec") return;
    const r = run.current;
    r.start = performance.now(); r.down = true; r.tap = false;
    setPhase("rec"); setT(0);
    r.raf = requestAnimationFrame(loop);
  };
  const up = () => {
    const r = run.current;
    if (phase !== "rec" || !r.down) return;
    r.down = false;
    if ((performance.now() - r.start) / 1000 < 0.6) r.tap = true; // a tap: let the demo take run to 3.2 s
  };
  useEffect(() => () => cancelAnimationFrame(run.current.raf), []);

  const limit = run.current.tap ? 3.2 : 12;
  const prog = phase === "done" ? 1 : Math.min(1, t / limit);
  const shown = phase === "done" ? run.current.last : t;

  return (
    <section id="book" data-record-time="1.8" data-record-hold="4.2" data-record-align="center" data-record-label="booking" className="pl-rail border-t border-line bg-bg">
      <div className="grid min-h-screen grid-cols-[1fr_700px] items-center gap-10 px-12">
        <div>
          <div className="mono cap text-muted">Book a session</div>
          <h2 className="font-display mt-3 text-[min(16vw,25vh)] leading-[0.84] text-fg">Book<br />a day.</h2>
        </div>
        <div className="space-y-5">
          <div className="grid grid-cols-7 border border-fg">
            {days.map((d, i) => (
              <button key={d} onClick={() => setDay(i)} className={`dchip mono cap cursor-pointer border-r border-fg py-4 last:border-r-0 ${day === i ? "on" : ""}`}>{d}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {slots.map((s, i) => <button key={s} onClick={() => setSlot(i)} className={`chip mono cap cursor-pointer ${slot === i ? "on" : ""}`}>{s}</button>)}
          </div>

          <div className="flex items-center gap-8 border border-line p-6">
            <button aria-label="Hold to leave a voice note (simulated)" data-cursor="Hold" data-hover-demo="click" data-hover-hold="2.4"
              className="mic-btn relative h-[200px] w-[200px] shrink-0 cursor-pointer select-none touch-none"
              onPointerDown={down} onPointerUp={up} onPointerLeave={up}
              onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) down(); }} onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") up(); }}>
              <svg viewBox="0 0 200 200" className="mic-ring absolute inset-0 h-full w-full -rotate-90">
                <circle cx="100" cy="100" r={R} fill="none" stroke="#3a2e27" strokeWidth="6" />
                <circle cx="100" cy="100" r={R} fill="none" stroke={phase === "done" ? "#ffc46b" : "#d4432b"} strokeWidth="6" strokeLinecap="butt" strokeDasharray={C} strokeDashoffset={C * (1 - prog)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {phase === "done" ? (
                  <svg viewBox="0 0 40 40" className="h-14 w-14"><path d="M8 21 L17 29 L33 11" fill="none" stroke="#ffc46b" strokeWidth="4" strokeDasharray="40" style={{ animation: "tick-in 0.5s ease-out both" }} /></svg>
                ) : (
                  <span className={`rec-dot ${phase === "rec" ? "" : "opacity-30"}`} style={{ width: 14, height: 14 }} />
                )}
                <span className="font-display mt-1 text-[46px] leading-none text-fg">{fmt(shown)}</span>
              </div>
            </button>
            <div className="min-w-0 flex-1">
              <div className="mono cap text-fg">{phase === "done" ? "Voice note saved" : phase === "rec" ? "Recording…" : "Hold to leave a voice note"}</div>
              <div className="mono mt-1 text-[12px] text-muted">Simulated: no microphone is used or asked for.</div>
              <div className="mt-4 flex h-10 items-center gap-[3px]" aria-hidden>
                {WAVE.map((h, i) => {
                  const live = phase === "rec" ? 0.25 + 0.75 * Math.abs(Math.sin(t * 5 + i * 0.9) * Math.cos(t * 2.3 + i * 0.4)) : phase === "done" ? h : 0.12 + h * 0.18;
                  return <span key={i} className="block w-[5px]" style={{ height: `${live * 100}%`, background: phase === "done" ? "#ffc46b" : phase === "rec" ? "#d4432b" : "#a39580", transition: phase === "rec" ? "none" : "height 0.4s" }} />;
                })}
              </div>
              {phase === "done" && <button onClick={() => { setPhase("idle"); setT(0); }} className="mono cap mt-3 cursor-pointer text-[10px] text-muted underline">Record again</button>}
            </div>
          </div>

          <button onClick={() => setSent(true)} data-cursor="Send" className="btn-lamp mono cap block w-full cursor-pointer py-5 text-[13px]">
            {sent ? `Request sent · ${days[day]} ${slots[slot]} (concept)` : "Request session →"}
          </button>
        </div>
      </div>
    </section>
  );
}
