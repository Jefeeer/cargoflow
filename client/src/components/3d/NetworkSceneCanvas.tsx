import { lazy, Suspense } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useWebGLSupport } from './useWebGLSupport';
import { NetworkMapSVG } from './NetworkMapSVG';

const MiamiNetworkScene = lazy(() =>
  import('./MiamiNetworkScene').then((m) => ({ default: m.MiamiNetworkScene })),
);

interface NetworkSceneCanvasProps {
  className?: string;
}

/**
 * Public entry point for the 3D network visual. Handles all graceful-degradation:
 * reduced motion / small screens / no WebGL all fall back to the static SVG map,
 * and the WebGL canvas itself only loads after this component mounts (lazy chunk).
 */
export function NetworkSceneCanvas({ className }: NetworkSceneCanvasProps) {
  const prefersReducedMotion = useReducedMotion();
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const webglSupported = useWebGLSupport();

  const useFallback = prefersReducedMotion || webglSupported === false;

  return (
    <div className={className} aria-hidden="true">
      {useFallback || webglSupported === null ? (
        <NetworkMapSVG animated={!prefersReducedMotion} />
      ) : (
        <Suspense fallback={<NetworkMapSVG animated={false} />}>
          <MiamiNetworkScene lowPower={isSmallScreen} reducedMotion={!!prefersReducedMotion} />
        </Suspense>
      )}
    </div>
  );
}
