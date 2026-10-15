"use client";

import { useRef } from "react";
import { gear } from "../content";
import { clamp, isStatic, sstep, useScrollFrame } from "./hooks";

/** PS22 tile wall (M211): tiles rise in as a corner-to-corner wave. Hover floods a tile lamp-yellow and prints its name + a sample year. */
export default function Gear() {
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const wall = useScrollFrame<HTMLDivElement>((r, vh) => {
    if (isStatic()) return;
    const q = clamp((vh * 0.98 - r.top) / (vh * 0.62));
    tiles.current.forEach((el, i) => {
      if (!el) return;
      const d = ((i % 4) + Math.floor(i / 4)) / 4; // 0..1 from the top-left corner
      const t = sstep(d * 0.5, d * 0.5 + 0.5, q);
      el.style.opacity = String(t);
      el.style.transform = `translateY(${((1 - t) * 40).toFixed(1)}px) scale(${(0.94 + 0.06 * t).toFixed(3)})`;
    });
  }, []);
  const demo = new Set([1, 2, 6]);
  return (
    <section id="gear" data-record-time="2" data-record-hold="3.4" data-record-align="center" data-record-label="gear" className="pl-rail bg-bg">
      <div className="flex items-end justify-between px-12 pb-6 pt-10">
        <h2 className="font-display text-[130px] leading-[0.86] text-fg">The gear.</h2>
        <div className="mono cap pb-3 text-muted">18 pieces · 8 shown · hover any</div>
      </div>
      <div ref={wall} className="grid grid-cols-4 border-l border-t border-line">
        {gear.map((g, i) => (
          <div key={g.id} ref={(el) => { tiles.current[i] = el; }} className="tile" data-cursor="Look" {...(demo.has(i) ? { "data-hover-demo": "", "data-hover-hold": "1.0" } : {})}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/tallow-tape/${g.id}.jpg`} alt={g.name} style={{ objectPosition: g.pos, transform: g.zoom !== 1 ? `scale(${g.zoom})` : undefined, transformOrigin: g.pos }} />
            <div className="flood" />
            <div className="tname mono cap text-fg">{g.name}</div>
            <div className="tyear mono text-[13px] font-semibold">{g.year} · sample</div>
          </div>
        ))}
      </div>
    </section>
  );
}
