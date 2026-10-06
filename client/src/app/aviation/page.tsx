import type { Metadata } from 'next';
import { AVIATION, SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/site/ServiceDetail';
import { Reveal } from '@/components/ui/Reveal';
import { EngineBlueprint } from '@/components/visuals/EngineBlueprint';

const service = SERVICES.find((s) => s.key === 'aviation')!;

export const metadata: Metadata = {
  title: service.title,
  description:
    'Aviation parts transportation from Miami — time-critical, carefully handled shipping for aircraft parts, engines, and specialized equipment.',
  alternates: { canonical: '/aviation' },
};

export default function AviationPage() {
  return (
    <ServiceDetail
      service={service}
      feature={
        <section className="bg-ink py-24 text-paper sm:py-28">
          <div className="shell">
            <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <h2 className="t-h2 lg:col-span-6">
                {AVIATION.headline}
              </h2>
              <p className="self-end text-lg leading-relaxed text-paper/65 lg:col-span-5 lg:col-start-8">
                {AVIATION.body}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-14 border border-paper/15">
              <EngineBlueprint />
            </Reveal>
          </div>
        </section>
      }
    />
  );
}
