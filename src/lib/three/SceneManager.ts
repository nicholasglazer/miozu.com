/**
 * Three.js Scene Manager - Handles WebGL context and rendering
 * Simplified version for miozu.com (based on oraklex.com pattern)
 */

import type * as THREE from 'three';
import { getGlobalThreeManager } from './GlobalThreeManager.svelte.js';

export interface SceneConfig {
	container: HTMLElement;
	alpha?: boolean;
	antialias?: boolean;
	pixelRatio?: number;
	/** Disable depth buffer (for 2D shader effects) */
	noDepth?: boolean;
	/** Force WebGL even if WebGPU is available */
	forceWebGL?: boolean;
}

export class SceneManager {
	private scene!: THREE.Scene;
	private camera!: THREE.PerspectiveCamera;
	private renderer!: THREE.WebGLRenderer;
	private container: HTMLElement;
	private animationId: number | null = null;
	private isDestroyed = false;
	private isPaused = false;
	private THREE: typeof THREE | null = null;
	private lastWidth = 0;
	private lastHeight = 0;
	private onFrameCallback: ((delta: number) => void) | null = null;
	private currentPixelRatio: number;
	targetFPS = 25; // EMERGENCY: Very low FPS for temperature control (public for GlobalManager)
	private lastFrameTime = 0;
	private windowFocused = true;

	constructor(private config: SceneConfig) {
		this.container = config.container;
		this.currentPixelRatio = Math.min(config.pixelRatio ?? window.devicePixelRatio, 1.0); // EMERGENCY: Max 1.0 for temperature
	}

	async init(): Promise<void> {
		// Dynamic import for code splitting
		this.THREE = await import('three');

		const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

		// Scene
		this.scene = new Scene();

		// Get initial dimensions
		const rect = this.container.getBoundingClientRect();
		const width = Math.floor(rect.width) || 1;
		const height = Math.floor(rect.height) || 1;

		// Validate dimensions (oraklex pattern)
		if (width <= 0 || height <= 0) {
			throw new Error(`Invalid container dimensions: ${width}x${height}`);
		}

		this.lastWidth = width;
		this.lastHeight = height;

		// Camera
		const aspect = width / height;
		this.camera = new PerspectiveCamera(75, aspect, 0.1, 1000);
		this.camera.position.z = 5;

		// Renderer with temperature optimizations
		this.renderer = new WebGLRenderer({
			alpha: this.config.alpha ?? true,
			antialias: this.config.antialias ?? false, // Disabled for temperature control
			powerPreference: 'default', // Use 'default' instead of 'high-performance'
			stencil: false, // Not needed for 2D effects - saves memory
			depth: !(this.config.noDepth ?? true),
			preserveDrawingBuffer: false,
			failIfMajorPerformanceCaveat: false
		});

		this.renderer.setPixelRatio(this.currentPixelRatio);
		this.renderer.setSize(width, height);
		this.container.appendChild(this.renderer.domElement);

		// EMERGENCY: Add window focus detection for temperature control
		this.setupFocusDetection();

		console.info(`[SceneManager] Initialized with WebGL renderer (${width}x${height}) - temp mode: ${this.targetFPS}fps`);
		console.log('[SceneManager] WebGL context info:', {
			renderer: !!this.renderer,
			scene: !!this.scene,
			camera: !!this.camera,
			domElement: !!this.renderer.domElement,
			contextLost: this.renderer.getContext().isContextLost()
		});
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

	/** Get current render dimensions */
	getSize(): { width: number; height: number } {
		return { width: this.lastWidth, height: this.lastHeight };
	}

	startRenderLoop(onFrame?: (delta: number) => void): void {
		this.onFrameCallback = onFrame || null;
		let lastTime = performance.now();
		this.lastFrameTime = lastTime;

		const animate = (): void => {
			if (this.isDestroyed) return;

			this.animationId = requestAnimationFrame(animate);

			// EMERGENCY: Skip rendering when paused OR window not focused (temperature control)
			if (this.isPaused || !this.windowFocused) return;

			const currentTime = performance.now();

			// EMERGENCY: Frame rate limiting for temperature control
			const targetFrameTime = 1000 / this.targetFPS;
			if (currentTime - this.lastFrameTime < targetFrameTime) {
				return; // Skip this frame
			}

			const delta = (currentTime - lastTime) / 1000;
			lastTime = currentTime;
			this.lastFrameTime = currentTime;

			// Call effect update callback (this is where real effects get updated)
			this.onFrameCallback?.(delta);

			// Render scene to canvas
			this.renderer.render(this.scene, this.camera);

			// EMERGENCY: Report frame to global manager for performance monitoring
			try {
				getGlobalThreeManager()?.countFrame();
			} catch (e) {
				// Ignore errors from global manager
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

	/** EMERGENCY: Setup window focus detection for temperature control */
	private setupFocusDetection(): void {
		const handleFocus = () => {
			this.windowFocused = true;
			console.log('🔥 Window focused - animations resumed');
		};

		const handleBlur = () => {
			this.windowFocused = false;
			console.log('❄️  Window blurred - animations paused for temperature control');
		};

		window.addEventListener('focus', handleFocus);
		window.addEventListener('blur', handleBlur);
		window.addEventListener('visibilitychange', () => {
			this.windowFocused = !document.hidden;
			console.log(`👁️  Visibility changed: ${this.windowFocused ? 'visible' : 'hidden'}`);
		});

		// Initial state
		this.windowFocused = !document.hidden && document.hasFocus();
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

		this.renderer?.dispose();
		this.renderer?.domElement.remove();
	}
}
