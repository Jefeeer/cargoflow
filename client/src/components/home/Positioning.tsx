import { POSITIONING } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

export function Positioning() {
  return (
    <section className="py-24 sm:py-32">
      <div className="shell">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <SectionLabel index="01">{POSITIONING.kicker}</SectionLabel>
          </Reveal>
          <div className="lg:col-span-9">
            <Reveal>
              <h2 className="t-h2">
                {POSITIONING.heading}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/75">{POSITIONING.body}</p>
            </Reveal>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {POSITIONING.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="border-t-2 border-ink pb-10 pt-5">
              <dt className="flex items-baseline justify-between">
                <span className="t-h3">{v.title}</span>
                <span className="label text-mute">V.{i + 1}</span>
              </dt>
              <dd className="mt-3 max-w-xs leading-relaxed text-mute">{v.body}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
