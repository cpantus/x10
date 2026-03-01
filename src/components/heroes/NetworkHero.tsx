import { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import ForceGraph3D from 'r3f-forcegraph';
import type { GraphData } from 'r3f-forcegraph';
import { useIsMobile } from './hooks/useIsMobile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HERO_COLORS } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AGENT_LABELS = [
  'Analyst', 'Writer', 'Strategist', 'Designer', 'Researcher',
  'Optimizer', 'Planner', 'Reviewer', 'Scheduler', 'Monitor',
  'Copywriter', 'SEO', 'CRM', 'Ad Buyer', 'Data Eng',
  'Outreach', 'Emailer', 'Branding', 'Growth', 'Funnel',
  'Retention', 'UX', 'Social', 'Video', 'AI Lead',
  'Auditor', 'Pricing', 'Forecast', 'Campaign', 'Insights',
  'Automator', 'Pipeline', 'Scoring', 'Persona', 'Segmenter',
];

const DESKTOP_NODES = 30;
const MOBILE_NODES = 15;
const LINK_RATIO = 2; // links per node (roughly)

const COLORS = {
  primary: HERO_COLORS.primary,    // #60A5FA
  secondary: HERO_COLORS.secondary, // #93C5FD
  accent: HERO_COLORS.deep,         // #1D4ED8
  link: 'rgba(96, 165, 250, 0.15)',
  particle: HERO_COLORS.primary,
};

const SPAWN_INTERVAL = 4_000; // ms between node spawns
const DESPAWN_DELAY = 8_000;   // ms before spawned node removed

// ---------------------------------------------------------------------------
// Graph data generation
// ---------------------------------------------------------------------------

interface GNode {
  id: string;
  label: string;
  val: number;
  color: string;
  ephemeral?: boolean;
}

interface GLink {
  source: string;
  target: string;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickColor(): string {
  const colors = [COLORS.primary, COLORS.secondary, COLORS.accent];
  return pickRandom(colors);
}

function generateGraph(nodeCount: number): GraphData<GNode, GLink> {
  const labels = AGENT_LABELS.slice(0, nodeCount);
  const nodes: GNode[] = labels.map((label, i) => ({
    id: `n${i}`,
    label,
    val: 1 + Math.random() * 3,
    color: pickColor(),
  }));

  const linkCount = Math.round(nodeCount * LINK_RATIO);
  const linkSet = new Set<string>();
  const links: GLink[] = [];

  while (links.length < linkCount) {
    const a = Math.floor(Math.random() * nodeCount);
    let b = Math.floor(Math.random() * nodeCount);
    if (a === b) continue;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (linkSet.has(key)) continue;
    linkSet.add(key);
    links.push({ source: nodes[a].id, target: nodes[b].id });
  }

  return { nodes, links };
}

// ---------------------------------------------------------------------------
// Inner scene (must be inside <Canvas>)
// ---------------------------------------------------------------------------

interface SceneProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

function Scene({ isMobile, reducedMotion }: SceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fgRef = useRef<any>(undefined);
  const nodeCount = isMobile ? MOBILE_NODES : DESKTOP_NODES;
  const [graphData, setGraphData] = useState<GraphData<GNode, GLink>>(() =>
    generateGraph(nodeCount),
  );

  // Configure forces after the graph mounts
  const handleFinishUpdate = useCallback(() => {
    if (!fgRef.current) return;
    const charge = fgRef.current.d3Force('charge');
    if (charge && typeof charge.strength === 'function') {
      charge.strength(-120);
    }
    const link = fgRef.current.d3Force('link');
    if (link && typeof link.distance === 'function') {
      link.distance(isMobile ? 30 : 40);
    }
  }, [isMobile]);

  // Dynamic node spawning (desktop + motion enabled only)
  useEffect(() => {
    if (isMobile || reducedMotion) return;

    let nextId = 1000;
    const interval = setInterval(() => {
      const id = `ephemeral-${nextId++}`;
      const label = pickRandom(AGENT_LABELS);
      const newNode: GNode = {
        id,
        label,
        val: 1 + Math.random() * 2,
        color: COLORS.primary,
        ephemeral: true,
      };

      setGraphData((prev) => {
        const existingIds = prev.nodes.map((n) => n.id);
        const connCount = 1 + Math.floor(Math.random() * 3);
        const targets = new Set<string>();
        while (targets.size < Math.min(connCount, existingIds.length)) {
          targets.add(pickRandom(existingIds));
        }
        const newLinks: GLink[] = [...targets].map((t) => ({
          source: id,
          target: t,
        }));
        return {
          nodes: [...prev.nodes, newNode],
          links: [...prev.links, ...newLinks],
        };
      });

      // Remove ephemeral node after delay
      setTimeout(() => {
        setGraphData((prev) => ({
          nodes: prev.nodes.filter((n) => n.id !== id),
          links: prev.links.filter(
            (l) =>
              (typeof l.source === 'string' ? l.source : (l.source as GNode).id) !== id &&
              (typeof l.target === 'string' ? l.target : (l.target as GNode).id) !== id,
          ),
        }));
      }, DESPAWN_DELAY);
    }, SPAWN_INTERVAL);

    return () => clearInterval(interval);
  }, [isMobile, reducedMotion]);

  // Auto-orbit via camera rotation
  const orbitAngle = useRef(0);

  useFrame((state, delta) => {
    // Tick the force simulation
    fgRef.current?.tickFrame();

    // Slow auto-orbit (skip if reduced motion)
    if (!reducedMotion) {
      orbitAngle.current += delta * 0.08;
      const radius = isMobile ? 100 : 120;
      state.camera.position.x = Math.sin(orbitAngle.current) * radius;
      state.camera.position.z = Math.cos(orbitAngle.current) * radius;
      state.camera.position.y = 20 * Math.sin(orbitAngle.current * 0.5);
      state.camera.lookAt(0, 0, 0);
    }
  });

  // Memoize accessors to avoid re-renders
  const nodeColorAccessor = useCallback((node: GNode) => node.color, []);
  const linkColorAccessor = useCallback(() => COLORS.link, []);

  const particleCount = reducedMotion ? 0 : (isMobile ? 1 : 2);
  const particleSpeed = reducedMotion ? 0 : 0.006;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[50, 50, 50]} intensity={0.6} />

      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        nodeId="id"
        nodeVal="val"
        nodeColor={nodeColorAccessor}
        nodeOpacity={0.9}
        nodeResolution={isMobile ? 6 : 10}
        nodeRelSize={isMobile ? 3 : 4}
        linkColor={linkColorAccessor}
        linkOpacity={0.15}
        linkWidth={0.3}
        linkDirectionalParticles={particleCount}
        linkDirectionalParticleSpeed={particleSpeed}
        linkDirectionalParticleWidth={0.8}
        linkDirectionalParticleColor={() => COLORS.particle}
        cooldownTime={reducedMotion ? 3000 : 15000}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={isMobile ? 30 : 50}
        onFinishUpdate={handleFinishUpdate}
      />

      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.3}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NetworkHero() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [dpr, setDpr] = useState(1.5);

  // Avoid SSR issues — only render Canvas client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handlePerformanceIncline = useCallback(() => {
    setDpr(Math.min(2, dpr + 0.25));
  }, [dpr]);

  const handlePerformanceDecline = useCallback(() => {
    setDpr(Math.max(0.75, dpr - 0.25));
  }, [dpr]);

  if (!mounted) {
    return (
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 to-[#030303]" />
    );
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ alpha: true, antialias: !isMobile, powerPreference: 'high-performance' }}
        dpr={dpr}
        camera={{ position: [0, 0, 120], fov: 60, near: 1, far: 500 }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onIncline={handlePerformanceIncline}
          onDecline={handlePerformanceDecline}
        >
          <Scene isMobile={isMobile} reducedMotion={reducedMotion} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
