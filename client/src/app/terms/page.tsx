import type { Metadata } from 'next';
import { COMPANY } from '@/lib/content';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using the CargoFlow website and requesting quotes.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms govern your use of the {COMPANY.legalName} website. By submitting a quote or contact request, you
        agree to be contacted by CargoFlow regarding your inquiry.
      </p>
      <h2>Quotes</h2>
      <p>
        Quote requests submitted through this site are inquiries, not binding contracts. Final pricing and terms for any
        shipment are confirmed directly with the CargoFlow team.
      </p>
      <h2>Website Content</h2>
      <p>Content on this site is provided for informational purposes and is subject to change without notice.</p>
      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>
    </LegalPage>
  );
}
