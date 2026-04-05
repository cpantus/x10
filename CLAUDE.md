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
- **Articles**: `src/pages/blog/posts/<slug>.tsx` �� JSX components, no runtime markdown
- **Typography**: `.prose-x10` in `src/index.css` (no `@tailwindcss/typography`)
- **OG meta**: `scripts/generate-blog-html.ts` — post-build script generates per-route HTML with correct OG tags for social crawlers (LinkedIn, Twitter, Facebook). SPA `SEOMeta.tsx` handles client-side.

### Adding a Blog Post (3 mandatory steps)
1. **Create JSX**: `src/pages/blog/posts/<slug>.tsx` — arrow function returning `<> ... </>`. All tables wrapped in `<div style={{ overflowX: 'auto' }}>` for mobile.
2. **Register in blogPosts.ts**: Add entry with `slug`, `title`, `date`, `excerpt`, `readingTimeMinutes`, `author`, `tags`, `component` (lazy import). Newest first.
3. **Add to OG script**: Add post metadata (slug, title, description) to `scripts/generate-blog-html.ts` posts array. Without this, LinkedIn will show company defaults instead of the blog post.

### Blog Rules
- `pnpm build` runs `tsc -b && vite build && bun scripts/generate-blog-html.ts` — always verify OG generation succeeds
- Tables use CSS `overflow-x: auto` globally (`.prose-x10 table` in index.css) — no manual wrapper divs needed, but wrapping in `<div style={{ overflowX: 'auto' }}>` is still safe
- `.prose-x10` has `overflow-x: clip` — wide content cannot break mobile layout
- `BlogPostPage.tsx` passes `ogType="article"` to `SEOMeta` — do not remove
- Voice/style: follow `~/.claude/skills/CTO-content/SKILL.md` for tone, formatting, banned words

## Key Data Files
- `src/data/catalogItems.ts` — 63 AI solutions across 6 verticals
- `src/data/blogPosts.ts` — blog post metadata registry
- `src/context/DesignVariantContext.tsx` — design variant switcher
- `src/index.css` — global styles + design tokens + `.prose-x10`
