# x10 Automation Website

Marketing site for x10 Automation — AI agent teams for European SMEs.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 3 + CSS custom properties (design tokens)
- Framer Motion for animations
- React Router v7 (client-side, BrowserRouter)
- Three.js + React Three Fiber (hero backgrounds, lazy-loaded)
- Lucide React for icons
- Self-hosted WOFF2 fonts (GDPR-compliant, no Google CDN)

## Brand

- Always **lowercase** `x10` — never `X10` in user-facing text
- Exception: `BackgroundWatermark` component renders decorative uppercase `X10`
- Domain: x10.ro

## Design System

3 switchable design variants via `?design=` URL param:
- `current` (default): Space Grotesk / Sora / JetBrains Mono, blue + gold accents
- `anthro`: Bebas Neue / Syne / DM Mono, acid green
- `v5`: Cormorant Garamond, warm gold (serif luxury)

All theming via CSS custom properties (`--color-accent-*`, `--font-*`, `--duration-*`). Set `data-design` attribute on `<html>`. See `src/context/DesignVariantContext.tsx`.

Dark theme only. Background: `#030303`. No light mode.

## Routes

| Path | Page | File |
|------|------|------|
| `/` | Landing page | `src/App.tsx` |
| `/catalog` | AI Solutions Catalog | `src/pages/CatalogPage.tsx` |
| `/solutions` | Solutions showcase | `src/pages/SolutionsPage.tsx` |
| `/blog` | Blog listing | `src/pages/blog/BlogListPage.tsx` |
| `/blog/:slug` | Blog article | `src/pages/blog/BlogPostPage.tsx` |
| `/privacy` | Privacy Policy | `src/pages/PrivacyPage.tsx` |
| `/terms` | Terms of Service | `src/pages/TermsPage.tsx` |
| `*` | 404 | `src/pages/NotFoundPage.tsx` |

All pages lazy-loaded with `React.lazy()` + `Suspense` in `src/main.tsx`.

## Blog Conventions

- **Data**: `src/data/blogPosts.ts` — metadata registry (slug, title, date, excerpt, tags, lazy component import)
- **Articles**: `src/pages/blog/posts/<slug>.tsx` — each post is a JSX component using native HTML tags
- **Typography**: `.prose-x10` class in `src/index.css` styles all article content (no `@tailwindcss/typography`)
- **No runtime markdown parser** — articles are pre-converted to JSX for zero bundle cost
- **SEO**: BlogPosting + BreadcrumbList JSON-LD schemas per article
- **Adding a new post**: Create JSX in `posts/`, add entry to `blogPosts` array — routing is automatic via `:slug` param

## Sub-page Pattern

All sub-pages follow this structure:
1. Fixed navbar: `backdrop-blur-xl`, logo left (links `/`), "Back to Home" right
2. Hero section: `pt-32 pb-16 px-6`, accent badge, large `font-heading` title, subtitle
3. Content: `max-w-7xl mx-auto px-6`
4. `SEOMeta` component for dynamic meta tags + JSON-LD

## Key Patterns

- Container: `max-w-7xl mx-auto px-6` (sections), `max-w-3xl` (article prose)
- Cards: `bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20`
- Entry animations: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Staggered: `delay: Math.min(idx * 0.03, 0.5)`
- Z-layers: 50 (navbar), 40 (vignette), 30 (content), 20 (hero)
- Colors always via `var(--color-accent-*)`, never hardcoded

## Commands

```bash
pnpm dev      # Dev server
pnpm build    # TypeScript check + Vite build
pnpm preview  # Preview production build
```
