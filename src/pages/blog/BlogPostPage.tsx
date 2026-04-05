import React, { Suspense, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import { blogPosts } from '../../data/blogPosts';
import SEOMeta from '../../components/SEOMeta';
import LogoIcon from '../../components/logos/LogoIcon';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schemas = useMemo(() => {
    if (!post) return [];
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: post.author.name,
        },
        publisher: {
          '@type': 'Organization',
          name: 'x10 Automation',
          url: 'https://x10.ro',
        },
        description: post.excerpt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://x10.ro/blog/${post.slug}`,
        },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://x10.ro/' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://x10.ro/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: `https://x10.ro/blog/${post.slug}` },
        ],
      },
    ];
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] text-white font-sans flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold font-heading">Post not found</h1>
        <Link to="/blog" className="text-sm underline text-white/60 hover:text-white transition-colors">
          Back to all posts
        </Link>
      </div>
    );
  }

  const ArticleContent = React.lazy(post.component);

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white font-sans">
      <SEOMeta
        title={`${post.title} | x10 Automation Blog`}
        description={post.excerpt}
        canonical={`https://x10.ro/blog/${post.slug}`}
        ogType="article"
        schemas={schemas}
      />

      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5"
        style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 80%, transparent)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <LogoIcon variant="gears" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold tracking-tight text-white leading-none font-heading">x10</span>
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-bold leading-tight"
                style={{ color: 'var(--color-accent-primary)' }}
              >
                Automation
              </span>
            </div>
          </a>
          <div className="flex items-center gap-6">
            <Link to="/blog" className="text-white/60 hover:text-white transition-colors text-sm">
              All Posts
            </Link>
            <a href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </a>
          </div>
        </div>
      </nav>

      <article>
        {/* Article Header */}
        <header className="pt-32 pb-12 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex gap-2 mb-6"
            >
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full border border-white/10 font-mono"
                  style={{ color: 'var(--color-accent-primary)', background: 'var(--color-accent-subtle)' }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading leading-tight"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 mt-6 text-sm font-mono text-white/40"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTimeMinutes} min read
              </span>
              <span>·</span>
              <span>
                {post.author.name} — {post.author.role}
              </span>
            </motion.div>
          </div>
        </header>

        {/* Article Content */}
        <div className="px-6 pb-32">
          <div className="prose-x10">
            <Suspense
              fallback={
                <div className="max-w-3xl mx-auto py-24 text-center text-white/30 font-mono text-sm">
                  Loading article...
                </div>
              }
            >
              <ArticleContent />
            </Suspense>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPostPage;
