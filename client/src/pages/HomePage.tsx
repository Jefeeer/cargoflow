import { SEO } from '@/components/shared/SEO';
import { Hero } from '@/components/home/Hero';
import { Positioning } from '@/components/home/Positioning';
import { Services } from '@/components/home/Services';
import { Aviation } from '@/components/home/Aviation';
import { Process } from '@/components/home/Process';
import { WhyCargoFlow } from '@/components/home/WhyCargoFlow';
import { Technology } from '@/components/home/Technology';
import { Network } from '@/components/home/Network';
import { AboutTeaser } from '@/components/home/AboutTeaser';
import { QuoteCTA } from '@/components/home/QuoteCTA';

export default function HomePage() {
  return (
    <>
      <SEO
        title="Aviation, Freight & Business Shipping — Miami"
        description="CargoFlow is a Miami-based logistics partner specializing in aviation parts transportation, freight forwarding, and business shipping to destinations across the United States."
      />
      <Hero />
      <Positioning />
      <Services />
      <Aviation />
      <Process />
      <WhyCargoFlow />
      <Technology />
      <Network />
      <AboutTeaser />
      <QuoteCTA />
    </>
  );
}
