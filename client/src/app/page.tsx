import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { CargoTicker } from '@/components/home/CargoTicker';
import { Positioning } from '@/components/home/Positioning';
import { ServicesIndex } from '@/components/home/ServicesIndex';
import { AviationFeature } from '@/components/home/AviationFeature';
import { Process } from '@/components/home/Process';
import { WhyCargoFlow } from '@/components/home/WhyCargoFlow';
import { Technology } from '@/components/home/Technology';
import { Network } from '@/components/home/Network';
import { ClosingCTA } from '@/components/site/ClosingCTA';

export const metadata: Metadata = {
  title: { absolute: 'CargoFlow | Aviation, Freight & Business Shipping — Miami' },
  description:
    'CargoFlow is a Miami-based logistics partner specializing in aviation parts transportation, freight forwarding, and business shipping to destinations across the United States.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CargoTicker />
      <Positioning />
      <ServicesIndex />
      <AviationFeature />
      <Process />
      <WhyCargoFlow />
      <Technology />
      <Network />
      <ClosingCTA withAbout />
    </>
  );
}
