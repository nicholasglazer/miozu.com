/**
 * Snake Trails Effect - Elegant flowing lines
 * Simplified with mouse following
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

// Fullscreen vertex shader (clip-space, bypasses camera)
// Ensures quad fills viewport regardless of camera settings
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Optimized fragment shader with reduced iterations for performance
const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;

varying vec2 vUv;

// Hash function for randomness
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

float hash2(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 p = vUv - 0.5;
  float aspect = iResolution.x / iResolution.y;
  p.x *= aspect;

  // Dark background
  vec3 bg = vec3(0.067, 0.067, 0.067);
  vec3 col = vec3(0.0);

  // Draw snake trails - reduced from 44 to 20 for better performance
  // 20 snakes × 45 segments = 900 iterations (was 3960)
  for (int i = 0; i < 20; i++) {
    float fi = float(i);
    float seed = hash(fi * 17.3) * 10.0;
    float seed2 = hash(fi * 23.7) * 10.0;

    // Randomized cycle time per snake
    float cycleTime = 8.0 + hash(fi * 7.1) * 6.0;
    float snakeDelay = hash(fi * 13.3) * cycleTime;
    float localTime = mod(iTime * (0.8 + hash(fi * 5.5) * 0.6) + snakeDelay, cycleTime);

    // Head and tail progress - continuous flow
    float headT = localTime / (cycleTime * 0.7);
    float tailT = max((localTime - cycleTime * 0.25) / (cycleTime * 0.7), 0.0);

    // Allow to go beyond 1.0 to exit screen fully
    if (tailT > 1.5) continue;
    if (headT < 0.0) continue;

    // White color with slight variation
    vec3 snakeCol = vec3(0.9, 0.92, 0.95);

    // Draw trail segments - optimized from 90 to 45 for performance
    for (int j = 0; j < 45; j++) {
      float fj = float(j) / 44.0;
      float t = mix(max(tailT, -0.3), min(headT, 1.3), fj);

      // Starting position - spread across all edges
      float startX, startY, endX, endY;
      int edgeType = int(mod(fi, 4.0));

      if (edgeType == 0) {
        // Left to right
        startX = -0.7 * aspect;
        endX = 0.7 * aspect;
        startY = (hash(fi * 3.1) - 0.5) * 0.8;
        endY = (hash(fi * 4.7) - 0.5) * 0.8;
      } else if (edgeType == 1) {
        // Right to left
        startX = 0.7 * aspect;
        endX = -0.7 * aspect;
        startY = (hash(fi * 5.3) - 0.5) * 0.8;
        endY = (hash(fi * 6.1) - 0.5) * 0.8;
      } else if (edgeType == 2) {
        // Top to bottom
        startY = 0.6;
        endY = -0.6;
        startX = (hash(fi * 7.9) - 0.5) * aspect * 1.2;
        endX = (hash(fi * 8.3) - 0.5) * aspect * 1.2;
      } else {
        // Bottom to top
        startY = -0.6;
        endY = 0.6;
        startX = (hash(fi * 9.7) - 0.5) * aspect * 1.2;
        endX = (hash(fi * 10.1) - 0.5) * aspect * 1.2;
      }

      // Base position interpolation
      float x = mix(startX, endX, t);
      float y = mix(startY, endY, t);

      // Chaotic wave patterns - multiple frequencies
      float timeShift = iTime * (0.3 + hash(fi * 2.1) * 0.4);
      float wave1 = sin(t * (8.0 + seed) + seed2 + timeShift) * 0.06;
      float wave2 = sin(t * (12.0 + seed2) - seed + timeShift * 1.3) * 0.03;
      float wave3 = sin(t * (18.0 + seed * 0.5) + timeShift * 0.7) * 0.02;

      // Apply waves perpendicular to travel direction
      if (edgeType < 2) {
        y += wave1 + wave2 + wave3;
        x += sin(t * 6.0 + seed) * 0.02;
      } else {
        x += wave1 + wave2 + wave3;
        y += sin(t * 6.0 + seed) * 0.02;
      }

      // Subtle mouse influence
      vec2 mouseOff = (iMouse - 0.5) * 0.05;
      float influence = smoothstep(-0.2, 0.5, t) * smoothstep(1.2, 0.5, t);
      y += mouseOff.y * influence;
      x += mouseOff.x * influence;

      vec2 pos = vec2(x, y);
      float d = length(p - pos);

      // Thinner, sharper glow - smaller head
      float glow = 0.00008 / (d * d + 0.00002);
      glow += 0.00015 / (d * d + 0.00015);

      // Fade along trail - tapered tail, smaller head
      float brightness = fj * fj * fj * fj * 0.8 + 0.2;

      // Fade at boundaries
      float edgeFade = smoothstep(-0.2, 0.1, t) * smoothstep(1.3, 1.0, t);
      glow *= brightness * edgeFade;
      glow = min(glow, 1.2);

      col += snakeCol * glow * 0.006;
    }
  }

  vec3 finalCol = bg + col;
  gl_FragColor = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
}
`;

export class SnakeTrailsEffect {
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
      depthWrite: false,
      precision: 'mediump' // Required for mobile compatibility
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
