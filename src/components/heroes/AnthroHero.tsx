/**
 * AnthroHero — Editorial brutalism hero
 * Canvas 2D LED matrix + SVG diagonal lines + giant clipped Bebas text
 */

import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from './hooks/useReducedMotion';
import { useIsMobile } from './hooks/useIsMobile';

export default function AnthroHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const CELL_SIZE = isMobile ? 12 : 8;
  const ACCENT = '#B8FF00';

  const draw = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, time: number) => {
    ctx.clearRect(0, 0, w, h);

    const cols = Math.ceil(w / CELL_SIZE);
    const rows = Math.ceil(h / CELL_SIZE);

    // LED matrix — wave pattern
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;

        // Wave intensity based on position and time
        const wave1 = Math.sin((col * 0.15) + (time * 0.002)) * 0.5 + 0.5;
        const wave2 = Math.cos((row * 0.12) + (time * 0.0015)) * 0.5 + 0.5;
        const wave3 = Math.sin(((col + row) * 0.08) + (time * 0.001)) * 0.5 + 0.5;

        const intensity = (wave1 * wave2 * wave3);

        if (intensity > 0.3) {
          const alpha = (intensity - 0.3) * 0.15;
          const r = 184, g = 255, b = 0; // #B8FF00
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;

          const gap = 2;
          const size = CELL_SIZE - gap;
          ctx.fillRect(x + 1, y + 1, size, size);
        }
      }
    }

    // Occasional bright "scan" columns
    const scanCol = Math.floor((time * 0.05) % cols);
    for (let row = 0; row < rows; row++) {
      const fadeDistance = Math.abs(row - (rows / 2)) / (rows / 2);
      const alpha = (1 - fadeDistance) * 0.08;
      ctx.fillStyle = `rgba(184,255,0,${alpha})`;
      ctx.fillRect(scanCol * CELL_SIZE + 1, row * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    }
  }, [CELL_SIZE]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    if (reducedMotion) {
      // Static single frame
      draw(ctx, canvas.getBoundingClientRect().width, canvas.getBoundingClientRect().height, 0);
      return () => window.removeEventListener('resize', resize);
    }

    const animate = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height, time);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [draw, reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Canvas LED matrix */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />

      {/* SVG diagonal lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        {/* Primary diagonal */}
        <line
          x1="0" y1="1000" x2="1000" y2="0"
          stroke={ACCENT}
          strokeWidth="0.5"
          strokeOpacity="0.15"
        />
        {/* Secondary diagonals */}
        <line
          x1="0" y1="700" x2="700" y2="0"
          stroke={ACCENT}
          strokeWidth="0.3"
          strokeOpacity="0.08"
        />
        <line
          x1="300" y1="1000" x2="1000" y2="300"
          stroke={ACCENT}
          strokeWidth="0.3"
          strokeOpacity="0.08"
        />
        {/* Horizontal accent line */}
        <line
          x1="0" y1="500" x2="1000" y2="500"
          stroke={ACCENT}
          strokeWidth="0.3"
          strokeOpacity="0.06"
        />
      </svg>

      {/* Giant clipped background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-heading text-[40vw] leading-none tracking-tighter font-bold"
          style={{
            color: 'transparent',
            WebkitTextStroke: `1px rgba(184, 255, 0, 0.06)`,
            userSelect: 'none',
          }}
        >
          X10
        </span>
      </div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent pointer-events-none" />

      {/* Top vignette */}
      <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-[var(--color-bg-primary)]/50 to-transparent pointer-events-none" />
    </div>
  );
}
