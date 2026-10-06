'use client';

import { useState } from 'react';
import { AVIATION } from '@/lib/content';

/** Callout anchor (on the part) and badge position, per requirement, in drawing units. */
const CALLOUTS: { at: [number, number]; badge: [number, number] }[] = [
  { at: [110, 104], badge: [70, 34] }, // Precision — fan
  { at: [612, 170], badge: [612, 96] }, // Urgency — exhaust
  { at: [300, 66], badge: [300, 24] }, // Communication — nacelle
  { at: [232, 214], badge: [196, 312] }, // Careful handling — compressor
  { at: [444, 216], badge: [480, 312] }, // Reliable scheduling — turbine
];

const COMPRESSOR = Array.from({ length: 8 }, (_, k) => ({ x: 168 + k * 21, h: 118 - k * 7 }));
const TURBINE = Array.from({ length: 3 }, (_, k) => ({ x: 420 + k * 16, h: 70 + k * 10 }));

export function EngineBlueprint() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-px bg-paper/15 lg:grid-cols-[1fr_minmax(0,22rem)]">
      {/* Drawing sheet */}
      <figure className="relative bg-ink p-4 sm:p-6">
        <svg viewBox="0 0 660 340" className="h-auto w-full text-paper" aria-hidden="true">
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
            </pattern>
          </defs>

          {/* Overall-length dimension */}
          <g stroke="currentColor" strokeOpacity="0.4" strokeWidth="0.8">
            <path d="M64 56V44M626 56V44M64 50H626" />
            <path d="M64 50l7 -3v6zM626 50l-7 -3v6z" fill="currentColor" fillOpacity="0.4" />
          </g>

          {/* Centreline — long-dash-short-dash, per drafting convention */}
          <path d="M30 170H650" stroke="currentColor" strokeOpacity="0.35" strokeDasharray="18 4 3 4" />

          <g fill="none" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4">
            {/* Fan cowl */}
            <path d="M66 84C90 66 180 60 300 66S450 92 500 112" />
            <path d="M66 256C90 274 180 280 300 274S450 248 500 228" />
            <path d="M66 84Q54 170 66 256" />
            <path d="M74 92C120 80 200 78 300 84S440 104 486 120" strokeOpacity="0.4" />
            <path d="M74 248C120 260 200 262 300 256S440 236 486 220" strokeOpacity="0.4" />
            {/* Core cowl & exhaust plug */}
            <path d="M462 124C520 130 556 138 576 146V194C556 202 520 210 462 216" />
            <path d="M576 150Q610 160 626 170Q610 180 576 190" />
            {/* Spinner */}
            <path d="M104 148Q80 160 74 170Q80 180 104 192" />
            {/* Combustor */}
            <rect x="346" y="126" width="62" height="88" rx="10" />
            <path d="M356 146h42M356 170h42M356 194h42" strokeOpacity="0.4" strokeDasharray="3 4" />
            {/* Shaft */}
            <rect x="110" y="164" width="466" height="12" strokeOpacity="0.5" />
          </g>

          {/* Sectioned parts get hatching */}
          <g stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.2" fill="url(#hatch)">
            <rect x="102" y="86" width="16" height="168" rx="7" />
            {COMPRESSOR.map(({ x, h }) => (
              <rect key={x} x={x} y={170 - h / 2} width="9" height={h} rx="2" />
            ))}
            {TURBINE.map(({ x, h }) => (
              <rect key={x} x={x} y={170 - h / 2} width="10" height={h} rx="2" />
            ))}
          </g>

          {/* Callouts */}
          {CALLOUTS.map(({ at: [ax, ay], badge: [bx, by] }, i) => {
            const on = active === i;
            return (
              <g key={i} className="transition-opacity duration-300" opacity={active === null || on ? 1 : 0.35}>
                <path
                  d={`M${ax} ${ay}L${bx} ${by}`}
                  stroke={on ? 'var(--color-sign)' : 'currentColor'}
                  strokeOpacity={on ? 1 : 0.6}
                  strokeWidth={on ? 1.6 : 1}
                />
                <circle cx={ax} cy={ay} r="3" fill={on ? 'var(--color-sign)' : 'currentColor'} />
                <circle
                  cx={bx}
                  cy={by}
                  r="13"
                  fill={on ? 'var(--color-sign)' : 'var(--color-ink)'}
                  stroke={on ? 'var(--color-sign)' : 'currentColor'}
                  strokeWidth="1.2"
                />
                <text
                  x={bx}
                  y={by + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="var(--font-plex-mono)"
                  fill={on ? 'var(--color-ink)' : 'currentColor'}
                >
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Drawing title block */}
        <figcaption className="label mt-4 grid grid-cols-2 border border-paper/20 text-[0.6rem] text-paper/55 sm:grid-cols-4">
          <span className="border-b border-r border-paper/20 px-3 py-2 sm:border-b-0">Dwg CF-AV-001</span>
          <span className="border-b border-paper/20 px-3 py-2 sm:border-b-0 sm:border-r">Handling requirements</span>
          <span className="border-r border-paper/20 px-3 py-2">Scale: NTS</span>
          <span className="px-3 py-2">Schematic only</span>
        </figcaption>
      </figure>

      {/* Requirements key */}
      <ol className="bg-ink">
        {AVIATION.requirements.map((req, i) => (
          <li
            key={req.title}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            className="border-b border-paper/15 last:border-b-0"
          >
            <div
              className={`flex w-full gap-4 px-5 py-5 transition-colors duration-300 ${
                active === i ? 'bg-sign text-ink' : 'text-paper'
              }`}
            >
              <span className={`label pt-1 ${active === i ? 'text-ink' : 'text-sign'}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-tight">{req.title}</span>
                <span className={`mt-1 block text-sm leading-relaxed ${active === i ? 'text-ink/75' : 'text-paper/60'}`}>
                  {req.body}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
