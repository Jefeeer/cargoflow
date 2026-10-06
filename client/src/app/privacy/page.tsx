import type { Metadata } from 'next';
import { COMPANY } from '@/lib/content';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "CargoFlow's privacy policy covering how we collect and use information submitted through our website.",
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {COMPANY.legalName} (&ldquo;CargoFlow,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;) respects your privacy. This
        policy explains what information we collect through {COMPANY.email} and our quote and contact forms, and how we
        use it.
      </p>
      <h2>Information We Collect</h2>
      <p>
        When you submit a quote request or contact form, we collect the information you provide — such as your name,
        company, email, phone number, and shipment details — solely to respond to your inquiry.
      </p>
      <h2>How We Use Information</h2>
      <p>
        We use submitted information to prepare quotes, respond to inquiries, and coordinate shipments. We do not sell
        your information to third parties.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
      </p>
    </LegalPage>
  );
}
