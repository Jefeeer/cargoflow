import { PROCESS } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';

export function Process() {
  return (
    <section className="section bg-ink-900">
      <div className="container-cf">
        <Reveal>
          <SectionHeader kicker="The Process" heading="How CargoFlow Works" align="center" className="mx-auto" />
        </Reveal>

        <ol className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} as="li">
              <div className="relative">
                <span className="font-display text-4xl font-bold text-signal-500/30">{step.number}</span>
                <h3 className="mt-3 font-display text-lg text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-300">{step.body}</p>
                <ul className="mt-4 space-y-1.5">
                  {step.points.map((p) => (
                    <li key={p} className="text-xs font-mono text-steel-500">
                      &middot; {p}
                    </li>
                  ))}
                </ul>
                {i < PROCESS.length - 1 && (
                  <div className="mt-6 hidden h-px w-full bg-gradient-to-r from-signal-500/40 to-transparent sm:block lg:hidden" />
                )}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
