import { SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/shared/ServiceDetail';

const service = SERVICES.find((s) => s.key === 'business')!;

export default function BusinessShippingPage() {
  return (
    <ServiceDetail
      service={service}
      seoDescription="Business shipping from Miami — local and interstate logistics for growing small-to-medium businesses and recurring shipments."
    />
  );
}
