"use client";

import { useEffect, useRef } from "react";
import { MAX_DEPTH, ZONES, scrollState, zoneFor } from "@/lib/scroll";

const TRACK = 224;

function format(depth: number) {
  return `${(Math.round(depth / 10) * 10).toLocaleString("en-US")} m`;
}

export default function DepthGauge() {
  const value = useRef<HTMLSpanElement>(null);
  const zone = useRef<HTMLSpanElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const mobile = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;
    let shown = -1;
    const tick = () => {
      const depth = scrollState.depth;
      if (Math.abs(depth - shown) > 0.5) {
        shown = depth;
        const text = format(depth);
        const name = zoneFor(depth);
        if (value.current) value.current.textContent = text;
        if (zone.current) zone.current.textContent = name;
        if (mobile.current) mobile.current.textContent = `${text} · ${name}`;
        if (marker.current) marker.current.style.transform = `translateY(${(depth / MAX_DEPTH) * TRACK}px)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <>
      <aside
        aria-hidden
        className="pointer-events-none fixed top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col items-end gap-3 font-mono lg:flex"
      >
        <span className="text-[10px] tracking-[0.32em] text-mist">DEPTH</span>
        <span ref={value} className="text-sm text-foam tabular-nums">
          0 m
        </span>
        <div className="relative w-px bg-gradient-to-b from-glow/70 via-glow/25 to-glow/5" style={{ height: TRACK }}>
          {ZONES.slice(2).map((z) => (
            <span
              key={z.name}
              className="absolute right-0 h-px w-2 bg-glow/40"
              style={{ top: (z.from / MAX_DEPTH) * TRACK }}
            />
          ))}
          <span
            ref={marker}
            className="absolute -top-[4px] -left-[4px] size-[9px] rounded-full bg-glow shadow-[0_0_14px_3px_rgba(56,189,248,0.6)] transition-transform duration-300 ease-out"
          />
        </div>
        <span ref={zone} className="text-[10px] tracking-[0.24em] text-glow uppercase">
          Surface
        </span>
      </aside>
      <span
        ref={mobile}
        aria-hidden
        className="glass pointer-events-none fixed right-4 bottom-4 z-20 rounded-full px-3 py-1.5 font-mono text-[11px] text-foam/80 tabular-nums lg:hidden"
      >
        0 m · Surface
      </span>
    </>
  );
}
