// Variant A: GPGPU particle constellation with FBO ping-pong simulation
// Hub nodes as InstancedMesh, bloom postprocessing, adaptive quality
import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor, Line } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useIsMobile } from './hooks/useIsMobile';
import { useReducedMotion } from './hooks/useReducedMotion';
import { HERO_COLORS } from './types';

// GLSL shaders
import particleSimVert from './shaders/particleSim.vert';
import particleSimFrag from './shaders/particleSim.frag';
import particleRenderVert from './shaders/particleRender.vert';
import particleRenderFrag from './shaders/particleRender.frag';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PARTICLE_COUNT_DESKTOP = 8000;
const PARTICLE_COUNT_MOBILE = 3000;
const TEX_SIZE_DESKTOP = Math.ceil(Math.sqrt(PARTICLE_COUNT_DESKTOP)); // 90
const TEX_SIZE_MOBILE = Math.ceil(Math.sqrt(PARTICLE_COUNT_MOBILE));   // 55
const HUB_COUNT = 20;

const COLOR_PRIMARY = new THREE.Color(HERO_COLORS.primary);
const COLOR_SECONDARY = new THREE.Color(HERO_COLORS.secondary);
const COLOR_DEEP = new THREE.Color(HERO_COLORS.deep);

// ---------------------------------------------------------------------------
// Helpers — generate initial data textures
// ---------------------------------------------------------------------------
function createPositionData(size: number): Float32Array {
  const data = new Float32Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const i4 = i * 4;
    data[i4] = (Math.random() - 0.5) * 3.0;     // x
    data[i4 + 1] = (Math.random() - 0.5) * 3.0; // y
    data[i4 + 2] = Math.random() * 0.8 + 0.2;   // depth (0.2–1.0)
    data[i4 + 3] = Math.random() * 0.8 + 0.4;   // life (0.4–1.2)
  }
  return data;
}

function createVelocityData(size: number): Float32Array {
  const data = new Float32Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const i4 = i * 4;
    data[i4] = (Math.random() - 0.5) * 0.2;     // vx
    data[i4 + 1] = (Math.random() - 0.5) * 0.2; // vy
    data[i4 + 2] = 0;                             // unused
    data[i4 + 3] = Math.random() > 0.7 ? 1.0 : 0.0; // particle type
  }
  return data;
}

function makeDataTexture(data: Float32Array, size: number): THREE.DataTexture {
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
  tex.needsUpdate = true;
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

function createRenderTarget(size: number): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false,
  });
}

// ---------------------------------------------------------------------------
// Generate hub node positions in a spread constellation pattern
// ---------------------------------------------------------------------------
function generateHubPositions(count: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const golden = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / golden;
    const r = 0.4 + Math.sqrt(i / count) * 1.6;
    positions.push(new THREE.Vector3(
      Math.cos(theta) * r,
      Math.sin(theta) * r,
      -(Math.random() * 1.5 + 0.5)
    ));
  }
  return positions;
}

// ---------------------------------------------------------------------------
// Generate hub-to-hub connections (nearest neighbours, max distance)
// ---------------------------------------------------------------------------
function generateConnections(hubs: THREE.Vector3[]): [THREE.Vector3, THREE.Vector3][] {
  const lines: [THREE.Vector3, THREE.Vector3][] = [];
  const maxDist = 1.6;
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      if (hubs[i].distanceTo(hubs[j]) < maxDist) {
        lines.push([hubs[i], hubs[j]]);
      }
    }
  }
  return lines;
}

// ---------------------------------------------------------------------------
// GPGPU Simulation component (renders to offscreen FBOs)
// ---------------------------------------------------------------------------
interface SimulationProps {
  texSize: number;
  positionRef: React.MutableRefObject<THREE.WebGLRenderTarget | null>;
  reducedMotion: boolean;
  mouseRef: React.MutableRefObject<{ x: number; y: number; active: boolean }>;
}

function Simulation({ texSize, positionRef, reducedMotion, mouseRef }: SimulationProps) {
  const { gl } = useThree();

  // Create ping-pong render targets
  const rtA = useMemo(() => createRenderTarget(texSize), [texSize]);
  const rtB = useMemo(() => createRenderTarget(texSize), [texSize]);
  const velocityRT = useMemo(() => createRenderTarget(texSize), [texSize]);

  // Current target toggle
  const pingPongRef = useRef(0);

  // Initialize data textures
  const initPosTex = useMemo(() => makeDataTexture(createPositionData(texSize), texSize), [texSize]);
  const initVelTex = useMemo(() => makeDataTexture(createVelocityData(texSize), texSize), [texSize]);

  // Fullscreen quad mesh for simulation
  const simMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleSimVert,
    fragmentShader: particleSimFrag,
    uniforms: {
      uPositions: { value: initPosTex },
      uVelocities: { value: initVelTex },
      uTime: { value: 0 },
      uDelta: { value: 0.016 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseActive: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    },
    depthTest: false,
    depthWrite: false,
  }), [initPosTex, initVelTex]);

  const quadGeo = useMemo(() => new THREE.PlaneGeometry(2, 2), []);
  const camera = useMemo(() => {
    const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cam.position.z = 0.5;
    return cam;
  }, []);

  // Offscreen scene for simulation
  const simScene = useMemo(() => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(quadGeo, simMaterial);
    scene.add(mesh);
    return scene;
  }, [quadGeo, simMaterial]);

  // Seed initial state into FBOs on first frame
  const seeded = useRef(false);

  useFrame((state, delta) => {
    if (!seeded.current) {
      // Render initial data into rtA by using the init textures
      const renderer = gl;
      simMaterial.uniforms.uPositions.value = initPosTex;
      simMaterial.uniforms.uVelocities.value = initVelTex;
      simMaterial.uniforms.uDelta.value = 0;
      renderer.setRenderTarget(rtA);
      renderer.render(simScene, camera);

      // Also render velocity init
      // For velocity we need a separate pass — but we store velocity data in
      // the velocity RT directly
      const velData = createVelocityData(texSize);
      const velTex = makeDataTexture(velData, texSize);
      // Copy velocity data texture to RT by rendering it
      const copyMat = new THREE.ShaderMaterial({
        vertexShader: particleSimVert,
        fragmentShader: `
          precision highp float;
          uniform sampler2D uSource;
          varying vec2 vUv;
          void main() { gl_FragColor = texture2D(uSource, vUv); }
        `,
        uniforms: { uSource: { value: velTex } },
        depthTest: false,
        depthWrite: false,
      });
      const copyMesh = new THREE.Mesh(quadGeo, copyMat);
      const copyScene = new THREE.Scene();
      copyScene.add(copyMesh);
      renderer.setRenderTarget(velocityRT);
      renderer.render(copyScene, camera);
      renderer.setRenderTarget(null);
      copyMat.dispose();
      velTex.dispose();

      positionRef.current = rtA;
      seeded.current = true;
      return;
    }

    if (reducedMotion) return;

    const current = pingPongRef.current === 0 ? rtA : rtB;
    const next = pingPongRef.current === 0 ? rtB : rtA;

    // Update uniforms
    simMaterial.uniforms.uPositions.value = current.texture;
    simMaterial.uniforms.uVelocities.value = velocityRT.texture;
    simMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    simMaterial.uniforms.uDelta.value = Math.min(delta, 0.05);
    simMaterial.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    simMaterial.uniforms.uMouseActive.value = mouseRef.current.active ? 1.0 : 0.0;

    // Run simulation — write new positions to `next`
    gl.setRenderTarget(next);
    gl.render(simScene, camera);
    gl.setRenderTarget(null);

    // Swap
    pingPongRef.current = 1 - pingPongRef.current;
    positionRef.current = next;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      rtA.dispose();
      rtB.dispose();
      velocityRT.dispose();
      initPosTex.dispose();
      initVelTex.dispose();
      simMaterial.dispose();
      quadGeo.dispose();
    };
  }, [rtA, rtB, velocityRT, initPosTex, initVelTex, simMaterial, quadGeo]);

  return null;
}

// ---------------------------------------------------------------------------
// Particle rendering component
// ---------------------------------------------------------------------------
interface ParticlesProps {
  texSize: number;
  particleCount: number;
  positionRef: React.MutableRefObject<THREE.WebGLRenderTarget | null>;
  isMobile: boolean;
}

function Particles({ texSize, particleCount, positionRef, isMobile }: ParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  // Create reference UVs for each particle to look up its position in the texture
  const references = useMemo(() => {
    const refs = new Float32Array(particleCount * 2);
    for (let i = 0; i < particleCount; i++) {
      const col = i % texSize;
      const row = Math.floor(i / texSize);
      refs[i * 2] = (col + 0.5) / texSize;
      refs[i * 2 + 1] = (row + 0.5) / texSize;
    }
    return refs;
  }, [particleCount, texSize]);

  // Dummy position buffer (positions come from texture in vertex shader)
  const positions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: particleRenderVert,
    fragmentShader: particleRenderFrag,
    uniforms: {
      uPositionTexture: { value: null },
      uPointSize: { value: isMobile ? 3.0 : 4.0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uColorPrimary: { value: COLOR_PRIMARY },
      uColorSecondary: { value: COLOR_SECONDARY },
      uColorDeep: { value: COLOR_DEEP },
    },
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
  }), [isMobile]);

  useFrame(() => {
    if (positionRef.current && material) {
      material.uniforms.uPositionTexture.value = positionRef.current.texture;
    }
  });

  useEffect(() => {
    return () => { material.dispose(); };
  }, [material]);

  // Update pixel ratio on viewport change
  useEffect(() => {
    material.uniforms.uPixelRatio.value = Math.min(viewport.dpr, 2);
  }, [viewport.dpr, material]);

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-aReference"
          args={[references, 2]}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Hub nodes (InstancedMesh with pulsing animation)
// ---------------------------------------------------------------------------
function HubNodes({ hubs }: { hubs: THREE.Vector3[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const baseScales = useMemo(
    () => hubs.map(() => 0.015 + Math.random() * 0.015),
    [hubs]
  );
  const phaseOffsets = useMemo(
    () => hubs.map(() => Math.random() * Math.PI * 2),
    [hubs]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < hubs.length; i++) {
      dummy.position.copy(hubs[i]);
      const pulse = 1.0 + Math.sin(t * 1.5 + phaseOffsets[i]) * 0.3;
      const s = baseScales[i] * pulse;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, hubs.length]} frustumCulled={false}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshBasicMaterial color={HERO_COLORS.primary} transparent opacity={0.8} toneMapped={false} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Hub connections (faint lines between nearby hubs)
// ---------------------------------------------------------------------------
function HubConnections({ connections }: { connections: [THREE.Vector3, THREE.Vector3][] }) {
  return (
    <>
      {connections.map((pair, i) => (
        <Line
          key={i}
          points={[pair[0], pair[1]]}
          color={HERO_COLORS.deep}
          lineWidth={0.5}
          transparent
          opacity={0.12}
        />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene content — assembles simulation, particles, hubs, postprocessing
// ---------------------------------------------------------------------------
interface SceneContentProps {
  isMobile: boolean;
  reducedMotion: boolean;
}

function SceneContent({ isMobile, reducedMotion }: SceneContentProps) {
  const texSize = isMobile ? TEX_SIZE_MOBILE : TEX_SIZE_DESKTOP;
  const particleCount = texSize * texSize;

  const positionRef = useRef<THREE.WebGLRenderTarget | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const { size } = useThree();

  // Mouse tracking
  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      mouseRef.current.x = (e.clientX / size.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY / size.height) * 2 - 1);
      mouseRef.current.active = true;
    };
    const handleLeave = () => {
      mouseRef.current.active = false;
    };
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerleave', handleLeave);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerleave', handleLeave);
    };
  }, [size]);

  // Hub data (stable across renders)
  const hubs = useMemo(() => generateHubPositions(HUB_COUNT), []);
  const connections = useMemo(() => generateConnections(hubs), [hubs]);

  return (
    <>
      <Simulation
        texSize={texSize}
        positionRef={positionRef}
        reducedMotion={reducedMotion}
        mouseRef={mouseRef}
      />
      <Particles
        texSize={texSize}
        particleCount={particleCount}
        positionRef={positionRef}
        isMobile={isMobile}
      />
      <HubNodes hubs={hubs} />
      <HubConnections connections={connections} />
      <EffectComposer>
        <Bloom
          intensity={1.0}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.8}
        />
      </EffectComposer>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
export default function ConstellationHero() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const [dpr, setDpr] = useState(Math.min(window.devicePixelRatio, 1.5));

  const handleIncline = useCallback(() => {
    setDpr(Math.min(window.devicePixelRatio, 2));
  }, []);

  const handleDecline = useCallback(() => {
    setDpr((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  return (
    <div className="absolute inset-0" style={{ background: 'transparent' }}>
      <Canvas
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: false,
        }}
        camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 20 }}
        style={{ background: 'transparent' }}
      >
        <PerformanceMonitor
          onIncline={handleIncline}
          onDecline={handleDecline}
          flipflops={3}
          bounds={() => [30, 60]}
        >
          <SceneContent isMobile={isMobile} reducedMotion={reducedMotion} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
