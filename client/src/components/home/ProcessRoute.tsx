'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { PROCESS } from '@/lib/content';

/** The four-stop journey; a route line fills as you scroll and each stop lights up as it's reached. */
export function ProcessRoute() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setReached(Math.min(PROCESS.length, Math.floor(v * PROCESS.length + 0.25) + 1));
  });



  return (
    <div ref={ref} className="relative">
      {/* Horizontal track (desktop) */}
      <div aria-hidden="true" className="absolute left-0 right-0 top-[1.15rem] hidden h-[3px] bg-ink/10 lg:block">
        <motion.div className="h-full origin-left bg-ink" style={{ scaleX: progress }} />
      </div>
      {/* Vertical track (mobile) */}
      <div aria-hidden="true" className="absolute bottom-0 left-[1.15rem] top-0 w-[3px] bg-ink/10 lg:hidden">
        <motion.div className="h-full w-full origin-top bg-ink" style={{ scaleY: progress }} />
      </div>

      <ol className="relative grid grid-cols-1 lg:grid-cols-4">
      {PROCESS.map((step, i) => {
        const on = i < reached;
        return (
          <li key={step.number} className="relative pb-14 pl-16 lg:pb-0 lg:pl-0 lg:pr-10">
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 grid h-[2.6rem] w-[2.6rem] place-items-center rounded-[3px] font-mono text-sm font-medium transition-colors duration-500 lg:relative ${
                on ? 'bg-sign text-ink' : 'bg-paper-2 text-mute'
              }`}
              style={{ boxShadow: 'inset 0 0 0 2px var(--color-ink)' }}
            >
              {step.number}
            </span>
            <h3
              className={`t-h3 mt-0 transition-colors duration-500 lg:mt-8 ${
                on ? 'text-ink' : 'text-ink/40'
              }`}
            >
              {step.title}
            </h3>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-mute">{step.body}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {step.points.map((p) => (
                <li key={p} className="label rounded-[2px] bg-paper-2 px-2 py-1 text-[0.6rem] text-ink/70">
                  {p}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
      </ol>
    </div>
  );
}
