export type HeroVariant = 'planet' | 'constellation' | 'network' | 'blob' | 'lightweight';

// Theme-aware colors — reads from CSS custom properties at runtime
export function getHeroColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    primary: style.getPropertyValue('--color-accent-primary').trim() || '#60A5FA',
    secondary: style.getPropertyValue('--color-accent-secondary').trim() || '#93C5FD',
    deep: style.getPropertyValue('--color-accent-deep').trim() || '#1D4ED8',
    glow: style.getPropertyValue('--color-accent-glow').trim() || 'rgba(96, 165, 250, 0.3)',
    glowStrong: style.getPropertyValue('--color-accent-glow-strong').trim() || 'rgba(96, 165, 250, 0.6)',
  };
}

// Static fallbacks for SSR / initial render
export const HERO_COLORS = {
  primary: '#60A5FA',
  secondary: '#93C5FD',
  deep: '#1D4ED8',
  darkest: '#172554',
  glow: 'rgba(96, 165, 250, 0.3)',
  glowStrong: 'rgba(96, 165, 250, 0.6)',
  bg: '#030303',
} as const;
