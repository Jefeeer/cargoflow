import { Link } from 'react-router-dom';
import { AVIATION } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';

export function Aviation() {
  return (
    <section className="section relative overflow-hidden bg-ink-950 bg-tech-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/70 to-transparent" />
      <div className="container-cf relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="kicker">{AVIATION.kicker}</p>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-balance">
              {AVIATION.headline}
            </h2>
            <p className="mt-5 text-lg text-steel-300 text-pretty">{AVIATION.body}</p>
            <Link to={AVIATION.cta.to} className="btn-primary btn-lg mt-8 inline-flex">
              {AVIATION.cta.label}
            </Link>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card border-signal-500/20">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel-500">
                Requirements Blueprint
              </p>
              <ul className="mt-5 space-y-4">
                {AVIATION.requirements.map((req, i) => (
                  <li key={req.title} className="flex gap-4 border-t border-steel-500/15 pt-4 first:border-t-0 first:pt-0">
                    <span className="font-mono text-sm text-signal-400">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <p className="font-display text-sm font-semibold text-white">{req.title}</p>
                      <p className="mt-1 text-sm text-steel-400">{req.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
