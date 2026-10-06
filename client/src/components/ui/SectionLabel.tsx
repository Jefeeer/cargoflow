interface SectionLabelProps {
  index: string;
  children: React.ReactNode;
  className?: string;
}

/** Numbered section marker — reads like a field reference on a waybill. */
export function SectionLabel({ index, children, className = '' }: SectionLabelProps) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span className="tabular inline-grid h-6 min-w-8 place-items-center rounded-[2px] border border-current px-1.5 tracking-normal">
        {index}
      </span>
      <span>{children}</span>
    </p>
  );
}
