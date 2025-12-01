/**
 * Sinuous Original Shader Effect - Authentic flowing particle trails
 * Based on "Sinuous" by nimitz (twitter: @stormoid)
 * https://www.shadertoy.com/view/4sGSDw
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 *
 * Multi-buffer implementation with ping-pong rendering
 * Optimized: 200 particles, smaller simulation buffers
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

const quadVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Buffer A: Velocity and Position simulation (runs at small resolution)
const bufferAFrag = `
precision highp float;

uniform float iTime;
uniform float iFrame;
uniform vec2 iResolution;
uniform sampler2D iPrevBuffer;

varying vec2 vUv;

vec2 hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
  p3 += dot(p3.zxy, p3.yxz + 19.19);
  return fract(vec2(p3.x * p3.y, p3.z * p3.x)) * 2.0 - 1.0;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

const mat2 m2 = mat2(0.80, -0.60, 0.60, 0.80);

float fbm(vec2 p, float tm) {
  p *= 2.0; p -= tm;
  float z = 2.0, rz = 0.0;
  p += iTime * 0.001 + 0.1;
  for (float i = 1.0; i < 6.0; i++) {
    rz += abs((noise(p) - 0.5) * 2.0) / z;
    z *= 1.93; p = m2 * p * 2.0;
  }
  return rz;
}

vec3 updateVel(vec3 vel, vec4 pos) {
  float n1a = fbm(pos.xy, pos.w);
  float n1b = fbm(pos.yx, pos.w);
  float nn = fbm(vec2(n1a, n1b), 0.0) * 5.8 + 0.5;
  vec2 dir = vec2(cos(nn), sin(nn));
  // Bias toward top-right
  dir += vec2(0.15, 0.1);
  vel.xy = mix(vel.xy, dir * 1.5, 0.005);
  return vel;
}

void main() {
  vec2 fragCoord = vUv * iResolution;
  vec2 w = 1.0 / iResolution;

  // Only use first 60 rows for data storage
  if (fragCoord.y > 60.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec4 col = vec4(0.0);
  vec4 pos = texture2D(iPrevBuffer, vec2(vUv.x, 50.0 * w.y));
  vec3 vel = texture2D(iPrevBuffer, vec2(vUv.x, 10.0 * w.y)).xyz;

  vel = updateVel(vel, pos);
  col.w = pos.w;

  float mdf = mod(iFrame, 1601.0);

  if (fragCoord.y < 30.0) {
    // Velocity row
    if (mdf < 2.5) {
      col = vec4(0.1, 0.0, 0.0, col.w + 1.0);
    } else {
      col.rgb = vel;
    }
  } else {
    // Position row - shifted up by 0.25
    if (mdf < 2.5) {
      float n = noise(vUv * 10.0 + iTime) - 0.5;
      pos = vec4(-0.99, n + 0.25, 0.0, col.w + 1.0);
    }
    pos.xy += vel.xy * 0.002;
    col.xyz = pos.xyz;
  }

  // Initialize - shifted up by 0.25
  if (iFrame < 15.0) {
    if (fragCoord.y < 30.0) {
      col = vec4(0.1, 0.0, 0.0, 0.0);
    } else {
      col = vec4(-0.99, noise(vUv * 5.0 + 3.15) - 0.5 + 0.25, 0.0, 0.0);
    }
  }

  gl_FragColor = col;
}
`;

// Buffer B: Particle rendering with trail accumulation
const bufferBFrag = `
precision highp float;

uniform float iTime;
uniform float iFrame;
uniform vec2 iResolution;
uniform vec2 iSimRes;
uniform sampler2D iParticles;
uniform sampler2D iPrevRender;

varying vec2 vUv;

#define NUM_PARTICLES 200

float mag(vec2 p) { return dot(p, p); }

vec4 drawParticles(vec2 p) {
  vec4 rez = vec4(0.0);
  vec2 w = 1.0 / iSimRes;

  for (int i = 0; i < NUM_PARTICLES; i++) {
    float fi = float(i);
    vec2 pos = texture2D(iParticles, vec2(fi * w.x, 50.0 * w.y)).rg;
    vec2 vel = texture2D(iParticles, vec2(fi * w.x, 10.0 * w.y)).rg;

    float d = mag(p - pos);
    d *= 500.0;
    d = 0.01 / (pow(d, 1.0) + 0.001);

    vec3 col = abs(sin(vec3(2.0, 3.4, 1.2) * (iTime * 0.07 + fi * 0.0017 + 2.5) + vec3(0.8, 0.0, 1.2)) * 0.7 + 0.3);
    rez.rgb += d * col * 0.04;
  }

  return rez;
}

void main() {
  vec2 p = vUv - 0.5;
  p.x *= iResolution.x / iResolution.y;
  p *= 1.1;

  vec4 cola = drawParticles(p) * 0.05;
  vec4 colb = 1.0 - texture2D(iPrevRender, vUv);
  vec4 col = cola + colb;

  vec4 base = 1.0 - vec4(1.0, 0.98, 0.9, 0.9) * (1.0 - mag(p + vec2(-0.20, -0.3)) * 0.1);

  float mdf = mod(iFrame, 1601.0);

  // Smooth fade transition over ~60 frames instead of hard cut
  float fadeOut = smoothstep(1550.0, 1601.0, mdf);
  float fadeIn = smoothstep(0.0, 60.0, mdf);
  float fade = max(fadeOut, 1.0 - fadeIn);

  if (iFrame < 15.0) {
    col = base;
  } else {
    col = mix(col, base, fade);
  }

  gl_FragColor = 1.0 - col;
}
`;

// Final Image: Color mixing
const imageFrag = `
precision highp float;

uniform float iTime;
uniform sampler2D iChannel0;

varying vec2 vUv;

void main() {
  vec4 c = vec4(texture2D(iChannel0, vUv).rgb, 1.0);
  gl_FragColor = vec4(mix(c, 1.0 - c, smoothstep(-0.3, 0.3, sin(vUv.y + iTime * 0.0717 + 3.4))));
}
`;

export class SinuousOriginalEffect {
  private manager: SceneManager;
  private THREE!: typeof THREE;

  // Simulation resolution (small for performance)
  private simWidth = 256;
  private simHeight = 64;

  // Render targets
  private bufferA: THREE.WebGLRenderTarget[] = [];
  private bufferB: THREE.WebGLRenderTarget[] = [];
  private currentBuffer = 0;

  // Scenes
  private quadScene!: THREE.Scene;
  private quadCamera!: THREE.OrthographicCamera;
  private quad!: THREE.Mesh;

  // Materials
  private bufferAMat!: THREE.ShaderMaterial;
  private bufferBMat!: THREE.ShaderMaterial;
  private imageMat!: THREE.ShaderMaterial;

  // Main scene quad
  private mainQuad!: THREE.Mesh;

  private frame = 0;
  private startTime = 0;
  private lastWidth = 0;
  private lastHeight = 0;

  constructor(manager: SceneManager) {
    this.manager = manager;
    this.THREE = manager.getTHREE();
  }

  async init(): Promise<void> {
    const THREE = this.THREE;
    const container = this.manager.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.lastWidth = width;
    this.lastHeight = height;

    // Orthographic camera for quad rendering
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadScene = new THREE.Scene();

    // Small render targets for particle simulation (Buffer A)
    const simOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    };

    // Full-size render targets for rendering (Buffer B)
    const renderOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.HalfFloatType
    };

    for (let i = 0; i < 2; i++) {
      this.bufferA.push(new THREE.WebGLRenderTarget(this.simWidth, this.simHeight, simOptions));
      this.bufferB.push(new THREE.WebGLRenderTarget(width, height, renderOptions));
    }

    // Buffer A material (particle simulation)
    this.bufferAMat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: bufferAFrag,
      uniforms: {
        iTime: { value: 0 },
        iFrame: { value: 0 },
        iResolution: { value: new THREE.Vector2(this.simWidth, this.simHeight) },
        iPrevBuffer: { value: null }
      }
    });

    // Buffer B material (particle rendering)
    this.bufferBMat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: bufferBFrag,
      uniforms: {
        iTime: { value: 0 },
        iFrame: { value: 0 },
        iResolution: { value: new THREE.Vector2(width, height) },
        iSimRes: { value: new THREE.Vector2(this.simWidth, this.simHeight) },
        iParticles: { value: null },
        iPrevRender: { value: null }
      }
    });

    // Final image material
    this.imageMat = new THREE.ShaderMaterial({
      vertexShader: quadVert,
      fragmentShader: imageFrag,
      uniforms: {
        iTime: { value: 0 },
        iChannel0: { value: null }
      }
    });

    // Quad for offscreen rendering
    const geom = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geom, this.bufferAMat);
    this.quadScene.add(this.quad);

    // Quad for main scene display
    this.mainQuad = new THREE.Mesh(geom.clone(), this.imageMat);

    const mainScene = this.manager.getScene();
    const mainCamera = this.manager.getCamera();
    mainCamera.position.set(0, 0, 1);
    mainCamera.lookAt(0, 0, 0);
    mainScene.add(this.mainQuad);
    mainScene.background = null;

    this.startTime = performance.now() / 1000;
  }

  update(delta: number): void {
    const renderer = this.manager.getRenderer();
    const time = performance.now() / 1000 - this.startTime;

    const container = this.manager.getContainer();
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Resize bufferB render targets if container size changed
    if (width !== this.lastWidth || height !== this.lastHeight) {
      for (const target of this.bufferB) {
        target.setSize(width, height);
      }
      this.lastWidth = width;
      this.lastHeight = height;
    }

    const prev = this.currentBuffer;
    const next = 1 - this.currentBuffer;

    // Update Buffer A (particle simulation)
    this.bufferAMat.uniforms.iTime.value = time;
    this.bufferAMat.uniforms.iFrame.value = this.frame;
    this.bufferAMat.uniforms.iPrevBuffer.value = this.bufferA[prev].texture;

    this.quad.material = this.bufferAMat;
    renderer.setRenderTarget(this.bufferA[next]);
    renderer.render(this.quadScene, this.quadCamera);

    // Update Buffer B (particle rendering)
    this.bufferBMat.uniforms.iTime.value = time;
    this.bufferBMat.uniforms.iFrame.value = this.frame;
    this.bufferBMat.uniforms.iResolution.value.set(width, height);
    this.bufferBMat.uniforms.iParticles.value = this.bufferA[next].texture;
    this.bufferBMat.uniforms.iPrevRender.value = this.bufferB[prev].texture;

    this.quad.material = this.bufferBMat;
    renderer.setRenderTarget(this.bufferB[next]);
    renderer.render(this.quadScene, this.quadCamera);

    // Update final image material
    this.imageMat.uniforms.iTime.value = time;
    this.imageMat.uniforms.iChannel0.value = this.bufferB[next].texture;

    renderer.setRenderTarget(null);

    this.currentBuffer = next;
    this.frame++;
  }

  destroy(): void {
    this.bufferA.forEach(rt => rt.dispose());
    this.bufferB.forEach(rt => rt.dispose());
    this.bufferAMat?.dispose();
    this.bufferBMat?.dispose();
    this.imageMat?.dispose();
    this.quad?.geometry.dispose();
    this.mainQuad?.geometry.dispose();
  }
}
