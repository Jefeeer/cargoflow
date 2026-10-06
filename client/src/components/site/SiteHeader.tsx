'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { COMPANY, NAV_ITEMS } from '@/lib/content';
import { Logo } from '@/components/ui/Logo';
import { Arrow } from '@/components/ui/Arrow';
import { MiamiClock } from './MiamiClock';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll, trap focus, and close on Escape while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    if (!menu) return;
    document.body.style.overflow = 'hidden';
    const focusables = menu.querySelectorAll<HTMLElement>('a, button');
    focusables[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Utility bar — scrolls away; the nav below stays pinned. */}
      <div className="bg-ink text-paper/70">
        <div className="shell label flex h-9 items-center justify-between gap-6 text-[0.625rem]">
          <p className="flex items-center gap-4">
            <span className="text-sign">● MIA</span>
            <span className="hidden sm:inline">{COMPANY.location}</span>
            <span className="hidden md:inline">25.89°N 80.19°W</span>
          </p>
          <p className="flex items-center gap-5">
            <MiamiClock />
            <a href={`mailto:${COMPANY.email}`} className="hidden hover:text-sign sm:inline">
              {COMPANY.email}
            </a>
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
          scrolled || open ? 'bg-paper/90 shadow-[0_1px_0_var(--rule)] backdrop-blur-md' : 'bg-paper'
        }`}
      >
        <nav className="shell flex h-[4.5rem] items-center justify-between gap-8" aria-label="Primary">
          <Logo />

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to}>
                  <Link
                    href={item.to}
                    aria-current={active ? 'page' : undefined}
                    className={`relative rounded-[3px] px-3.5 py-2 text-[0.9375rem] font-medium transition-colors ${
                      active ? 'bg-ink text-sign' : 'text-ink/75 hover:bg-paper-2 hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link href="/quote" className="btn btn-sign btn-sm hidden sm:inline-flex">
              Get a quote
              <Arrow className="arrow" size={14} />
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="inline-grid h-11 w-11 place-items-center rounded-[3px] text-ink hover:bg-paper-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
                <path
                  d={open ? 'M4 4l14 14M18 4 4 18' : 'M2 6h18M2 11h18M2 16h18'}
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-menu"
            ref={menuRef}
            className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-ink text-paper lg:hidden"
          >
            <ul className="shell flex flex-col py-6">
              {NAV_ITEMS.map((item, i) => (
                <li key={item.to} className="border-b border-paper/10">
                  <Link
                    href={item.to}
                    className="group flex items-center justify-between py-4 text-2xl font-semibold tracking-tight"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="label text-paper/40">0{i + 1}</span>
                      {item.label}
                    </span>
                    <Arrow className="text-sign transition-transform group-hover:translate-x-1" size={20} />
                  </Link>
                </li>
              ))}
              <li className="pt-8">
                <Link href="/quote" className="btn btn-sign w-full">
                  Get a free quote
                  <Arrow className="arrow" />
                </Link>
              </li>
              <li className="label pt-8 text-paper/50">
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
