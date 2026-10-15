"use client";

import { useEffect, useRef } from "react";
import { footer, hook } from "../content";
import { clamp, useStatic, isStatic, sstep, useScrollFrame } from "./hooks";

const ROWS = [
  { dir: -1, cls: "text-fg", stroke: false },
  { dir: 1, cls: "", stroke: true },
  { dir: -1, cls: "text-accent", stroke: false },
];
const TEXT = `${footer.word} · `.repeat(3);

/** FO08 giant velocity marquee (M397): three rows of the wordmark run in opposite directions all the time; scroll velocity multiplies their speed
 *  and flips their lean. The lamp dims as the last screen arrives. */
export default function Footer() {
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const dim = useRef<HTMLDivElement>(null);
  const x = useRef([0, 0, 0]);
  const stat = useStatic();

  useEffect(() => {
    if (isStatic()) return;
    let raf = 0, last = performance.now(), y = window.scrollY, v = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const nv = (window.scrollY - y) / Math.max(dt, 0.001);
      y = window.scrollY;
      v += (nv - v) * 0.08;
      const boost = Math.min(5, Math.abs(v) / 500);
      const sgn = v < -50 ? -1 : 1;
      rows.current.forEach((el, i) => {
        if (!el) return;
        const half = (el.firstElementChild as HTMLElement | null)?.offsetWidth || 3000;
        const sp = (70 + i * 28) * (1 + boost) * sgn * ROWS[i].dir;
        x.current[i] = (((x.current[i] + sp * dt) % half) + half) % half;
        el.style.transform = `translateX(${-x.current[i]}px) skewX(${(-v / 400 * ROWS[i].dir).toFixed(2)}deg)`;
      });
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stat]);

  const ref = useScrollFrame<HTMLElement>((r, vh) => {
    if (dim.current) dim.current.style.opacity = String(isStatic() ? 0 : 0.6 * sstep(0.9, 0.1, clamp(r.top / vh)));
  }, [stat]);

  return (
    <footer ref={ref} data-record-time="2.0" data-record-align="bottom" data-record-hold="0.8" data-record-label="footer" className="pl-rail relative h-screen overflow-hidden border-t border-line bg-bg">
      <div className="flex h-[calc(100vh-72px)] flex-col justify-center overflow-hidden">
        {ROWS.map((r, i) => (
          <div key={i} className="overflow-hidden">
            <div ref={(el) => { rows.current[i] = el; }} className={`mq font-display flex text-[26vh] leading-[0.92] ${r.cls}`} style={r.stroke ? { color: "transparent", WebkitTextStroke: "2px var(--cream)" } : undefined}>
              <span className="shrink-0">{TEXT}</span><span className="shrink-0" aria-hidden>{TEXT}</span><span className="shrink-0" aria-hidden>{TEXT}</span>
            </div>
          </div>
        ))}
      </div>
      <div ref={dim} className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0 }} />
      <div className="mono cap relative z-10 flex h-[72px] items-center justify-between border-t border-line bg-bg px-12 text-fg">
        <span>{footer.note}</span>
        <span className="hidden text-muted lg:block">{hook}</span>
        <span>{footer.hours}</span>
      </div>
    </footer>
  );
}
