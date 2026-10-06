import Link from 'next/link';
import { SERVICES, type ServiceContent } from '@/lib/content';
import { PageHero } from '@/components/site/PageHero';
import { ClosingCTA } from '@/components/site/ClosingCTA';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Arrow } from '@/components/ui/Arrow';
import { ProcessRoute } from '@/components/home/ProcessRoute';

interface ServiceDetailProps {
  service: ServiceContent;
  /** Optional service-specific section between "included" and "process". */
  feature?: React.ReactNode;
}

/** Shared layout for the Aviation, Freight Forwarding, and Business Shipping pages. */
export function ServiceDetail({ service, feature }: ServiceDetailProps) {
  const others = SERVICES.filter((s) => s.key !== service.key);

  return (
    <>
      <PageHero
        trail={['Services', service.title]}
        kicker={service.eyebrow}
        title={service.title}
        code={service.code}
        intro={<p>{service.description}</p>}
      >
        <Link href={service.cta.to} className="btn btn-ink">
          {service.cta.label}
          <Arrow className="arrow" />
        </Link>
      </PageHero>

      <section className="py-24 sm:py-28">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel index="01">What&apos;s included</SectionLabel>
            <h2 className="mt-6 t-h2">
              Covered on every shipment.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <ul className="waybill grid-cols-1 sm:grid-cols-2">
              {service.highlights.map((h, i) => (
                <li key={h} className="flex items-start gap-4 bg-paper p-6">
                  <span className="label pt-1 text-mute">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 text-lg font-medium tracking-tight">{h}</span>
                  <span aria-hidden="true" className="grid h-5 w-5 place-items-center bg-ink text-sign">
                    <svg viewBox="0 0 10 10" className="h-3 w-3">
                      <path d="M1.5 5.5 4 8l4.5-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {feature}

      <section className="bg-paper-2 py-24 sm:py-28">
        <div className="shell">
          <Reveal>
            <SectionLabel index="02">How it moves</SectionLabel>
            <h2 className="mt-6 max-w-2xl t-h2">
              From your first message to confirmed delivery.
            </h2>
          </Reveal>
          <div className="mt-16">
            <ProcessRoute />
          </div>
        </div>
      </section>

      <nav aria-label="Other services" className="border-t-2 border-ink">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {others.map((s, i) => (
            <Link
              key={s.key}
              href={s.route}
              className={`group flex items-center gap-6 p-8 transition-colors duration-300 hover:bg-sign sm:p-10 ${
                i === 0 ? 'border-b-2 border-ink sm:border-b-0 sm:border-r-2' : ''
              }`}
            >
              <span className="sign sign-location h-14 w-14 justify-center p-0 text-2xl">{s.code}</span>
              <span className="flex-1">
                <span className="label block text-mute">Also from CargoFlow</span>
                <span className="t-h3 mt-1 block">{s.title}</span>
              </span>
              <Arrow size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </nav>

      <ClosingCTA
        headline="Ready to ship with CargoFlow?"
        body={`Tell us about your shipment and get started with a ${service.title.toLowerCase()} quote.`}
        primary={service.cta}
      />
    </>
  );
}
