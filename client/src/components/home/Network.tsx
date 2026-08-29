import { NETWORK } from '@/lib/content';
import { Reveal } from '@/components/shared/Reveal';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { NetworkSceneCanvas } from '@/components/3d/NetworkSceneCanvas';

export function Network() {
  return (
    <section className="section bg-ink-950 bg-tech-grid">
      <div className="container-cf">
        <Reveal>
          <SectionHeader kicker={NETWORK.kicker} heading={NETWORK.headline} intro={NETWORK.body} align="center" className="mx-auto" />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="card mt-14 aspect-[16/9] w-full overflow-hidden p-0 sm:aspect-[21/9]">
            <NetworkSceneCanvas className="h-full w-full" />
          </div>
          <p className="mt-3 text-center text-xs text-steel-500">
            Illustrative visualization of CargoFlow&apos;s network reach — not live shipment data.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
