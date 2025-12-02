/**
 * Three.js Scene Manager - Handles WebGPU/WebGL context and rendering
 * Designed for lazy loading and performance optimization
 * Automatically uses WebGPU when available, falls back to WebGL
 */

import type * as THREE from 'three';
import { createRenderer, type RendererResult } from './gpu/rendererFactory';
import { performanceMonitor, getGPUInfo, type GPUInfo } from './gpu/capabilities';

export interface SceneConfig {
	container: HTMLElement;
	alpha?: boolean;
	antialias?: boolean;
	pixelRatio?: number;
	/** Disable depth buffer (for 2D shader effects) */
	noDepth?: boolean;
	/** Force WebGL even if WebGPU is available */
	forceWebGL?: boolean;
	/** Enable performance monitoring and adaptive quality */
	adaptiveQuality?: boolean;
}

export class SceneManager {
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	private rendererResult!: RendererResult;
	private container: HTMLElement;
	private animationId: number | null = null;
	private isDestroyed = false;
	private isPaused = false;
	private THREE: typeof THREE | null = null;
	private lastWidth = 0;
	private lastHeight = 0;
	private onFrameCallback: ((delta: number) => void) | null = null;
	private _isWebGPU = false;
	private _gpuInfo: GPUInfo | null = null;
	private useAdaptiveQuality = false;
	private currentPixelRatio: number;

	constructor(private config: SceneConfig) {
		this.container = config.container;
		this.currentPixelRatio = Math.min(config.pixelRatio ?? window.devicePixelRatio, 2);
	}

	async init(): Promise<void> {
		// Dynamic import for code splitting
		this.THREE = await import('three');

		const { Scene, PerspectiveCamera } = this.THREE;

		// Scene
		this.scene = new Scene();

		// Get initial dimensions
		const rect = this.container.getBoundingClientRect();
		const width = Math.floor(rect.width) || 1;
		const height = Math.floor(rect.height) || 1;
		this.lastWidth = width;
		this.lastHeight = height;

		// Camera
		const aspect = width / height;
		this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
		this.camera.position.z = 5;

		// Renderer - uses WebGPU when available, falls back to WebGL
		const useDepth = !(this.config.noDepth ?? true); // Default to no depth for 2D shaders

		this.rendererResult = await createRenderer(this.THREE, {
			alpha: this.config.alpha ?? true,
			antialias: this.config.antialias ?? true,
			pixelRatio: this.currentPixelRatio,
			powerPreference: 'high-performance',
			stencil: false, // Not needed for 2D effects - saves memory
			depth: useDepth,
			preserveDrawingBuffer: false,
			forceWebGL: this.config.forceWebGL ?? false
		});

		this.renderer = this.rendererResult.renderer;
		this._isWebGPU = this.rendererResult.isWebGPU;
		this._gpuInfo = this.rendererResult.gpuInfo;

		this.renderer.setSize(width, height);
		this.container.appendChild(this.renderer.domElement);

		// Setup adaptive quality if enabled
		this.useAdaptiveQuality = this.config.adaptiveQuality ?? false;
		if (this.useAdaptiveQuality) {
			this.setupAdaptiveQuality();
		}

		// Log renderer type
		const rendererType = this._isWebGPU ? 'WebGPU' : 'WebGL';
		const gpuTier = this._gpuInfo?.tier ?? 'unknown';
		console.info(`[SceneManager] Initialized with ${rendererType} renderer [GPU tier: ${gpuTier}]`);
	}

	/**
	 * Setup adaptive quality based on FPS monitoring
	 */
	private setupAdaptiveQuality(): void {
		performanceMonitor.onQualityChange((quality) => {
			this.applyQualitySettings(quality);
		});

		// Set initial quality based on GPU tier
		if (this._gpuInfo) {
			performanceMonitor.setQuality(this._gpuInfo.tier);
		}
	}

	/**
	 * Apply quality settings based on performance
	 */
	private applyQualitySettings(quality: 'high' | 'medium' | 'low'): void {
		const basePixelRatio = this.config.pixelRatio ?? window.devicePixelRatio;

		switch (quality) {
			case 'high':
				this.currentPixelRatio = Math.min(basePixelRatio, 2);
				break;
			case 'medium':
				this.currentPixelRatio = Math.min(basePixelRatio, 1.5);
				break;
			case 'low':
				this.currentPixelRatio = 1;
				break;
		}

		this.renderer.setPixelRatio(this.currentPixelRatio);

		// Dispatch event for effects to adjust their quality
		window.dispatchEvent(
			new CustomEvent('quality-change', {
				detail: { quality, pixelRatio: this.currentPixelRatio }
			})
		);
	}

	/** Resize renderer and camera - call from Svelte's bind:clientWidth/Height */
	resize(width: number, height: number): void {
		if (this.isDestroyed) return;

		// Ensure valid dimensions
		width = Math.floor(width) || 1;
		height = Math.floor(height) || 1;

		// Skip if dimensions unchanged
		if (width === this.lastWidth && height === this.lastHeight) return;

		this.lastWidth = width;
		this.lastHeight = height;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}

	/** Force resize - use after DOM relocation (e.g., canvas teleportation) */
	forceResize(width: number, height: number): void {
		if (this.isDestroyed) return;

		// Ensure valid dimensions
		width = Math.floor(width) || 1;
		height = Math.floor(height) || 1;

		this.lastWidth = width;
		this.lastHeight = height;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);

		// Force context update by clearing
		this.renderer.clear();
	}

	/** Upgrade to full retina quality - use for expanded views
	 * @param maxRatio - Maximum pixel ratio (default 2, use 3 for premium single-canvas views)
	 */
	upgradeToRetinaQuality(maxRatio: number = 2): void {
		if (this.isDestroyed) return;

		// Upgrade pixel ratio for retina displays
		// When expanded (single canvas), we can afford higher quality (up to 3x)
		const retinaPixelRatio = Math.min(window.devicePixelRatio, maxRatio);
		if (this.currentPixelRatio < retinaPixelRatio) {
			this.currentPixelRatio = retinaPixelRatio;
			this.renderer.setPixelRatio(retinaPixelRatio);
		}
	}

	getScene(): THREE.Scene {
		return this.scene;
	}

	getCamera(): THREE.PerspectiveCamera {
		return this.camera;
	}

	/** Get current render dimensions (more reliable than reading from container after teleportation) */
	getSize(): { width: number; height: number } {
		return { width: this.lastWidth, height: this.lastHeight };
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

	/** Check if using WebGPU renderer */
	get isWebGPU(): boolean {
		return this._isWebGPU;
	}

	/** Get GPU information */
	get gpuInfo(): GPUInfo | null {
		return this._gpuInfo;
	}

	/** Get current quality level */
	get currentQuality(): 'high' | 'medium' | 'low' {
		return performanceMonitor.getCurrentQuality();
	}

	startRenderLoop(onFrame?: (delta: number) => void): void {
		this.onFrameCallback = onFrame || null;
		let lastTime = performance.now();

		const animate = (): void => {
			if (this.isDestroyed) return;

			this.animationId = requestAnimationFrame(animate);

			// Skip rendering when paused (saves GPU cycles)
			if (this.isPaused) return;

			// Performance monitoring
			if (this.useAdaptiveQuality) {
				performanceMonitor.beginFrame();
			}

			const currentTime = performance.now();
			const delta = (currentTime - lastTime) / 1000;
			lastTime = currentTime;

			this.onFrameCallback?.(delta);
			this.renderer.render(this.scene, this.camera);

			// End frame monitoring
			if (this.useAdaptiveQuality) {
				performanceMonitor.endFrame();
			}
		};

		animate();
	}

	/** Pause rendering (for when canvas is off-screen) */
	pause(): void {
		this.isPaused = true;
	}

	/** Resume rendering */
	resume(): void {
		this.isPaused = false;
	}

	/** Check if rendering is paused */
	get paused(): boolean {
		return this.isPaused;
	}

	/** Get performance metrics */
	getPerformanceMetrics(): { fps: number; frameTime: number; avgFrameTime: number } {
		return performanceMonitor.getMetrics();
	}

	destroy(): void {
		this.isDestroyed = true;

		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
		}

		// Clean up Three.js resources
		this.scene?.traverse((object) => {
			if ((object as THREE.Mesh).geometry) {
				(object as THREE.Mesh).geometry.dispose();
			}
			if ((object as THREE.Mesh).material) {
				const material = (object as THREE.Mesh).material;
				if (Array.isArray(material)) {
					material.forEach((m) => m.dispose());
				} else {
					material.dispose();
				}
			}
		});

		// Use the renderer result's dispose method
		this.rendererResult?.dispose();
		this.renderer?.domElement.remove();
	}
}
