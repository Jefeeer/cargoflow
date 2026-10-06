import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ProcessRoute } from './ProcessRoute';

export function Process() {
  return (
    <section id="process" className="bg-paper-2 py-24 sm:py-32">
      <div className="shell">
        <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionLabel index="04">The process</SectionLabel>
            <h2 className="mt-6 t-h2">
              How CargoFlow works.
            </h2>
          </div>
          <p className="self-end text-lg leading-relaxed text-mute lg:col-span-4 lg:col-start-9">
            Four stops from first message to confirmed delivery, with clear communication at each one.
          </p>
        </Reveal>
        <div className="mt-16 lg:mt-20">
          <ProcessRoute />
        </div>
      </div>
    </section>
  );
}
