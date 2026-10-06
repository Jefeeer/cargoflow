import type { Metadata } from 'next';
import Link from 'next/link';
import { Arrow } from '@/components/ui/Arrow';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for could not be found.",
};

/** 404 as an airfield sign array: you are here (nowhere), home is that way. */
export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <div className="shell">
        <div className="inline-flex flex-wrap gap-1 bg-ink p-1">
          <span
            className="xwide grid min-h-20 place-items-center bg-ink px-7 text-4xl font-[800] text-sign"
            style={{ boxShadow: 'inset 0 0 0 3px var(--color-sign), inset 0 0 0 6px var(--color-ink)' }}
          >
            404
          </span>
          <Link
            href="/"
            className="xwide group flex min-h-20 items-center gap-4 bg-sign px-7 text-2xl font-[800] uppercase text-ink transition-colors hover:bg-ink hover:text-sign"
          >
            <Arrow dir="left" size={30} className="transition-transform group-hover:-translate-x-1" />
            Home
          </Link>
        </div>

        <h1 className="t-display mt-14 max-w-3xl">This taxiway doesn&apos;t exist.</h1>
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/75">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Follow the signs back.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-ink">
            Back to home
            <Arrow className="arrow" />
          </Link>
          <Link href="/quote" className="btn btn-line">
            Get a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
