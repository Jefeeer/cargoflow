import Link from 'next/link';
import { AVIATION } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Arrow } from '@/components/ui/Arrow';
import { EngineBlueprint } from '@/components/visuals/EngineBlueprint';

export function AviationFeature() {
  return (
    <section className="on-dark relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="03" className="text-sign">
              {AVIATION.kicker}
            </SectionLabel>
            <h2 className="mt-6 t-h2">
              {AVIATION.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-end lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-paper/70">{AVIATION.body}</p>
            <Link href={AVIATION.cta.to} className="btn btn-sign mt-8 self-start">
              {AVIATION.cta.label}
              <Arrow className="arrow" />
            </Link>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mt-16 border border-paper/15">
          <EngineBlueprint />
        </Reveal>
      </div>
    </section>
  );
}
