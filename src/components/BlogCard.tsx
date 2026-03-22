import { motion } from 'framer-motion';
import type { BlogPost } from '../data/blogPosts';

interface BlogCardProps {
  post: BlogPost;
  delay?: number;
}

const tagColors = [
  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
];

function tagColor(tag: string): string {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const BlogCard: React.FC<BlogCardProps> = ({ post, delay = 0 }) => (
  <motion.a
    href={`/blog/${post.slug}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="group bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-[#151515] transition-all duration-300 flex flex-col h-full no-underline"
  >
    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className={`text-[10px] px-2 py-0.5 rounded-full border font-mono uppercase tracking-wider ${tagColor(tag)}`}
        >
          {tag}
        </span>
      ))}
    </div>

    {/* Title */}
    <h3 className="font-heading text-xl font-semibold text-white mb-3 group-hover:text-white transition-colors leading-tight">
      {post.title}
    </h3>

    {/* Excerpt */}
    <p className="text-sm text-white/40 leading-relaxed line-clamp-3 flex-grow">
      {post.excerpt}
    </p>

    {/* Footer */}
    <div className="flex items-center justify-between border-t border-white/5 mt-4 pt-4">
      <span className="text-xs font-mono text-white/30">{formatDate(post.date)}</span>
      <span className="text-xs text-white/30">{post.readingTimeMinutes} min read</span>
    </div>
  </motion.a>
);

export default BlogCard;
