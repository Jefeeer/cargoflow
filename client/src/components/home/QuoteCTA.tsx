import { Link } from 'react-router-dom';
import { QUOTE_CTA } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';

export function QuoteCTA() {
  return (
    <section className="section bg-ink-950 bg-tech-grid">
      <div className="container-cf">
        <Reveal>
          <div className="card mx-auto max-w-3xl border-signal-500/30 bg-gradient-to-br from-ink-850 to-ink-900 p-10 text-center sm:p-14">
            <h2 className="text-3xl sm:text-4xl text-balance">{QUOTE_CTA.headline}</h2>
            <p className="mt-4 text-lg text-steel-300 text-pretty">{QUOTE_CTA.body}</p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to={QUOTE_CTA.primaryCta.to} className="btn-primary btn-lg">
                {QUOTE_CTA.primaryCta.label}
              </Link>
              <Link to={QUOTE_CTA.secondaryCta.to} className="btn-secondary btn-lg">
                {QUOTE_CTA.secondaryCta.label}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
