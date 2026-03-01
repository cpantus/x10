// Variant C: R3F morphing sphere + orbiting nodes + Bloom
import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, PerformanceMonitor, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useIsMobile } from './hooks/useIsMobile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HERO_COLORS } from './types';
import * as THREE from 'three';

// ---------- Node configuration ----------

interface NodeConfig {
  orbitRadius: number;
  speed: number;
  inclination: number; // radians
  phase: number;       // radians
  size: number;
}

function generateNodes(count: number): NodeConfig[] {
  const nodes: NodeConfig[] = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      orbitRadius: 3 + Math.random() * 2,
      speed: 0.15 + Math.random() * 0.35,
      inclination: (Math.random() - 0.5) * Math.PI * 0.6,
      phase: (Math.PI * 2 * i) / count + Math.random() * 0.4,
      size: 0.08 + Math.random() * 0.04,
    });
  }
  return nodes;
}

// ---------- Central Sphere ----------

function CentralSphere({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_state, delta) => {
    if (meshRef.current && !reducedMotion) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 64]} />
      <MeshDistortMaterial
        color={HERO_COLORS.primary}
        distort={0.4}
        speed={reducedMotion ? 0 : 1.5}
        metalness={0.2}
        roughness={0.7}
        emissive={HERO_COLORS.primary}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

// ---------- Orbiting Nodes (InstancedMesh) ----------

function OrbitingNodes({
  configs,
  reducedMotion,
}: {
  configs: NodeConfig[];
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positionsRef = useRef<THREE.Vector3[]>(configs.map(() => new THREE.Vector3()));
  const count = configs.length;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = reducedMotion ? 0 : clock.getElapsedTime();

    for (let i = 0; i < count; i++) {
      const cfg = configs[i];
      const angle = cfg.phase + (reducedMotion ? 0 : t * cfg.speed);

      const x = Math.cos(angle) * cfg.orbitRadius;
      const z = Math.sin(angle) * cfg.orbitRadius;
      const y = Math.sin(cfg.inclination) * Math.sin(angle * 0.5) * cfg.orbitRadius * 0.4;

      // Pulsing scale
      const pulse = reducedMotion ? 1 : 0.8 + 0.4 * Math.sin(t * 2 + cfg.phase);
      const s = cfg.size * pulse;

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      positionsRef.current[i].set(x, y, z);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={HERO_COLORS.secondary}
          emissive={HERO_COLORS.secondary}
          emissiveIntensity={0.4}
        />
      </instancedMesh>
      <ConnectionLines
        configs={configs}
        positionsRef={positionsRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

// ---------- Connection Lines ----------

const DISTANCE_THRESHOLD = 3.5;

function ConnectionLines({
  configs,
  positionsRef,
  reducedMotion,
}: {
  configs: NodeConfig[];
  positionsRef: React.RefObject<THREE.Vector3[]>;
  reducedMotion: boolean;
}) {
  const count = configs.length;
  // Recompute pairs each frame via a state-driving ref
  const [pairs, setPairs] = useState<[THREE.Vector3, THREE.Vector3][]>([]);
  const frameCounter = useRef(0);

  useFrame(() => {
    // Update every 3 frames to save performance
    frameCounter.current += 1;
    if (frameCounter.current % 3 !== 0) return;
    if (!positionsRef.current) return;

    const newPairs: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dist = positionsRef.current[i].distanceTo(positionsRef.current[j]);
        if (dist < DISTANCE_THRESHOLD) {
          newPairs.push([
            positionsRef.current[i].clone(),
            positionsRef.current[j].clone(),
          ]);
        }
      }
    }
    setPairs(newPairs);
  });

  if (reducedMotion) return null;

  return (
    <>
      {pairs.map((pair, idx) => (
        <Line
          key={idx}
          points={pair}
          color={HERO_COLORS.primary}
          lineWidth={1}
          opacity={0.15}
          transparent
        />
      ))}
    </>
  );
}

// ---------- Scene ----------

function Scene({
  isMobile,
  reducedMotion,
}: {
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const [dpr, setDpr] = useState(1.5);
  const nodeCount = isMobile ? 5 : 10;
  const configs = useMemo(() => generateNodes(nodeCount), [nodeCount]);

  return (
    <>
      <PerformanceMonitor
        bounds={() => [45, 60]}
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
      />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <pointLight position={[-10, -5, -10]} intensity={0.3} color={HERO_COLORS.deep} />
      <CentralSphere reducedMotion={reducedMotion} />
      <OrbitingNodes configs={configs} reducedMotion={reducedMotion} />
      {!isMobile && (
        <EffectComposer>
          <Bloom
            intensity={0.8}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
      {/* Apply DPR reactively — Canvas reads initial, but state drives re-render */}
      <DprUpdater dpr={dpr} />
    </>
  );
}

/** Reactively updates pixel ratio via useFrame's gl reference */
function DprUpdater({ dpr }: { dpr: number }) {
  useFrame(({ gl }) => {
    if (gl.getPixelRatio() !== dpr) {
      gl.setPixelRatio(dpr);
    }
  });
  return null;
}

// ---------- BlobHero ----------

export default function BlobHero() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ alpha: true, antialias: !isMobile }}
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene isMobile={isMobile} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
