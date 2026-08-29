import { Link } from 'react-router-dom';
import { SEO } from '@/components/shared/SEO';
import { Reveal } from '@/components/shared/Reveal';
import { ABOUT } from '@/lib/content';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description="CargoFlow is a Miami-based logistics partner specializing in aviation parts transportation, freight forwarding, and business shipping."
      />

      <section className="section bg-ink-950 bg-tech-grid">
        <div className="container-cf">
          <Reveal>
            <p className="kicker">{ABOUT.kicker}</p>
            <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl leading-[1.05] text-balance">{ABOUT.headline}</h1>
            <div className="mt-6 max-w-2xl space-y-4 text-lg text-steel-300 text-pretty">
              {ABOUT.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container-cf">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 0.06}>
                <div className="card h-full">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-steel-500">{fact.label}</p>
                  <p className="mt-2 font-display text-lg text-white">{fact.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-ink-950 bg-tech-grid">
        <div className="container-cf">
          <Reveal>
            <div className="card mx-auto max-w-2xl border-signal-500/30 p-10 text-center">
              <h2 className="text-2xl sm:text-3xl text-balance">Ready to ship with CargoFlow?</h2>
              <p className="mt-3 text-steel-300">Tell us about your shipment and we'll help find the right solution.</p>
              <Link to="/quote" className="btn-primary btn-lg mt-6 inline-flex">
                Get a Free Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
