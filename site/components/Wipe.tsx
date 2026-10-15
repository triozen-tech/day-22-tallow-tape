"use client";

import { useRef } from "react";
import { clamp, useStatic, isStatic, sstep, useScrollFrame } from "./hooks";

const ROWS = 7;

/** X34 kinetic type wipe: rows of the brand word scale up and rotate, each sliding at its own speed until type fills the frame,
 *  then the next section fades up behind. Pure function of scroll. In ?static=1 the band is a calm still row of type. */
export default function Wipe() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const grp = useRef<HTMLDivElement>(null);
  const stat = useStatic();
  const ref = useScrollFrame<HTMLElement>((r, vh) => {
    const run = r.height - vh;
    const q = clamp(-r.top / run);
    const rot = -90 * sstep(0.12, 0.78, q);
    const sc = 1 + 1.7 * sstep(0.1, 0.8, q);
    if (grp.current) grp.current.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    rows.current.forEach((el, i) => {
      if (!el) return;
      const dir = i % 2 ? 1 : -1;
      const sp = 20 + i * 7;
      el.style.transform = `translateX(${(dir * (sp * q * 10 - 40)).toFixed(1)}%)`;
    });
    if (grp.current) grp.current.style.opacity = String(1 - sstep(0.82, 0.98, q));
  }, []);
  return (
    <section ref={ref} aria-hidden data-record-time="1.2" data-record-label="wipe" className="relative bg-bg" style={{ height: stat ? "46vh" : "190vh" }}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden" style={{ height: stat ? "46vh" : "100vh" }}>
        <div ref={grp} className="w-[160vw] shrink-0 will-change-transform" style={{ opacity: 1 }}>
          {Array.from({ length: ROWS }, (_, i) => (
            <div key={i} ref={(el) => { rows.current[i] = el; }} className="font-display whitespace-nowrap text-[15vh] leading-[0.9]" style={{ color: i % 3 === 1 ? "var(--accent)" : "transparent", WebkitTextStroke: i % 3 === 1 ? "0" : "1px var(--cream)" }}>
              TALLOW &amp; TAPE · TALLOW &amp; TAPE · TALLOW &amp; TAPE · TALLOW &amp; TAPE
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
