/**
 * Static/SVG fallback for the 3D network scene: used when the user prefers
 * reduced motion, WebGL is unavailable, or as the always-usable base under
 * the 3D canvas. Stylized US outline with Miami hub + route arcs.
 */
const DESTINATIONS = [
  { x: 620, y: 60, label: 'NYC' },
  { x: 520, y: 140, label: 'ATL' },
  { x: 300, y: 100, label: 'CHI' },
  { x: 90, y: 160, label: 'LAX' },
  { x: 430, y: 260, label: 'HOU' },
];

const MIAMI = { x: 560, y: 300 };

export function NetworkMapSVG({ animated = true }: { animated?: boolean }) {
  return (
    <svg
      viewBox="0 0 700 360"
      className="h-full w-full"
      role="img"
      aria-label="Illustrative map of CargoFlow's Miami hub and national shipping routes"
    >
      <defs>
        <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF6A2C" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6A2C" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* technical grid backdrop */}
      <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
        <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      </pattern>
      <rect width="700" height="360" fill="url(#grid)" />

      {/* route arcs */}
      {DESTINATIONS.map((d) => {
        const midX = (d.x + MIAMI.x) / 2;
        const midY = Math.min(d.y, MIAMI.y) - 60;
        const path = `M${MIAMI.x},${MIAMI.y} Q${midX},${midY} ${d.x},${d.y}`;
        return (
          <g key={d.label}>
            <path
              d={path}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 5"
              className={animated ? 'animate-[dash_18s_linear_infinite]' : undefined}
            />
            <circle cx={d.x} cy={d.y} r="4" fill="#7791B3" />
            <text x={d.x + 8} y={d.y + 4} fontSize="11" fill="#A3B6CE" fontFamily="monospace">
              {d.label}
            </text>
            {animated && (
              <circle r="3" fill="#FFC2A1">
                <animateMotion dur="5s" repeatCount="indefinite" path={path} />
              </circle>
            )}
          </g>
        );
      })}

      {/* Miami hub */}
      <circle cx={MIAMI.x} cy={MIAMI.y} r="9" fill="#FF6A2C" className={animated ? 'animate-pulse-dot' : undefined} />
      <circle cx={MIAMI.x} cy={MIAMI.y} r="16" fill="none" stroke="#FF6A2C" strokeOpacity="0.4" strokeWidth="1.5" />
      <text
        x={MIAMI.x}
        y={MIAMI.y + 30}
        fontSize="12"
        fontWeight="600"
        textAnchor="middle"
        fill="#FFFFFF"
        fontFamily="monospace"
      >
        MIAMI HUB
      </text>
    </svg>
  );
}
