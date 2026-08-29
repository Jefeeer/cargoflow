import { TECHNOLOGY, TRACKING_DEMO } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function Technology() {
  return (
    <section className="section bg-ink-900">
      <div className="container-cf">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
          <Reveal>
            <SectionHeader kicker={TECHNOLOGY.kicker} heading={TECHNOLOGY.headline} intro={TECHNOLOGY.body} />

            <ol className="mt-10 space-y-0">
              {TECHNOLOGY.milestones.map((m, i) => (
                <li key={m} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        i === 0 ? 'bg-signal-400' : 'bg-steel-600'
                      }`}
                      aria-hidden="true"
                    />
                    {i < TECHNOLOGY.milestones.length - 1 && (
                      <span className="my-1 w-px flex-1 bg-steel-700" aria-hidden="true" />
                    )}
                  </div>
                  <p className="pb-8 text-sm font-medium text-steel-200">{m}</p>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card border-signal-500/20">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel-500">Demo Tracking</p>
                <span className="rounded-full bg-signal-500/15 px-3 py-1 text-xs font-semibold text-signal-300">
                  Illustrative only
                </span>
              </div>

              <p className="mt-5 font-mono text-sm text-steel-400">{TRACKING_DEMO.trackingNumber}</p>
              <p className="mt-1 font-display text-xl text-white">{TRACKING_DEMO.status}</p>
              <p className="mt-1 text-sm text-steel-400">{TRACKING_DEMO.service}</p>

              <div className="mt-8 flex items-center justify-between">
                {TRACKING_DEMO.route.map((stop, i) => (
                  <div key={stop} className="flex flex-1 flex-col items-center text-center">
                    <span
                      className={`h-3 w-3 rounded-full ${
                        i <= TRACKING_DEMO.currentLegIndex ? 'bg-signal-400' : 'bg-steel-600'
                      }`}
                    />
                    <p className="mt-2 text-xs font-medium text-steel-300">{stop}</p>
                    {i < TRACKING_DEMO.route.length - 1 && (
                      <span
                        className="absolute mt-1.5 h-px w-1/3 -translate-x-1/2 bg-steel-700"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs text-steel-500">{TRACKING_DEMO.eta}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
