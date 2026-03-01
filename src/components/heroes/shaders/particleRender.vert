// Particle rendering vertex shader — reads position from GPGPU texture
precision highp float;

uniform sampler2D uPositionTexture;
uniform float uPointSize;
uniform float uPixelRatio;

attribute vec2 aReference; // UV coords into position texture

varying float vLife;
varying float vDepth;
varying float vType;

void main() {
  vec4 posData = texture2D(uPositionTexture, aReference);

  vec2 pos = posData.xy;
  float depth = posData.z;
  vLife = posData.w;
  vDepth = depth;

  // We'll encode type from the velocity texture but pass it through position
  // For simplicity, derive type from depth threshold
  vType = step(0.7, depth);

  vec4 mvPosition = modelViewMatrix * vec4(pos, -depth * 2.0, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Size attenuation based on depth and life
  float size = uPointSize * uPixelRatio * (0.5 + depth * 0.5) * smoothstep(0.0, 0.15, vLife);
  gl_PointSize = size * (300.0 / -mvPosition.z);
}
