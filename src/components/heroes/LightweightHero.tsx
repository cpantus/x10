// Variant D: CSS gradient + Canvas 2D particles + SVG circuit paths — zero WebGL
import { useRef, useEffect, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from './hooks/useIsMobile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HERO_COLORS } from './types';

// --- Circuit path definitions (PCB-style straight lines with 90-degree turns) ---
const CIRCUIT_PATHS = [
  'M -20 120 H 300 V 300 H 500 V 180 H 750',
  'M 1920 80 H 1400 V 250 H 1100 V 400 H 800 V 280',
  'M 200 700 H 600 V 500 H 900 V 650 H 1200',
  'M 1920 600 H 1500 V 450 H 1200 V 550 H 950',
  'M -20 400 H 250 V 550 H 500 V 380 H 700',
];

// --- Particle type ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

function createParticles(count: number, w: number, h: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.6 + 0.1 * (Math.random() > 0.5 ? 1 : -1),
    vy: (Math.random() - 0.5) * 0.6 + 0.1 * (Math.random() > 0.5 ? 1 : -1),
    radius: Math.random() * 1.5 + 0.8,
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

// Parse CSS color to rgba components for canvas rendering
function parseColorToRgb(color: string): [number, number, number] {
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
  // Fallback to blue
  return [96, 165, 250];
}

export default function LightweightHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  // Read theme color from CSS custom property
  const [accentRgb, setAccentRgb] = useState<[number, number, number]>([96, 165, 250]);
  const [svgColor, setSvgColor] = useState<string>(HERO_COLORS.primary);

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--color-accent-primary').trim();
    if (primary) {
      setAccentRgb(parseColorToRgb(primary));
      setSvgColor(primary);
    }
  }, []);

  const particleCount = isMobile ? 40 : 80;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const [r, g, b] = accentRgb;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(particleCount, rect.width, rect.height);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    // Static render for reduced motion
    if (reducedMotion) {
      const rect = canvas.getBoundingClientRect();
      const particles = particlesRef.current;
      ctx.clearRect(0, 0, rect.width, rect.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
      }
      // Draw static connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      return () => observer.disconnect();
    }

    // Animated loop
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update and draw particles
      for (const p of particles) {
        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < 120 && mDist > 0) {
          const force = (120 - mDist) / 120 * 0.8;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Dampen velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Clamp speed
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.5) {
          p.vx = (p.vx / speed) * 1.5;
          p.vy = (p.vy / speed) * 1.5;
        }
        if (speed < 0.15) {
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${0.08 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [particleCount, reducedMotion, handleMouseMove, handleMouseLeave, accentRgb]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 0: CSS animated conic gradient */}
      <div className="absolute inset-0 hero-gradient-rotate" />

      {/* Layer 1: Canvas 2D particle network */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />

      {/* Layer 2: SVG circuit paths */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1920 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        style={{ pointerEvents: 'none' }}
      >
        {CIRCUIT_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke={svgColor}
            strokeOpacity={0.1}
            strokeWidth={1}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={reducedMotion ? { pathLength: 1 } : { pathLength: 1 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 3, delay: i * 1, ease: 'easeInOut' }
            }
          />
        ))}
      </svg>
    </div>
  );
}
