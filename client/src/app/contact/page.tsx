import type { Metadata } from 'next';
import Link from 'next/link';
import { COMPANY } from '@/lib/content';
import { ContactForm } from '@/components/forms/ContactForm';
import { Arrow } from '@/components/ui/Arrow';
import { MiamiClock } from '@/components/site/MiamiClock';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact CargoFlow LLC in North Miami, Florida for aviation parts transportation, freight forwarding, and business shipping inquiries.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="border-b-2 border-ink">
        <div className="shell pb-14 pt-10 sm:pt-14">
          <p className="label text-mute">Contact</p>
          <h1 className="t-display mt-5">Get in touch.</h1>
        </div>
      </div>

      <div className="shell mt-14 grid grid-cols-1 gap-14 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="text-lg leading-relaxed text-ink/75">
            Have a question before requesting a quote? Send us a message and the CargoFlow team will follow up.
          </p>

          <dl className="waybill mt-10 grid-cols-1">
            <div className="bg-paper p-5">
              <dt className="label text-mute">Entity</dt>
              <dd className="mt-2 text-lg font-semibold">{COMPANY.legalName}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="label text-mute">Base</dt>
              <dd className="mt-2 text-lg font-semibold">{COMPANY.location}</dd>
            </div>
            <div className="bg-paper p-5">
              <dt className="label text-mute">Email</dt>
              <dd className="mt-2 text-lg font-semibold">
                <a href={`mailto:${COMPANY.email}`} className="link">
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div className="bg-ink p-5 text-paper">
              <dt className="label text-paper/50">Miami, right now</dt>
              <dd className="label mt-2 text-base text-sign">
                <MiamiClock />
              </dd>
            </div>
          </dl>

          <Link
            href="/quote"
            className="group mt-6 flex items-center justify-between bg-sign p-5 font-semibold transition-colors hover:bg-ink hover:text-sign"
          >
            Ready for pricing? Request a quote
            <Arrow className="transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>

        <div className="lg:col-span-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
