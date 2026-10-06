interface ArrowProps {
  className?: string;
  /** Direction the arrow points. Airfield signs use all eight. */
  dir?: 'right' | 'left' | 'up' | 'down' | 'up-right';
  size?: number;
}

const ROTATION: Record<NonNullable<ArrowProps['dir']>, number> = {
  right: 0,
  'up-right': -45,
  up: -90,
  left: 180,
  down: 90,
};

/** Signage arrow — heavy shaft, open triangular head. */
export function Arrow({ className, dir = 'right', size = 16 }: ArrowProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ transform: `rotate(${ROTATION[dir]}deg)` }}
    >
      <path d="M1 8h12.5M8.5 2.5 14 8l-5.5 5.5" stroke="currentColor" strokeWidth="2.25" strokeLinejoin="miter" />
    </svg>
  );
}
