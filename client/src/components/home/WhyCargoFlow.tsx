import { WHY_CARGOFLOW } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function WhyCargoFlow() {
  return (
    <section id="why" className="section bg-ink-950">
      <div className="container-cf">
        <Reveal>
          <SectionHeader kicker="Why CargoFlow" heading="A logistics partner built for what matters." />
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CARGOFLOW.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="card h-full">
                <h3 className="font-display text-base text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
