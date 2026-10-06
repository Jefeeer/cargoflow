import Link from 'next/link';

interface LogoProps {
  className?: string;
  inverted?: boolean;
}

/** Mark: a direction sign pointing up-and-out from Miami. Wordmark in extended Archivo. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="3" fill="var(--color-sign)" />
      <path d="M9 23 22 10M12 9.5h10.5V20" fill="none" stroke="var(--color-ink)" strokeWidth="3.4" />
    </svg>
  );
}

export function Logo({ className = '', inverted = false }: LogoProps) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="CargoFlow home">
      <LogoMark className="h-8 w-8 transition-transform duration-500 ease-out group-hover:rotate-[-8deg]" />
      <span
        className={`xwide text-[1.05rem] font-[750] uppercase tracking-[-0.01em] ${inverted ? 'text-paper' : 'text-ink'}`}
      >
        CargoFlow
      </span>
    </Link>
  );
}
