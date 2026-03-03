/**
 * V5Hero — Dark luxury editorial hero
 * Subtle radial gradient + gold SVG hairlines + serif headline reveal
 */

const GOLD = '#D4A853';

export default function V5Hero() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg-primary)]">
      {/* Radial gradient — warm gold center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 45%, rgba(212, 168, 83, 0.06) 0%, rgba(212, 168, 83, 0.02) 40%, transparent 70%)`,
        }}
      />

      {/* Secondary gradient — top-right warmth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 40% at 75% 20%, rgba(212, 168, 83, 0.04) 0%, transparent 60%)`,
        }}
      />

      {/* SVG hairline decorative elements */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 1000 1000"
      >
        {/* Horizontal hairlines */}
        <line
          x1="100" y1="300" x2="900" y2="300"
          stroke={GOLD}
          strokeWidth="0.3"
          strokeOpacity="0.08"
        />
        <line
          x1="200" y1="700" x2="800" y2="700"
          stroke={GOLD}
          strokeWidth="0.3"
          strokeOpacity="0.06"
        />

        {/* Vertical hairlines */}
        <line
          x1="150" y1="200" x2="150" y2="800"
          stroke={GOLD}
          strokeWidth="0.3"
          strokeOpacity="0.05"
        />
        <line
          x1="850" y1="200" x2="850" y2="800"
          stroke={GOLD}
          strokeWidth="0.3"
          strokeOpacity="0.05"
        />

        {/* Corner accents — top-left */}
        <path
          d="M 100 250 L 100 200 L 150 200"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          strokeOpacity="0.1"
        />

        {/* Corner accents — bottom-right */}
        <path
          d="M 900 750 L 900 800 L 850 800"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          strokeOpacity="0.1"
        />

        {/* Center diamond */}
        <path
          d="M 500 380 L 520 400 L 500 420 L 480 400 Z"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.5"
          strokeOpacity="0.12"
        />

        {/* Decorative circle */}
        <circle
          cx="500" cy="400"
          r="80"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.3"
          strokeOpacity="0.04"
        />
      </svg>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
        }}
      />

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent pointer-events-none" />

      {/* Top gradient — subtle */}
      <div className="absolute top-0 left-0 right-0 h-1/5 bg-gradient-to-b from-[var(--color-bg-primary)]/30 to-transparent pointer-events-none" />
    </div>
  );
}
