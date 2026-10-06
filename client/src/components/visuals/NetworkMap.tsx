'use client';

import { useMemo, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { DESTINATIONS, HUB, MAP_HEIGHT, MAP_WIDTH, buildDotPath, project, routePath } from '@/lib/usMap';

/**
 * Dot-matrix US map with routes radiating from the Miami hub.
 * Routes draw in on first view; pulses then travel each lane on a loop.
 */
export function NetworkMap({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const reduce = useReducedMotion();

  const dots = useMemo(() => buildDotPath(), []);
  const routes = useMemo(() => DESTINATIONS.map((d) => ({ city: d, d: routePath(d), at: project(d.lonLat) })), []);
  const [hx, hy] = project(HUB.lonLat);
  const animate = inView || reduce;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
      className={className}
      role="img"
      aria-label="Illustrative map: routes from CargoFlow's Miami hub to destinations across the United States"
    >
      <path d={dots} stroke="currentColor" strokeOpacity="0.22" strokeWidth="3.4" strokeLinecap="round" />

      {routes.map(({ city, d }, i) => (
        <g key={city.code}>
          <motion.path
            d={d}
            fill="none"
            stroke="var(--color-sign)"
            strokeWidth="1.6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={animate ? { pathLength: 1, opacity: 0.9 } : undefined}
            transition={{ duration: 1.6, delay: 0.25 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          />
          {!reduce && inView && (
            <circle r="3.2" fill="var(--color-sign)">
              <animateMotion
                dur={`${3.4 + (i % 4) * 0.6}s`}
                begin={`${1.8 + i * 0.35}s`}
                repeatCount="indefinite"
                path={d}
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="spline"
                keySplines="0.45 0 0.55 1"
              />
            </circle>
          )}
        </g>
      ))}

      {routes.map(({ city, at: [x, y] }, i) => (
        <motion.g
          key={city.code}
          initial={{ opacity: 0 }}
          animate={animate ? { opacity: 1 } : undefined}
          transition={{ delay: 1.2 + i * 0.12, duration: 0.5 }}
        >
          <rect x={x - 3.5} y={y - 3.5} width="7" height="7" fill="currentColor" />
          <text
            x={city.anchor === 'end' ? x - 9 : x + 9}
            y={y + 3.5}
            textAnchor={city.anchor ?? 'start'}
            fontSize="10.5"
            fontFamily="var(--font-plex-mono)"
            letterSpacing="0.08em"
            fill="currentColor"
            fillOpacity="0.75"
          >
            {city.code}
          </text>
        </motion.g>
      ))}

      {/* Hub */}
      <g transform={`translate(${hx} ${hy})`}>
        {!reduce && inView && (
          <circle r="10" fill="none" stroke="var(--color-sign)" strokeWidth="1.5">
            <animate attributeName="r" values="8;30" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.4s" repeatCount="indefinite" />
          </circle>
        )}
        <rect x="-8" y="-8" width="16" height="16" rx="1.5" fill="var(--color-sign)" />
        <rect x="-3.5" y="-3.5" width="7" height="7" fill="var(--color-ink)" />
        <text
          x="16"
          y="4"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-plex-mono)"
          letterSpacing="0.1em"
          fill="var(--color-sign)"
        >
          MIA · HUB
        </text>
      </g>
    </svg>
  );
}
