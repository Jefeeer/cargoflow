import { CARGO_TYPES } from '@/lib/content';

/** Yellow marquee of what CargoFlow moves. The duplicate run is hidden from assistive tech. */
export function CargoTicker() {
  const run = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {CARGO_TYPES.map((item) => (
        <li key={item} className="flex items-center">
          <span className="wide px-6 text-sm font-[700] uppercase tracking-wide sm:text-base">{item}</span>
          <span aria-hidden="true" className="h-2 w-2 rotate-45 bg-ink" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="What we move" className="overflow-hidden border-y-2 border-ink bg-sign py-4 text-ink">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {run(false)}
        {run(true)}
      </div>
    </section>
  );
}
