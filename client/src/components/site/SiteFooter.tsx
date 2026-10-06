import Link from 'next/link';
import { COMPANY, FOOTER } from '@/lib/content';
import { LogoMark } from '@/components/ui/Logo';
import { Arrow } from '@/components/ui/Arrow';

const COLUMNS = [
  ...FOOTER.columns.slice(0, 2),
  {
    heading: 'Explore',
    links: [
      { label: 'What we move', to: '/#services' },
      { label: 'How it works', to: '/#process' },
      { label: 'Request a quote', to: '/quote' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-paper">
      <div className="shell pt-20 pb-10">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-paper/50">Origin</p>
            <p className="mt-4 max-w-sm text-lg font-medium leading-snug tracking-tight">{FOOTER.blurb}</p>
            <dl className="mt-10 grid grid-cols-2 gap-6 text-sm">
              <div>
                <dt className="label text-paper/45">Entity</dt>
                <dd className="mt-2 text-paper/85">{COMPANY.legalName}</dd>
              </div>
              <div>
                <dt className="label text-paper/45">Base</dt>
                <dd className="mt-2 text-paper/85">{COMPANY.location}</dd>
              </div>
              <div className="col-span-2">
                <dt className="label text-paper/45">Write to us</dt>
                <dd className="mt-2">
                  <a href={`mailto:${COMPANY.email}`} className="link text-sign">
                    {COMPANY.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h2 className="label text-paper/45">{col.heading}</h2>
                <ul className="mt-5 space-y-3.5">
                  {col.links.map((link) => (
                    <li key={link.to}>
                      <Link href={link.to} className="text-[0.9375rem] text-paper/80 transition-colors hover:text-sign">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-paper/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group inline-flex items-center gap-3" aria-label="CargoFlow home">
            <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-45" />
            <span className="xwide text-lg font-[750] uppercase tracking-[-0.01em]">CargoFlow</span>
          </Link>
          <Link href="/quote" className="btn btn-sign btn-sm self-start sm:self-auto">
            Get a quote
            <Arrow className="arrow" size={14} />
          </Link>
        </div>

        <div className="mt-8 flex flex-col gap-4 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {FOOTER.legal.map((link) => (
              <li key={link.to}>
                <Link href={link.to} className="hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="#main" className="inline-flex items-center gap-1.5 hover:text-paper">
                Back to top <Arrow dir="up" size={10} />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
