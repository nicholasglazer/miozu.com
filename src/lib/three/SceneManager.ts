/**
 * Three.js Scene Manager - Handles WebGL context and rendering
 * Designed for lazy loading and performance optimization
 */

import type * as THREE from 'three';

export interface SceneConfig {
  container: HTMLElement;
  alpha?: boolean;
  antialias?: boolean;
  pixelRatio?: number;
}

export class SceneManager {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private container: HTMLElement;
  private animationId: number | null = null;
  private isDestroyed = false;
  private THREE: typeof THREE | null = null;

  constructor(private config: SceneConfig) {
    this.container = config.container;
  }

  async init(): Promise<void> {
    // Dynamic import for code splitting
    this.THREE = await import('three');

    const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

    // Scene
    this.scene = new Scene();

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.z = 5;

    // Renderer
    this.renderer = new WebGLRenderer({
      alpha: this.config.alpha ?? true,
      antialias: this.config.antialias ?? true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(this.config.pixelRatio ?? window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // Handle resize
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    if (this.isDestroyed) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getTHREE(): typeof THREE {
    if (!this.THREE) throw new Error('THREE not loaded');
    return this.THREE;
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  startRenderLoop(onFrame?: (delta: number) => void): void {
    let lastTime = performance.now();

    const animate = (): void => {
      if (this.isDestroyed) return;

      this.animationId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      onFrame?.(delta);
      this.renderer.render(this.scene, this.camera);
    };

    animate();
  }

  destroy(): void {
    this.isDestroyed = true;

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    window.removeEventListener('resize', this.handleResize);

    // Clean up Three.js resources
    this.scene?.traverse((object) => {
      if ((object as THREE.Mesh).geometry) {
        (object as THREE.Mesh).geometry.dispose();
      }
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach(m => m.dispose());
        } else {
          material.dispose();
        }
      }
    });

    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
