import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Magnet,
  Radar,
  Database,
  Zap,
  ClipboardCheck,
  MessageSquare,
  FileText,
  BarChart3,
  Heart,
  Scale,
  Home,
  Wrench,
  Briefcase,
  ShoppingCart,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import SEOMeta from '../components/SEOMeta';
import LogoIcon from '../components/logos/LogoIcon';
import {
  catalogItems,
  APP_TYPE_META,
  VERTICAL_META,
  COMPLEXITY_META,
  type AppType,
  type Vertical,
  type CatalogItem,
} from '../data/catalogItems';

const iconMap: Record<string, LucideIcon> = {
  Magnet,
  Radar,
  Database,
  Zap,
  ClipboardCheck,
  MessageSquare,
  FileText,
  BarChart3,
  Heart,
  Scale,
  Home,
  Wrench,
  Briefcase,
  ShoppingCart,
};

const appTypeKeys = Object.keys(APP_TYPE_META) as AppType[];
const verticalKeys = Object.keys(VERTICAL_META) as Vertical[];
const totalItems = catalogItems.length;
const provenCount = catalogItems.filter((i) => i.proven).length;

const CatalogPage: React.FC = () => {
  const [activeType, setActiveType] = useState<AppType | 'all'>('all');
  const [activeVertical, setActiveVertical] = useState<Vertical | 'all'>('all');
  const typeFilterRef = useRef<HTMLDivElement>(null);
  const verticalFilterRef = useRef<HTMLDivElement>(null);

  const scrollPillIntoView = useCallback((ref: React.RefObject<HTMLDivElement | null>, key: string) => {
    requestAnimationFrame(() => {
      const container = ref.current;
      if (!container) return;
      const btn = container.querySelector(`[data-filter="${key}"]`) as HTMLElement;
      if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  }, []);

  const handleTypeClick = useCallback((t: AppType | 'all') => {
    setActiveType(t);
    scrollPillIntoView(typeFilterRef, t);
  }, [scrollPillIntoView]);

  const handleVerticalClick = useCallback((v: Vertical | 'all') => {
    setActiveVertical(v);
    scrollPillIntoView(verticalFilterRef, v);
  }, [scrollPillIntoView]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filteredItems = useMemo(() =>
    catalogItems.filter((item) =>
      (activeType === 'all' || item.appType === activeType) &&
      (activeVertical === 'all' || item.vertical === activeVertical)
    ), [activeType, activeVertical]);

  // Cross-filtered counts for pills
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const t of appTypeKeys) counts[t] = 0;
    for (const item of catalogItems) {
      if (activeVertical === 'all' || item.vertical === activeVertical) {
        counts.all++;
        counts[item.appType]++;
      }
    }
    return counts;
  }, [activeVertical]);

  const verticalCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    for (const v of verticalKeys) counts[v] = 0;
    for (const item of catalogItems) {
      if (activeType === 'all' || item.appType === activeType) {
        counts.all++;
        counts[item.vertical]++;
      }
    }
    return counts;
  }, [activeType]);

  const summaryText = useMemo(() => {
    if (activeType === 'all' && activeVertical === 'all') return `Showing ${totalItems} solutions`;
    const typePart = activeType !== 'all' ? APP_TYPE_META[activeType].label : 'solutions';
    const vertPart = activeVertical !== 'all' ? VERTICAL_META[activeVertical].label : 'all industries';
    return `Showing ${filteredItems.length} ${typePart} in ${vertPart}`;
  }, [activeType, activeVertical, filteredItems.length]);

  const catalogSchemas = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "x10 Automation AI Solutions Catalog",
      "description": `${totalItems} AI-powered solutions across 6 industries and 8 capability types.`,
      "numberOfItems": totalItems,
      "itemListElement": [
        ...appTypeKeys.map((t, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": APP_TYPE_META[t].label,
          "description": `${catalogItems.filter((it) => it.appType === t).length} solutions`,
        })),
        ...verticalKeys.map((v, i) => ({
          "@type": "ListItem",
          "position": appTypeKeys.length + i + 1,
          "name": VERTICAL_META[v].label,
          "description": `${catalogItems.filter((it) => it.vertical === v).length} solutions`,
        })),
      ],
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

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] text-white font-sans">
      <SEOMeta
        title="AI Solutions Catalog | 6 Industries, 8 App Types | x10 Automation"
        description={`Browse ${totalItems} AI-powered solutions across 6 industries and 8 capability types: lead magnets, scrapers, data enrichment, automation pipelines, audit tools, AI chatbots, programmatic content, and dashboards.`}
        canonical="https://x10.ro/catalog"
        schemas={catalogSchemas}
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
            AI Transformation Partner
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-heading"
          >
            Solutions Catalog
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto"
          >
            {totalItems} AI-powered solutions across 6 industries and 8 capability types.
            <br />
            <span className="text-white/30 text-base">
              6 Industries | 8 App Types | {provenCount} Proven in Production
            </span>
          </motion.p>
        </div>
      </section>

      {/* Dual Filter Bar */}
      <section className="pb-4 sticky top-16 z-40 backdrop-blur-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-primary) 90%, transparent)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Row 1: App Type */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
            <div
              ref={typeFilterRef}
              className="flex gap-2 overflow-x-auto pb-2 px-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <FilterButton
                label="All Types"
                count={typeCounts.all}
                active={activeType === 'all'}
                onClick={() => handleTypeClick('all')}
                data-filter="all"
              />
              {appTypeKeys.map((t) => {
                const meta = APP_TYPE_META[t];
                const Icon = iconMap[meta.icon];
                return (
                  <FilterButton
                    key={t}
                    label={meta.label}
                    count={typeCounts[t]}
                    active={activeType === t}
                    onClick={() => handleTypeClick(t)}
                    icon={Icon ? <Icon className="w-3.5 h-3.5" /> : undefined}
                    data-filter={t}
                  />
                );
              })}
            </div>
          </div>

          {/* Row 2: Industry */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
            <div
              ref={verticalFilterRef}
              className="flex gap-2 overflow-x-auto pb-2 px-6"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <FilterButton
                label="All Industries"
                count={verticalCounts.all}
                active={activeVertical === 'all'}
                onClick={() => handleVerticalClick('all')}
                data-filter="all"
              />
              {verticalKeys.map((v) => {
                const meta = VERTICAL_META[v];
                const Icon = iconMap[meta.icon];
                return (
                  <FilterButton
                    key={v}
                    label={meta.label}
                    count={verticalCounts[v]}
                    active={activeVertical === v}
                    onClick={() => handleVerticalClick(v)}
                    icon={Icon ? <Icon className="w-3.5 h-3.5" /> : undefined}
                    data-filter={v}
                  />
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="px-6 pt-1 pb-2">
            <p className="text-xs text-white/30 font-mono">{summaryText}</p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {filteredItems.length > 0 ? (
              <motion.div
                key={`${activeType}-${activeVertical}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.5) }}
                  >
                    <CatalogCard item={item} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <p className="text-white/40 text-lg mb-4">No solutions in this exact combination yet.</p>
                <p className="text-white/25 text-sm mb-6">Try broadening your filters.</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setActiveType('all')}
                    className="text-sm px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Reset App Type
                  </button>
                  <button
                    onClick={() => setActiveVertical('all')}
                    className="text-sm px-4 py-2 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-colors"
                  >
                    Reset Industry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
            <span className="text-white/30 text-xs font-mono">AI Transformation Partner</span>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-4 text-xs text-white/30">
              <a href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-white/60 transition-colors">Terms & Conditions</a>
              <button onClick={() => window.dispatchEvent(new Event('reopenCookieConsent'))} className="hover:text-white/60 transition-colors">Cookie Settings</button>
            </div>
            <p className="text-white/20 text-xs font-mono">
              {totalItems} solutions | 6 industries | 8 app types
            </p>
          </div>
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
  'data-filter'?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, count, active, onClick, icon, ...rest }) => (
  <button
    onClick={onClick}
    {...rest}
    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-200 border ${
      active
        ? 'border-accent-400 bg-accent-400/10 text-white'
        : 'border-white/10 bg-white/5 text-white/50 hover:text-white/80 hover:border-white/20'
    }`}
    style={active ? { borderColor: 'var(--color-accent-primary)', background: 'var(--color-accent-subtle)' } : {}}
  >
    {icon}
    <span>{label}</span>
    <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/10 text-white/80' : 'bg-white/5 text-white/30'}`}>
      {count}
    </span>
  </button>
);

const typeColorMap: Record<string, string> = {
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  emerald: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  fuchsia: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
};

const complexityDotColor: Record<string, string> = {
  low: 'bg-emerald-500',
  medium: 'bg-amber-500',
  high: 'bg-orange-500',
};

const CatalogCard: React.FC<{ item: CatalogItem }> = ({ item }) => {
  const typeMeta = APP_TYPE_META[item.appType];
  const verticalMeta = VERTICAL_META[item.vertical];
  const TypeIcon = iconMap[typeMeta.icon];
  const colorClass = typeColorMap[typeMeta.color] || 'bg-white/10 text-white/60 border-white/20';
  const complexMeta = COMPLEXITY_META[item.complexity];

  return (
    <div className="group bg-[#111] border border-white/10 rounded-xl p-6 hover:border-white/20 hover:bg-[#151515] transition-all duration-300 flex flex-col h-full">
      {/* Header: type icon+label left, vertical pill right */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            {TypeIcon && <TypeIcon className="w-4 h-4" />}
          </div>
          <span className="text-[10px] tracking-wider uppercase text-white/25 font-mono">
            {typeMeta.label}
          </span>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-white/40 whitespace-nowrap border border-white/5">
          {verticalMeta.label}
        </span>
      </div>

      {/* Title & Description */}
      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white transition-colors font-heading">
        {item.title}
      </h3>
      <p className="text-sm text-white/40 leading-relaxed mb-4 flex-grow line-clamp-2">{item.desc}</p>

      {/* Bottom Row */}
      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-3">
          <span className={`text-[11px] px-2.5 py-1 rounded-full border ${colorClass}`}>
            {typeMeta.label}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-white/30">
            <span className={`w-2 h-2 rounded-full ${complexityDotColor[item.complexity]}`} />
            {complexMeta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/30 font-mono">{item.metric}</span>
          {item.proven && (
            <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: 'var(--color-accent-primary)' }}>
              <CheckCircle2 className="w-3 h-3" />
              Proven
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;
