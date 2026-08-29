import type { ReactNode } from 'react';

interface SectionHeaderProps {
  kicker?: string;
  heading: ReactNode;
  intro?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({ kicker, heading, intro, align = 'left', className }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-2xl ${alignClass} ${className ?? ''}`}>
      {kicker && <p className="kicker mb-4">{kicker}</p>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-balance">{heading}</h2>
      {intro && <p className="mt-5 text-lg text-steel-300 text-pretty">{intro}</p>}
    </div>
  );
}
