import { Link } from 'react-router-dom';
import { SERVICES } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function Services() {
  return (
    <section id="services" className="section bg-ink-900">
      <div className="container-cf">
        <Reveal>
          <SectionHeader
            kicker="What We Move"
            heading="Logistics solutions built around your cargo."
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.key} delay={i * 0.1}>
              <div className="card card-hover flex h-full flex-col">
                <p className="kicker">{service.eyebrow}</p>
                <h3 className="mt-3 font-display text-xl text-white">{service.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-300">{service.short}</p>
                <ul className="mt-5 space-y-2">
                  {service.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex items-center gap-2 text-sm text-steel-400">
                      <span className="h-1 w-1 rounded-full bg-signal-400" aria-hidden="true" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link to={service.route} className="btn-secondary flex-1">
                    Learn More
                  </Link>
                  <Link to={service.cta.to} className="btn-primary flex-1">
                    {service.cta.label}
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
