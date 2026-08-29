import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { HERO } from '@/lib/content';
import { NetworkSceneCanvas } from '@/components/3d/NetworkSceneCanvas';

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink-950 bg-tech-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/20 via-ink-950/60 to-ink-950" />

      {/* 3D/SVG scene sits behind copy; pointer-events-none so it never blocks clicks */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <NetworkSceneCanvas className="h-full w-full" />
      </div>

      <div className="container-cf relative py-28 sm:py-36 lg:py-44">
        <motion.div
          className="max-w-3xl"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="kicker mb-6">{HERO.kicker}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            {HERO.headline[0]}
            <br />
            <span className="text-signal-400">{HERO.headline[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-steel-300 text-pretty">{HERO.subhead}</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to={HERO.primaryCta.to} className="btn-primary btn-lg">
              {HERO.primaryCta.label}
            </Link>
            <a href={HERO.secondaryCta.to} className="btn-secondary btn-lg">
              {HERO.secondaryCta.label}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
