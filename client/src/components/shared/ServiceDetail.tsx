import { Link } from 'react-router-dom';
import type { ServiceContent } from '@/lib/content';
import { SEO } from '@/components/shared/SEO';
import { Reveal } from '@/components/shared/Reveal';

interface ServiceDetailProps {
  service: ServiceContent;
  seoDescription: string;
}

/** Shared detail-page layout for each service (Aviation, Freight, Business Shipping). */
export function ServiceDetail({ service, seoDescription }: ServiceDetailProps) {
  return (
    <>
      <SEO title={service.title} description={seoDescription} />

      <section className="relative overflow-hidden bg-ink-950 bg-tech-grid py-24 sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/10 to-ink-950" />
        <div className="container-cf relative">
          <Reveal>
            <p className="kicker">{service.eyebrow}</p>
            <h1 className="mt-4 max-w-2xl text-4xl sm:text-5xl leading-[1.05] text-balance">{service.title}</h1>
            <p className="mt-5 max-w-2xl text-lg text-steel-300 text-pretty">{service.description}</p>
            <Link to={service.cta.to} className="btn-primary btn-lg mt-8 inline-flex">
              {service.cta.label}
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-ink-900">
        <div className="container-cf">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl text-balance">What&apos;s Included</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.highlights.map((h, i) => (
              <Reveal key={h} delay={i * 0.05}>
                <div className="card flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-signal-400" aria-hidden="true" />
                  <p className="text-sm text-steel-200">{h}</p>
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
              <p className="mt-3 text-steel-300">
                Tell us about your shipment and get started with a {service.title.toLowerCase()} quote.
              </p>
              <Link to={service.cta.to} className="btn-primary btn-lg mt-6 inline-flex">
                {service.cta.label}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
