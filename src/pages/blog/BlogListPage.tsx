import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import SEOMeta from '../../components/SEOMeta';
import LogoIcon from '../../components/logos/LogoIcon';
import BlogCard from '../../components/BlogCard';
import { blogPosts } from '../../data/blogPosts';

const sortedPosts = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

const BlogListPage: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const schemas = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "X10 Automation Engineering Blog",
      "description": "Technical deep-dives, case studies, and lessons from building AI agent teams.",
      "url": "https://x10.ro/blog",
      "publisher": {
        "@type": "Organization",
        "name": "X10 Automation",
        "url": "https://x10.ro",
      },
      "blogPost": sortedPosts.map((p) => ({
        "@type": "BlogPosting",
        "headline": p.title,
        "datePublished": p.date,
        "description": p.excerpt,
        "author": { "@type": "Person", "name": p.author.name },
        "url": `https://x10.ro/blog/${p.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://x10.ro/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://x10.ro/blog" },
      ],
    },
  ], []);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white font-sans">
      <SEOMeta
        title="Blog | X10 Automation"
        description="Technical deep-dives, case studies, and lessons from building AI agent teams."
        canonical="https://x10.ro/blog"
        schemas={schemas}
      />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 80%, transparent)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <LogoIcon variant="gears" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold tracking-tight text-white leading-none font-heading">x10</span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold leading-tight" style={{ color: 'var(--color-accent-primary)' }}>Automation</span>
            </div>
          </a>
          <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-primary)] via-[#0a0a0a] to-[var(--color-bg-primary)]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase block mb-4 font-mono"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            Engineering Blog
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading"
          >
            Blog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Technical deep-dives, case studies, and lessons from building AI agent teams.
          </motion.p>
        </div>
      </section>

      {/* Post Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post, idx) => (
            <BlogCard key={post.slug} post={post} delay={Math.min(idx * 0.05, 0.5)} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold tracking-widest font-heading" style={{ color: 'var(--color-accent-primary)' }}>
              X10 AUTOMATION
            </span>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-white/30 text-xs font-mono">Engineering Blog</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-4 text-xs text-white/30">
              <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white/60 transition-colors">Terms & Conditions</a>
              <button onClick={() => window.dispatchEvent(new Event('reopenCookieConsent'))} className="hover:text-white/60 transition-colors">Cookie Settings</button>
            </div>
            <p className="text-white/20 text-xs font-mono">
              {sortedPosts.length} {sortedPosts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogListPage;
