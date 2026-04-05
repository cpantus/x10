/**
 * Post-build script: generates per-blog-post HTML files with correct OG meta tags.
 *
 * Problem: This is an SPA — social crawlers (LinkedIn, Twitter, Facebook) don't execute JS,
 * so they only see the static OG tags in index.html (company defaults).
 *
 * Solution: After vite build, generate dist/blog/<slug>/index.html for each blog post
 * with post-specific OG tags baked into the static HTML. The SPA still loads and takes over.
 *
 * Run: bun scripts/generate-blog-html.ts (called automatically by `pnpm build`)
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

// Blog posts metadata — keep in sync with src/data/blogPosts.ts
const posts = [
  {
    slug: 'apex-quantization-amd-strix-halo',
    title: 'APEX Quantization on AMD Consumer Hardware: 3 Models, 34% Smaller, Better Than F16',
    description: 'We benchmarked APEX and REAP quantization across three Qwen3.5 models — 35B, 97B, and 122B — on an AMD Ryzen AI Max+ 395. The 35B agent dropped from 34.4 GB to 22.8 GB with perplexity below F16. Q4_0 KV cache promoted to production. TurboQuant blocked on Vulkan — ROCm is the unlock path.',
  },
  {
    slug: 'transcription-local-vs-teams-copilot',
    title: 'Local Whisper vs Teams Copilot: 42/45 to 21/45 on a 4-Hour Romanian Meeting',
    description: 'We benchmarked a fully local whisper.cpp pipeline against Microsoft Teams Copilot on a 4-hour Romanian business meeting. Manual grading: 42/45 vs 21/45. The open-source stack won on text accuracy, number parsing, and technical vocabulary — at zero recurring cost.',
  },
  {
    slug: 'opus-46-ghostty-fix-strategy',
    title: 'The Scaffold Was the Variable, Not the Model',
    description: 'A case study in workflow scaffolding: how structured investigation prompts steered Claude Opus 4.6 to independently reproduce a shipped Ghostty bug fix across three experimental runs.',
  },
];

const indexHtml = readFileSync(resolve(distDir, 'index.html'), 'utf-8');

let generated = 0;

for (const post of posts) {
  const url = `https://x10.ro/blog/${post.slug}`;
  const fullTitle = `${post.title} | x10 Automation Blog`;

  const html = indexHtml
    // OG tags
    .replace(
      /<meta property="og:type" content="[^"]*"/,
      '<meta property="og:type" content="article"'
    )
    .replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="${url}"`
    )
    .replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${post.title}"`
    )
    .replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${post.description}"`
    )
    // Twitter tags
    .replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${post.title}"`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${post.description}"`
    )
    // Page title and description
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${fullTitle}</title>`
    )
    .replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${post.description}"`
    )
    // Canonical
    .replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="${url}"`
    );

  const dir = resolve(distDir, 'blog', post.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(resolve(dir, 'index.html'), html);
  generated++;
}

// Also generate dist/blog/index.html for the blog listing page
const blogListHtml = indexHtml
  .replace(
    /<meta property="og:title" content="[^"]*"/,
    '<meta property="og:title" content="Blog | x10 Automation"'
  )
  .replace(
    /<meta property="og:description" content="[^"]*"/,
    '<meta property="og:description" content="Technical deep-dives on local AI, quantization, privacy-first deployment, and AMD consumer hardware benchmarks."'
  )
  .replace(
    /<meta property="og:url" content="[^"]*"/,
    '<meta property="og:url" content="https://x10.ro/blog"'
  )
  .replace(
    /<title>[^<]*<\/title>/,
    '<title>Blog | x10 Automation</title>'
  )
  .replace(
    /<link rel="canonical" href="[^"]*"/,
    '<link rel="canonical" href="https://x10.ro/blog"'
  );

mkdirSync(resolve(distDir, 'blog'), { recursive: true });
writeFileSync(resolve(distDir, 'blog', 'index.html'), blogListHtml);

console.log(`Generated ${generated} blog post HTML files + blog listing page`);
