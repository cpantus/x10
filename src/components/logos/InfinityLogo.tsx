import { motion, useReducedMotion } from 'framer-motion';
import type { LogoIconProps } from './types';

// Figure-8 / infinity path in a 40x40 viewBox
const INFINITY_PATH = 'M 7,20 C 7,12 14,8 20,14 C 26,20 33,16 33,20 C 33,24 26,28 20,22 C 14,16 7,28 7,20 Z';

export default function InfinityLogo({ className }: LogoIconProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`w-10 h-10 ${className || ''}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Static path */}
        <path
          d={INFINITY_PATH}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeOpacity={0.3}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Animated path draw */}
        <motion.path
          d={INFINITY_PATH}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeWidth={1.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />

        {/* Traveling glow dot */}
        {!reducedMotion && (
          <motion.circle
            r={2.5}
            fill="var(--color-accent-primary)"
            filter="url(#infinity-glow)"
          >
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              path={INFINITY_PATH}
            />
          </motion.circle>
        )}

        <defs>
          <filter id="infinity-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
