import Link from 'next/link';
import { SERVICES } from '@/lib/content';
import { Arrow } from '@/components/ui/Arrow';

const [aviation, freight, business] = SERVICES;

/** One direction sign in the array: designator + destination + arrow, black on yellow. */
function DirectionSign({
  code,
  label,
  href,
  dir,
  arrowFirst = false,
}: {
  code: string;
  label: string;
  href: string;
  dir: 'left' | 'up' | 'right';
  arrowFirst?: boolean;
}) {
  const arrow = <Arrow dir={dir} size={26} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />;
  return (
    <Link
      href={href}
      className="group flex min-h-[4.75rem] flex-1 items-center justify-center gap-4 bg-sign px-5 text-ink transition-colors duration-300 hover:bg-ink hover:text-sign"
    >
      {arrowFirst && arrow}
      <span className="xwide text-[1.625rem] font-[800] leading-none">{code}</span>
      <span className="xwide max-w-[14ch] text-[0.8125rem] font-[700] uppercase leading-tight sm:hidden xl:block">
        {label}
      </span>
      {!arrowFirst && arrow}
    </Link>
  );
}

/**
 * Navigation set as an airfield sign array — direction signs flanking a location sign.
 * Each panel links to a service.
 */
export function SignArray() {
  return (
    <nav aria-label="Services" className="bg-ink p-1">
      <div className="flex flex-col gap-1 sm:flex-row">
        <DirectionSign code={aviation.code} label={aviation.title} href={aviation.route} dir="left" arrowFirst />
        <div className="hidden min-h-[4.75rem] items-center justify-center bg-ink px-8 sm:flex" style={{ boxShadow: 'inset 0 0 0 3px var(--color-sign), inset 0 0 0 6px var(--color-ink)' }}>
          <span className="xwide text-[1.625rem] font-[800] leading-none text-sign">MIA</span>
        </div>
        <DirectionSign code={freight.code} label={freight.title} href={freight.route} dir="up" />
        <DirectionSign code={business.code} label={business.title} href={business.route} dir="right" />
      </div>
    </nav>
  );
}
