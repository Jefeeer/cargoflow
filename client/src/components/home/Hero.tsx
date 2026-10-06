import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { HERO } from '@/lib/content';
import { Arrow } from '@/components/ui/Arrow';
import { DepartureBoard } from '@/components/visuals/DepartureBoard';
import { SignArray } from './SignArray';

/** CSS custom property for staggering the enter-* animations. */
const delay = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

function Line({ children, d }: { children: ReactNode; d: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span className="enter-rise block" style={delay(d)}>
        {children}
      </span>
    </span>
  );
}

// Entrance motion is CSS-only so the headline paints before hydration.
export function Hero() {
  const [first, second] = HERO.headline;
  const lastSpace = second.lastIndexOf(' ');
  const secondLead = second.slice(0, lastSpace);
  const secondTail = second.slice(lastSpace + 1);

  return (
    <section className="relative overflow-hidden">
      <div className="shell pt-10 sm:pt-14 lg:pt-16">
        <div className="enter-fade flex flex-wrap items-center justify-between gap-4" style={delay(0)}>
          <p className="flex items-center gap-3">
            <span className="sign sign-location text-xs">MIA</span>
            <span className="label text-mute">{HERO.kicker}</span>
          </p>
          <p className="label hidden text-mute md:block">Aviation · Freight · Business shipping</p>
        </div>

        <h1 className="t-hero isolate mt-8 sm:mt-10">
          <Line d={0.05}>{first}</Line>
          <Line d={0.17}>
            <span className="text-mute-2">{secondLead} </span>
            <span className="relative inline-block whitespace-nowrap">
              <span
                aria-hidden="true"
                className="enter-sweep absolute -inset-x-[0.06em] bottom-[0.06em] top-[0.14em] -z-10 bg-sign"
                style={delay(0.85)}
              />
              {secondTail}
            </span>
          </Line>
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-12 pb-16 lg:mt-16 lg:grid-cols-12 lg:gap-10 lg:pb-20">
          <div className="enter-fade lg:col-span-5 lg:pt-2" style={delay(0.45)}>
            <p className="max-w-md text-lg leading-relaxed text-ink/80">{HERO.subhead}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href={HERO.primaryCta.to} className="btn btn-ink">
                {HERO.primaryCta.label}
                <Arrow className="arrow" />
              </Link>
              <Link href={HERO.secondaryCta.to} className="btn btn-line">
                {HERO.secondaryCta.label}
              </Link>
            </div>
          </div>

          <div className="enter-fade min-w-0 lg:col-span-7" style={{ ...delay(0.6), '--from-y': '40px' } as CSSProperties}>
            <DepartureBoard />
          </div>
        </div>
      </div>

      <SignArray />
    </section>
  );
}
