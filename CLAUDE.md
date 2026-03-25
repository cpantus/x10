# x10 Automation Website

x10.ro — marketing site for x10 Automation, AI agent teams for European SMEs.

## Stack
- React 19 + TypeScript + Vite
- Tailwind CSS 3 + CSS custom properties (design tokens)
- Framer Motion 12 (animations)
- React Router v7 (client-side, BrowserRouter)
- Three.js + React Three Fiber (hero backgrounds, lazy-loaded)
- Lucide React (icons)
- Self-hosted WOFF2 fonts (GDPR-compliant, no Google CDN)

## Commands
- `pnpm dev` — local dev server
- `pnpm build` — TypeScript check + Vite build
- `pnpm preview` — serve production build

## Brand Rules
- **Always lowercase** `x10` — never `X10` in user-facing text
- Exception: `BackgroundWatermark` renders decorative uppercase `X10`
- Domain: x10.ro

## Design System
- Dark mode only (`#030303`). No light mode.
- 3 switchable variants via `?design=` URL param: `current` (default), `anthro`, `v5`
- All theming via CSS custom properties (`--color-accent-*`, `--font-*`, `--duration-*`)
- Fonts: Space Grotesk (display), Sora (body), JetBrains Mono (mono)

## Routes
| Path | Page | File |
|------|------|------|
| `/` | Landing | `src/App.tsx` |
| `/catalog` | AI Solutions Catalog | `src/pages/CatalogPage.tsx` |
| `/solutions` | Solutions showcase | `src/pages/SolutionsPage.tsx` |
| `/blog` | Blog listing | `src/pages/blog/BlogListPage.tsx` |
| `/blog/:slug` | Blog article | `src/pages/blog/BlogPostPage.tsx` |
| `/privacy` | Privacy Policy | `src/pages/PrivacyPage.tsx` |
| `/terms` | Terms of Service | `src/pages/TermsPage.tsx` |
| `*` | 404 | `src/pages/NotFoundPage.tsx` |

## Blog
- **Data**: `src/data/blogPosts.ts` — metadata registry with lazy component imports
- **Articles**: `src/pages/blog/posts/<slug>.tsx` — JSX components, no runtime markdown
- **Typography**: `.prose-x10` in `src/index.css` (no `@tailwindcss/typography`)
- **Adding a post**: Create JSX in `posts/`, add entry to `blogPosts` array

## Key Data Files
- `src/data/catalogItems.ts` — 63 AI solutions across 6 verticals
- `src/data/blogPosts.ts` — blog post metadata registry
- `src/context/DesignVariantContext.tsx` — design variant switcher
- `src/index.css` — global styles + design tokens + `.prose-x10`
