/**
 * Sinuous-inspired Shader Effect - Flowing particle trails
 * Inspired by "Sinuous" by nimitz (twitter: @stormoid)
 * https://www.shadertoy.com/view/4sGSDw
 *
 * Optimized single-pass version for great performance
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
uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

#define PI 3.14159265359

// Fast hash function
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Simple value noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fast FBM with only 3 octaves
float fbm(vec2 p) {
  float f = 0.0;
  f += 0.5 * noise(p); p *= 2.01;
  f += 0.25 * noise(p); p *= 2.02;
  f += 0.125 * noise(p);
  return f;
}

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = iResolution.x / iResolution.y;
  uv.x *= aspect;

  float t = iTime * 0.12;
  vec3 col = vec3(0.0);

  // Draw 12 flowing sinuous lines - optimized
  for (int i = 0; i < 12; i++) {
    float fi = float(i);
    float phase = fi * 0.5 + t;

    // Create flowing curve using sine waves
    vec2 linePos = uv;
    linePos.x += sin(linePos.y * 3.5 + phase) * 0.25;
    linePos.y += cos(linePos.x * 2.5 + phase * 0.8) * 0.15;

    // Add noise-based distortion for organic feel
    float n = fbm(linePos * 2.5 + vec2(t * 0.3, fi * 0.7));
    linePos += vec2(cos(n * PI * 2.0), sin(n * PI * 2.0)) * 0.12;

    // Calculate distance to a curved sinuous line
    float curve = sin(linePos.x * 5.0 + t * 1.2 + fi * 0.8) * 0.25 + linePos.y;
    float d = abs(curve);

    // Soft glow falloff
    float glow = 0.004 / (d * d + 0.002);

    // Fade at edges
    glow *= smoothstep(0.9, 0.3, abs(linePos.x));

    // Sinuous-style rainbow color cycling
    vec3 lineCol = 0.5 + 0.5 * cos(
      vec3(2.0, 3.4, 1.2) * (t * 0.4 + fi * 0.25 + 2.5) +
      vec3(0.8, 0.0, 1.2)
    );

    col += glow * lineCol * 0.12;
  }

  // Tone mapping
  col = 1.0 - exp(-col * 1.2);

  // Cream/white background with subtle gradient
  vec2 bgOffset = uv + vec2(-0.12, -0.15);
  float bgGrad = 1.0 - length(bgOffset) * 0.2;
  vec3 bg = vec3(0.97, 0.95, 0.91) * bgGrad;

  // Composite: colored trails subtracted from light background
  vec3 finalCol = bg - col * 0.6;
  finalCol = max(finalCol, vec3(0.0));

  // Signature Sinuous color shift based on y position
  float shift = smoothstep(-0.3, 0.3, sin(vUv.y * 1.8 + iTime * 0.0717 + 3.4));
  finalCol = mix(finalCol, 1.0 - finalCol, shift * 0.08);

  gl_FragColor = vec4(finalCol, 1.0);
}
`;

export class SinuousShaderEffect {
  private manager: SceneManager;
  private THREE!: typeof THREE;
  private mesh!: THREE.Mesh;
  private material!: THREE.ShaderMaterial;
  private startTime: number = 0;

  constructor(manager: SceneManager) {
    this.manager = manager;
    this.THREE = manager.getTHREE();
  }

  async init(): Promise<void> {
    const { PlaneGeometry, ShaderMaterial, Mesh, Vector2 } = this.THREE;
    const scene = this.manager.getScene();
    const camera = this.manager.getCamera();

    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    const container = this.manager.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vector2(width, height) }
      },
      depthTest: false,
      depthWrite: false,
      precision: 'mediump' // Required for mobile compatibility
    });

    const geometry = new PlaneGeometry(2, 2);
    this.mesh = new Mesh(geometry, this.material);
    scene.add(this.mesh);

    scene.background = null;
    this.startTime = performance.now() / 1000;
  }

  update(delta: number): void {
    const elapsed = performance.now() / 1000 - this.startTime;
    this.material.uniforms.iTime.value = elapsed;

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
    if (this.mesh) {
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
    }
  }
}
