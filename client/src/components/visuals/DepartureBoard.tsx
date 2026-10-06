'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { BOARD_ROWS, BOARD_STATUSES, type BoardRow } from '@/lib/content';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-';

interface FlapTextProps {
  value: string;
  length: number;
  /** ms before this cell starts settling — staggers rows/columns. */
  delay?: number;
  tone?: 'paper' | 'sign' | 'dim';
}

/**
 * A run of split-flap tiles. When `value` changes, each tile cycles through random
 * glyphs and settles left-to-right — the cadence of a real Solari board.
 */
function FlapText({ value, length, delay = 0, tone = 'paper' }: FlapTextProps) {
  const reduce = useReducedMotion();
  const target = value.padEnd(length, ' ').slice(0, length);
  const [shown, setShown] = useState(target);
  const frame = useRef<number>(0);
  const shownRef = useRef(shown);

  useEffect(() => {
    if (reduce) {
      setShown(target);
      return;
    }
    const start = performance.now() + delay;
    // Each position settles at its own time; spaces settle almost immediately.
    const settleAt = [...target].map((ch, i) => start + i * 45 + (ch === ' ' ? 0 : 220 + Math.random() * 260));
    let last = 0;

    const step = (now: number) => {
      if (now - last > 55) {
        last = now;
        let done = true;
        const next = [...target]
          .map((ch, i) => {
            if (now >= settleAt[i]) return ch;
            done = false;
            if (now < start) return shownRef.current[i] ?? ' ';
            return ch === ' ' && Math.random() > 0.3 ? ' ' : CHARSET[(Math.random() * CHARSET.length) | 0];
          })
          .join('');
        shownRef.current = next;
        setShown(next);
        if (done) return;
      }
      frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame.current);
  }, [target, delay, reduce]);

  const color = tone === 'sign' ? 'text-sign' : tone === 'dim' ? 'text-paper/45' : 'text-paper';
  return (
    <span className="inline-flex gap-[2px]" aria-hidden="true">
      {[...shown].map((ch, i) => (
        <span
          key={i}
          className={`relative inline-grid h-[1.6em] w-[1.12em] place-items-center rounded-[2px] bg-ink-3 font-mono font-medium ${color}`}
        >
          {ch === ' ' ? ' ' : ch}
          {/* the flap hinge */}
          <span className="absolute inset-x-0 top-1/2 h-px bg-ink/90" />
        </span>
      ))}
    </span>
  );
}

function nextStatus(current: string) {
  const i = BOARD_STATUSES.indexOf(current as (typeof BOARD_STATUSES)[number]);
  return BOARD_STATUSES[(i + 1) % BOARD_STATUSES.length];
}

export function DepartureBoard() {
  const reduce = useReducedMotion();
  const [rows, setRows] = useState<BoardRow[]>(BOARD_ROWS);
  const cursor = useRef(0);

  // Advance one row's status every few seconds so the board feels live.
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      const idx = cursor.current % BOARD_ROWS.length;
      cursor.current += 2; // skip around the board rather than marching top-down
      setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, status: nextStatus(r.status) } : r)));
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <figure className="relative overflow-hidden rounded-[4px] bg-ink p-4 text-paper shadow-[0_40px_80px_-40px_rgba(14,14,12,0.6)] sm:p-6">
      <figcaption className="flex items-center justify-between gap-4 border-b border-paper/10 pb-4">
        <span className="label flex items-center gap-2 text-sign">
          <span className="inline-block h-2 w-2 animate-blink rounded-full bg-sign" aria-hidden="true" />
          Outbound · Miami MIA
        </span>
        <span className="label text-paper/45">Sample board — illustrative</span>
      </figcaption>

      <div className="mt-4 overflow-x-auto text-[clamp(0.6rem,1.15vw,0.8rem)]">
        <table className="w-full border-separate border-spacing-y-[6px]">
          <thead>
            <tr className="label text-left text-[0.6rem] text-paper/40">
              <th className="hidden pr-4 font-medium sm:table-cell">Ref</th>
              <th className="pr-4 font-medium">Destination</th>
              <th className="hidden pr-4 font-medium md:table-cell">Service</th>
              <th className="font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={row.ref}>
                <td className="hidden pr-4 sm:table-cell">
                  <FlapText value={row.ref} length={6} delay={r * 90} tone="dim" />
                  <span className="sr-only">{row.ref}</span>
                </td>
                <td className="pr-4">
                  <FlapText value={row.to} length={11} delay={r * 90 + 120} />
                  <span className="sr-only">{row.to}</span>
                </td>
                <td className="hidden pr-4 md:table-cell">
                  <FlapText value={row.service} length={8} delay={r * 90 + 240} tone="dim" />
                  <span className="sr-only">{row.service}</span>
                </td>
                <td>
                  <FlapText
                    value={row.status}
                    length={12}
                    delay={r * 90 + 360}
                    tone={row.status === 'DELIVERED' ? 'paper' : 'sign'}
                  />
                  <span className="sr-only">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
