import type { Metadata } from 'next';
import { SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/site/ServiceDetail';

const service = SERVICES.find((s) => s.key === 'freight')!;

export const metadata: Metadata = {
  title: service.title,
  description:
    'Freight forwarding from Miami — coordinated movement of goods through port, warehouse, carrier, and final destination.',
  alternates: { canonical: '/freight' },
};

export default function FreightPage() {
  return <ServiceDetail service={service} />;
}
