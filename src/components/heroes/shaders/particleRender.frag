// Particle rendering fragment shader — soft glowing dots
precision highp float;

uniform vec3 uColorPrimary;   // blue-400
uniform vec3 uColorSecondary; // blue-300
uniform vec3 uColorDeep;      // blue-700

varying float vLife;
varying float vDepth;
varying float vType;

void main() {
  // Circular point with soft edge
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;

  // Soft glow falloff
  float alpha = smoothstep(0.5, 0.0, dist);
  alpha *= alpha; // extra softness

  // Color based on particle type and depth
  vec3 color = mix(uColorPrimary, uColorSecondary, vType);
  color = mix(color, uColorDeep, (1.0 - vDepth) * 0.5);

  // Fade with life
  alpha *= smoothstep(0.0, 0.2, vLife) * (0.4 + vDepth * 0.6);

  gl_FragColor = vec4(color, alpha);
}
