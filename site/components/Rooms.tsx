"use client";

import { useState } from "react";
import { rooms } from "../content";
import { bars } from "./hooks";

const BARS = bars(32, 7);

/** GL09 horizontal accordion (M257): the hovered room opens wide, the others fold to a vertical label, the lamp swells. */
export default function Rooms() {
  const [open, setOpen] = useState(0);
  return (
    <section id="rooms" data-record-time="2" data-record-hold="2.4" data-record-align="center" data-record-label="rooms" className="pl-rail bg-bg">
      <div className="mono cap flex items-center justify-between px-12 py-5 text-muted"><span>Rooms · 3</span><span>Hover a room</span></div>
      <div className="flex h-[78vh] border-y border-line" onMouseLeave={() => setOpen(0)}>
        {rooms.map((r, i) => (
          <div key={r.n} className={`room ${open === i ? "open" : ""}`} onMouseEnter={() => setOpen(i)} data-cursor="Open" {...(i === 1 ? { "data-hover-demo": "", "data-hover-hold": "1.6" } : {})}>
            <div className="room-vert">
              <span className="font-display whitespace-nowrap text-[64px] text-fg" style={{ writingMode: "vertical-rl" }}>{r.name}</span>
              <span className="mono cap absolute left-4 top-4 text-muted">{r.n}</span>
            </div>
            <div className="room-body">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.img} alt={r.name} className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: r.pos }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(14,10,9,0.55), rgba(14,10,9,0.08) 40%, rgba(14,10,9,0.85))" }} />
              <div className="room-glow" />
              <div className="absolute left-9 top-8">
                <div className="mono cap text-fg">{r.n}</div>
                <div className="font-display mt-2 text-[clamp(90px,9vw,150px)] leading-[0.86] text-fg">{r.name}</div>
              </div>
              <div className="absolute bottom-8 left-9 right-9 flex items-end justify-between gap-8">
                <p className="mono max-w-[330px] text-[14px] leading-relaxed text-fg">{r.spec}</p>
                <div className="flex h-14 items-end gap-[4px]" aria-hidden>
                  {BARS.map((h, k) => <span key={k} className="bar block w-[6px] bg-fg" style={{ height: `${h * 100}%`, ["--d" as string]: `${0.9 + (k % 5) * 0.2}s`, ["--dl" as string]: `${-k * 0.11}s` }} />)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
