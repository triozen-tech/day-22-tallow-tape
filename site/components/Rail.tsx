"use client";

import { useEffect, useState } from "react";
import { nav } from "../content";

type Lenis = { scrollTo: (t: number | HTMLElement, o?: object) => void };

/** NV09 fixed side rail. Vertical labels; each is a per-word clone ticker (M276): the twin rolls in on hover and on the section in view. */
export default function Rail() {
  const [on, setOn] = useState("");
  useEffect(() => {
    const t = setInterval(() => {
      const mid = window.innerHeight * 0.45;
      let cur = "";
      for (const n of nav) {
        const r = document.getElementById(n.id)?.getBoundingClientRect();
        if (r && r.top <= mid && r.bottom > mid) cur = n.id;
      }
      setOn(cur);
    }, 140);
    return () => clearInterval(t);
  }, []);
  const go = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <nav className="fixed bottom-0 left-0 top-0 z-50 flex flex-col items-center justify-between border-r border-line bg-bg py-5" style={{ width: "var(--rail)" }}>
      <div className="flex flex-col items-center gap-2">
        <span className="rec-dot" />
        <span className="mono cap text-[10px] font-bold text-fg">REC</span>
      </div>
      <div className="flex flex-col items-center gap-7">
        {nav.map((n) => (
          <button key={n.id} onClick={() => go(n.id)} data-cursor="Go" className={`rail-link mono cap cursor-pointer text-[11px] font-bold text-fg ${on === n.id ? "on" : ""}`}>
            <span className="rail-label"><span className="roll"><span>{n.label}</span><span aria-hidden>{n.label}</span></span></span>
          </button>
        ))}
      </div>
      <button onClick={() => window.scrollTo({ top: 0 })} className="rail-label mono cap cursor-pointer text-[11px] font-bold text-fg">Tallow &amp; Tape</button>
    </nav>
  );
}
