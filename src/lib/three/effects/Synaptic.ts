/**
 * Synaptic Effect - Glowing particles with trails
 * Inspired by nimitz's Synaptic shader (twitter: @stormoid)
 * https://www.shadertoy.com/view/MdG3Dd
 *
 * Single-pass adaptation for Three.js
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

// Fullscreen vertex shader (clip-space, bypasses camera)
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

// Hash function for randomness
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

vec2 hash2(float n) {
  return fract(sin(vec2(n, n + 1.0)) * vec2(43758.5453123, 22578.1459123));
}

// Number of particles - optimized for performance
// 40×6=240 iterations (was 60×8=480)
const int NUM_PARTICLES = 40;
const int TRAIL_STEPS = 6;

// Get particle 2D position based on time
vec2 getParticlePos(float id, float time) {
  // Random starting parameters per particle
  float speed = 0.15 + hash(id * 7.1) * 0.25;
  float phase = hash(id * 13.3) * 6.28;
  float radius = 0.15 + hash(id * 17.7) * 0.25;

  float t = time * speed + phase;

  // Base orbital motion
  vec2 pos = vec2(
    sin(t * 1.1 + hash(id * 2.3) * 6.28) * radius,
    cos(t * 0.9 + hash(id * 3.7) * 6.28) * radius
  );

  // Add secondary motion
  pos.x += sin(t * 2.3 + id * 0.5) * 0.12;
  pos.y += cos(t * 1.7 + id * 0.7) * 0.15;

  // Add drift
  pos += hash2(id * 31.3) * 0.3 - 0.15;

  // Subtle attraction toward center with oscillation
  float centerPull = sin(time * 0.2 + id) * 0.3 + 0.7;
  pos *= centerPull;

  return pos;
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = iResolution.x / iResolution.y;
  uv.x *= aspect;

  // Mouse influence
  vec2 mo = (iMouse - 0.5) * 0.1;

  vec3 col = vec3(0.0);

  // Draw particles with trails
  for (int i = 0; i < NUM_PARTICLES; i++) {
    float fi = float(i);

    // Particle color - cycling through vibrant palette
    vec3 particleCol = abs(sin(vec3(2.0, 3.4, 1.2) * (iTime * 0.08 + fi * 0.025 + 2.0) + vec3(0.8, 0.0, 1.2))) * 0.7 + 0.3;

    // Draw trail by sampling multiple time points
    for (int j = 0; j < TRAIL_STEPS; j++) {
      float fj = float(j);
      float trailTime = iTime - fj * 0.04;

      vec2 pos = getParticlePos(fi, trailTime);

      // Add mouse influence
      pos += mo * (1.0 - fj / float(TRAIL_STEPS)) * 0.5;

      // Distance from current pixel to particle
      float d = length(uv - pos);

      // Glow effect - sharp core with soft falloff
      float glow = 0.003 / (d * d + 0.001);
      glow += 0.0008 / (d + 0.02);

      // Trail fade - head is brightest
      float trailFade = 1.0 - fj / float(TRAIL_STEPS);
      trailFade = trailFade * trailFade;

      // Clamp glow to prevent blowout
      glow = min(glow, 2.0);

      col += particleCol * glow * trailFade * 0.012;
    }
  }

  // Subtle vignette
  float vig = 1.0 - dot(uv * 0.8, uv * 0.8);
  vig = clamp(vig, 0.0, 1.0);
  col *= vig;

  // Background - match the dark theme
  vec3 bg = vec3(0.067, 0.067, 0.067);
  col = bg + col;

  // Soft tone mapping
  col = col / (1.0 + col * 0.3);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export class SynapticEffect {
  private manager: SceneManager;
  private THREE!: typeof THREE;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private startTime = 0;
  private mousePos = { x: 0.5, y: 0.5 };
  private targetMouse = { x: 0.5, y: 0.5 };
  private boundMouseMove: (e: MouseEvent) => void;

  constructor(manager: SceneManager) {
    this.manager = manager;
    this.THREE = manager.getTHREE();
    this.boundMouseMove = this.onMouseMove.bind(this);
  }

  private onMouseMove(e: MouseEvent): void {
    const container = this.manager.getContainer();
    const rect = container.getBoundingClientRect();
    this.targetMouse.x = (e.clientX - rect.left) / rect.width;
    this.targetMouse.y = 1.0 - (e.clientY - rect.top) / rect.height;
  }

  async init(): Promise<void> {
    const THREE = this.THREE;
    const container = this.manager.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) }
      },
      depthTest: false,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);

    const scene = this.manager.getScene();
    const camera = this.manager.getCamera();
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    scene.add(this.mesh);
    scene.background = null;

    container.addEventListener('mousemove', this.boundMouseMove);

    this.startTime = performance.now() / 1000;
  }

  update(delta: number): void {
    const time = performance.now() / 1000 - this.startTime;
    this.material.uniforms.iTime.value = time;

    // Smooth mouse follow
    this.mousePos.x += (this.targetMouse.x - this.mousePos.x) * 0.05;
    this.mousePos.y += (this.targetMouse.y - this.mousePos.y) * 0.05;
    this.material.uniforms.iMouse.value.set(this.mousePos.x, this.mousePos.y);

    // Use SceneManager's tracked dimensions (more reliable after teleportation)
    const { width, height } = this.manager.getSize();
    this.material.uniforms.iResolution.value.set(width, height);
  }

  /**
   * Force resize and update shader uniforms
   * Called after canvas teleportation or window resize
   */
  forceResize(width: number, height: number): void {
    if (width < 1 || height < 1) return;
    this.material.uniforms.iResolution.value.set(width, height);
  }

  destroy(): void {
    const container = this.manager.getContainer();
    container.removeEventListener('mousemove', this.boundMouseMove);
    this.material?.dispose();
    this.mesh?.geometry.dispose();
  }
}
