/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useDesignVariant } from '../context/DesignVariantContext';

const CustomCursor: React.FC = () => {
  const { variant } = useDesignVariant();
  const [isHovering, setIsHovering] = useState(false);

  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth spring animation
  const springConfig = { damping: 20, stiffness: 350, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') ||
                        target.closest('a') ||
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      {/* This div is the actual cursor "body" and will handle the scaling and text centering */}
      {/* Changed base size to 80px diameter (40px radius) */}
      <motion.div
        className={`relative flex items-center justify-center ${
          variant === 'anthro'
            ? 'rounded-none border-2 border-[var(--color-accent-primary)] bg-transparent'
            : variant === 'v5'
            ? 'rounded-full border-2 border-[var(--color-accent-primary)] bg-transparent'
            : 'rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]'
        }`}
        style={{ width: variant === 'v5' ? 64 : 80, height: variant === 'v5' ? 64 : 80 }}
        animate={{
          // Scaled by 1.5 to become 120px diameter (60px radius) when hovering
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Text directly inside the scalable cursor body, centered by flex parent */}
        <motion.span
          className="z-10 text-black font-black uppercase tracking-widest text-sm overflow-hidden whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
