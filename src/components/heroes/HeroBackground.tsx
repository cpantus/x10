import { Suspense, lazy } from 'react';
import type { HeroVariant, DesignVariant } from './types';
import PlanetHero from './PlanetHero';

// Lazy-load WebGL-heavy variants (R3F ~250KB gzip)
const ConstellationHero = lazy(() => import('./ConstellationHero'));
const NetworkHero = lazy(() => import('./NetworkHero'));
const BlobHero = lazy(() => import('./BlobHero'));
const LightweightHero = lazy(() => import('./LightweightHero'));

// Design variant heroes
const AnthroHero = lazy(() => import('./AnthroHero'));
const V5Hero = lazy(() => import('./V5Hero'));

interface HeroBackgroundProps {
  variant: HeroVariant;
  designVariant?: DesignVariant;
}

export default function HeroBackground({ variant, designVariant = 'current' }: HeroBackgroundProps) {
  // Anthro and V5 always use their own hero
  if (designVariant === 'anthro') {
    return (
      <Suspense fallback={<div className="absolute inset-0 bg-[var(--color-bg-primary)]" />}>
        <AnthroHero />
      </Suspense>
    );
  }

  if (designVariant === 'v5') {
    return (
      <Suspense fallback={<div className="absolute inset-0 bg-[var(--color-bg-primary)]" />}>
        <V5Hero />
      </Suspense>
    );
  }

  // Current variant — use the standard hero switcher
  if (variant === 'planet') {
    return <PlanetHero />;
  }

  return (
    <Suspense fallback={<div className="absolute inset-0 bg-[var(--color-bg-primary)]" />}>
      {variant === 'constellation' && <ConstellationHero />}
      {variant === 'network' && <NetworkHero />}
      {variant === 'blob' && <BlobHero />}
      {variant === 'lightweight' && <LightweightHero />}
    </Suspense>
  );
}
