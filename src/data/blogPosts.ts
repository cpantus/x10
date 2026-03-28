import type { ComponentType } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;           // ISO 8601
  excerpt: string;
  readingTimeMinutes: number;
  author: { name: string; role: string };
  tags: string[];
  component: () => Promise<{ default: ComponentType }>;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'transcription-local-vs-teams-copilot',
    title: 'Local Whisper vs Teams Copilot: 42/45 to 21/45 on a 4-Hour Romanian Meeting',
    date: '2026-03-28',
    excerpt: 'We benchmarked a fully local whisper.cpp pipeline against Microsoft Teams Copilot on a 4-hour Romanian business meeting. Manual grading: 42/45 vs 21/45. The open-source stack won on text accuracy, number parsing, and technical vocabulary — at zero recurring cost.',
    readingTimeMinutes: 15,
    author: { name: 'Cristi', role: 'Founder, x10 Automation' },
    tags: ['ai', 'transcription', 'whisper', 'benchmark', 'local-ai', 'privacy'],
    component: () => import('../pages/blog/posts/transcription-vs-teams'),
  },
  {
    slug: 'opus-46-ghostty-fix-strategy',
    title: 'The Scaffold Was the Variable, Not the Model',
    date: '2026-03-22',
    excerpt: 'A case study in workflow scaffolding: how structured investigation prompts steered Claude Opus 4.6 to independently reproduce a shipped Ghostty bug fix across three experimental runs.',
    readingTimeMinutes: 12,
    author: { name: 'Cristi', role: 'Founder, x10 Automation' },
    tags: ['ai', 'debugging', 'claude', 'workflow-engineering'],
    component: () => import('../pages/blog/posts/ghostty-opus-fix'),
  },
];
