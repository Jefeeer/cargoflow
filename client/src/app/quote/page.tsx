import type { Metadata } from 'next';
import { Suspense } from 'react';
import { COMPANY, PROCESS } from '@/lib/content';
import { QuoteForm } from '@/components/forms/QuoteForm';

export const metadata: Metadata = {
  title: 'Get a Quote',
  description:
    'Request a shipping quote from CargoFlow for aviation parts transportation, freight forwarding, or business shipping from Miami.',
  alternates: { canonical: '/quote' },
};

export default function QuotePage() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="border-b-2 border-ink">
        <div className="shell pb-14 pt-10 sm:pt-14">
          <p className="label text-mute">Get a quote · Free, no obligation</p>
          <h1 className="t-display mt-5 max-w-4xl">Tell us about your shipment.</h1>
        </div>
      </div>

      <div className="shell mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="text-lg leading-relaxed text-ink/75">
              Fill out the details below and the CargoFlow team will review your shipment information. The more you
              tell us, the more precisely we can plan.
            </p>

            <div className="mt-10 bg-ink p-6 text-paper">
              <p className="label text-sign">What happens next</p>
              <ol className="mt-5 space-y-5">
                {PROCESS.map((step) => (
                  <li key={step.number} className="grid grid-cols-[2.25rem_1fr] gap-3">
                    <span className="label pt-0.5 text-paper/45">{step.number}</span>
                    <span>
                      <span className="block font-semibold">{step.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-paper/60">{step.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <p className="mt-6 text-sm text-mute">
              Prefer email?{' '}
              <a href={`mailto:${COMPANY.email}`} className="link font-medium text-ink">
                {COMPANY.email}
              </a>
            </p>
          </div>
        </aside>

        <div className="lg:col-span-8">
          <Suspense fallback={<div className="h-[60rem] animate-pulse bg-paper-2" />}>
            <QuoteForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
