import { Suspense, lazy } from 'react';
import type { LogoVariant, LogoIconProps } from './types';
import GearsLogo from './GearsLogo';

const NeuralLogo = lazy(() => import('./NeuralLogo'));
const InfinityLogo = lazy(() => import('./InfinityLogo'));
const AtomicLogo = lazy(() => import('./AtomicLogo'));

interface LogoIconSwitcherProps extends LogoIconProps {
  variant: LogoVariant;
}

export default function LogoIcon({ variant, className }: LogoIconSwitcherProps) {
  if (variant === 'gears') {
    return <GearsLogo className={className} />;
  }

  return (
    <Suspense fallback={<GearsLogo className={className} />}>
      {variant === 'neural' && <NeuralLogo className={className} />}
      {variant === 'infinity' && <InfinityLogo className={className} />}
      {variant === 'atomic' && <AtomicLogo className={className} />}
    </Suspense>
  );
}
