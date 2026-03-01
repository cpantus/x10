import { motion, useReducedMotion } from 'framer-motion';
import { Settings } from 'lucide-react';
import type { LogoIconProps } from './types';

export default function GearsLogo({ className }: LogoIconProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`relative w-10 h-10 flex items-center justify-center ${className || ''}`}>
      <motion.div
        animate={reducedMotion ? {} : { rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Settings className="w-10 h-10" style={{ color: 'var(--color-accent-primary)' }} />
      </motion.div>
      <motion.div
        animate={reducedMotion ? {} : { rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Settings className="w-6 h-6 text-white/90" />
      </motion.div>
    </div>
  );
}
