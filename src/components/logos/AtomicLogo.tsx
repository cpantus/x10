import { motion } from 'framer-motion';
import type { LogoIconProps } from './types';

export default function AtomicLogo({ className }: LogoIconProps) {
  return (
    <div className={`w-10 h-10 ${className || ''}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full">
        <defs>
          <filter id="atomic-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Orbit ring 1 (horizontal ellipse) */}
        <ellipse
          cx={20} cy={20} rx={16} ry={7}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeOpacity={0.25}
          strokeWidth={0.8}
        />

        {/* Orbit ring 2 (rotated 60deg) */}
        <ellipse
          cx={20} cy={20} rx={16} ry={7}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeOpacity={0.25}
          strokeWidth={0.8}
          transform="rotate(60 20 20)"
        />

        {/* Orbit ring 3 (rotated -60deg) */}
        <ellipse
          cx={20} cy={20} rx={16} ry={7}
          fill="none"
          stroke="var(--color-accent-primary)"
          strokeOpacity={0.25}
          strokeWidth={0.8}
          transform="rotate(-60 20 20)"
        />

        {/* Electron 1 — orbits ring 1 */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '20px 20px' }}
        >
          <circle
            cx={36} cy={20} r={2}
            fill="var(--color-accent-primary)"
            filter="url(#atomic-glow)"
          />
        </motion.g>

        {/* Electron 2 — orbits ring 2 */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '20px 20px' }}
        >
          <circle
            cx={36} cy={20} r={2}
            fill="var(--color-accent-secondary)"
            filter="url(#atomic-glow)"
            transform="rotate(60 20 20)"
          />
        </motion.g>

        {/* Nucleus (center dot) */}
        <circle
          cx={20} cy={20} r={3}
          fill="var(--color-accent-primary)"
          filter="url(#atomic-glow)"
        />
      </svg>
    </div>
  );
}
