import Link from 'next/link';
import { ABOUT, QUOTE_CTA } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { Arrow } from '@/components/ui/Arrow';

interface ClosingCTAProps {
  headline?: string;
  body?: string;
  primary?: { label: string; to: string };
  /** Show the short "About CargoFlow" aside (home page only). */
  withAbout?: boolean;
}

/** Sign-yellow closing band with a hazard-stripe edge. Reused at the end of every page. */
export function ClosingCTA({
  headline = QUOTE_CTA.headline,
  body = QUOTE_CTA.body,
  primary = QUOTE_CTA.primaryCta,
  withAbout = false,
}: ClosingCTAProps) {
  return (
    <section className="bg-sign text-ink">
      <div aria-hidden="true" className="bg-hatch h-3" />
      <div className="shell grid grid-cols-1 gap-14 py-24 sm:py-28 lg:grid-cols-12">
        <Reveal className={withAbout ? 'lg:col-span-8' : 'lg:col-span-10'}>
          <h2 className="t-display">
            {headline}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">{body}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={primary.to} className="btn btn-ink">
              {primary.label}
              <Arrow className="arrow" />
            </Link>
            <Link href={QUOTE_CTA.secondaryCta.to} className="btn btn-line">
              {QUOTE_CTA.secondaryCta.label}
            </Link>
          </div>
        </Reveal>

        {withAbout && (
          <Reveal delay={0.12} className="self-end border-t-2 border-ink pt-6 lg:col-span-4">
            <p className="label">{ABOUT.kicker}</p>
            <p className="t-h3 mt-4">{ABOUT.headline}</p>
            <p className="mt-3 leading-relaxed text-ink/75">{ABOUT.body[1]}</p>
            <Link href="/about" className="group mt-6 inline-flex items-center gap-2 font-semibold">
              <span className="link">About CargoFlow</span>
              <Arrow size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
