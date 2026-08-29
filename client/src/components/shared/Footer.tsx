import { Link } from 'react-router-dom';
import { COMPANY, FOOTER } from '@/lib/content';

export function Footer() {
  return (
    <footer className="border-t border-steel-500/15 bg-ink-900">
      <div className="container-cf py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="font-display text-xl font-bold tracking-tight text-white">
              Cargo<span className="text-signal-400">Flow</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-steel-400">{FOOTER.blurb}</p>
            <div className="mt-6 space-y-1 text-sm text-steel-300">
              <p>{COMPANY.legalName}</p>
              <p>{COMPANY.location}</p>
              <a
                href={`mailto:${COMPANY.email}`}
                className="inline-block text-signal-400 hover:text-signal-300"
              >
                {COMPANY.email}
              </a>
            </div>
          </div>

          {FOOTER.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-steel-500">
                {col.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-steel-300 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-steel-500/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-steel-500">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </p>
          <ul className="flex gap-6">
            {FOOTER.legal.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-xs text-steel-400 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
