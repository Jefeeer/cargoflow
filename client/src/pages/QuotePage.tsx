import { SEO } from '@/components/shared/SEO';
import { QuoteForm } from '@/components/forms/QuoteForm';

export default function QuotePage() {
  return (
    <section className="section bg-ink-950 bg-tech-grid">
      <SEO
        title="Get a Quote"
        description="Request a shipping quote from CargoFlow for aviation parts transportation, freight forwarding, or business shipping from Miami."
      />
      <div className="container-cf">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">Get a Quote</p>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl text-balance">
            Tell us about your shipment.
          </h1>
          <p className="mt-4 text-lg text-steel-300 text-pretty">
            Fill out the details below and the CargoFlow team will review your shipment information.
          </p>

          <div className="card mt-10 sm:p-10">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
