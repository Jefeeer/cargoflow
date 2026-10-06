interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

/** Plain, readable document layout for legal copy. */
export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="border-b-2 border-ink">
        <div className="shell pb-14 pt-10 sm:pt-14">
          <p className="label text-mute">Legal</p>
          <h1 className="t-display mt-5">{title}</h1>
        </div>
      </div>
      <div className="shell mt-14 grid grid-cols-1 lg:grid-cols-12">
        <div className="space-y-5 text-base leading-relaxed text-ink/80 lg:col-span-7 lg:col-start-4 [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_h2]:pt-6 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-ink">
          {children}
        </div>
      </div>
    </section>
  );
}
