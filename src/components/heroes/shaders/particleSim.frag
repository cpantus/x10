// GPGPU particle simulation — reads previous state, writes new state
precision highp float;

uniform sampler2D uPositions;
uniform sampler2D uVelocities;
uniform float uTime;
uniform float uDelta;
uniform vec2 uMouse;        // normalized -1..1
uniform float uMouseActive; // 0 or 1
uniform vec2 uResolution;   // viewport aspect

varying vec2 vUv;

// --- Simplex noise helpers ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x_ = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x_) - 0.5;
  vec3 ox = floor(x_ + 0.5);
  vec3 a0 = x_ - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Hash for pseudo-random respawn
float hash(float n) { return fract(sin(n) * 43758.5453123); }

void main() {
  vec4 pos = texture2D(uPositions, vUv);
  vec4 vel = texture2D(uVelocities, vUv);

  vec2 p = pos.xy;
  float depth = pos.z;
  float life = pos.w;
  vec2 v = vel.xy;
  float particleType = vel.w;

  float dt = min(uDelta, 0.05); // clamp to prevent explosions

  // --- Forces ---

  // 1. Gentle drift (slight upward + lateral)
  vec2 drift = vec2(0.0, 0.02) * dt;

  // 2. Turbulence via simplex noise
  float noiseScale = 1.5;
  float nx = snoise(vec2(p.x * noiseScale + uTime * 0.15, p.y * noiseScale));
  float ny = snoise(vec2(p.x * noiseScale, p.y * noiseScale + uTime * 0.15 + 100.0));
  vec2 turbulence = vec2(nx, ny) * 0.4 * dt;

  // 3. Mouse gravitational pull
  if (uMouseActive > 0.5) {
    vec2 toMouse = uMouse - p;
    float dist = length(toMouse);
    float strength = 0.8 / (dist * dist + 0.1);
    strength = min(strength, 2.0);
    v += normalize(toMouse) * strength * dt;
  }

  // Apply forces
  v += drift + turbulence;

  // Damping
  v *= 0.98;

  // Integrate position
  p += v * dt;

  // Decrease life
  life -= dt * 0.08;

  // --- Respawn check ---
  float boundCheck = step(2.5, abs(p.x)) + step(2.5, abs(p.y)) + step(0.0, -life);
  if (boundCheck > 0.0) {
    // Respawn near center
    float seed = vUv.x * 1000.0 + vUv.y * 7777.0 + uTime * 13.0;
    p.x = (hash(seed) - 0.5) * 1.5;
    p.y = (hash(seed + 1.0) - 0.5) * 1.5;
    depth = hash(seed + 2.0) * 0.8 + 0.2;
    life = 0.8 + hash(seed + 3.0) * 0.4;
    v = vec2((hash(seed + 4.0) - 0.5) * 0.3, (hash(seed + 5.0) - 0.5) * 0.3);
    particleType = step(0.7, hash(seed + 6.0)); // 30% are type 1
  }

  gl_FragColor = vec4(p, depth, life);
}
