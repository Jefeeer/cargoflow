import Link from 'next/link';
import { SERVICES } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Arrow } from '@/components/ui/Arrow';

/** Services as an index — one full-bleed row per service, with a sign-yellow sweep on hover. */
export function ServicesIndex() {
  return (
    <section id="services" className="pb-24 sm:pb-32">
      <div className="shell">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <SectionLabel index="02">What we move</SectionLabel>
            <h2 className="mt-6 t-h2">
              Logistics solutions built around your cargo.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
            <p className="text-lg leading-relaxed text-mute">
              Three specialisms, one coordinating team in North Miami. Choose a lane, or tell us what you&apos;re
              moving and we&apos;ll scope it.
            </p>
          </Reveal>
        </div>
      </div>

      <ul className="mt-16 border-b-2 border-ink">
        {SERVICES.map((s) => (
          <li key={s.key} className="border-t-2 border-ink">
            <Link href={s.route} className="group relative block overflow-hidden">
              <span
                aria-hidden="true"
                className="absolute inset-0 origin-left scale-x-0 bg-sign transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
              />
              <div className="shell relative grid grid-cols-[auto_1fr_auto] items-center gap-x-6 gap-y-4 py-8 sm:gap-x-10 lg:grid-cols-12 lg:py-10">
                <span className="sign sign-location h-14 w-14 justify-center p-0 text-2xl lg:col-span-1">{s.code}</span>
                <div className="lg:col-span-4">
                  <p className="label text-mute">{s.eyebrow}</p>
                  <h3 className="t-h3 mt-1.5">{s.title}</h3>
                </div>
                <p className="col-span-3 leading-relaxed text-ink/75 lg:col-span-4">{s.short}</p>
                <ul className="label col-span-3 hidden space-y-1.5 text-ink/60 sm:block lg:col-span-2">
                  {s.highlights.slice(0, 3).map((h) => (
                    <li key={h}>— {h}</li>
                  ))}
                </ul>
                <span className="col-start-3 row-start-1 grid h-12 w-12 place-items-center justify-self-end rounded-full border-2 border-ink transition-colors duration-500 group-hover:bg-ink group-hover:text-sign lg:col-span-1 lg:col-start-auto lg:row-start-auto">
                  <Arrow className="transition-transform duration-500 group-hover:-rotate-45" />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="shell mt-8 flex justify-end">
        <Link href="/quote" className="group inline-flex items-center gap-2 font-medium">
          <span className="link">Not sure which fits? Describe your cargo</span>
          <Arrow size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
