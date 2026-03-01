import { Suspense, lazy } from 'react';
import type { HeroVariant } from './types';
import PlanetHero from './PlanetHero';

// Lazy-load WebGL-heavy variants (R3F ~250KB gzip)
const ConstellationHero = lazy(() => import('./ConstellationHero'));
const NetworkHero = lazy(() => import('./NetworkHero'));
const BlobHero = lazy(() => import('./BlobHero'));

// Lightweight is small enough to eager-load
const LightweightHero = lazy(() => import('./LightweightHero'));

interface HeroBackgroundProps {
  variant: HeroVariant;
}

export default function HeroBackground({ variant }: HeroBackgroundProps) {
  if (variant === 'planet') {
    return <PlanetHero />;
  }

  return (
    <Suspense fallback={<div className="absolute inset-0 bg-[#030303]" />}>
      {variant === 'constellation' && <ConstellationHero />}
      {variant === 'network' && <NetworkHero />}
      {variant === 'blob' && <BlobHero />}
      {variant === 'lightweight' && <LightweightHero />}
    </Suspense>
  );
}
