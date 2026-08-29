import { POSITIONING } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function Positioning() {
  return (
    <section className="section bg-ink-950">
      <div className="container-cf">
        <Reveal>
          <SectionHeader kicker={POSITIONING.kicker} heading={POSITIONING.heading} intro={POSITIONING.body} />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POSITIONING.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="card h-full">
                <h3 className="font-display text-lg text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
