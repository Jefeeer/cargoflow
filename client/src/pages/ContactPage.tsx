import { SEO } from '@/components/shared/SEO';
import { ContactForm } from '@/components/forms/ContactForm';
import { COMPANY } from '@/lib/content';

export default function ContactPage() {
  return (
    <section className="section bg-ink-950 bg-tech-grid">
      <SEO
        title="Contact"
        description="Contact CargoFlow LLC in North Miami, Florida for aviation parts transportation, freight forwarding, and business shipping inquiries."
      />
      <div className="container-cf">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="kicker">Contact</p>
            <h1 className="mt-4 text-3xl sm:text-4xl text-balance">Get in touch.</h1>
            <p className="mt-4 text-steel-300 text-pretty">
              Have a question before requesting a quote? Send us a message and the CargoFlow team will follow up.
            </p>

            <div className="card mt-8 space-y-2 text-sm text-steel-300">
              <p className="font-display text-base text-white">{COMPANY.legalName}</p>
              <p>{COMPANY.location}</p>
              <a href={`mailto:${COMPANY.email}`} className="inline-block text-signal-400 hover:text-signal-300">
                {COMPANY.email}
              </a>
            </div>
          </div>

          <div className="card lg:col-span-3 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
