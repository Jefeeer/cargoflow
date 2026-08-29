import { SEO } from '@/components/shared/SEO';
import { COMPANY } from '@/lib/content';

export default function TermsPage() {
  return (
    <section className="section bg-ink-950">
      <SEO title="Terms of Service" description="Terms of service for using the CargoFlow website and requesting quotes." />
      <div className="container-cf">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">Legal</p>
          <h1 className="mt-4 text-3xl sm:text-4xl text-balance">Terms of Service</h1>

          <div className="prose-invert mt-8 space-y-6 text-steel-300">
            <p>
              These terms govern your use of the {COMPANY.legalName} website. By submitting a quote or contact
              request, you agree to be contacted by CargoFlow regarding your inquiry.
            </p>
            <h2 className="font-display text-xl text-white">Quotes</h2>
            <p>
              Quote requests submitted through this site are inquiries, not binding contracts. Final pricing and
              terms for any shipment are confirmed directly with the CargoFlow team.
            </p>
            <h2 className="font-display text-xl text-white">Website Content</h2>
            <p>
              Content on this site is provided for informational purposes and is subject to change without notice.
            </p>
            <h2 className="font-display text-xl text-white">Contact</h2>
            <p>
              Questions about these terms can be sent to{' '}
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
