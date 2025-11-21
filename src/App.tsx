/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Bot, Zap, Network, Shield, ChevronDown, Quote, FileText, Search, Users, ShieldCheck, BarChart3, Target, Check, Scale, Eye, Calculator, Lock, FileKey, Download, X, Server, Cpu, CheckSquare, ShieldAlert, Settings, Edit2, Save } from 'lucide-react';
import AIChat from './components/AIChat';

// --- Design Tokens & Assets ---

const fonts = {
  heading: '"Sora", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

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

const Navbar = () => {
  const navItems = ['Process', 'Case Study', 'Pricing', 'Security'];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 max-w-[1920px] mx-auto backdrop-blur-sm bg-black/20 border-b border-white/5"
    >
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Rotating Gears Logo */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Settings className="w-10 h-10 text-red-500" />
            </motion.div>
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <Settings className="w-6 h-6 text-white/90" />
            </motion.div>
        </div>
        <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white leading-none" style={{ fontFamily: fonts.heading }}>X10</span>
            <span className="text-[10px] tracking-[0.2em] text-red-500 uppercase font-bold">Automation</span>
        </div>
      </div>

      <div className="hidden md:flex gap-10 items-center">
        {navItems.map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '-')}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            className="text-xs font-medium text-gray-400 hover:text-white transition-colors uppercase tracking-[0.2em] relative group"
            style={{ fontFamily: fonts.mono }}
          >
            {item}
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-red-500 group-hover:w-full transition-all duration-300" />
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
        className="hidden md:flex items-center relative px-6 py-2.5 border border-white/20 text-white text-xs uppercase tracking-widest backdrop-blur-md bg-black/30 group overflow-hidden"
        style={{ fontFamily: fonts.mono }}
      >
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/20 to-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-100 ease-out" />
        <span className="relative z-10">Book Consultation</span>
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
            className="text-xs text-red-300 uppercase tracking-widest font-bold"
            style={{ fontFamily: fonts.mono, textShadow: '0 0 10px rgba(255,0,0,0.5)' }}
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
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-red-500/80 rounded-full blur-sm"
            />
        </div>

        {!isLeft && (
          <motion.span
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: delay + 0.5 }}
            className="text-xs text-red-300 uppercase tracking-widest font-bold"
            style={{ fontFamily: fonts.mono, textShadow: '0 0 10px rgba(255,0,0,0.5)' }}
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
            <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ff3b30" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ff3b30" stopOpacity="0" />
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
        className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-950/30 backdrop-blur-md shadow-[0_0_20px_rgba(220,38,38,0.2)]"
      >
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]" />
        <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-red-100 font-bold" style={{ fontFamily: fonts.mono }}>
          Elite AI Consultancy
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-8 text-white drop-shadow-2xl"
        style={{
            fontFamily: fonts.heading,
            textShadow: '0 0 80px rgba(255, 50, 50, 0.15)'
        }}
      >
        Scale Operations <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
            X10 With Agents
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
        We architect autonomous AI agent swarms that automate complex workflows, drastically reducing overhead and multiplying output by a factor of ten.
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
            boxShadow: "0 0 40px rgba(220, 38, 38, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-9 py-4 bg-white text-black overflow-hidden cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-200 to-orange-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 flex items-center gap-3 font-bold uppercase tracking-wider text-sm" style={{ fontFamily: fonts.heading }}>
            Deploy Agents
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
          className="group flex items-center gap-3 px-9 py-4 border border-white/20 text-white transition-colors backdrop-blur-sm cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="font-bold uppercase tracking-wider text-sm" style={{ fontFamily: fonts.heading }}>
            See The Logic
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
};

const RedPlanet = () => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] md:-translate-y-[40%] z-10 pointer-events-none w-[40vh] h-[40vh] md:w-[60vh] md:h-[60vh]"
         style={{ perspective: '1000px' }}>

      {/* 3D Container */}
      <div className="w-full h-full relative flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>

          {/* Planet Surface */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute w-[60%] h-[60%] rounded-full bg-black shadow-2xl"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #ff8a65 0%, #ff3d00 20%, #b71c1c 50%, #380202 85%, #000000 100%)',
              boxShadow: '0 0 80px rgba(255, 61, 0, 0.5), inset 0 0 60px rgba(0,0,0,0.8)',
              transform: 'translateZ(0px)',
            }}
          >
             {/* Atmosphere Glow Pulse */}
             <motion.div
                 animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute inset-0 rounded-full bg-red-500 mix-blend-screen blur-[30px] opacity-40"
             />
          </motion.div>

          {/* Rings Container - Fixed Tilt */}
          <div className="absolute w-[180%] h-[180%] flex items-center justify-center"
               style={{
                   transformStyle: 'preserve-3d',
                   transform: 'rotateX(78deg) rotateY(10deg)' // Slightly steeper tilt for dramatic effect
               }}>

                {/* Main Body Ring (Fuller) */}
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(transparent 50%, rgba(255,50,0,0.05) 55%, rgba(255,100,50,0.1) 60%, rgba(255,50,0,0.05) 65%, transparent 70%)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        boxShadow: '0 0 40px rgba(255, 50, 0, 0.2)', // Glow
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {/* Visible Ring Texture */}
                    <div className="absolute inset-[28%] border-[12px] border-dashed border-red-500/20 rounded-full opacity-80 blur-[2px]" />
                    <div className="absolute inset-[30%] border-[2px] border-white/10 rounded-full opacity-60" />
                </motion.div>

                {/* Inner Bright Ring */}
                 <motion.div
                    className="absolute w-[65%] h-[65%] rounded-full border-[3px] border-red-400/40"
                    style={{ boxShadow: '0 0 20px rgba(255,0,0,0.4)' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
          </div>
      </div>
    </div>
  );
};

const Landscape = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[35vh] z-20 overflow-hidden flex justify-center pointer-events-none">
      <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-[#030303] via-[#030303] to-transparent z-20" />

      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5, ease: "circOut" }}
        className="absolute bottom-0 w-full max-w-lg md:max-w-2xl h-full origin-bottom z-10"
        style={{ perspective: '200px' }}
      >
        <div className="relative w-full h-full bg-gradient-to-b from-transparent via-[#1a0505] to-[#030303]"
             style={{
               clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0% 100%)',
             }}
        >
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] mix-blend-overlay"></div>
          {/* Glowing Data Lines on Road */}
          <motion.div
            animate={{ backgroundPosition: '0 100px' }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,0,0,0.2)_50%,rgba(255,0,0,0)_100%)] bg-[length:100%_20px]"
          />
        </div>
      </motion.div>
    </div>
  );
};

// --- New Sections Components ---

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-16 md:mb-24 text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-red-500/20 bg-red-900/5"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      <span className="text-[10px] uppercase tracking-widest text-red-200 font-mono">{subtitle}</span>
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-4xl md:text-5xl font-bold text-white"
      style={{ fontFamily: fonts.heading }}
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
    className="p-8 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group"
  >
    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors border border-red-500/20">
      <Icon className="w-6 h-6 text-red-500" />
    </div>
    <h3 className="text-xl font-bold text-white mb-4" style={{ fontFamily: fonts.heading }}>{title}</h3>
    <p className="text-gray-400 leading-relaxed font-light">{desc}</p>
  </motion.div>
);

const TransformationSection = () => {
  const features = [
    { icon: Bot, title: "Autonomous Swarms", desc: "Deploy self-governing agent fleets that handle inquiries, scheduling, and logistics 24/7." },
    { icon: Zap, title: "10x Velocity", desc: "Accelerate operational throughput by automating repetitive tasks, allowing your team to focus on strategy." },
    { icon: Network, title: "Neural Integration", desc: "Our systems plug seamlessly into your stack—CRM, ERP, Slack—creating a unified, intelligent nervous system." }
  ];

  return (
    <section id="process" className="relative py-32 px-6 max-w-[1600px] mx-auto z-40 overflow-hidden">
      <BackgroundWatermark />
      <SectionHeader title="Transforming Organisations" subtitle="AI-Powered Efficiency" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
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
                            {['Receive Email', 'Open CRM', 'Copy Data', 'Paste to Slack', 'Wait for Approval', 'Draft Reply'].map((step, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-white/10 rounded border border-white/20 text-gray-100 shadow-lg hover:bg-white/20 transition-colors">
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                    <span className="text-white font-medium text-sm">{step}</span>
                                    {i < 5 && <span className="ml-auto text-xs text-red-400 font-mono">Delay: 2h</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* X10 Way */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-900/20 to-transparent blur-2xl rounded-full opacity-50" />
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3 font-mono">
                            <span className="text-red-500">02</span> THE X10 WAY
                        </h3>
                        <div className="relative h-[500px] border border-red-500/30 bg-gradient-to-b from-red-950/10 to-black rounded-xl p-8 flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8 z-10">
                                <div>
                                    <h4 className="text-lg font-bold text-white">Autonomous Loop</h4>
                                    <p className="text-xs text-red-400 font-mono">CONTINUOUS EXECUTION</p>
                                </div>
                                <div className="flex items-center gap-2 px-2 py-1 bg-red-900/20 rounded border border-red-500/30">
                                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"/>
                                   <span className="text-[10px] text-red-300 font-mono">LIVE</span>
                                </div>
                            </div>

                            {/* Loop Visual */}
                            <div className="relative flex-grow flex items-center justify-center z-10 my-4">
                                {/* Static Rings */}
                                <div className="absolute w-64 h-64 rounded-full border border-white/5" />
                                <div className="absolute w-48 h-48 rounded-full border border-white/5" />

                                {/* Animated Orbit */}
                                <motion.div
                                    className="absolute w-64 h-64 rounded-full border-r-2 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute w-48 h-48 rounded-full border-l-2 border-red-400/50"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Central Core */}
                                <div className="absolute z-20 bg-black p-4 rounded-full border border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.3)] flex items-center justify-center">
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
                                    <div className="text-gray-500 text-[10px] uppercase">Latency</div>
                                    <div className="text-xl font-bold text-white font-mono">12ms</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-gray-500 text-[10px] uppercase">Actions/Sec</div>
                                    <div className="text-xl font-bold text-white font-mono">5k+</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-gray-500 text-[10px] uppercase">Error Rate</div>
                                    <div className="text-xl font-bold text-white font-mono">0%</div>
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
            ${isCenter ? 'bg-[#1a1a1a] border-2 border-red-500' : 'bg-black border border-white/20'}`}
        style={{ top: y, left: x }}
    >
        {isCenter && (
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500 blur-xl z-[-1]"
            />
        )}
        <Icon className={`w-6 h-6 ${isCenter ? 'text-red-500' : 'text-gray-300'}`} />

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
       { icon: Search, label: 'Research' },
       { icon: FileText, label: 'Creative' },
       { icon: Cpu, label: 'Code' },
       { icon: ShieldCheck, label: 'Audit' },
       { icon: Target, label: 'Strategy' },
       { icon: BarChart3, label: 'Analytics' },
       { icon: Shield, label: 'Security' },
       { icon: Scale, label: 'Legal' },
       { icon: Eye, label: 'UX/UI' }
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
                            stroke="#333"
                            strokeWidth="1"
                        />
                        {/* Data Packet Out */}
                        <circle r="2" fill="#ef4444">
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
                    className="absolute w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_red] z-10"
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
    <section className="relative py-24 bg-[#020202] overflow-hidden border-y border-white/5">
      <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />

      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
        <SectionHeader title="Swarm Intelligence" subtitle="The Neural Architecture" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Distributed Consensus</h3>
                    <p className="text-gray-400 leading-relaxed">
                        Unlike linear bots, X10 swarms operate as a graph. Agents communicate laterally, verifying each other's work and reaching consensus before executing critical actions.
                    </p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <Network className="text-red-500 w-6 h-6" />
                        <div>
                            <div className="text-white font-bold text-sm">Orchestrator Model</div>
                            <div className="text-gray-500 text-xs">Central nervous system delegating tasks</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10">
                        <ShieldCheck className="text-blue-400 w-6 h-6" />
                        <div>
                            <div className="text-white font-bold text-sm">Critic & Verifier</div>
                            <div className="text-gray-500 text-xs">Double-checks output for accuracy</div>
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
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-900/10">
                        <Users className="w-4 h-4 text-blue-400" />
                        <span className="text-xs uppercase tracking-widest text-blue-200 font-mono">Control</span>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: fonts.heading }}>
                        Autonomous but <br /> <span className="text-blue-500">Obedient</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        The biggest fear with AI is losing control. We solve this with "Co-Pilot Mode." Agents draft, research, and propose actions, but critical decisions wait for your single-click approval.
                    </p>
                    <ul className="space-y-4">
                        {['Human-in-the-loop approval Gates', 'Real-time Activity Stream', 'Instant "Kill-Switch" Override'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-gray-300">
                                <CheckSquare className="w-5 h-5 text-blue-500" /> {item}
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
                                <div className={`w-2 h-2 rounded-full ${status === 'processing' ? 'bg-yellow-400 animate-pulse' : 'bg-blue-500'}`} />
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
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                            <Bot className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div className="w-full">
                                            <p className="text-gray-300 text-sm mb-2"><span className="font-bold text-white">Sales Agent</span> proposes:</p>
                                            <div className="bg-black/50 border border-white/10 p-4 rounded text-sm text-gray-400 font-mono whitespace-pre-wrap">
                                                {content}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={handleApprove} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded text-sm font-bold transition-colors flex items-center justify-center gap-2">
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
                                    <p className="text-white font-bold mb-2 flex items-center gap-2"><Edit2 className="w-4 h-4 text-blue-400"/> Edit Proposal</p>
                                    <textarea
                                        value={tempContent}
                                        onChange={(e) => setTempContent(e.target.value)}
                                        className="w-full flex-grow h-32 bg-black/50 border border-white/20 rounded p-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-blue-500 mb-4 resize-none"
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
                                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                                    <p className="text-blue-400 font-mono text-sm animate-pulse">EXECUTION IN PROGRESS...</p>
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
        { agent: "Analyst", role: "Watcher", text: "ALERT: 'Cyber-Y2K' aesthetic trending +450% on TikTok. Inventory for SKU-902 is adequate.", color: "text-blue-400" },
        { agent: "Strategist", role: "Planner", text: "Initiating Campaign #882. Objective: Capture trend volume. Budget limit: $2,000/day.", color: "text-purple-400" },
        { agent: "Creative", role: "Generator", text: "Generated 12 ad variations. 3 Video, 9 Static. Copy angle: 'Nostalgia Future'.", color: "text-pink-400" },
        { agent: "MediaBuyer", role: "Executor", text: "Deploying to Meta & TikTok. Targeting: Gen Z, Interest: Retro Tech. Bids set.", color: "text-green-400" },
        { agent: "Analyst", role: "Watcher", text: "T+4 Hours: ROAS at 4.2. Increasing budget by 20%. Pausing Variation B (Low CTR).", color: "text-blue-400" },
        // Expanded Workflow
        { agent: "Creative", role: "Optimizer", text: "Variation A performing best. Generating 5 iterations of Variation A with new hooks.", color: "text-pink-400" },
        { agent: "Legal", role: "Compliance", text: "Scanning assets... 100% Compliant. No copyright flags detected.", color: "text-yellow-400" },
        { agent: "MediaBuyer", role: "Executor", text: "Scaling budget on Variation A_v2. Bid cap increased to $1.50.", color: "text-green-400" },
        { agent: "Analyst", role: "Watcher", text: "Inventory warning: SKU-902 stock below 150 units. Alerting Logistics.", color: "text-blue-400" },
        { agent: "Logistics", role: "Ops", text: "Restock order #9921 triggered. ETA 2 days. Shifting ads to pre-order messaging if stock < 50.", color: "text-orange-400" },
        { agent: "Strategist", role: "Planner", text: "Cross-channel opportunity detected: Twitter/X sentiment rising. Expanding campaign.", color: "text-purple-400" },
        { agent: "Creative", role: "Generator", text: "Drafting text-based assets for X. Tone: Witty/Meme-centric.", color: "text-pink-400" },
        { agent: "Legal", role: "Compliance", text: "Reviewing X copy... Approved.", color: "text-yellow-400" },
        { agent: "MediaBuyer", role: "Executor", text: "Launching Twitter Ad Set #2. Budget: $500 test.", color: "text-green-400" },
        { agent: "Analyst", role: "Watcher", text: "T+12 Hours: Blended ROAS 5.1. Total Revenue: $14,200.", color: "text-blue-400" },
        { agent: "Strategist", role: "Planner", text: "Campaign successful. Locking learnings for Q4 playbook.", color: "text-purple-400" },
        { agent: "System", role: "Core", text: "Daily Report generated. Emailing stakeholders.", color: "text-gray-400" },
        { agent: "Analyst", role: "Watcher", text: "Micro-trend 'Neon-Goth' detected. Early signal. Monitoring...", color: "text-blue-400" },
        { agent: "MediaBuyer", role: "Executor", text: "Pre-emptively creating audience segments for 'Neon-Goth'.", color: "text-green-400" },
        { agent: "System", role: "Core", text: "Cycle complete. Standby for next trend trigger.", color: "text-gray-400" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMessage(prev => (prev + 1) % (messages.length + 1));
        }, 1500); // Slightly faster to show more logs
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
                    <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-red-500/20 bg-red-900/10">
                        <Target className="w-4 h-4 text-red-500" />
                        <span className="text-xs uppercase tracking-widest text-red-200 font-mono">Case Study: Ecommerce</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: fonts.heading }}>
                        Autonomous Marketing <br /> <span className="text-red-500">Orchestrator</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        A global fashion brand struggled with slow reaction times to viral micro-trends. We deployed a bespoke X10 Agent Swarm to monitor social signals and autonomously spin up ad campaigns.
                    </p>

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">350%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">ROAS Increase</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">0</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Human Touchpoints</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">24/7</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Operation Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1 font-mono">&lt; 15m</div>
                            <div className="text-sm text-gray-500 uppercase tracking-widest">Trend to Ad Time</div>
                        </div>
                    </div>

                    <button className="flex items-center gap-3 text-white font-bold border-b border-red-500 pb-1 hover:text-red-400 transition-colors">
                        Read Full Case Study <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Content: Agent Simulation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                        {/* Window Header */}
                        <div className="bg-[#111] px-4 py-3 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
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
                                     <span className="w-2 h-4 bg-red-500 animate-pulse" />
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

const UseCaseCard: React.FC<{ title: string, metric: string, label: string, desc?: string }> = ({ title, metric, label, desc }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative h-[400px] bg-gradient-to-b from-[#111] to-[#050505] border border-white/10 p-8 flex flex-col justify-between overflow-hidden group"
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
        <Cpu className="w-24 h-24 text-white" />
    </div>

    <div>
        <div className="text-red-500 mb-4">
            <Shield className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-xs text-red-400 uppercase tracking-widest mb-4">{label}</p>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>

    <div className="mt-auto">
        <div className="text-5xl font-bold text-white mb-2" style={{ fontFamily: fonts.mono }}>{metric}</div>
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="h-full bg-red-600"
            />
        </div>
        <p className="text-xs text-gray-400 mt-3">Efficiency Increase Verified</p>
    </div>
  </motion.div>
);

const ImplementationsSection = () => {
  const useCases = [
    { title: "Ad Campaign Manager", metric: "300%", label: "ROI Uplift", desc: "Train for a week to optimize your advertising strategy, A/B testing, and ROI analysis. Continuously monitors ad performance." },
    { title: "Competitor Intel", metric: "24/7", label: "Market Watch", desc: "Monitoring of competitor activities, pricing strategies, product launches, and market positioning. Instant alerts on changes." },
    { title: "Compliance Sentinel", metric: "100%", label: "Risk Coverage", desc: "Monitor laws, regulations, compliance requirements continuously. Never miss a regulatory change that affects your business." },
    { title: "Customer Support Agent", metric: "85%", label: "Resolution Rate", desc: "Resolve customer inquiries instantly with human-like context awareness and empathy." },
    { title: "Data Entry Pipeline", metric: "99.9%", label: "Accuracy Rate", desc: "Process thousands of documents and forms without a single manual error." },
    { title: "Sales Outreach Bot", metric: "10x", label: "Lead Generation", desc: "Personalized outreach at scale, booking meetings while you sleep." }
  ];

  return (
    <section id="use-cases" className="py-32 bg-[#080808] relative overflow-hidden">
      <BackgroundWatermark />
      <div className="max-w-[1600px] mx-auto px-6 relative z-10">
         <div className="flex flex-col md:flex-row justify-between items-end mb-16">
             <div className="max-w-2xl">
                <span className="text-red-500 font-mono text-xs tracking-widest mb-4 block">CONCRETE USE CASES</span>
                <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: fonts.heading }}>
                    Engineered for Impact
                </h2>
             </div>
             <button className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors mt-6 md:mt-0">
                View All Case Studies <ArrowRight className="w-4 h-4" />
             </button>
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
const ROICalculatorSection = () => {
    const [teamSize, setTeamSize] = useState(5);
    const [hourlyWage, setHourlyWage] = useState(500);
    const [hoursAutomated, setHoursAutomated] = useState(10); // hours per week per person

    const weeklySavings = teamSize * hourlyWage * hoursAutomated;
    const annualSavings = weeklySavings * 52;

    return (
        <section className="py-32 bg-[#020202] border-t border-white/5 relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeader title="Calculate ROI" subtitle="Projected Savings" />
                        <p className="text-gray-400 mb-12 -mt-8 text-center lg:text-left">
                            Estimate the capital recovered by deploying X10 agents to handle repetitive cognitive tasks.
                        </p>

                        <div className="space-y-8">
                             {/* Slider 1 */}
                             <div>
                                <div className="flex justify-between text-sm text-gray-300 mb-2">
                                    <span>Team Size</span>
                                    <span className="font-mono text-red-400">{teamSize} employees</span>
                                </div>
                                <input
                                    type="range" min="1" max="20" value={teamSize}
                                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1 font-mono">
                                    <span>1</span>
                                    <span>20</span>
                                </div>
                             </div>
                             {/* Slider 2 */}
                             <div>
                                <div className="flex justify-between text-sm text-gray-300 mb-2">
                                    <span>Avg. Hourly Wage</span>
                                    <span className="font-mono text-red-400">{hourlyWage} Lei/hr</span>
                                </div>
                                <input
                                    type="range" min="100" max="3300" value={hourlyWage}
                                    onChange={(e) => setHourlyWage(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                 <div className="flex justify-between text-xs text-gray-600 mt-1 font-mono">
                                    <span>100</span>
                                    <span>3300</span>
                                </div>
                             </div>
                             {/* Slider 3 */}
                             <div>
                                <div className="flex justify-between text-sm text-gray-300 mb-2">
                                    <span>Hours Automated / Week (Per Person)</span>
                                    <span className="font-mono text-red-400">{hoursAutomated} hrs</span>
                                </div>
                                <input
                                    type="range" min="1" max="20" value={hoursAutomated}
                                    onChange={(e) => setHoursAutomated(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                                />
                                 <div className="flex justify-between text-xs text-gray-600 mt-1 font-mono">
                                    <span>1</span>
                                    <span>20</span>
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-20">
                            <Calculator className="w-32 h-32 text-white" />
                        </div>
                        <h4 className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">Estimated Annual Savings</h4>
                        <div className="text-5xl md:text-7xl font-bold text-white mb-4 font-mono tracking-tighter">
                             {annualSavings.toLocaleString()} <span className="text-2xl text-red-500">Lei</span>
                        </div>
                        <p className="text-red-500 text-sm flex items-center gap-2">
                            <ArrowRight className="w-4 h-4" /> Capital returned to strategy
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// --- Security Section ---
const SecuritySection = () => {
    const features = [
        { icon: Lock, title: "Zero-Training Policy", desc: "Your data is never used to train our base models. It remains yours, exclusively." },
        { icon: Server, title: "On-Premise Options", desc: "Deploy our agent containers within your own VPC for maximum air-gapped security." },
        { icon: ShieldAlert, title: "SOC2 Compliant", desc: "Our workflows adhere to rigorous enterprise security standards and audit trails." }
    ];

    return (
        <section id="security" className="py-24 bg-black border-y border-white/10">
            <div className="max-w-[1600px] mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-gray-700 bg-gray-900">
                     <FileKey className="w-4 h-4 text-gray-400" />
                     <span className="text-xs uppercase tracking-widest text-gray-300 font-mono">Enterprise Trust</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 font-heading">Your Data. Your Rules.</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <div key={i} className="p-6 border border-white/10 rounded-lg bg-[#050505] hover:border-white/20 transition-colors text-left">
                            <f.icon className="w-8 h-8 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


const PricingCard = ({ tier, price, features, recommended }: any) => (
    <motion.div
        whileHover={{ y: -10 }}
        className={`relative p-8 rounded-2xl border flex flex-col h-full ${recommended ? 'bg-gradient-to-b from-[#111] to-black border-red-500/50' : 'bg-[#0a0a0a] border-white/10'}`}
    >
        {recommended && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
            </div>
        )}

        <div className="mb-8">
            <h3 className="text-xl font-bold text-white mb-2">{tier}</h3>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-bold text-white font-mono">{price}</span>
                {price !== 'Custom' && <span className="text-gray-500 text-sm">/month</span>}
            </div>
        </div>

        <div className="flex-grow space-y-4 mb-8">
            {features.map((feat: string, i: number) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className={`w-4 h-4 mt-0.5 ${recommended ? 'text-red-500' : 'text-gray-500'}`} />
                    <span>{feat}</span>
                </div>
            ))}
        </div>

        <button className={`w-full py-3 text-sm font-bold uppercase tracking-wider rounded transition-all
            ${recommended
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                : 'border border-white/20 hover:bg-white/5 text-white'}`}>
            Get Started
        </button>
    </motion.div>
);

const PricingSection = () => {
    return (
        <section id="pricing" className="py-32 bg-[#030303] px-6">
             <div className="max-w-[1600px] mx-auto">
                <SectionHeader title="Implementation Tiers" subtitle="Scalable Solutions" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <PricingCard
                        tier="Neural Pilot"
                        price="$5,000"
                        features={[
                            "Single-workflow automation",
                            "1-2 Specialized Agents",
                            "Weekly Performance Reporting",
                            "Email Support",
                            "Standard Integration (Zapier/API)"
                        ]}
                    />
                    <PricingCard
                        tier="Swarm Core"
                        price="$12,000"
                        recommended={true}
                        features={[
                            "Multi-agent department ecosystem",
                            "5-10 Interconnected Agents",
                            "Real-time Dashboard Access",
                            "Dedicated Success Manager",
                            "Deep Integration (CRM/ERP/Slack)",
                            "Autonomous Decision Loops"
                        ]}
                    />
                    <PricingCard
                        tier="Omni-System"
                        price="Custom"
                        features={[
                            "Full Enterprise Architecture",
                            "Unlimited Agent Swarms",
                            "Custom LLM Fine-tuning",
                            "On-premise Deployment Options",
                            "24/7 Critical Response",
                            "White-label Interface"
                        ]}
                    />
                </div>
             </div>
        </section>
    );
};

const ImplementationExample = () => {
    const steps = [
        { title: "Audit & Analysis", desc: "We map your current workflows to identify bottlenecks." },
        { title: "Agent Architecture", desc: "Custom LLM agents designed for specific roles." },
        { title: "Deployment", desc: "Seamless integration with fail-safe protocols." },
        { title: "X10 Scaling", desc: "Continuous learning loops to multiply throughput." }
    ];

    return (
        <section id="results" className="py-32 max-w-[1600px] mx-auto px-6 relative overflow-hidden">
            <BackgroundWatermark className="w-full h-full absolute left-0 top-0 flex items-center justify-start pl-[10%]" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                <div>
                    <SectionHeader title="Implementation Process" subtitle="How We Work" />
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
                                    <div className="w-8 h-8 rounded-full border border-red-500 bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-sm">
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
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent blur-3xl" />
                    <div className="relative bg-black border border-white/10 rounded-xl p-8 overflow-hidden">
                         {/* Fake Code/Terminal UI */}
                         <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            <span className="ml-2 text-xs text-gray-500 font-mono">agent_core.py</span>
                         </div>
                         <div className="font-mono text-sm space-y-2 text-gray-300">
                             <p><span className="text-blue-400">class</span> <span className="text-yellow-300">SalesAgent</span>(BaseAgent):</p>
                             <p className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-300">analyze_lead</span>(self, data):</p>
                             <p className="pl-8 text-gray-500"># AI logic for lead scoring</p>
                             <p className="pl-8">score = self.model.predict(data)</p>
                             <p className="pl-8"><span className="text-purple-400">if</span> score &gt; 0.8:</p>
                             <p className="pl-12">self.crm.create_opportunity(data)</p>
                             <p className="pl-12"><span className="text-purple-400">return</span> <span className="text-green-400">"High Priority"</span></p>
                             <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1 }}
                                className="w-2 h-4 bg-red-500 inline-block ml-1 align-middle"
                             />
                         </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TestimonialCard = ({ quote, author, role, img }: { quote: string, author: string, role: string, img: string }) => (
    <div className="bg-white/5 border border-white/10 p-8 rounded-lg relative group hover:bg-white/[0.08] transition-colors">
        <Quote className="w-8 h-8 text-red-500/20 absolute top-6 left-6" />
        <p className="text-lg text-gray-300 mb-8 relative z-10 leading-relaxed italic">"{quote}"</p>
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full p-[1px] bg-gradient-to-br from-red-500 to-black">
                 <img src={img} alt={author} className="w-full h-full rounded-full object-cover border border-black" />
            </div>
            <div>
                <div className="text-white font-bold">{author}</div>
                <div className="text-red-400 text-xs uppercase tracking-wider">{role}</div>
            </div>
        </div>
    </div>
);

const TestimonialsSection = () => (
    <section className="py-32 bg-[#050505] px-6 border-t border-white/5 relative overflow-hidden">
        <BackgroundWatermark />
        <div className="max-w-[1600px] mx-auto relative z-10">
            <SectionHeader title="Client Success" subtitle="Results" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TestimonialCard
                    quote="X10 automated our entire invoicing process. We saved 40 hours a week in manual data entry immediately."
                    author="Sarah Jenkins"
                    role="CFO, TechFlow"
                    img="https://i.pravatar.cc/150?u=sarah"
                />
                <TestimonialCard
                    quote="The customer support agents they built handle 90% of our tickets. Our human team is finally happy."
                    author="Marcus Chen"
                    role="Head of Support, OmniScale"
                    img="https://i.pravatar.cc/150?u=marcus"
                />
                <TestimonialCard
                    quote="We scaled from 100 to 1000 leads per day without hiring a single new SDR. The ROI was instant."
                    author="Elena Rodriguez"
                    role="VP of Sales, NovaCorp"
                    img="https://i.pravatar.cc/150?u=elena"
                />
            </div>
        </div>
    </section>
);

const LeadMagnet = () => (
    <section className="py-20 bg-gradient-to-b from-black to-[#111] border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500" />
                <h2 className="text-3xl font-bold text-white mb-4">Not Ready for a Call?</h2>
                <p className="text-gray-400 mb-8">Download our "Automation Readiness Audit" PDF. It takes 3 minutes to see if your business is ready for X10.</p>
                <button className="bg-white text-black px-8 py-3 rounded font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2 mx-auto">
                    <Download className="w-4 h-4" /> Get The Free Audit
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
                <a href="#" className="hover:text-red-500 transition-colors">Services</a>
                <a href="#" className="hover:text-red-500 transition-colors">Case Studies</a>
                <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
            </div>
            <div className="text-gray-600 text-xs">
                © 2025 X10 Automation. All rights reserved.
            </div>
        </div>
    </footer>
);

// --- Main Page Component ---

const App: React.FC = () => {
  // Set document title for the full app feel
  useEffect(() => {
    document.title = "X10 Automation | AI Consultancy";
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white selection:bg-red-500 selection:text-white font-sans">
      <NoiseOverlay />
      <Vignette />
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <RedPlanet />

        <div className="w-full max-w-[1600px] mx-auto relative flex flex-col justify-center items-center pt-20 z-30">
            <HeroContent />
            <div className="absolute inset-0 pointer-events-none">
               <Annotation label="Auto-Scaling" side="left" delay={2.4} x={-350} y={-220} />
               <Annotation label="Neural Nets" side="left" delay={2.6} x={-420} y={-20} />
               <Annotation label="Agent Swarms" side="right" delay={2.5} x={350} y={-220} />
               <Annotation label="Zero Latency" side="right" delay={2.7} x={420} y={-20} />
            </div>
        </div>

        <Landscape />

        {/* Scroll Indicator */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 3, duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        >
            <ChevronDown className="w-8 h-8 text-white/30" />
        </motion.div>
      </section>

      {/* Content Sections */}
      <div className="relative z-30 bg-[#030303]">
        <TransformationSection />
        <ComparisonSection />
        <AgentShowcaseSection />
        <HumanInLoopSection />
        <EcommerceCaseStudySection />
        <ROICalculatorSection />
        <ImplementationsSection />
        <SecuritySection />
        <PricingSection />
        <ImplementationExample />
        <TestimonialsSection />
        <LeadMagnet />
        <Footer />
      </div>

      <AIChat />
    </div>
  );
}

export default App;
