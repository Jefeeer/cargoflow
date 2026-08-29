import { SEO } from '@/components/shared/SEO';
import { COMPANY } from '@/lib/content';

export default function PrivacyPage() {
  return (
    <section className="section bg-ink-950">
      <SEO title="Privacy Policy" description="CargoFlow's privacy policy covering how we collect and use information submitted through our website." />
      <div className="container-cf">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">Legal</p>
          <h1 className="mt-4 text-3xl sm:text-4xl text-balance">Privacy Policy</h1>

          <div className="prose-invert mt-8 space-y-6 text-steel-300">
            <p>
              {COMPANY.legalName} ("CargoFlow," "we," "us") respects your privacy. This policy explains what
              information we collect through {COMPANY.email} and our quote and contact forms, and how we use it.
            </p>
            <h2 className="font-display text-xl text-white">Information We Collect</h2>
            <p>
              When you submit a quote request or contact form, we collect the information you provide — such as
              your name, company, email, phone number, and shipment details — solely to respond to your inquiry.
            </p>
            <h2 className="font-display text-xl text-white">How We Use Information</h2>
            <p>
              We use submitted information to prepare quotes, respond to inquiries, and coordinate shipments. We do
              not sell your information to third parties.
            </p>
            <h2 className="font-display text-xl text-white">Contact</h2>
            <p>
              Questions about this policy can be sent to{' '}
              <a href={`mailto:${COMPANY.email}`} className="text-signal-400 hover:text-signal-300">
                {COMPANY.email}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
