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
