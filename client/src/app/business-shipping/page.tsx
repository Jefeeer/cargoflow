import type { Metadata } from 'next';
import { SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/site/ServiceDetail';

const service = SERVICES.find((s) => s.key === 'business')!;

export const metadata: Metadata = {
  title: service.title,
  description:
    'Business shipping from Miami — local and interstate logistics for growing small-to-medium businesses and recurring shipments.',
  alternates: { canonical: '/business-shipping' },
};

export default function BusinessShippingPage() {
  return <ServiceDetail service={service} />;
}
