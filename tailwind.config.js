/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: 'var(--color-accent-primary)',
          primary: 'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)',
          cta: 'var(--color-accent-cta)',
          deep: 'var(--color-accent-deep)',
          glow: 'var(--color-accent-glow)',
          subtle: 'var(--color-accent-subtle)',
          muted: 'var(--color-accent-muted)',
          // Legacy tonal scale mapped to primary for backwards compat
          50: 'var(--color-accent-subtle)',
          100: 'var(--color-accent-secondary)',
          200: 'var(--color-accent-secondary)',
          300: 'var(--color-accent-secondary)',
          400: 'var(--color-accent-primary)',
          500: 'var(--color-accent-cta)',
          600: 'var(--color-accent-cta)',
          700: 'var(--color-accent-deep)',
          800: 'var(--color-accent-deep)',
          900: 'var(--color-accent-deep)',
          950: 'var(--color-accent-deep)',
        },
      },
    },
  },
  plugins: [],
}
