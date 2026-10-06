import { TECHNOLOGY } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SpecimenWaybill } from '@/components/visuals/SpecimenWaybill';

export function Technology() {
  return (
    <section className="bg-dots bg-paper-2 py-24 sm:py-32">
      <div className="shell grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <SectionLabel index="06">{TECHNOLOGY.kicker}</SectionLabel>
          <h2 className="mt-6 t-h2">
            {TECHNOLOGY.headline}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-mute">{TECHNOLOGY.body}</p>
          <ol className="mt-10 flex flex-wrap gap-2">
            {TECHNOLOGY.milestones.map((m, i) => (
              <li key={m} className="label flex items-center gap-2 rounded-[2px] bg-paper px-2.5 py-1.5 text-ink/75 shadow-[inset_0_0_0_1px_var(--rule)]">
                <span className="text-mute-2">{i + 1}</span>
                {m}
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7">
          <SpecimenWaybill />
        </Reveal>
      </div>
    </section>
  );
}
