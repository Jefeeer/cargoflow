import { SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/shared/ServiceDetail';

const service = SERVICES.find((s) => s.key === 'freight')!;

export default function FreightPage() {
  return (
    <ServiceDetail
      service={service}
      seoDescription="Freight forwarding from Miami — coordinated movement of goods through port, warehouse, carrier, and final destination."
    />
  );
}
