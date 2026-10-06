import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

interface PageHeroProps {
  /** Breadcrumb trail after "CargoFlow". */
  trail: string[];
  kicker: string;
  title: string;
  intro?: React.ReactNode;
  /** Optional large sign tile (e.g. a service designator). */
  code?: string;
  children?: React.ReactNode;
}

/** Shared top-of-page block for inner pages. */
export function PageHero({ trail, kicker, title, intro, code, children }: PageHeroProps) {
  return (
    <section className="border-b-2 border-ink">
      <div className="shell pb-16 pt-10 sm:pb-20 sm:pt-14">
        <nav aria-label="Breadcrumb" className="label text-mute">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-ink">
                CargoFlow
              </Link>
            </li>
            {trail.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-ink">{t}</span>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 grid grid-cols-1 items-end gap-10 lg:mt-16 lg:grid-cols-12">
          <Reveal className={code ? 'lg:col-span-9' : 'lg:col-span-10'}>
            <p className="label text-mute">{kicker}</p>
            <h1 className="t-display mt-5">{title}</h1>
          </Reveal>
          {code && (
            <Reveal delay={0.1} className="hidden justify-self-end lg:col-span-3 lg:block">
              <span
                aria-hidden="true"
                className="sign sign-location h-28 w-28 justify-center p-0 text-[4.25rem]"
                style={{ boxShadow: 'inset 0 0 0 4px var(--color-sign), inset 0 0 0 8px var(--color-ink)' }}
              >
                {code}
              </span>
            </Reveal>
          )}
        </div>

        {(intro || children) && (
          <Reveal delay={0.12} className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {intro && <div className="text-lg leading-relaxed text-ink/75 lg:col-span-7">{intro}</div>}
            {children && <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:items-end lg:justify-end">{children}</div>}
          </Reveal>
        )}
      </div>
    </section>
  );
}
