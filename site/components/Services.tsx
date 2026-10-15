"use client";

import { useRef } from "react";
import { services } from "../content";
import { clamp, isStatic, sstep, useScrollFrame } from "./hooks";

/** PD08 numbered rail (M425): the rail line draws down with scroll and each step's number, title and price mask in from their own scroll position. */
export default function Services() {
  const line = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const ref = useScrollFrame<HTMLElement>((r, vh) => {
    if (isStatic()) return;
    const q = clamp((vh * 0.9 - r.top) / (r.height * 0.9));
    if (line.current) line.current.style.transform = `scaleY(${q})`;
    rows.current.forEach((el) => {
      if (!el) return;
      const t = sstep(vh * 0.92, vh * 0.5, el.getBoundingClientRect().top);
      el.querySelectorAll<HTMLElement>("[data-m]").forEach((m, k) => {
        const tt = clamp(t * 1.3 - k * 0.14);
        m.style.transform = `translateY(${((1 - sstep(0, 1, tt)) * 110).toFixed(1)}%)`;
      });
      const pr = el.querySelector<HTMLElement>("[data-price]");
      if (pr) pr.style.transform = `translateX(${((1 - sstep(0.3, 1, t)) * 40).toFixed(1)}px)`, (pr.style.opacity = String(sstep(0.3, 1, t)));
    });
  }, []);
  return (
    <section ref={ref} id="services" data-record-time="1.6" data-record-hold="0.8" data-record-align="center" data-record-label="services" className="pl-rail relative bg-bg">
      <div className="grid grid-cols-[400px_1fr] border-b border-line">
        <div className="relative border-r border-line px-12 py-14">
          <div className="mono cap text-muted">What we do</div>
          <h2 className="font-display mt-4 text-[150px] leading-[0.86] text-fg">Four<br />jobs.</h2>
          <div ref={line} className="absolute bottom-0 right-[-1px] top-0 w-[2px] origin-top bg-accent" style={{ transform: "scaleY(1)" }} />
        </div>
        <div>
          {services.map((s, i) => (
            <div key={s.n} ref={(el) => { rows.current[i] = el; }} className="grid grid-cols-[110px_1fr_300px] items-center border-b border-line px-10 py-9 last:border-b-0" data-cursor="Book">
              <div className="overflow-hidden"><div data-m className="font-display text-[84px] text-accent">{s.n}</div></div>
              <div>
                <div className="overflow-hidden"><div data-m className="font-display text-[84px] leading-[0.95] text-fg">{s.name}</div></div>
                <div className="overflow-hidden"><div data-m className="mono mt-1 text-[13px] text-muted">{s.note}</div></div>
              </div>
              <div data-price className="mono text-right text-[14px] text-fg">{s.price}<div className="cap mt-1 text-[10px] text-muted">{s.unit}</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
