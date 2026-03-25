# Architecture

## Design Variant System

3 variants switchable via `?design=` URL param, managed by `DesignVariantContext.tsx`:

| Variant | Display Font | Body Font | Mono Font | Accent |
|---------|-------------|-----------|-----------|--------|
| `current` (default) | Space Grotesk | Sora | JetBrains Mono | Blue `#60A5FA` + Gold `#F59E0B` |
| `anthro` | Bebas Neue | Syne | DM Mono | Acid green `#B8FF00` |
| `v5` | Cormorant Garamond | Space Grotesk | Syne | Warm gold `#D4A853` |

Sets `data-design` attribute on `<html>`. CSS custom properties per variant in `src/styles/design-*.css`. Motion tokens per variant in `DesignVariantContext.tsx`.

## Routing & Code Splitting

All pages lazy-loaded via `React.lazy()` + `Suspense` in `src/main.tsx`. Each page is a separate Vite chunk.

## Sub-page Pattern

All sub-pages (catalog, solutions, blog, privacy, terms) follow:
1. Fixed navbar: `backdrop-blur-xl`, `z-50`, logo left (links `/`), "Back to Home" right
2. Hero section: `pt-32 pb-16 px-6`, accent badge, large `font-heading` title, subtitle
3. Content: `max-w-7xl mx-auto px-6`
4. `SEOMeta` component for dynamic meta tags + JSON-LD schemas

## CSS Architecture

Design tokens as CSS custom properties scoped to `html[data-design="..."]`:
- `--color-accent-primary`, `--color-accent-secondary`, `--color-accent-cta`, `--color-accent-deep`
- `--color-accent-glow`, `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-elevated`
- `--font-display`, `--font-body`, `--font-mono`
- `--duration-fast`, `--duration-normal`, `--duration-slow`, `--duration-emphasis`

Tailwind extends via CSS vars: `fontFamily: { sans: 'var(--font-body)', heading: 'var(--font-display)', mono: 'var(--font-mono)' }`.

## UI Patterns

- **Container**: `max-w-7xl mx-auto px-6` (sections), `max-w-3xl` (prose)
- **Cards**: `bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-[#151515]`
- **Entry animations**: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- **Staggered delay**: `delay: Math.min(idx * 0.03, 0.5)`
- **Z-layers**: 50 (navbar), 40 (vignette), 30 (content), 20 (hero), 10 (section bg), 0 (watermark)
- **Colors**: Always via `var(--color-accent-*)`, never hardcoded

## CSS Utility Classes

| Class | Effect |
|-------|--------|
| `.hero-gradient-rotate` | 20s conic gradient rotation |
| `.glow-pulse` | Text-shadow breathing (4-6s) |
| `.scanline-hover` | Sweep-line on hover |
| `.gradient-border` | Diagonal gradient border on hover |
| `.btn-glow` | Box-shadow glow on button hover |
| `.dot-grid` | Subtle dot background (24px, 4% opacity) |
| `.section-divider` | Gradient horizontal line |
| `.prose-x10` | Long-form article typography |

## Hero Variants

Lazy-loaded via `HeroBackground.tsx`:

| Variant | Tech | Notes |
|---------|------|-------|
| `lightweight` | CSS | **Default** |
| `planet` | CSS | Lightweight alternative |
| `constellation` | Three.js (R3F) | ~250KB gzip |
| `network` | Three.js (R3F) | Force graph |
| `blob` | Three.js (R3F) | Organic shape |
| `anthro` | Variant-specific | Design override |
| `v5` | Variant-specific | Design override |

Design variant always overrides hero. URL param `?hero=` switches hero within `current` variant.

## Blog Architecture

- **No runtime markdown**: Articles are JSX components (`src/pages/blog/posts/<slug>.tsx`)
- **Lazy per-article**: Each post is a separate chunk via dynamic `import()` in `blogPosts.ts`
- **Typography**: `.prose-x10` class handles all styling — articles use native HTML tags only
- **SEO**: `BlogPosting` + `BreadcrumbList` JSON-LD per article, `Blog` schema on listing page
- **Data model**: `BlogPost` interface in `src/data/blogPosts.ts` — slug, title, date, excerpt, tags, author, lazy component

## SEO

- `SEOMeta` component: dynamic `<title>`, `<meta>`, Open Graph, Twitter Card, JSON-LD injection
- Schemas per page: Organization, WebSite, Service, FAQPage, ItemList, BlogPosting, BreadcrumbList
- Canonical URLs on all pages
- `@media (prefers-reduced-motion: reduce)` disables all animations
