import type { Metadata } from 'next';
import Link from 'next/link';
import { ABOUT, POSITIONING } from '@/lib/content';
import { PageHero } from '@/components/site/PageHero';
import { ClosingCTA } from '@/components/site/ClosingCTA';
import { Reveal } from '@/components/ui/Reveal';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Arrow } from '@/components/ui/Arrow';
import { Network } from '@/components/home/Network';

export const metadata: Metadata = {
  title: 'About',
  description:
    'CargoFlow is a Miami-based logistics partner specializing in aviation parts transportation, freight forwarding, and business shipping.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={['About']}
        kicker={ABOUT.kicker}
        title={ABOUT.headline}
        intro={
          <div className="space-y-5">
            {ABOUT.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        }
      >
        <Link href="/quote" className="btn btn-ink">
          Get a free quote
          <Arrow className="arrow" />
        </Link>
      </PageHero>

      <section className="py-24 sm:py-28">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <SectionLabel index="01">At a glance</SectionLabel>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-8">
            <dl className="waybill grid-cols-1 sm:grid-cols-2">
              {ABOUT.facts.map((f, i) => (
                <div key={f.label} className="bg-paper p-6 sm:p-8">
                  <dt className="label flex justify-between text-mute">
                    <span>{f.label}</span>
                    <span>{String(i + 1).padStart(2, '0')}</span>
                  </dt>
                  <dd className="t-h3 mt-5">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper-2 py-24 sm:py-28">
        <div className="shell">
          <Reveal className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionLabel index="02">What we stand on</SectionLabel>
            </div>
            <h2 className="t-h2 lg:col-span-8">
              {POSITIONING.body}
            </h2>
          </Reveal>
          <dl className="mt-16 grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {POSITIONING.values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08} className="border-t-2 border-ink pb-8 pt-5">
                <dt className="t-h3">{v.title}</dt>
                <dd className="mt-3 leading-relaxed text-mute">{v.body}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <Network index="03" />

      <ClosingCTA headline="Ready to ship with CargoFlow?" body="Tell us about your shipment and we'll help find the right solution." />
    </>
  );
}
