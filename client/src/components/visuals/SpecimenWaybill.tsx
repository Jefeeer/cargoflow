import { TECHNOLOGY, TRACKING_DEMO } from '@/lib/content';

/** Deterministic barcode-looking bars derived from the reference string. Decorative only. */
function Barcode({ value }: { value: string }) {
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  for (const ch of `*${value}*`) {
    const code = ch.charCodeAt(0);
    for (let b = 0; b < 6; b++) {
      const w = ((code >> b) & 1) + 1;
      if (b % 2 === 0) bars.push({ x, w });
      x += w + 1;
    }
  }
  return (
    <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" className="h-12 w-full" aria-hidden="true">
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} y="0" width={bar.w} height="40" fill="currentColor" />
      ))}
    </svg>
  );
}

function Cell({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-paper px-4 py-3 ${className}`}>
      <p className="label text-[0.6rem] text-mute">{label}</p>
      <div className="mt-1.5 text-[0.9375rem] font-medium">{children}</div>
    </div>
  );
}

const CURRENT = TECHNOLOGY.milestones.indexOf(TRACKING_DEMO.status as (typeof TECHNOLOGY.milestones)[number]);

export function SpecimenWaybill() {
  const [origin, via, destination] = TRACKING_DEMO.route;

  return (
    <div className="relative">
      <article
        aria-label="Specimen shipment record — illustrative demo, not a live shipment"
        className="relative bg-paper text-ink shadow-[0_1px_0_var(--rule),0_30px_60px_-30px_rgba(14,14,12,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:-rotate-[1.25deg] lg:hover:rotate-0"
      >
        <header className="grid grid-cols-[1fr_auto] items-end gap-6 border-b-2 border-ink p-5">
          <div>
            <p className="xwide text-sm font-[750] uppercase">CargoFlow</p>
            <p className="label mt-1 text-[0.6rem] text-mute">Shipment record · Not negotiable</p>
          </div>
          <div className="w-40 text-right sm:w-52">
            <Barcode value={TRACKING_DEMO.trackingNumber} />
            <p className="label mt-1 text-[0.65rem] tracking-[0.2em]">{TRACKING_DEMO.trackingNumber}</p>
          </div>
        </header>

        <div className="waybill grid-cols-2 sm:grid-cols-3">
          <Cell label="01 Origin">{origin}</Cell>
          <Cell label="02 Via">{via}</Cell>
          <Cell label="03 Destination" className="col-span-2 sm:col-span-1">
            {destination}
          </Cell>
          <Cell label="04 Nature of goods" className="col-span-2">
            {TRACKING_DEMO.service}
          </Cell>
          <Cell label="05 Status" className="col-span-2 sm:col-span-1">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 animate-blink rounded-full bg-ink" aria-hidden="true" />
              {TRACKING_DEMO.status}
            </span>
          </Cell>
        </div>

        <div className="p-5">
          <p className="label text-[0.6rem] text-mute">06 Milestones</p>
          <ol className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2.5 sm:grid-cols-3">
            {TECHNOLOGY.milestones.map((m, i) => {
              const done = i < CURRENT;
              const now = i === CURRENT;
              return (
                <li key={m} className="flex items-center gap-2.5 text-sm">
                  <span
                    className={`grid h-4 w-4 shrink-0 place-items-center border-[1.5px] border-ink ${
                      now ? 'bg-sign' : done ? 'bg-ink text-paper' : ''
                    }`}
                    aria-hidden="true"
                  >
                    {done && (
                      <svg viewBox="0 0 10 10" className="h-2.5 w-2.5">
                        <path d="M1.5 5.5 4 8l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      </svg>
                    )}
                  </span>
                  <span className={now ? 'font-semibold' : done ? 'text-ink' : 'text-mute'}>
                    {m}
                    <span className="sr-only">{done ? ' (complete)' : now ? ' (current)' : ' (pending)'}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <footer className="border-t border-dashed border-ink/30 px-5 py-3">
          <p className="label text-[0.6rem] text-mute">{TRACKING_DEMO.eta}</p>
        </footer>

        {/* Rubber stamp */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[34%] top-5 hidden rotate-[-9deg] sm:block rounded-[4px] border-[3px] border-stamp px-3 py-1 text-stamp opacity-85 mix-blend-multiply"
          style={{ boxShadow: 'inset 0 0 0 2px var(--color-paper), inset 0 0 0 4px var(--color-stamp)' }}
        >
          <span className="xwide text-2xl font-[800] uppercase tracking-[0.08em]">Specimen</span>
        </div>
      </article>
    </div>
  );
}
