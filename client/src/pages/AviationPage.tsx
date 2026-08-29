import { SERVICES } from '@/lib/content';
import { ServiceDetail } from '@/components/shared/ServiceDetail';

const service = SERVICES.find((s) => s.key === 'aviation')!;

export default function AviationPage() {
  return (
    <ServiceDetail
      service={service}
      seoDescription="Aviation parts transportation from Miami — time-critical, carefully handled shipping for aircraft parts, engines, and specialized equipment."
    />
  );
}
