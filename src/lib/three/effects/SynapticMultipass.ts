/**
 * Synaptic Multi-pass Effect - Authentic port from Shadertoy
 * Original by nimitz (twitter: @stormoid)
 * https://www.shadertoy.com/view/MdG3Dd
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 *
 * Uses ping-pong buffers for particle simulation:
 * - Buffer A: Particle velocity and position handling
 * - Buffer B: Rendering with feedback
 * - Final: Output from Buffer B
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

// Buffer A - Particle velocity and position simulation
const bufferAFragment = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D iChannel0; // Self (previous frame)
uniform sampler2D iChannel1; // Noise texture
uniform int iFrame;

varying vec2 vUv;

#define time iTime

vec3 hash3(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p.zxy, p.yxz + 19.1);
  return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z)) - 0.5;
}

vec3 update(in vec3 vel, vec3 pos, in float id) {
  vel.xyz = vel.xyz * 0.999 + (hash3(vel.xyz + time) * 2.0) * 7.0;

  float d = pow(length(pos) * 1.2, 0.75);
  vel.xyz = mix(vel.xyz, -pos * d, sin(-time * 0.55) * 0.5 + 0.5);

  return vel;
}

void main() {
  vec2 fragCoord = vUv * iResolution;
  vec2 q = vUv;

  vec4 col = vec4(0.0);
  vec2 w = 1.0 / iResolution.xy;

  vec3 pos = texture2D(iChannel0, vec2(q.x, 100.0 * w.y)).xyz;
  vec3 velo = texture2D(iChannel0, vec2(q.x, 0.0)).xyz;
  velo = update(velo, pos, q.x);

  if (fragCoord.y < 30.0) {
    col.rgb = velo;
  } else {
    pos.rgb += velo * 0.002;
    col.rgb = pos.rgb;
  }

  // Init
  if (iFrame < 10) {
    if (fragCoord.y < 30.0) {
      col = (texture2D(iChannel1, q * 1.9) - 0.5) * 10.0;
    } else {
      col = (texture2D(iChannel1, q * 1.9) - 0.5) * 0.5;
    }
  }

  gl_FragColor = col;
}
`;

// Buffer B - Rendering with feedback
const bufferBFragment = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D iChannel0; // Buffer A (particle data)
uniform sampler2D iChannel1; // Self (previous frame for feedback)
uniform int iFrame;

varying vec2 vUv;

#define time iTime

// Further optimized: 35×3=105 iterations (was 50×4=200)
const int numParticles = 35;
const int stepsPerFrame = 3;

float mag(vec3 p) { return dot(p, p); }

vec4 drawParticles(in vec3 ro, in vec3 rd) {
  vec4 rez = vec4(0.0);
  vec2 w = 1.0 / iResolution.xy;

  for (int i = 0; i < numParticles; i++) {
    vec3 pos = texture2D(iChannel0, vec2(float(i) * w.x, 100.0 * w.y)).rgb;
    vec3 vel = texture2D(iChannel0, vec2(float(i) * w.x, 0.0)).rgb;

    for (int j = 0; j < stepsPerFrame; j++) {
      float d = mag((ro + rd * dot(pos.xyz - ro, rd)) - pos.xyz);
      d *= 1000.0;
      d = 0.14 / (pow(d, 1.1) + 0.03);

      rez.rgb += d * abs(sin(vec3(2.0, 3.4, 1.2) * (time * 0.06 + float(i) * 0.003 + 2.0) + vec3(0.8, 0.0, 1.2)) * 0.7 + 0.3) * 0.04;
      pos.xyz += vel * 0.002 * 0.2;
    }
  }
  rez /= float(stepsPerFrame);

  return rez;
}

void main() {
  vec2 q = vUv;
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x / iResolution.y;

  vec2 mo = iMouse - 0.5;
  mo = (mo == vec2(-0.5)) ? vec2(-0.15, 0.0) : mo;
  mo.x *= iResolution.x / iResolution.y;
  mo *= 6.14;

  vec3 ro = vec3(0.0, 0.0, 2.5);
  vec3 rd = normalize(vec3(p, -0.5));

  vec4 cola = drawParticles(ro, rd);
  vec4 colb = texture2D(iChannel1, q);

  // Feedback
  vec4 col = cola + colb;
  col *= 0.9975;

  if (iFrame < 5) col = vec4(0.0);

  gl_FragColor = col;
}
`;

// Final output shader
const finalFragment = `
precision highp float;

uniform sampler2D iChannel0; // Buffer B
uniform vec2 iResolution;

varying vec2 vUv;

void main() {
  vec3 col = texture2D(iChannel0, vUv).rgb;

  // Add subtle vignette
  vec2 p = vUv - 0.5;
  float vig = 1.0 - dot(p * 1.2, p * 1.2);
  vig = clamp(vig, 0.0, 1.0);
  col *= vig;

  // Background blend
  vec3 bg = vec3(0.067, 0.067, 0.067);
  col = bg + col;

  // Tone mapping
  col = col / (1.0 + col * 0.3);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export class SynapticMultipassEffect {
  private manager: SceneManager;
  private THREE!: typeof THREE;

  // Render targets for ping-pong
  private bufferATargets!: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private bufferBTargets!: [THREE.WebGLRenderTarget, THREE.WebGLRenderTarget];
  private currentBufferA = 0;
  private currentBufferB = 0;

  // Materials
  private bufferAMaterial!: THREE.ShaderMaterial;
  private bufferBMaterial!: THREE.ShaderMaterial;
  private finalMaterial!: THREE.ShaderMaterial;

  // Scenes and meshes for each pass
  private bufferAScene!: THREE.Scene;
  private bufferBScene!: THREE.Scene;
  private finalMesh!: THREE.Mesh;

  // Noise texture
  private noiseTexture!: THREE.DataTexture;

  private orthoCamera!: THREE.OrthographicCamera;
  private startTime = 0;
  private frameCount = 0;
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

  // Resolution scale for render targets (1.0 = full resolution)
  private readonly BUFFER_SCALE = 1.0;

  private createNoiseTexture(): THREE.DataTexture {
    const THREE = this.THREE;
    const size = 128; // Reduced from 256 for performance
    const data = new Float32Array(size * size * 4);

    for (let i = 0; i < size * size; i++) {
      data[i * 4 + 0] = Math.random();
      data[i * 4 + 1] = Math.random();
      data[i * 4 + 2] = Math.random();
      data[i * 4 + 3] = 1.0;
    }

    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    texture.needsUpdate = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    return texture;
  }

  private createRenderTarget(width: number, height: number): THREE.WebGLRenderTarget {
    const THREE = this.THREE;
    return new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
      depthBuffer: false, // Not needed for 2D shaders
      stencilBuffer: false
    });
  }

  async init(): Promise<void> {
    const THREE = this.THREE;
    const container = this.manager.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create orthographic camera for full-screen passes
    this.orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Create noise texture
    this.noiseTexture = this.createNoiseTexture();

    // Create ping-pong render targets at reduced resolution
    const bufferWidth = Math.floor(width * this.BUFFER_SCALE);
    const bufferHeight = Math.floor(height * this.BUFFER_SCALE);
    this.bufferATargets = [
      this.createRenderTarget(bufferWidth, bufferHeight),
      this.createRenderTarget(bufferWidth, bufferHeight)
    ];
    this.bufferBTargets = [
      this.createRenderTarget(bufferWidth, bufferHeight),
      this.createRenderTarget(bufferWidth, bufferHeight)
    ];

    const geometry = new THREE.PlaneGeometry(2, 2);

    // Buffer A material (particle simulation)
    this.bufferAMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: bufferAFragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
        iChannel0: { value: null },
        iChannel1: { value: this.noiseTexture },
        iFrame: { value: 0 }
      }
    });

    this.bufferAScene = new THREE.Scene();
    this.bufferAScene.add(new THREE.Mesh(geometry, this.bufferAMaterial));

    // Buffer B material (rendering with feedback)
    this.bufferBMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: bufferBFragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
        iMouse: { value: new THREE.Vector2(0.5, 0.5) },
        iChannel0: { value: null },
        iChannel1: { value: null },
        iFrame: { value: 0 }
      }
    });

    this.bufferBScene = new THREE.Scene();
    this.bufferBScene.add(new THREE.Mesh(geometry, this.bufferBMaterial));

    // Final output material
    this.finalMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: finalFragment,
      uniforms: {
        iChannel0: { value: null },
        iResolution: { value: new THREE.Vector2(width, height) }
      }
    });

    this.finalMesh = new THREE.Mesh(geometry, this.finalMaterial);

    const scene = this.manager.getScene();
    const camera = this.manager.getCamera();
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    scene.add(this.finalMesh);
    scene.background = null;

    container.addEventListener('mousemove', this.boundMouseMove);

    this.startTime = performance.now() / 1000;
  }

  update(delta: number): void {
    const renderer = this.manager.getRenderer();
    const time = performance.now() / 1000 - this.startTime;

    // Update mouse
    this.mousePos.x += (this.targetMouse.x - this.mousePos.x) * 0.05;
    this.mousePos.y += (this.targetMouse.y - this.mousePos.y) * 0.05;

    // Use SceneManager's tracked dimensions (more reliable after teleportation)
    const { width, height } = this.manager.getSize();

    // Skip rendering if dimensions are invalid (prevents framebuffer errors)
    if (width < 1 || height < 1) return;

    // Resize targets if needed (at scaled resolution)
    const bufferWidth = Math.max(1, Math.floor(width * this.BUFFER_SCALE));
    const bufferHeight = Math.max(1, Math.floor(height * this.BUFFER_SCALE));
    if (this.bufferATargets[0].width !== bufferWidth || this.bufferATargets[0].height !== bufferHeight) {
      for (const target of [...this.bufferATargets, ...this.bufferBTargets]) {
        target.setSize(bufferWidth, bufferHeight);
      }
    }

    // Update uniforms - use buffer resolution for shaders
    const resolution = new this.THREE.Vector2(bufferWidth, bufferHeight);

    // --- Pass 1: Buffer A (particle simulation) ---
    const prevBufferA = this.bufferATargets[this.currentBufferA];
    const nextBufferA = this.bufferATargets[1 - this.currentBufferA];

    this.bufferAMaterial.uniforms.iTime.value = time;
    this.bufferAMaterial.uniforms.iResolution.value = resolution;
    this.bufferAMaterial.uniforms.iChannel0.value = prevBufferA.texture;
    this.bufferAMaterial.uniforms.iFrame.value = this.frameCount;

    renderer.setRenderTarget(nextBufferA);
    renderer.render(this.bufferAScene, this.orthoCamera);

    this.currentBufferA = 1 - this.currentBufferA;

    // --- Pass 2: Buffer B (rendering with feedback) ---
    const prevBufferB = this.bufferBTargets[this.currentBufferB];
    const nextBufferB = this.bufferBTargets[1 - this.currentBufferB];

    this.bufferBMaterial.uniforms.iTime.value = time;
    this.bufferBMaterial.uniforms.iResolution.value = resolution;
    this.bufferBMaterial.uniforms.iMouse.value.set(this.mousePos.x, this.mousePos.y);
    this.bufferBMaterial.uniforms.iChannel0.value = nextBufferA.texture;
    this.bufferBMaterial.uniforms.iChannel1.value = prevBufferB.texture;
    this.bufferBMaterial.uniforms.iFrame.value = this.frameCount;

    renderer.setRenderTarget(nextBufferB);
    renderer.render(this.bufferBScene, this.orthoCamera);

    this.currentBufferB = 1 - this.currentBufferB;

    // --- Pass 3: Final output ---
    this.finalMaterial.uniforms.iChannel0.value = nextBufferB.texture;
    this.finalMaterial.uniforms.iResolution.value = resolution;

    renderer.setRenderTarget(null);

    this.frameCount++;
  }

  /**
   * Force resize render targets and update shader uniforms
   * Called after canvas teleportation or window resize
   */
  forceResize(width: number, height: number): void {
    if (width < 1 || height < 1) return;

    const bufferWidth = Math.max(1, Math.floor(width * this.BUFFER_SCALE));
    const bufferHeight = Math.max(1, Math.floor(height * this.BUFFER_SCALE));

    // Resize all render targets
    for (const target of [...this.bufferATargets, ...this.bufferBTargets]) {
      target.setSize(bufferWidth, bufferHeight);
    }

    // Update shader uniforms
    const resolution = new this.THREE.Vector2(bufferWidth, bufferHeight);
    this.bufferAMaterial.uniforms.iResolution.value = resolution;
    this.bufferBMaterial.uniforms.iResolution.value = resolution;
    this.finalMaterial.uniforms.iResolution.value = resolution;
  }

  destroy(): void {
    const container = this.manager.getContainer();
    container.removeEventListener('mousemove', this.boundMouseMove);

    // Dispose render targets
    for (const target of [...this.bufferATargets, ...this.bufferBTargets]) {
      target.dispose();
    }

    // Dispose materials
    this.bufferAMaterial?.dispose();
    this.bufferBMaterial?.dispose();
    this.finalMaterial?.dispose();

    // Dispose noise texture
    this.noiseTexture?.dispose();

    // Dispose geometry
    this.finalMesh?.geometry.dispose();
  }
}
