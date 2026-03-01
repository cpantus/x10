import React, { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Zap, Network, Shield, FileText, Search, ShieldCheck, BarChart3, Target, Check, Eye, Calculator, Cpu, Settings, Edit2, Scale, BookOpen, Bell, ArrowLeft } from 'lucide-react';
import SEOMeta from '../components/SEOMeta';

// --- Design Tokens ---

const fonts = {
  heading: '"Space Grotesk", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

// --- Shared Components (duplicated from App.tsx) ---

interface WatermarkProps {
    className?: string;
}

const BackgroundWatermark: React.FC<WatermarkProps> = ({ className }) => (
    <div className={`absolute pointer-events-none select-none overflow-hidden flex items-center z-0 ${className || "inset-0 justify-center"}`}>
        <span className="text-[20vw] font-bold text-white/[0.07] leading-none whitespace-nowrap" style={{ fontFamily: fonts.heading }}>X10</span>
    </div>
);

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

// --- Marketing Components (copied from App.tsx) ---

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

// --- Legal Agent Components (copied from App.tsx) ---

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

// --- E-commerce Case Study Section ---
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

                    <a href="/#results" className="flex items-center gap-3 text-white font-bold border-b border-accent-400 pb-1 hover:text-accent-300 transition-colors">
                        See More Results <ArrowRight className="w-4 h-4" />
                    </a>
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

// --- Page Layout ---

const SolutionsNavbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-6 md:px-12 max-w-[1920px] mx-auto backdrop-blur-xl bg-black/60 border-b border-white/5">
    <a href="/" className="flex items-center gap-3 group cursor-pointer">
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-white leading-none" style={{ fontFamily: fonts.heading }}>X10</span>
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold leading-tight" style={{ color: 'var(--color-accent-primary)' }}>Automation</span>
      </div>
    </a>
    <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: fonts.mono }}>
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </a>
  </nav>
);

const SolutionsFooter = () => (
  <footer className="py-12 border-t border-white/10 bg-black px-6">
    <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left">
        <div className="text-2xl font-bold text-white mb-2" style={{ fontFamily: fonts.heading }}>X10 Automation</div>
        <p className="text-gray-500 text-sm">Architecting the autonomous future.</p>
      </div>
      <div className="text-gray-600 text-xs">
        &copy; 2026 X10 Automation. All rights reserved.<span className="text-gray-700 text-xs ml-2">&middot; Built with AI</span>
      </div>
    </div>
  </footer>
);

const SolutionsPage: React.FC = () => {
  type ColorTheme = 'electric-blue' | 'midnight-teal' | 'cyan-spectrum' | 'midnight-gold';
  const DEFAULT_THEME: ColorTheme = 'midnight-gold';
  const VALID_THEMES: ColorTheme[] = ['electric-blue', 'midnight-teal', 'cyan-spectrum', 'midnight-gold'];

  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const colorTheme = useMemo<ColorTheme>(() => {
    const param = params.get('theme') as ColorTheme;
    return VALID_THEMES.includes(param) ? param : DEFAULT_THEME;
  }, [params]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  const solutionsSchemas = useMemo(() => [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "AI Marketing Team",
      "provider": { "@type": "Organization", "name": "X10 Automation", "url": "https://x10.ro" },
      "description": "15-25 specialized AI agents delivering SEO, GEO optimization, content creation, email automation, competitive intelligence, and lead magnets for SMEs.",
      "offers": { "@type": "Offer", "priceSpecification": { "@type": "PriceSpecification", "price": "3000-6500", "priceCurrency": "EUR", "unitText": "per month" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Praetor Legal AI",
      "provider": { "@type": "Organization", "name": "X10 Automation", "url": "https://x10.ro" },
      "description": "8 specialized legal AI agents searching 35M Romanian court decisions with 92.7% accuracy. Contract analysis, case research, and compliance verification.",
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://x10.ro/" },
        { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://x10.ro/solutions" },
      ],
    },
  ], []);

  return (
    <div className="relative w-full min-h-screen bg-[#030303] text-white selection:bg-accent-400 selection:text-white font-sans">
      <SEOMeta
        title="AI Marketing & Legal Agent Teams | X10 Automation Solutions"
        description="Explore X10 Automation's AI agent teams: 15-25 marketing specialists delivering SEO, GEO, email automation, and lead magnets, plus Praetor Legal AI searching 35M court decisions. 90-day pilot from €3K/mo."
        canonical="https://x10.ro/solutions"
        schemas={solutionsSchemas}
      />
      <SolutionsNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full"
            style={{ border: '1px solid var(--color-accent-glow)', background: 'var(--color-accent-subtle)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent-primary)' }} />
            <span className="text-[10px] uppercase tracking-widest font-mono" style={{ color: 'var(--color-accent-secondary)' }}>AI Agent Teams</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{ fontFamily: fonts.heading }}
          >
            Our Solutions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Purpose-built AI agent teams for marketing and legal — orchestrated intelligence that delivers in days what takes traditional teams months.
          </motion.p>
        </div>
      </section>

      {/* Marketing Solutions */}
      <AgentShowcaseSection />
      <ComparisonSection />
      <EcommerceCaseStudySection />

      {/* Legal Solutions */}
      <LegalAgentShowcaseSection />
      <LegalComparisonSection />
      <LegalCaseStudySection />

      <SolutionsFooter />
    </div>
  );
};

export default SolutionsPage;
