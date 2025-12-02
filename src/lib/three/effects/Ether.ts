/**
 * Ether Effect - Glowing orb shader
 * Based on "Ether" by nimitz 2014 (twitter: @stormoid)
 * https://www.shadertoy.com/view/MsjSW3
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported
 */

import type * as THREE from 'three';
import type { SceneManager } from '../SceneManager';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

#define t iTime

mat2 m(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

float map(vec3 p) {
  p.xz *= m(t * 0.4);
  p.xy *= m(t * 0.3);
  vec3 q = p * 2.0 + t;
  return length(p + vec3(sin(t * 0.7))) * log(length(p) + 1.0) + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
}

void main() {
  vec2 fragCoord = vUv * iResolution;

  // Smart aspect ratio handling - center the effect and maintain proportions
  float aspect = iResolution.x / iResolution.y;
  vec2 p = fragCoord.xy / iResolution.y - vec2(aspect * 0.5, 0.5);

  vec3 cl = vec3(0.0);
  float d = 2.5;

  for (int i = 0; i <= 5; i++) {
    vec3 pos = vec3(0.0, 0.0, 5.0) + normalize(vec3(p, -1.0)) * d;
    float rz = map(pos);
    float f = clamp((rz - map(pos + 0.1)) * 0.5, -0.1, 1.0);
    vec3 l = vec3(0.1, 0.3, 0.4) + vec3(5.0, 2.5, 3.0) * f;
    cl = cl * l + smoothstep(2.5, 0.0, rz) * 0.7 * l;
    d += min(rz, 1.0);
  }

  gl_FragColor = vec4(cl, 1.0);
}
`;

export class EtherEffect {
  private manager: SceneManager;
  private THREE!: typeof THREE;
  private material!: THREE.ShaderMaterial;
  private mesh!: THREE.Mesh;
  private startTime = 0;

  constructor(manager: SceneManager) {
    this.manager = manager;
    this.THREE = manager.getTHREE();
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
        iResolution: { value: new THREE.Vector2(width, height) }
      }
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry, this.material);

    const scene = this.manager.getScene();
    const camera = this.manager.getCamera();
    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    scene.add(this.mesh);
    scene.background = null;

    this.startTime = performance.now() / 1000;
  }

  update(delta: number): void {
    const time = performance.now() / 1000 - this.startTime;
    this.material.uniforms.iTime.value = time;

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
    this.material?.dispose();
    this.mesh?.geometry.dispose();
  }
}
