import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, FileText, Bell, Edit2, Target, Eye, BarChart3, type LucideIcon } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import LogoIcon from '../components/logos/LogoIcon';

const fonts = {
  heading: '"Space Grotesk", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

const iconMap: Record<string, LucideIcon> = {
  Search,
  FileText,
  Bell,
  Edit2,
  Target,
  Eye,
  BarChart3,
};

const categories = [
  {
    name: 'Strategic Research',
    icon: 'Search',
    deliverables: [
      { title: 'Market Research Report', client: 'Pet Supplies E-commerce', desc: '18KB comprehensive market analysis covering competitive landscape, customer segments, and growth opportunities', type: 'Research', metric: '18KB report' },
      { title: '90-Day Growth Strategy', client: 'Pet Supplies E-commerce', desc: 'Full strategic roadmap with 3 phases: Fix & Launch, Optimize & Scale, Authority Building', type: 'Strategy', metric: '3 phases' },
      { title: 'Market Landscape Analysis', client: 'Automotive Parts Retailer', desc: 'Complete competitive positioning and market opportunity assessment for auto parts e-commerce', type: 'Research', metric: '12 competitors mapped' },
    ],
  },
  {
    name: 'Pitch Decks',
    icon: 'FileText',
    deliverables: [
      { title: 'Investment Pitch Deck', client: 'Pet Supplies E-commerce', desc: 'Professional PPTX presentation with market data, projections, and competitive analysis', type: 'Presentation', metric: 'PPTX' },
      { title: 'Interactive Sales Pitch', client: 'Pet Supplies E-commerce', desc: 'Full HTML interactive pitch with animations, data visualizations, and responsive design', type: 'Interactive', metric: 'HTML' },
      { title: 'Technical Capability Pitch', client: 'Automotive Parts Retailer', desc: 'Interactive HTML showcase of AI capabilities with live demos and ROI projections', type: 'Interactive', metric: 'HTML' },
    ],
  },
  {
    name: 'Email & Campaigns',
    icon: 'Bell',
    deliverables: [
      { title: 'Q1 Campaign Strategy', client: 'Automotive Parts Retailer', desc: 'Complete campaign strategy targeting \u20AC280K revenue with 6 automation flows', type: 'Strategy', metric: '\u20AC280K target' },
      { title: 'Email Marketing PRD', client: 'Pet Supplies E-commerce', desc: 'Full product requirements for email automation: welcome, cart recovery, post-purchase, win-back', type: 'PRD', metric: '6 flows' },
      { title: 'Abandoned Cart Recovery', client: 'Automotive Parts Retailer', desc: 'Multi-step automation with dynamic content, timing optimization, and A/B test framework', type: 'Automation', metric: '3-5% recovery' },
    ],
  },
  {
    name: 'Content Strategy',
    icon: 'Edit2',
    deliverables: [
      { title: 'LinkedIn Authority Campaign', client: 'Pet Supplies E-commerce', desc: '15 LinkedIn posts across 5 audience segments with engagement hooks and CTA optimization', type: 'Social', metric: '15 posts' },
      { title: 'Programmatic Blog Content', client: 'Automotive Parts Retailer', desc: '80 SEO-optimized articles covering product categories, buying guides, and technical specs', type: 'Content', metric: '80 articles' },
      { title: 'Product Description Templates', client: 'Pet Supplies E-commerce', desc: 'Scalable templates for 500+ product descriptions with SEO metadata', type: 'Templates', metric: '500+ products' },
    ],
  },
  {
    name: 'Lead Generation',
    icon: 'Target',
    deliverables: [
      { title: 'Vehicle Compatibility Checker', client: 'Automotive Parts Retailer', desc: 'Interactive tool matching parts to vehicle models with real-time inventory data', type: 'Lead Magnet', metric: '40%+ conversion' },
      { title: 'Towing Capacity Calculator', client: 'Automotive Parts Retailer', desc: 'Calculator with legal compliance data for Romanian towing regulations', type: 'Lead Magnet', metric: 'Legal compliant' },
      { title: 'Cost Savings Calculator', client: 'Automotive Parts Retailer', desc: 'ROI calculator comparing OEM vs aftermarket parts with warranty analysis', type: 'Lead Magnet', metric: '2x industry avg' },
    ],
  },
  {
    name: 'SEO & AI Search',
    icon: 'Search',
    deliverables: [
      { title: 'LLM SEO Audit', client: 'Professional Services Client', desc: 'Complete audit of visibility in AI search engines: ChatGPT, Perplexity, Gemini, Claude', type: 'Audit', metric: '4 AI engines' },
      { title: 'GEO Readiness Assessment', client: 'Automotive Parts Retailer', desc: 'Generative Engine Optimization score with actionable improvement roadmap', type: 'Audit', metric: '3.5\u21927.5 score' },
      { title: 'Technical SEO Fix Package', client: 'Automotive Parts Retailer', desc: 'Critical technical fixes: schema markup, Core Web Vitals, crawlability, indexation', type: 'Technical', metric: '30-min deploy' },
    ],
  },
  {
    name: 'Competitive Intelligence',
    icon: 'Eye',
    deliverables: [
      { title: 'Competitive Analysis Package', client: 'Pet Supplies E-commerce', desc: 'Full analysis: executive summary, competitive matrix, strategic playbook, and threat assessment', type: 'Analysis', metric: '12 competitors' },
      { title: 'Pricing Intelligence Report', client: 'Automotive Parts Retailer', desc: 'Automated pricing comparison across 5 competitors with dynamic monitoring setup', type: 'Intelligence', metric: '5 competitors' },
      { title: 'Market Entry Assessment', client: 'Energy Sector Client', desc: 'Market viability analysis with regulatory landscape and competitive positioning', type: 'Research', metric: '3 markets' },
    ],
  },
  {
    name: 'Data Visualization',
    icon: 'BarChart3',
    deliverables: [
      { title: 'Energy Sector Infographic', client: 'Energy Sector Client', desc: 'Interactive data visualization for energy consumption patterns and savings projections', type: 'Infographic', metric: 'Interactive' },
      { title: 'Marketing Effort Dashboard', client: 'Automotive Parts Retailer', desc: 'Visual breakdown of campaign performance, channel attribution, and ROI tracking', type: 'Dashboard', metric: 'Real-time' },
      { title: 'Agent Performance Visualization', client: 'Pet Supplies E-commerce', desc: 'Live dashboard showing AI agent activity, task completion, and efficiency metrics', type: 'Dashboard', metric: 'Live data' },
    ],
  },
];

const typeColors: Record<string, string> = {
  Research: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Strategy: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Presentation: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Interactive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  PRD: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  Automation: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  Social: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Content: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Templates: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  'Lead Magnet': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  Audit: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Technical: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  Analysis: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  Intelligence: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  Infographic: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
  Dashboard: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
};

const totalDeliverables = categories.reduce((sum, c) => sum + c.deliverables.length, 0);

const CatalogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'midnight-gold');
    window.scrollTo(0, 0);
  }, []);

  const catalogSchemas = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "X10 Automation AI Deliverables Catalog",
      "description": "153 production-ready AI deliverable specifications across 8 categories from real client engagements.",
      "numberOfItems": 153,
      "itemListElement": categories.map((cat, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": cat.name,
        "description": `${cat.deliverables.length} deliverables in ${cat.name}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://x10.ro/" },
        { "@type": "ListItem", "position": 2, "name": "Catalog", "item": "https://x10.ro/catalog" },
      ],
    },
  ], []);

  const filteredDeliverables =
    activeCategory === 'All'
      ? categories.flatMap((c) =>
          c.deliverables.map((d) => ({ ...d, category: c.name, icon: c.icon }))
        )
      : (categories
          .find((c) => c.name === activeCategory)
          ?.deliverables.map((d) => ({
            ...d,
            category: activeCategory,
            icon: categories.find((c) => c.name === activeCategory)?.icon || 'Search',
          })) || []);

  return (
    <div className="min-h-screen bg-[#030303] text-white" style={{ fontFamily: '"Sora", sans-serif' }}>
      <SEOMeta
        title="AI Deliverables Catalog | 153 Specs Across 9 Industries | X10 Automation"
        description="Browse 153 production-ready AI deliverable specifications across 8 categories: strategic research, pitch decks, email campaigns, content strategy, lead generation, SEO, competitive intelligence, and data visualization."
        canonical="https://x10.ro/catalog"
        schemas={catalogSchemas}
      />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group cursor-pointer">
            <LogoIcon variant="gears" />
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold tracking-tight text-white leading-none" style={{ fontFamily: fonts.heading }}>x10</span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold leading-tight" style={{ color: 'var(--color-accent-primary)' }}>Automation</span>
            </div>
          </a>
          <a
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-[#0a0a0a] to-[#030303]" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs tracking-[0.3em] uppercase block mb-4"
            style={{ fontFamily: fonts.mono, color: 'var(--color-accent, #00E5CC)' }}
          >
            Production-Ready Deliverables
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            style={{ fontFamily: fonts.heading }}
          >
            Solutions Catalog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            153 production-ready specifications across {categories.length} categories.
            <br />
            <span className="text-white/30 text-base">
              Showing {totalDeliverables} representative deliverables from real client engagements.
            </span>
          </motion.p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-12 sticky top-16 z-40 bg-[#030303]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterButton
              label="All"
              count={totalDeliverables}
              active={activeCategory === 'All'}
              onClick={() => setActiveCategory('All')}
            />
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Search;
              return (
                <FilterButton
                  key={cat.name}
                  label={cat.name}
                  count={cat.deliverables.length}
                  active={activeCategory === cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  icon={<Icon className="w-3.5 h-3.5" />}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredDeliverables.map((item, idx) => (
                <motion.div
                  key={`${item.category}-${item.title}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <DeliverableCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span
              className="text-sm font-bold tracking-widest"
              style={{ fontFamily: fonts.heading, color: 'var(--color-accent, #00E5CC)' }}
            >
              X10 AUTOMATION
            </span>
            <span className="text-white/20 text-xs">|</span>
            <span className="text-white/30 text-xs" style={{ fontFamily: fonts.mono }}>
              AI-Powered Marketing Teams
            </span>
          </div>
          <p className="text-white/20 text-xs" style={{ fontFamily: fonts.mono }}>
            {totalDeliverables} deliverables shown &middot; 153 total specifications &middot; 9 industries
          </p>
        </div>
      </footer>
    </div>
  );
};

/* ---------- Sub-components ---------- */

interface FilterButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, count, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border ${
      active
        ? 'border-accent-400 bg-accent-400/10 text-white'
        : 'border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20'
    }`}
    style={active ? { borderColor: 'var(--color-accent, #00E5CC)', background: 'var(--color-accent, #00E5CC)10' } : {}}
  >
    {icon}
    <span>{label}</span>
    <span
      className={`text-xs px-1.5 py-0.5 rounded-full ${
        active ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/30'
      }`}
    >
      {count}
    </span>
  </button>
);

interface DeliverableItem {
  title: string;
  client: string;
  desc: string;
  type: string;
  metric: string;
  category: string;
  icon: string;
}

const DeliverableCard: React.FC<{ item: DeliverableItem }> = ({ item }) => {
  const Icon = iconMap[item.icon] || Search;
  const colorClass = typeColors[item.type] || 'bg-white/10 text-white/60 border-white/20';

  return (
    <div className="group bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-[#151515] transition-all duration-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-accent, #00E5CC)' }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-wider uppercase text-white/25" style={{ fontFamily: fonts.mono }}>
            {item.category}
          </span>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/40 whitespace-nowrap border border-white/5">
          {item.client}
        </span>
      </div>

      {/* Title & Description */}
      <h3
        className="text-base font-semibold text-white mb-2 group-hover:text-white transition-colors"
        style={{ fontFamily: fonts.heading }}
      >
        {item.title}
      </h3>
      <p className="text-sm text-white/40 leading-relaxed mb-4 flex-grow">{item.desc}</p>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <span className={`text-[11px] px-2.5 py-1 rounded-full border ${colorClass}`}>{item.type}</span>
        <span className="text-xs text-white/30" style={{ fontFamily: fonts.mono }}>
          {item.metric}
        </span>
      </div>
    </div>
  );
};

export default CatalogPage;
