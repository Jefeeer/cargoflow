import { WHY_CARGOFLOW } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';

/** Reasons set as a specification sheet: sticky heading left, numbered clauses right. */
export function WhyCargoFlow() {
  return (
    <section id="why" className="py-24 sm:py-32">
      <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal className="lg:sticky lg:top-32">
            <SectionLabel index="05">Why CargoFlow</SectionLabel>
            <h2 className="mt-6 t-h2">
              A logistics partner built for what matters.
            </h2>
            <div aria-hidden="true" className="bg-hatch mt-10 h-3 w-40 rounded-[1px]" />
          </Reveal>
        </div>

        <ol className="lg:col-span-7">
          {WHY_CARGOFLOW.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={i * 0.04}
              className="group grid grid-cols-[3.5rem_1fr] gap-4 border-t border-ink/20 py-7 last:border-b sm:grid-cols-[5rem_1fr]"
            >
              <span className="tabular text-3xl font-light leading-none tracking-tight text-ink/25 transition-colors duration-500 group-hover:text-ink">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="t-h3">{item.title}</h3>
                <p className="mt-2 max-w-lg leading-relaxed text-mute">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
