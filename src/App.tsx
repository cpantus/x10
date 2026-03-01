/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Zap, Network, Shield, ChevronDown, FileText, Search, Users, ShieldCheck, BarChart3, Target, Check, Eye, Calculator, X, Server, Cpu, CheckSquare, Settings, Edit2, Save, Scale, BookOpen, Bell, Lock } from 'lucide-react';
import AIChat from './components/AIChat';
import HeroBackground from './components/heroes/HeroBackground';
import type { HeroVariant } from './components/heroes/types';
import LogoIcon from './components/logos/LogoIcon';
import type { LogoVariant } from './components/logos/types';

// --- Design Tokens & Assets ---

const fonts = {
  heading: '"Space Grotesk", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

// Hero background variant — change here or use ?hero=lightweight in URL
const DEFAULT_HERO_VARIANT: HeroVariant = 'lightweight';
const SHOW_HERO_ANNOTATIONS = false;

// Color theme — switchable via ?theme=midnight-teal in URL
type ColorTheme = 'electric-blue' | 'midnight-teal' | 'cyan-spectrum' | 'midnight-gold';
const DEFAULT_THEME: ColorTheme = 'midnight-gold';
const VALID_THEMES: ColorTheme[] = ['electric-blue', 'midnight-teal', 'cyan-spectrum', 'midnight-gold'];

// Logo variant — switchable via ?logo=gears in URL
const DEFAULT_LOGO: LogoVariant = 'gears';
const VALID_LOGOS: LogoVariant[] = ['gears', 'neural', 'infinity', 'atomic'];

// --- Visual Effects Components ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-[0.06]"
       style={{
         backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
         backgroundSize: '150px 150px'
       }}
  />
);

const Vignette = () => (
  <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,transparent_10%,#000000_120%)] opacity-80" />
);

interface WatermarkProps {
    className?: string;
}

const BackgroundWatermark: React.FC<WatermarkProps> = ({ className }) => (
    <div className={`absolute pointer-events-none select-none overflow-hidden flex items-center z-0 ${className || "inset-0 justify-center"}`}>
        <span className="text-[20vw] font-bold text-white/[0.07] leading-none whitespace-nowrap" style={{ fontFamily: fonts.heading }}>X10</span>
    </div>
);

// --- UI Components ---

const Navbar = ({ logoVariant }: { logoVariant: LogoVariant }) => {
  const navItems = ['Solutions', 'Industries', 'Case Studies', 'Results'];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 max-w-[1920px] mx-auto backdrop-blur-xl bg-black/60 border-b border-white/5"
    >
      <div className="flex items-center gap-3 group cursor-pointer">
        <LogoIcon variant={logoVariant} />
        <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none" style={{ fontFamily: fonts.heading }}>X10</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold leading-tight" style={{ color: 'var(--color-accent-primary)' }}>Automation</span>
        </div>
      </div>

      <div className="hidden md:flex gap-10 items-center">
        {navItems.map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="text-xs font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] relative group"
            style={{ fontFamily: fonts.mono }}
          >
            {item}
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300" style={{ background: 'var(--color-accent-primary)' }} />
          </motion.a>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)",
          borderColor: "rgba(255,255,255,0.8)",
          transition: { duration: 0.1, delay: 0 }
        }}
        whileTap={{ scale: 0.95 }}
        className="hidden md:flex items-center relative px-6 py-2.5 border border-white/20 text-white text-xs uppercase tracking-widest backdrop-blur-md bg-black/30 group overflow-hidden btn-glow"
        style={{ fontFamily: fonts.mono }}
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-100 ease-out" />
        <span className="relative z-10">Book a Consultation</span>
      </motion.button>
    </motion.nav>
  );
};

interface AnnotationProps {
  label: string;
  side: 'left' | 'right';
  delay: number;
  x: number;
  y: number;
}

const Annotation: React.FC<AnnotationProps> = ({ label, side, delay, x, y }) => {
  const isLeft = side === 'left';
  const uniqueId = `lineGradient-${label.replace(/\s+/g, '-')}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay, duration: 1 }}
      className={`absolute top-1/2 left-1/2 pointer-events-none z-30 hidden lg:flex flex-col ${isLeft ? 'items-end' : 'items-start'}`}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <div className="flex items-center gap-4">
        {isLeft && (
          <motion.span
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-xs uppercase tracking-widest font-bold"
            style={{ fontFamily: fonts.mono, textShadow: '0 0 10px var(--color-accent-glow)', color: 'var(--color-accent-secondary)' }}
          >
            {label}
          </motion.span>
        )}

        {/* Anchor Dot */}
        <div className="relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + 0.2 }}
              className="w-1.5 h-1.5 bg-white rounded-full relative z-10"
            />
            <motion.div
              animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-sm" style={{ background: 'var(--color-accent-muted)' }}
            />
        </div>

        {!isLeft && (
          <motion.span
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-xs uppercase tracking-widest font-bold"
            style={{ fontFamily: fonts.mono, textShadow: '0 0 10px var(--color-accent-glow)', color: 'var(--color-accent-secondary)' }}
          >
            {label}
          </motion.span>
        )}
      </div>

      {/* Technical Line */}
      <svg
        width="140"
        height="100"
        className={`absolute top-3 ${isLeft ? 'right-2' : 'left-2'} opacity-60`}
        style={{
          transform: isLeft ? 'scaleX(1)' : 'scaleX(-1)',
          transformOrigin: isLeft ? 'right top' : 'left top'
        }}
      >
        <defs>
          <linearGradient id={uniqueId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--color-accent-primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0 80 L60 80 L100 0"
          fill="none"
          stroke={`url(#${uniqueId})`}
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: delay, ease: "circOut" }}
        />
      </svg>
    </motion.div>
  );
};

const HeroContent = () => {
  return (
    <div className="relative z-30 flex flex-col items-center text-center max-w-5xl px-6 mt-[-60px] md:mt-[-100px]">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full backdrop-blur-md"
        style={{ border: '1px solid var(--color-accent-glow)', background: 'var(--color-accent-subtle)', boxShadow: '0 0 20px var(--color-accent-glow)' }}
      >
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--color-accent-primary)', boxShadow: '0 0 10px var(--color-accent-primary)' }} />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/90 font-bold" style={{ fontFamily: fonts.mono }}>
          Architecting the Autonomous Future
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
        className="font-bold leading-[1.05] tracking-tight mb-8 text-white drop-shadow-2xl"
        style={{
            fontFamily: fonts.heading,
            fontSize: 'clamp(3rem, 0.273rem + 8.18vw, 7.5rem)',
            textShadow: '0 0 80px var(--color-accent-glow)'
        }}
      >
        Your Dedicated AI Team.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
            10x the Output.
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed font-light"
        style={{ fontFamily: fonts.heading }}
      >
        We build custom AI agent teams that deliver{' '}
        <motion.span
          className="font-bold text-white glow-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          style={{ color: 'var(--color-accent-primary)', animationDuration: '12s' }}
        >months of work in days</motion.span>
        . Interactive tools, automation pipelines, market intelligence — engineered specifically for your business.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="flex flex-col md:flex-row gap-5 items-center"
      >
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 40px var(--color-accent-glow-strong)"
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-9 py-4 bg-white text-black overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)] btn-glow"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-accent-secondary/40 to-accent-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-3 font-bold uppercase tracking-wider text-sm" style={{ fontFamily: fonts.heading }}>
            Book a Strategy Call
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255, 255, 255, 0.2)",
            borderColor: "rgba(255,255,255,0.6)",
            backgroundColor: "rgba(255,255,255,0.05)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-3 px-9 py-4 border border-white/20 text-white transition-colors backdrop-blur-sm cursor-pointer"
        >
          <ChevronDown className="w-3 h-3" />
          <span className="font-bold uppercase tracking-wider text-sm" style={{ fontFamily: fonts.heading }}>
            See How It Works
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

// --- New Sections Components ---

const SectionHeader = ({ title, subtitle, gradient }: { title: string, subtitle: string, gradient?: boolean }) => (
  <div className="mb-16 md:mb-24 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full"
      style={{ border: '1px solid var(--color-accent-glow)', background: 'var(--color-accent-subtle)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent-primary)' }} />
      <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--color-accent-secondary)' }}>{subtitle}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className={`text-4xl md:text-5xl font-bold ${gradient ? 'text-transparent bg-clip-text' : 'text-white'}`}
      style={{
        fontFamily: fonts.heading,
        ...(gradient ? { backgroundImage: 'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))' } : {}),
      }}
    >
      {title}
    </motion.h2>
  </div>
);

const FeatureCard: React.FC<{ icon: any, title: string, desc: string, delay: number }> = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group gradient-border scanline-hover relative overflow-hidden"
  >
    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors border" style={{ background: 'var(--color-accent-subtle)', borderColor: 'var(--color-accent-glow)' }}>
      <Icon className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} />
    </div>
    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: fonts.heading }}>{title}</h3>
    <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
  </motion.div>
);

const TransformationSection = () => {
  const features = [
    { icon: Users, title: "Dedicated AI Teams", desc: "Not generic tools. Custom agent teams built for YOUR industry, YOUR data, YOUR workflows. Each team has 15-25 specialized agents working in concert." },
    { icon: Zap, title: "10x Velocity", desc: "What takes traditional agencies 6-10 weeks, we deliver in days. A full SEO audit, GEO strategy, email automation architecture, and interactive lead magnets — all in one engagement." },
    { icon: Target, title: "Hyper-Personalized at Scale", desc: "AI enables treating every customer as a segment of one. Interactive tools, personalized email flows, behavioral scoring — all data-driven, all automated." },
    { icon: Cpu, title: "Private AI Solutions", desc: "Open-source models fine-tuned on your data, deployed on your infrastructure. Grounded generation, evaluation frameworks, and full EU AI Act + GDPR compliance built in." }
  ];

  return (
    <section id="how-it-works" className="relative py-32 px-6 max-w-[1600px] mx-auto z-40 overflow-hidden dot-grid">
      <BackgroundWatermark />
      <SectionHeader title="Why x10" subtitle="The x10 Advantage" gradient />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={i * 0.2} />
        ))}
      </div>
    </section>
  );
};

// --- Comparison Section ---
const ComparisonSection = () => {
    return (
        <section className="py-24 bg-[#020202] border-t border-white/5 relative">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Traditional Way */}
                    <div className="opacity-100">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
                            <span className="text-gray-500">01</span> THE OLD WAY
                        </h3>
                        <div className="space-y-4 relative pl-6 border-l border-dashed border-gray-600">
                            {['Brief agency (2 weeks)', 'Wait for proposal (1 week)', 'Revisions back & forth (2 weeks)', 'Campaign build (3-4 weeks)', 'Launch & monitor (manual)', 'Monthly PDF report'].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded border border-white/20 text-gray-100 shadow-lg hover:bg-white/20 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <span className="text-white font-medium text-sm">{step}</span>
                                    {i < 5 && <span className="ml-auto text-xs text-accent-300 font-mono">{['2 weeks', '1 week', '2 weeks', '4 weeks', 'Ongoing'][i]}</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* X10 Way */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-accent-900/20 to-transparent blur-2xl rounded-full opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
                            <span className="text-accent-400">02</span> THE X10 WAY
                        </h3>
                        <div className="relative h-[500px] border border-accent-400/30 bg-gradient-to-b from-accent-950/10 to-black rounded-xl p-8 flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 z-10">
                                <div>
                                    <h4 className="text-lg font-bold text-white">AI Agent Orchestration</h4>
                                    <p className="text-xs text-accent-300 font-mono">DAYS, NOT MONTHS</p>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-accent-900/20 rounded border border-accent-400/30">
                                   <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse"/>
                                   <span className="text-[10px] text-accent-200 font-mono">LIVE</span>
                                </div>
                            </div>

                            {/* Loop Visual */}
                            <div className="relative flex-grow flex items-center justify-center z-10 my-4">
                                {/* Static Rings */}
                                <div className="absolute w-64 h-64 rounded-full border border-white/5" />
                                <div className="absolute w-48 h-48 rounded-full border border-white/5" />

                                {/* Animated Orbit */}
                                <motion.div
                                    className="absolute w-64 h-64 rounded-full border-r-2"
                                    style={{ borderColor: 'var(--color-accent-primary)', boxShadow: '0 0 20px var(--color-accent-glow)' }}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute w-48 h-48 rounded-full border-l-2"
                                    style={{ borderColor: 'var(--color-accent-muted)' }}
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Central Core */}
                                <div className="absolute z-20 bg-black p-4 rounded-full flex items-center justify-center" style={{ border: '1px solid var(--color-accent-primary)', boxShadow: '0 0 30px var(--color-accent-glow)' }}>
                                    <Bot className="w-10 h-10 text-white" />
                                </div>

                                {/* Nodes (Positioned absolutely on the ring) */}
                                <div className="absolute w-64 h-64 pointer-events-none">
                                    <motion.div
                                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Eye className="w-4 h-4 text-blue-400" />
                                        <span className="text-[10px] font-bold tracking-wider">MONITOR</span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute right-[10%] bottom-[10%] translate-x-1/4 translate-y-1/4 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Cpu className="w-4 h-4 text-purple-400" />
                                        <span className="text-[10px] font-bold tracking-wider">DECIDE</span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute left-[10%] bottom-[10%] -translate-x-1/4 translate-y-1/4 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="text-[10px] font-bold tracking-wider">ACT</span>
                                    </motion.div>
                                </div>

                                {/* Arrows (Using SVG for curve) */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                    {/* Simple curved arrows could be added here if needed, but the spinning rings imply direction enough */}
                                </svg>
                            </div>

                            {/* Metrics */}
                            <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t border-white/10 z-10">
                                <div>
                                    <div className="text-gray-500 text-[10px] uppercase">Delivery</div>
                                    <div className="text-xl font-bold text-white font-mono">Days</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-500 text-[10px] uppercase">Cost</div>
                                    <div className="text-xl font-bold text-white font-mono">80% less</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-[10px] uppercase">Stack</div>
                                    <div className="text-xl font-bold text-white font-mono">Full</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Network Graph Components ---

const AgentNode = ({ x, y, icon: Icon, label, isCenter }: any) => (
    <div
        className={`absolute w-16 h-16 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex flex-col items-center justify-center z-20 -translate-x-1/2 -translate-y-1/2
            ${isCenter ? 'bg-[#1a1a1a] border-2 border-accent-400' : 'bg-black border border-white/20'}`}
        style={{ top: y, left: x }}
    >
        {isCenter && (
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-accent-400 blur-xl z-[-1]"
            />
        )}
        <Icon className={`w-6 h-6 ${isCenter ? 'text-accent-400' : 'text-gray-300'}`} />

        <div className="absolute -bottom-8 whitespace-nowrap pointer-events-none">
            <span className={`text-[10px] md:text-[10px] font-mono uppercase tracking-wider ${isCenter ? 'text-white font-bold' : 'text-gray-500'}`}>
                {label}
            </span>
        </div>
    </div>
);

const SwarmGraph = () => {
    // Layout configuration
    const centerX = 50;
    const centerY = 50;
    const radius = 38; // % distance from center

    // Satellite Agents Definition
    const satelliteAgents = [
       { icon: Target, label: 'Director' },
       { icon: Search, label: 'SEO' },
       { icon: Eye, label: 'GEO Expert' },
       { icon: FileText, label: 'Content' },
       { icon: Zap, label: 'Email' },
       { icon: BarChart3, label: 'Growth' },
       { icon: Calculator, label: 'Analytics' },
       { icon: Shield, label: 'Intel' },
       { icon: Edit2, label: 'Copywriter' }
    ];

    const totalSatellites = satelliteAgents.length;

    // Helper to calculate position
    const getPos = (index: number) => {
        const angleDeg = (360 / totalSatellites) * index - 90; // Start from top
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);
        return { x: `${x}%`, y: `${y}%`, rawX: x, rawY: y };
    };

    const nodes = [
        { id: 'center', x: '50%', y: '50%', icon: Settings, label: 'X10', isCenter: true },
        ...satelliteAgents.map((agent, i) => ({
             id: `agent-${i}`,
             ...getPos(i),
             icon: agent.icon,
             label: agent.label
        }))
    ];

    return (
        <div className="relative w-full h-[400px] md:h-[600px] bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
            {/* Grid Bg */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Connections SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {nodes.slice(1).map((node: any, i) => (
                    <React.Fragment key={i}>
                        <line
                            x1="50%" y1="50%"
                            x2={node.x} y2={node.y}
                            stroke="var(--color-accent-deep)"
                            strokeOpacity={0.3}
                            strokeWidth="1"
                        />
                        {/* Data Packet Out */}
                        <circle r="2" fill="var(--color-accent-primary)">
                             <animateMotion
                                dur={`${2 + i * 0.3}s`}
                                repeatCount="indefinite"
                             >
                                <mpath href={`#path-${i}`} />
                             </animateMotion>
                        </circle>
                    </React.Fragment>
                ))}
            </svg>

             {/* Animated Particles using Divs for easier coordinate mapping than SVG paths in fluid layout */}
             {nodes.slice(1).map((node: any, i) => (
                 <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1.5 h-1.5 bg-accent-400 rounded-full shadow-[0_0_5px_teal] z-10"
                    initial={{ top: '50%', left: '50%', opacity: 0 }}
                    animate={{
                        top: [node.y, '50%'],
                        left: [node.x, '50%'],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 2
                    }}
                 />
             ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <AgentNode key={i} {...node} />
            ))}
        </div>
    );
};

const AgentShowcaseSection = () => {
  return (
    <section id="solutions" className="relative py-24 bg-[#020202] overflow-hidden border-y border-white/5">
      <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <SectionHeader title="Your AI Marketing Team" subtitle="15-25 Specialists Working Together" gradient />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Orchestrated Intelligence</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Unlike generic AI tools, x10 deploys teams of specialized agents that communicate, verify, and coordinate. Your Marketing Director agent delegates to SEO, Content, Email, and Analytics specialists — just like a real team, but operating 24/7.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <Network className="text-accent-400 w-6 h-6" />
                        <div>
                            <div className="text-white font-bold text-sm">Marketing Director</div>
                            <div className="text-gray-500 text-xs">Orchestrates strategy across all channels</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <ShieldCheck className="w-6 h-6" style={{ color: 'var(--color-accent-secondary)' }} />
                        <div>
                            <div className="text-white font-bold text-sm">Quality Assurance</div>
                            <div className="text-gray-500 text-xs">Every output verified before delivery</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 relative">
                 <div className="w-full max-w-[800px] aspect-[4/3] mx-auto relative">
                    <SwarmGraph />
                 </div>
            </div>
        </div>
      </div>
    </section>
  )
}

// --- Legal Agent Showcase Section ---

const LegalSwarmGraph = () => {
    const centerX = 50;
    const centerY = 50;
    const radius = 38;

    const satelliteAgents = [
        { icon: Target, label: 'Director' },
        { icon: Search, label: 'Research' },
        { icon: BookOpen, label: 'Case Law' },
        { icon: FileText, label: 'Contract' },
        { icon: ShieldCheck, label: 'Compliance' },
        { icon: Bell, label: 'ECRIS' },
        { icon: Check, label: 'Citations' },
        { icon: Scale, label: 'Legislative' },
    ];

    const totalSatellites = satelliteAgents.length;

    const getPos = (index: number) => {
        const angleDeg = (360 / totalSatellites) * index - 90;
        const angleRad = (angleDeg * Math.PI) / 180;
        const x = centerX + radius * Math.cos(angleRad);
        const y = centerY + radius * Math.sin(angleRad);
        return { x: `${x}%`, y: `${y}%`, rawX: x, rawY: y };
    };

    const nodes = [
        { id: 'center', x: '50%', y: '50%', icon: Scale, label: 'Praetor', isCenter: true },
        ...satelliteAgents.map((agent, i) => ({
             id: `agent-${i}`,
             ...getPos(i),
             icon: agent.icon,
             label: agent.label
        }))
    ];

    return (
        <div className="relative w-full h-[400px] md:h-[600px] bg-[#0a0a0a] rounded-3xl border border-purple-500/20 overflow-hidden shadow-2xl">
            {/* Grid Bg */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* Connections SVG Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <defs>
                    <filter id="legal-glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                {nodes.slice(1).map((node: any, i) => (
                    <React.Fragment key={i}>
                        <line
                            x1="50%" y1="50%"
                            x2={node.x} y2={node.y}
                            stroke="#4c1d95"
                            strokeWidth="1"
                        />
                        <circle r="2" fill="#a855f7">
                             <animateMotion
                                dur={`${2 + i * 0.3}s`}
                                repeatCount="indefinite"
                             >
                                <mpath href={`#legal-path-${i}`} />
                             </animateMotion>
                        </circle>
                    </React.Fragment>
                ))}
            </svg>

             {/* Animated Particles */}
             {nodes.slice(1).map((node: any, i) => (
                 <motion.div
                    key={`particle-${i}`}
                    className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full shadow-[0_0_5px_purple] z-10"
                    initial={{ top: '50%', left: '50%', opacity: 0 }}
                    animate={{
                        top: [node.y, '50%'],
                        left: [node.x, '50%'],
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2 + Math.random(),
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 2
                    }}
                 />
             ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <AgentNode key={i} {...node} />
            ))}
        </div>
    );
};

const LegalAgentShowcaseSection = () => {
  return (
    <section id="legal-ai" className="relative py-24 bg-[#020202] overflow-hidden border-y border-white/5">
      <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <div className="mb-16 md:mb-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-900/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span className="text-[10px] uppercase tracking-widest text-purple-200 font-mono">8 Specialized Legal Agents</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white"
            style={{ fontFamily: fonts.heading }}
          >
            Your AI Legal Team
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Legal Intelligence at Scale</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Praetor deploys 8 specialized legal agents that research, analyze, and cross-reference across 35 million court decisions. Your lead attorney sets the direction — the AI team handles the heavy lifting, with every finding verified and cited.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                        <Scale className="text-purple-400 w-6 h-6" />
                        <div>
                            <div className="text-white font-bold text-sm">Lead Attorney</div>
                            <div className="text-gray-500 text-xs">Sets strategy and reviews all AI findings</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-purple-500/20">
                        <ShieldCheck className="text-purple-400 w-6 h-6" />
                        <div>
                            <div className="text-white font-bold text-sm">Compliance Gate</div>
                            <div className="text-gray-500 text-xs">Every output verified against current regulations</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 relative">
                 <div className="w-full max-w-[800px] aspect-[4/3] mx-auto relative">
                    <LegalSwarmGraph />
                 </div>
            </div>
        </div>
      </div>
    </section>
  )
}

// --- Legal Comparison Section ---
const LegalComparisonSection = () => {
    return (
        <section className="py-24 bg-[#020202] border-t border-white/5 relative">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Traditional Legal */}
                    <div className="opacity-100">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
                            <span className="text-gray-500">01</span> TRADITIONAL LEGAL
                        </h3>
                        <div className="space-y-4 relative pl-6 border-l border-dashed border-gray-600">
                            {[
                                { step: 'Research case law manually (2-4 hrs/case)', time: '4 hours' },
                                { step: 'Draft contract from templates (1-2 days)', time: '2 days' },
                                { step: 'Compliance audit (3-5 days)', time: '5 days' },
                                { step: 'Monitor company registry (weekly)', time: 'Weekly' },
                                { step: 'Cross-reference citations (1-2 hrs)', time: '2 hours' },
                                { step: 'Generate compliance report (2-3 days)', time: '3 days' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded border border-white/20 text-gray-100 shadow-lg hover:bg-white/20 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <span className="text-white font-medium text-sm">{item.step}</span>
                                    <span className="ml-auto text-xs text-gray-400 font-mono">{item.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Praetor Way */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-900/20 to-transparent blur-2xl rounded-full opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
                            <span className="text-purple-400">02</span> THE PRAETOR WAY
                        </h3>
                        <div className="relative h-[500px] border border-purple-400/30 bg-gradient-to-b from-purple-950/10 to-black rounded-xl p-8 flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 z-10">
                                <div>
                                    <h4 className="text-lg font-bold text-white">AI Legal Orchestration</h4>
                                    <p className="text-xs text-purple-300 font-mono">MINUTES, NOT DAYS</p>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-purple-900/20 rounded border border-purple-400/30">
                                   <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"/>
                                   <span className="text-[10px] text-purple-200 font-mono">LIVE</span>
                                </div>
                            </div>

                            {/* Loop Visual */}
                            <div className="relative flex-grow flex items-center justify-center z-10 my-4">
                                {/* Static Rings */}
                                <div className="absolute w-64 h-64 rounded-full border border-white/5" />
                                <div className="absolute w-48 h-48 rounded-full border border-white/5" />

                                {/* Animated Orbit */}
                                <motion.div
                                    className="absolute w-64 h-64 rounded-full border-r-2 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute w-48 h-48 rounded-full border-l-2 border-purple-300/50"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Central Core */}
                                <div className="absolute z-20 bg-black p-4 rounded-full border border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center justify-center">
                                    <Scale className="w-10 h-10 text-white" />
                                </div>

                                {/* Nodes */}
                                <div className="absolute w-64 h-64 pointer-events-none">
                                    <motion.div
                                        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Eye className="w-4 h-4 text-blue-400" />
                                        <span className="text-[10px] font-bold tracking-wider">MONITOR</span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute right-[10%] bottom-[10%] translate-x-1/4 translate-y-1/4 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Cpu className="w-4 h-4 text-purple-400" />
                                        <span className="text-[10px] font-bold tracking-wider">ANALYZE</span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute left-[10%] bottom-[10%] -translate-x-1/4 translate-y-1/4 bg-[#111] border border-white/20 p-2 rounded-lg flex flex-col items-center gap-1 shadow-xl w-24 pointer-events-auto"
                                    >
                                        <Zap className="w-4 h-4 text-yellow-400" />
                                        <span className="text-[10px] font-bold tracking-wider">ACT</span>
                                    </motion.div>
                                </div>

                                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                                </svg>
                            </div>

                            {/* Metrics */}
                            <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t border-white/10 z-10">
                                <div>
                                    <div className="text-gray-500 text-[10px] uppercase">Research</div>
                                    <div className="text-xl font-bold text-white font-mono">Seconds</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-500 text-[10px] uppercase">Accuracy</div>
                                    <div className="text-xl font-bold text-white font-mono">92.7%</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-[10px] uppercase">Decisions</div>
                                    <div className="text-xl font-bold text-white font-mono">35M+</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Legal Case Study Section ---
const LegalCaseStudySection = () => {
    const [activeMessage, setActiveMessage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const messages = [
        { agent: "Director", role: "Intake", text: "New case: Commercial dispute — contract breach claim. Initiating full legal analysis.", color: "text-purple-400" },
        { agent: "Research", role: "Search", text: "Querying 35M court decisions... 2,847 relevant precedents found for commercial contract disputes.", color: "text-blue-400" },
        { agent: "Research", role: "Filter", text: "Narrowing to jurisdiction + timeframe: 127 directly applicable decisions identified.", color: "text-blue-400" },
        { agent: "Case Law", role: "Analyze", text: "Precedent analysis complete. Strong favorable pattern: 78% of similar cases ruled for claimant.", color: "text-green-400" },
        { agent: "Case Law", role: "Finding", text: "Key precedent: Decision 1247/2024 — identical clause interpretation, Supreme Court ruling.", color: "text-green-400" },
        { agent: "Contract", role: "Review", text: "Analyzing contract clauses against 7 standard templates... 3 non-standard clauses flagged.", color: "text-orange-400" },
        { agent: "Contract", role: "Finding", text: "Force majeure clause missing standard exclusions — potential liability exposure identified.", color: "text-orange-400" },
        { agent: "Compliance", role: "Check", text: "Running AML + GDPR + Labor Law + Corporate Governance checks...", color: "text-yellow-400" },
        { agent: "Compliance", role: "Finding", text: "GDPR data processing agreement incomplete — missing Article 28 required provisions.", color: "text-yellow-400" },
        { agent: "ECRIS", role: "Monitor", text: "Company registry check: No recent changes. Last filing: Annual report 2025-12-15.", color: "text-cyan-400" },
        { agent: "ECRIS", role: "Alert", text: "Counterparty alert: Board member change filed 2026-01-20 — potential strategic shift.", color: "text-cyan-400" },
        { agent: "Citations", role: "Verify", text: "Cross-referencing all 14 cited decisions... 14/14 verified current and applicable.", color: "text-pink-400" },
        { agent: "Citations", role: "Status", text: "Citation accuracy: 100%. No overturned or superseded decisions in chain.", color: "text-pink-400" },
        { agent: "Legislative", role: "Check", text: "Checking for pending legislation affecting contract interpretation...", color: "text-indigo-400" },
        { agent: "Legislative", role: "Finding", text: "New Commercial Code amendment (pending Q2 2026) — may strengthen claimant position.", color: "text-indigo-400" },
        { agent: "Director", role: "Report", text: "Legal analysis complete. 127 precedents analyzed, 3 contract risks identified, full compliance audit done.", color: "text-purple-400" },
        { agent: "Director", role: "Summary", text: "Recommendation: Strong case. Proceed with claim. Address GDPR gap before filing.", color: "text-purple-400" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMessage(prev => (prev + 1) % (messages.length + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeMessage]);

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left Content */}
                <div>
                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-purple-400/20 bg-purple-900/10">
                        <Scale className="w-4 h-4 text-purple-400" />
                        <span className="text-xs uppercase tracking-widest text-purple-200 font-mono">Live Agent Workflow</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: fonts.heading }}>
                        Watch Your AI Legal Team <br /> <span className="text-purple-400">In Action</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Watch Praetor execute a comprehensive legal due diligence review. From case law research through contract analysis to compliance verification — 8 agents working in concert to deliver in minutes what takes days manually.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">35M+</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Court Decisions Searched</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">8</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Legal Agents Deployed</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">4</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Compliance Domains Checked</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">92.7%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Citation Accuracy</div>
                        </div>
                    </div>
                </div>

                {/* Right Content: Agent Simulation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-purple-400/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative bg-[#0a0a0a] border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl">
                        {/* Window Header */}
                        <div className="bg-[#111] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-400/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                <Scale className="w-3 h-3" /> praetor_legal_review.log
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div ref={scrollRef} className="p-6 h-[400px] font-mono text-sm overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                             <AnimatePresence mode='popLayout'>
                                {messages.slice(0, activeMessage).map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        layout
                                        className="mb-4 border-l-2 border-purple-500/20 pl-4"
                                    >
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`font-bold ${msg.color}`}>{msg.agent}</span>
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">{msg.role}</span>
                                            <span className="text-[10px] text-gray-600 ml-auto">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-gray-300">{msg.text}</p>
                                    </motion.div>
                                ))}
                             </AnimatePresence>

                             {activeMessage < messages.length && (
                                 <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-gray-500 mt-4"
                                 >
                                     <span className="w-2 h-4 bg-purple-400 animate-pulse" />
                                     <span>Processing...</span>
                                 </motion.div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Human In Loop Section ---
const HumanInLoopSection = () => {
    const [status, setStatus] = useState<'idle' | 'processing' | 'approved' | 'rejected' | 'editing'>('idle');
    const [content, setContent] = useState("Subject: Partnership Opportunity\n\nHi Dave,\nI noticed Acme Corp is expanding...");
    const [tempContent, setTempContent] = useState("");

    const handleApprove = () => {
        setStatus('processing');
        setTimeout(() => {
            setStatus('approved');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1500);
    };

    const handleReject = () => {
        setStatus('rejected');
        setTimeout(() => setStatus('idle'), 2000);
    };

    const handleEdit = () => {
        setTempContent(content);
        setStatus('editing');
    };

    const handleSaveEdit = () => {
        setContent(tempContent);
        setStatus('idle');
    };

    return (
        <section className="py-32 bg-[#050505] relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center gap-16 relative z-10">
                <div className="flex-1">
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border" style={{ borderColor: 'var(--color-accent-glow)', background: 'var(--color-accent-subtle)' }}>
                        <Users className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} />
                        <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--color-accent-secondary)' }}>Control</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: fonts.heading }}>
                        AI Executes. <br /> <span style={{ color: 'var(--color-accent-primary)' }}>You Direct.</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Your team reviews and approves every strategic decision. AI proposes, researches, and drafts — but critical actions wait for your single-click approval. Full transparency, full control.
                    </p>
                    <ul className="space-y-4">
                        {['Human-in-the-loop approval Gates', 'Real-time Activity Stream', 'Instant "Kill-Switch" Override'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300">
                                <CheckSquare className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} /> {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex-1 w-full max-w-xl">
                    {/* Mock Interface */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        className="bg-[#111] border border-white/10 rounded-xl overflow-hidden shadow-2xl relative"
                    >
                        <div className="bg-[#1a1a1a] px-4 py-3 border-b border-white/10 flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${status === 'processing' ? 'bg-yellow-400 animate-pulse' : ''}`} style={status !== 'processing' ? { background: 'var(--color-accent-primary)' } : {}} />
                                Action Required
                            </span>
                            <span className="text-[10px] text-gray-500">Just now</span>
                        </div>

                        <div className="p-6 relative min-h-[280px]">
                           <AnimatePresence mode='wait'>
                            {status === 'idle' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--color-accent-subtle)' }}>
                                            <Bot className="w-5 h-5" style={{ color: 'var(--color-accent-primary)' }} />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-gray-300 text-sm mb-2"><span className="font-bold text-white">Sales Agent</span> proposes:</p>
                                            <div className="bg-black/50 border border-white/10 p-4 rounded text-sm text-gray-400 font-mono whitespace-pre-wrap">
                                                {content}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleApprove} className="flex-1 text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2" style={{ background: 'var(--color-accent-cta)' }}>
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={handleEdit} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <Edit2 className="w-4 h-4" /> Edit
                                        </button>
                                        <button onClick={handleReject} className="flex-1 border border-red-500/30 text-red-400 hover:bg-red-900/20 py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <X className="w-4 h-4" /> Reject
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'editing' && (
                                <motion.div
                                    key="editing"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="h-full flex flex-col"
                                >
                                    <p className="text-white font-bold mb-2 flex items-center gap-2"><Edit2 className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }}/> Edit Proposal</p>
                                    <textarea
                                        value={tempContent}
                                        onChange={(e) => setTempContent(e.target.value)}
                                        className="w-full flex-grow h-32 bg-black/50 border border-white/20 rounded p-3 text-sm text-gray-300 font-mono focus:outline-none mb-4 resize-none" style={{ '--tw-ring-color': 'var(--color-accent-primary)' } as React.CSSProperties}
                                    />
                                    <div className="flex gap-3 mt-auto">
                                        <button onClick={handleSaveEdit} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
                                            <Save className="w-4 h-4" /> Save Changes
                                        </button>
                                        <button onClick={() => setStatus('idle')} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded text-sm font-bold transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {status === 'processing' && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-[#111]/90 backdrop-blur-sm z-20"
                                >
                                    <div className="w-12 h-12 border-4 rounded-full animate-spin mb-4" style={{ borderColor: 'var(--color-accent-glow)', borderTopColor: 'var(--color-accent-primary)' }} />
                                    <p className="font-mono text-sm animate-pulse" style={{ color: 'var(--color-accent-primary)' }}>EXECUTION IN PROGRESS...</p>
                                </motion.div>
                            )}

                            {status === 'approved' && (
                                <motion.div
                                    key="approved"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-green-900/20 backdrop-blur-md z-20"
                                >
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                                        <Check className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Action Executed</h3>
                                    <p className="text-green-400 text-sm">Email sent successfully.</p>
                                </motion.div>
                            )}

                             {status === 'rejected' && (
                                <motion.div
                                    key="rejected"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 backdrop-blur-md z-20"
                                >
                                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                        <X className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-white font-bold text-xl mb-1">Action Rejected</h3>
                                    <p className="text-red-400 text-sm">Agent will refine strategy.</p>
                                </motion.div>
                            )}
                           </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

const EcommerceCaseStudySection = () => {
    const [activeMessage, setActiveMessage] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const messages = [
        { agent: "SEO", role: "Audit", text: "Crawling site structure... 50,000+ duplicate pages detected in Google index", color: "text-blue-400" },
        { agent: "SEO", role: "Finding", text: "Zero canonical tags — critical crawl budget waste identified", color: "text-blue-400" },
        { agent: "SEO", role: "Finding", text: "Missing meta descriptions sitewide — SERP CTR opportunity: +15-20%", color: "text-blue-400" },
        { agent: "GEO", role: "Audit", text: "Testing AI search visibility... Current GEO readiness: 3.5/10", color: "text-purple-400" },
        { agent: "GEO", role: "Finding", text: "No competitor has AI search strategy — first-mover window open", color: "text-purple-400" },
        { agent: "GEO", role: "Deploy", text: "Deploying llms.txt, HowTo schema, entity optimization", color: "text-purple-400" },
        { agent: "Intel", role: "Analyze", text: "Analyzing 6 competitors across 12 dimensions...", color: "text-orange-400" },
        { agent: "Intel", role: "Finding", text: "Largest product catalog in niche — moat identified, not leveraged", color: "text-orange-400" },
        { agent: "Email", role: "Audit", text: "Zero email infrastructure detected — largest revenue leak", color: "text-yellow-400" },
        { agent: "Email", role: "Finding", text: "Estimated 2,000+ abandoned carts/month unrecovered", color: "text-yellow-400" },
        { agent: "Director", role: "Strategy", text: "Designing 6 email automation flows: cart recovery, welcome, post-purchase...", color: "text-accent-400" },
        { agent: "Director", role: "Plan", text: "Building 90-day roadmap: Fix & Launch → Optimize & Scale → Authority", color: "text-accent-400" },
        { agent: "Builder", role: "Deploy", text: "Deploying interactive compatibility checker...", color: "text-pink-400" },
        { agent: "Builder", role: "Deploy", text: "Deploying towing capacity calculator with legal compliance data...", color: "text-pink-400" },
        { agent: "Builder", role: "Deploy", text: "Configuring email engine: custom Listmonk + Amazon SES EU", color: "text-pink-400" },
        { agent: "Builder", role: "Deploy", text: "Launching abandoned cart automation — est. 3-5% recovery rate", color: "text-pink-400" },
        { agent: "Results", role: "Report", text: "Technical SEO fixes deployed — 30-min configs the agency missed for months", color: "text-green-400" },
        { agent: "Results", role: "Report", text: "3 interactive lead magnets live — 8.3% conversion vs 3.8% industry avg", color: "text-green-400" },
        { agent: "Results", role: "Report", text: "Email automation generating revenue from Week 3", color: "text-green-400" },
        { agent: "Results", role: "Report", text: "GEO readiness: 3.5/10 → 7.5/10 target in 90 days", color: "text-green-400" },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMessage(prev => (prev + 1) % (messages.length + 1));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [activeMessage]);

    return (
        <section id="case-study" className="py-32 bg-[#050505] relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1600px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* Left Content */}
                <div>
                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-accent-400/20 bg-accent-900/10">
                        <Target className="w-4 h-4 text-accent-400" />
                        <span className="text-xs uppercase tracking-widest text-accent-100 font-mono">Live Agent Workflow</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: fonts.heading }}>
                        Watch Your AI Marketing Team <br /> <span className="text-accent-400">In Action</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Watch our AI team execute a complete digital transformation. From technical SEO audit through GEO strategy to email automation — every agent has a role, every step creates measurable value.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">5</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Audit Dimensions</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">23</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Critical Findings</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">3</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Revenue Channels Launched</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">90</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Day Roadmap Delivered</div>
                        </div>
                    </div>

                    <button onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center gap-3 text-white font-bold border-b border-accent-400 pb-1 hover:text-accent-300 transition-colors">
                        See More Results <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Content: Agent Simulation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-accent-400/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Window Header */}
                        <div className="bg-[#111] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent-400/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-xs font-mono text-gray-500 flex items-center gap-2">
                                <Network className="w-3 h-3" /> swarm_main_thread.log
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div ref={scrollRef} className="p-6 h-[400px] font-mono text-sm overflow-y-auto relative scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                             <AnimatePresence mode='popLayout'>
                                {messages.slice(0, activeMessage).map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        layout
                                        className="mb-4 border-l-2 border-white/10 pl-4"
                                    >
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`font-bold ${msg.color}`}>{msg.agent}</span>
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase">{msg.role}</span>
                                            <span className="text-[10px] text-gray-600 ml-auto">{new Date().toLocaleTimeString()}</span>
                                        </div>
                                        <p className="text-gray-300">{msg.text}</p>
                                    </motion.div>
                                ))}
                             </AnimatePresence>

                             {activeMessage < messages.length && (
                                 <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 text-gray-500 mt-4"
                                 >
                                     <span className="w-2 h-4 bg-accent-400 animate-pulse" />
                                     <span>Processing...</span>
                                 </motion.div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MetricsBar = () => {
    const metrics = [
        { value: "90", label: "Day Pilot Program" },
        { value: "25", label: "AI Specialists Per Team" },
        { value: "10x", label: "Content Output vs Agencies" },
        { value: "All", label: "Channels Orchestrated" },
        { value: "#1", label: "AI Search Rankings Achieved" },
    ];

    return (
        <section className="py-16 bg-[#020202] border-y border-white/5">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-3xl md:text-4xl font-bold mb-2 glow-pulse tabular-nums" style={{ fontFamily: '"Space Grotesk", sans-serif', color: 'var(--color-accent-primary)' }}>
                                {m.value}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-widest font-mono">{m.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const IndustriesSection = () => {
    const industries = [
        { name: "Healthcare", apps: 21, examples: ["Patient intake automation", "Appointment scheduling", "Health calculators"] },
        { name: "Legal", apps: 18, examples: ["Document analysis", "Case research", "Client intake forms"] },
        { name: "Real Estate", apps: 19, examples: ["Property valuation tools", "Lead qualification", "Market reports"] },
        { name: "Trades", apps: 16, examples: ["Quote generators", "Job scheduling", "Inventory management"] },
        { name: "Professional Services", apps: 17, examples: ["Proposal generators", "Time tracking", "Client portals"] },
        { name: "Retail & E-commerce", apps: 21, examples: ["Product recommenders", "Cart recovery", "Pricing intelligence"] },
    ];

    return (
        <section id="industries" className="py-32 bg-[#050505] relative overflow-hidden dot-grid">
            <BackgroundWatermark />
            <div className="max-w-[1600px] mx-auto px-6 relative z-10">
                <SectionHeader title="Industries We Serve" subtitle="6 Verticals & Growing" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industries.map((ind, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="p-6 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-lg group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{ind.name}</h3>
                                <span className="text-accent-400 font-mono text-sm font-bold">{ind.apps} apps</span>
                            </div>
                            <ul className="space-y-2">
                                {ind.examples.map((ex, j) => (
                                    <li key={j} className="text-gray-400 text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 rounded-full bg-accent-400/50" />
                                        {ex}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const UseCaseCard: React.FC<{ title: string, metric: string, label: string, desc?: string }> = ({ title, metric, label, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative h-[400px] bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 p-8 flex flex-col justify-between overflow-hidden group gradient-border scanline-hover"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Cpu className="w-24 h-24 text-white" />
    </div>

    <div>
        <div className="text-accent-400 mb-4">
            <Shield className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-accent-300 uppercase tracking-widest mb-4">{label}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>

    <div className="mt-auto">
        <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: fonts.mono }}>{metric}</div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full shimmer-bar"
            />
        </div>
        <p className="text-xs text-gray-400 mt-3">Efficiency Increase Verified</p>
    </div>
  </motion.div>
);

const ImplementationsSection = () => {
  const useCases = [
    { title: "Lead Magnets", metric: "30", label: "Ready Specs", desc: "Interactive calculators, quizzes, and configurators that capture leads at 2x industry average conversion rates." },
    { title: "Automation Pipelines", metric: "22", label: "Ready Specs", desc: "Email sequences, CRM workflows, and behavioral triggers that recover revenue on autopilot." },
    { title: "Programmatic Content", metric: "27", label: "Ready Specs", desc: "SEO-optimized landing pages, product descriptions, and blog content generated at scale." },
    { title: "AI Chatbots", metric: "17", label: "Ready Specs", desc: "Intelligent customer service and sales bots trained on your specific business knowledge." },
    { title: "Data Scrapers", metric: "18", label: "Ready Specs", desc: "Competitive intelligence, pricing monitors, and market data collection running 24/7." },
    { title: "Audit Tools", metric: "12", label: "Ready Specs", desc: "Comprehensive SEO, GEO readiness, and digital presence scoring with actionable recommendations." }
  ];

  return (
    <section id="use-cases" className="py-32 bg-[#080808] relative overflow-hidden dot-grid">
      <BackgroundWatermark />
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16">
             <div className="max-w-2xl">
                <span className="text-accent-400 font-mono text-xs tracking-widest mb-4 block">READY TO DEPLOY</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: fonts.heading }}>
                    Ready-to-Deploy Solutions
                </h2>
             </div>
             <a href="/catalog" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors mt-6 md:mt-0">
                View Full Catalog <ArrowRight className="w-4 h-4" />
             </a>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {useCases.map((uc, i) => (
                <UseCaseCard key={i} {...uc} />
             ))}
         </div>
      </div>
    </section>
  );
};

// --- ROI Calculator ---
const useCountUp = (target: number, duration = 600) => {
    const [display, setDisplay] = useState(target);
    const prevRef = useRef(target);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const from = prevRef.current;
        const to = target;
        prevRef.current = target;
        if (from === to) return;

        const startTime = performance.now();
        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (to - from) * eased));
            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [target, duration]);

    return display;
};

const eurFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

const ROICalculatorSection = () => {
    const [teamSize, setTeamSize] = useState(5);
    const [hourlyCost, setHourlyCost] = useState(50);
    const [hoursAutomated, setHoursAutomated] = useState(10);

    const annualSavings = teamSize * hourlyCost * hoursAutomated * 52;
    const animatedSavings = useCountUp(annualSavings);

    const comparisons = [
        { service: "SEO Audit + Fix", traditional: "2-3 weeks, €3-5K", x10: "2 days, included" },
        { service: "Email Automation (6 flows)", traditional: "4-6 weeks, €5-8K", x10: "1 week, included" },
        { service: "3 Interactive Lead Magnets", traditional: "6-8 weeks, €10-15K", x10: "3-5 days, included" },
        { service: "Content (80 articles)", traditional: "3 months, €8-12K", x10: "1 month, included" },
        { service: "GEO / AI Search Strategy", traditional: "Not offered", x10: "Included" },
    ];

    return (
        <section className="py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <SectionHeader title="The x10 Multiplier" subtitle="Results Comparison" gradient />
                <p className="text-gray-400 text-lg text-center -mt-12 mb-16 max-w-2xl mx-auto">
                    Same deliverables. 10x the velocity. A fraction of the cost.
                </p>

                {/* Interactive ROI Calculator */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {/* Left: Sliders */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.mono }}>Team Size</label>
                                <span className="text-white font-bold text-lg" style={{ fontFamily: fonts.heading }}>{teamSize} employees</span>
                            </div>
                            <input
                                type="range"
                                min={1} max={20} step={1}
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="roi-slider"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1" style={{ fontFamily: fonts.mono }}>
                                <span>1</span><span>20</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.mono }}>Avg. Hourly Cost</label>
                                <span className="text-white font-bold text-lg" style={{ fontFamily: fonts.heading }}>{'\u20AC'}{hourlyCost}/hr</span>
                            </div>
                            <input
                                type="range"
                                min={10} max={100} step={5}
                                value={hourlyCost}
                                onChange={(e) => setHourlyCost(Number(e.target.value))}
                                className="roi-slider"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1" style={{ fontFamily: fonts.mono }}>
                                <span>{'\u20AC'}10</span><span>{'\u20AC'}100</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-baseline mb-3">
                                <label className="text-sm text-gray-400 uppercase tracking-widest" style={{ fontFamily: fonts.mono }}>Hours Automated / Week / Person</label>
                                <span className="text-white font-bold text-lg" style={{ fontFamily: fonts.heading }}>{hoursAutomated} hrs</span>
                            </div>
                            <input
                                type="range"
                                min={1} max={60} step={1}
                                value={hoursAutomated}
                                onChange={(e) => setHoursAutomated(Number(e.target.value))}
                                className="roi-slider"
                            />
                            <div className="flex justify-between text-xs text-gray-600 mt-1" style={{ fontFamily: fonts.mono }}>
                                <span>1 hr</span><span>60 hrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Animated Savings Display */}
                    <div className="flex flex-col items-center justify-center p-8 border border-accent-400/30 rounded-xl bg-accent-950/20 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 via-transparent to-accent-400/5" />
                        <div className="relative z-10 text-center">
                            <motion.div
                                key={annualSavings}
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                                className="text-5xl md:text-6xl font-bold glow-pulse mb-4"
                                style={{ fontFamily: fonts.heading, color: 'var(--color-accent-primary)' }}
                            >
                                {eurFormat.format(animatedSavings)}
                            </motion.div>
                            <div className="text-accent-400 text-sm uppercase tracking-widest mb-2" style={{ fontFamily: fonts.mono }}>
                                Estimated Annual Savings
                            </div>
                            <div className="text-gray-500 text-sm">
                                Capital returned to strategy
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-hidden border border-white/10 rounded-xl">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-white/5 border-b border-white/10">
                        <div className="p-4 text-sm font-bold text-gray-400 uppercase tracking-widest" style={{ fontFamily: '"JetBrains Mono", monospace' }}>Deliverable</div>
                        <div className="p-4 text-sm font-bold text-gray-500 uppercase tracking-widest text-center" style={{ fontFamily: '"JetBrains Mono", monospace' }}>Traditional Agency</div>
                        <div className="p-4 text-sm font-bold uppercase tracking-widest text-center" style={{ fontFamily: '"JetBrains Mono", monospace', color: 'var(--color-accent-primary)' }}>x10 Automation</div>
                    </div>

                    {/* Rows */}
                    {comparisons.map((row, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`grid grid-cols-3 border-b border-white/5 hover:bg-white/5 transition-colors ${i === comparisons.length - 1 ? 'border-b-0' : ''}`}
                        >
                            <div className="p-4 text-white font-medium text-sm">{row.service}</div>
                            <div className="p-4 text-gray-500 text-sm text-center">{row.traditional}</div>
                            <div className="p-4 text-accent-300 text-sm text-center font-medium">{row.x10}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="p-6 border border-white/10 rounded-lg bg-white/5 text-center">
                        <div className="text-gray-500 text-xs uppercase tracking-widest mb-2 font-mono">Traditional Total</div>
                        <div className="text-2xl font-bold text-gray-400" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>6+ months · €26-40K</div>
                    </div>
                    <div className="p-6 border border-accent-400/30 rounded-lg bg-accent-950/20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-400/5 to-transparent" />
                        <div className="relative z-10">
                            <div className="text-accent-400 text-xs uppercase tracking-widest mb-2 font-mono">x10 Total</div>
                            <div className="text-2xl font-bold text-white" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>90 days · €3-6.5K/mo</div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-8 max-w-xl mx-auto">
                    x10 amplifies human expertise. Your strategist + our AI team = 10x the output.
                </p>
            </div>
        </section>
    );
}

// --- Private AI Section ---
const PrivateAISection = () => {
    const features = [
        { icon: Server, title: "Open-Source Models, Fine-Tuned", desc: "We deploy open-source LLMs fine-tuned on YOUR data. No vendor lock-in, no data leaving your premises. Full model ownership." },
        { icon: Lock, title: "Grounded Generation", desc: "Every AI response grounded in your actual data. Retrieval-augmented generation with evaluation frameworks that measure accuracy, not just fluency." },
        { icon: Shield, title: "EU AI Act & GDPR Native", desc: "Built for European compliance from day one. Consent-first architecture, on-premise deployment options, full audit trails. Not retrofitted — designed compliant." },
        { icon: Users, title: "Human Oversight Built In", desc: "AI proposes, your team approves. Configurable guardrails, automatic quality gates, escalation to human reviewers for high-stakes decisions." },
    ];

    return (
        <section className="py-24 bg-black border-y border-white/10">
            <div className="max-w-[1600px] mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-accent-400/20 bg-accent-900/10">
                    <Server className="w-4 h-4 text-accent-400" />
                    <span className="text-xs uppercase tracking-widest text-accent-100 font-mono">Enterprise AI</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Private AI Solutions</h2>
                <p className="text-gray-400 mb-16 max-w-2xl mx-auto">Your models. Your data. Your infrastructure.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 border border-white/10 rounded-lg bg-[#050505] hover:border-accent-400/30 transition-colors text-left"
                        >
                            <f.icon className="w-8 h-8 text-accent-400 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Implementation Example ---
const ImplementationExample = () => {
    const steps = [
        { title: "Deep Research (Days 1-2)", desc: "We run 5 parallel audits before our first meeting. SEO, GEO readiness, email infrastructure, competitive landscape, content gaps. You receive a scored report with specific revenue calculations — not vague recommendations." },
        { title: "Strategy & Architecture (Days 2-3)", desc: "We design your custom AI team (15-25 specialists), build your 90-day roadmap with week-by-week deliverables, and calculate ROI for every initiative. You review and approve before we build." },
        { title: "Build & Launch (Days 3-30)", desc: "Month 1: Fix critical technical debt, launch email automation, deploy interactive tools. Revenue from email by Week 3. Quick wins that fund the engagement." },
        { title: "Scale & Dominate (Days 31-90)", desc: "Months 2-3: Content authority, programmatic SEO, advanced automations, AI search optimization. Full performance review at Day 90 with before/after data." },
    ];

    return (
        <section id="results" className="py-32 max-w-[1600px] mx-auto px-6 relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                    <SectionHeader title="How We Work" subtitle="Your Engagement" />
                    <div className="space-y-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-6"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full border border-accent-400 bg-accent-400/10 flex items-center justify-center text-accent-400 font-bold text-sm">
                                        {i + 1}
                                    </div>
                                    {i !== steps.length - 1 && <div className="w-[1px] h-full bg-white/10 my-2" />}
                                </div>
                                <div className="pb-8">
                                    <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                    <p className="text-gray-400">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-400/20 to-transparent blur-3xl" />
                    <div className="relative bg-black border border-white/10 rounded-xl p-8 overflow-hidden">
                         {/* Fake Code/Terminal UI */}
                         <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-accent-400/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            <span className="ml-2 text-xs text-gray-500 font-mono">engagement_pipeline.py</span>
                         </div>
                         <div className="font-mono text-sm space-y-2 text-gray-300">
                             <p><span className="text-gray-500"># Day 1: Parallel Audit Execution</span></p>
                             <p><span className="text-blue-400">audit</span> = director.run_parallel([</p>
                             <p className="pl-4">seo_agent.<span className="text-yellow-300">full_crawl</span>(client),</p>
                             <p className="pl-4">geo_agent.<span className="text-yellow-300">ai_search_test</span>(client),</p>
                             <p className="pl-4">email_agent.<span className="text-yellow-300">infrastructure_scan</span>(client),</p>
                             <p className="pl-4">intel_agent.<span className="text-yellow-300">competitor_matrix</span>(client),</p>
                             <p className="pl-4">content_agent.<span className="text-yellow-300">gap_analysis</span>(client),</p>
                             <p>])</p>
                             <p>&nbsp;</p>
                             <p><span className="text-gray-500"># Day 2: Revenue calculation</span></p>
                             <p><span className="text-blue-400">roadmap</span> = director.<span className="text-green-400">build_90day_plan</span>(</p>
                             <p className="pl-4">audit, roi_targets=client.goals</p>
                             <p>)</p>
                             <span
                                className="w-2 h-4 inline-block ml-1 align-middle terminal-cursor"
                                style={{ background: 'var(--color-accent-primary)' }}
                             />
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ResultCard = ({ vertical, icon: Icon, result, metrics, color }: { vertical: string, icon: any, result: string, metrics: string, color: string }) => (
    <div className="bg-white/5 border border-white/10 p-8 rounded-lg relative group hover:bg-white/[0.08] transition-colors backdrop-blur-sm">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-6`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>{vertical}</h3>
        <p className="text-gray-300 mb-6 leading-relaxed text-sm">{result}</p>
        <div className="pt-4 border-t border-white/10">
            <p className="text-accent-400 text-xs font-mono uppercase tracking-wider">{metrics}</p>
        </div>
    </div>
);

const ResultsSection = () => (
    <section id="case-studies" className="py-32 bg-[#050505] px-6 border-t border-white/5 relative overflow-hidden">
        <BackgroundWatermark />
        <div className="max-w-[1600px] mx-auto relative z-10">
            <SectionHeader title="Real Results" subtitle="Case Studies" gradient />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <ResultCard
                    vertical="Auto Parts E-commerce"
                    icon={Settings}
                    result="Delivered 3 interactive lead magnets, ownership change monitoring system, and full email automation architecture for a 9,300+ SKU catalog. Estimated impact: 66+ additional orders/month from cart recovery alone."
                    metrics="48-hour delivery · 3 lead magnets · 9,300+ SKUs audited"
                    color="bg-accent-500/20"
                />
                <ResultCard
                    vertical="Pet Supplies E-commerce"
                    icon={Calculator}
                    result="3 AI-powered calculators (nutrition analysis, deworming calendar, annual cost estimator) built with Google Gemini integration. Each tool captures leads at 2.2x the industry average."
                    metrics="8.3% conversion · 3 AI calculators · Gemini-powered"
                    color="bg-accent-deep/20"
                />
                <ResultCard
                    vertical="Local Auto Service"
                    icon={Search}
                    result="SEO audit identified critical ranking opportunities. Achieved #1 position in Claude, Perplexity, and ChatGPT for competitive local service queries within 30 days of implementation."
                    metrics="#1 in AI search · 30-day timeline · GEO optimized"
                    color="bg-purple-500/20"
                />
            </div>
        </div>
    </section>
);

const LeadMagnet = () => (
    <section className="py-20 bg-gradient-to-b from-black to-[#111] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2" style={{ background: 'linear-gradient(to right, var(--color-accent-primary), var(--color-accent-secondary))' }} />
                <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Book a Strategy Call</h2>
                <p className="text-gray-400 mb-8">See what a dedicated AI team can do for your business. 30 minutes. No commitment. We'll show you exactly where AI can drive revenue for your specific situation.</p>
                <button className="text-black px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors flex items-center gap-2 mx-auto btn-glow" style={{ background: 'var(--color-accent-primary)' }}>
                    <ArrowRight className="w-4 h-4" /> Book Your Call
                </button>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-20 border-t border-white/10 bg-black px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-white mb-2" style={{ fontFamily: fonts.heading }}>X10 Automation</div>
                <p className="text-gray-500 text-sm">Architecting the autonomous future.</p>
            </div>
            <div className="flex gap-8 text-sm text-gray-400">
                <a href="#how-it-works" className="hover:text-accent-400 transition-colors">How It Works</a>
                <a href="#case-studies" className="hover:text-accent-400 transition-colors">Results</a>
                <a href="#" className="hover:text-accent-400 transition-colors">Book a Call</a>
            </div>
            <div className="text-gray-600 text-xs">
                © 2026 X10 Automation. All rights reserved.<span className="text-gray-700 text-xs ml-2">&middot; Built with AI</span>
            </div>
        </div>
    </footer>
);

// --- Main Page Component ---

const App: React.FC = () => {
  // URL param overrides: ?hero=lightweight&theme=midnight-teal&logo=gears
  const params = useMemo(() => new URLSearchParams(window.location.search), []);

  const heroVariant = useMemo<HeroVariant>(() => {
    const param = params.get('hero');
    const valid: HeroVariant[] = ['planet', 'constellation', 'network', 'blob', 'lightweight'];
    return valid.includes(param as HeroVariant) ? (param as HeroVariant) : DEFAULT_HERO_VARIANT;
  }, [params]);

  const colorTheme = useMemo<ColorTheme>(() => {
    const param = params.get('theme') as ColorTheme;
    return VALID_THEMES.includes(param) ? param : DEFAULT_THEME;
  }, [params]);

  const logoVariant = useMemo<LogoVariant>(() => {
    const param = params.get('logo') as LogoVariant;
    return VALID_LOGOS.includes(param) ? param : DEFAULT_LOGO;
  }, [params]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    document.title = "X10 Automation | Architecting the Autonomous Future";
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white selection:bg-accent-400 selection:text-white font-sans">
      <NoiseOverlay />
      <Vignette />
      <Navbar logoVariant={logoVariant} />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <HeroBackground variant={heroVariant} />

        <div className="w-full max-w-[1600px] mx-auto relative flex flex-col justify-center items-center pt-20 z-30">
            <HeroContent />
            {SHOW_HERO_ANNOTATIONS && (
            <div className="absolute inset-0 pointer-events-none">
               <Annotation label="Custom AI Teams" side="left" delay={2.4} x={-380} y={-240} />
               <Annotation label="90-Day Pilot" side="left" delay={2.6} x={-450} y={-20} />
               <Annotation label="10x Output" side="right" delay={2.5} x={380} y={-240} />
               <Annotation label="6 Industries" side="right" delay={2.7} x={450} y={-20} />
            </div>
            )}
        </div>

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 3, duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
            <ChevronDown className="w-8 h-8 text-white/30" />
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-b from-transparent to-[#030303] z-20 pointer-events-none" />
      </section>

      {/* Content Sections */}
      <div className="relative z-30 bg-[#030303]">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#030303] to-transparent pointer-events-none z-50" />
        <TransformationSection />
        <div className="section-divider max-w-4xl mx-auto" />
        <HumanInLoopSection />
        <MetricsBar />

        {/* Solution 1: AI Marketing */}
        <AgentShowcaseSection />
        <ComparisonSection />
        <EcommerceCaseStudySection />

        {/* Solution 2: Praetor Legal AI */}
        <LegalAgentShowcaseSection />
        <LegalComparisonSection />
        <LegalCaseStudySection />

        {/* Enterprise */}
        <div className="section-divider max-w-4xl mx-auto" />
        <PrivateAISection />

        {/* Shared */}
        <IndustriesSection />
        <ROICalculatorSection />
        <ImplementationsSection />
        <ImplementationExample />
        <ResultsSection />
        <LeadMagnet />
        <Footer />
      </div>

      <AIChat />
    </div>
  );
}

export default App;
