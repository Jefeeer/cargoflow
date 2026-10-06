import { ABOUT, NETWORK } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { NetworkMap } from '@/components/visuals/NetworkMap';

export function Network({ index = '07' }: { index?: string }) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <SectionLabel index={index} className="text-sign">
              {NETWORK.kicker}
            </SectionLabel>
            <h2 className="mt-6 t-h2">
              {NETWORK.headline}
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="self-end lg:col-span-5 lg:col-start-8">
            <p className="text-lg leading-relaxed text-paper/65">{NETWORK.body}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14">
          <NetworkMap className="h-auto w-full text-paper" />
        </Reveal>

        <dl className="mt-14 grid grid-cols-1 gap-px bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.facts.map((f) => (
            <div key={f.label} className="bg-ink py-5 pr-6 sm:px-6 sm:first:pl-0">
              <dt className="label text-paper/45">{f.label}</dt>
              <dd className="mt-2 text-lg font-medium leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
