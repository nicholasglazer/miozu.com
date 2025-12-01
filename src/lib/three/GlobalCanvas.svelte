<script lang="ts">
	/**
	 * GlobalCanvas - Single full-page canvas with multiple viewports
	 *
	 * This is the "sophisticated technique" for smooth WebGL/WebGPU transitions:
	 * - ONE GPU context (never lost)
	 * - Multiple scenes rendered via scissor/viewport
	 * - Animated viewport rectangles for seamless card expansion
	 * - Automatic WebGPU/WebGL selection
	 *
	 * Based on: https://threejs.org/manual/en/multiple-scenes.html
	 */

	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { viewportRegistry, type ViewportRect } from '$lib/stores/viewportRegistry';
	import { createRenderer, type RendererResult } from './gpu/rendererFactory';
	import { performanceMonitor, type GPUInfo } from './gpu/capabilities';

	// Types
	import type * as THREE from 'three';

	// State
	let canvas: HTMLCanvasElement;
	let renderer: THREE.WebGLRenderer | null = null;
	let rendererResult: RendererResult | null = null;
	let THREE_MODULE: typeof THREE | null = null;
	let animationId: number | null = null;
	let isDestroyed = false;
	let isWebGPU = false;
	let gpuInfo: GPUInfo | null = null;

	// Scene cache - reuse scenes/effects for each effect type
	interface SceneEntry {
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		effectInstance: any;
		effectModule: any;
		mockManager: MockSceneManager;
	}
	const sceneCache = new Map<string, SceneEntry>();

	// Mock SceneManager that provides the interface effects expect
	class MockSceneManager {
		private _renderer: THREE.WebGLRenderer;
		private _THREE: typeof THREE;
		private _container: HTMLElement;
		private _scene: THREE.Scene;
		private _camera: THREE.PerspectiveCamera;
		private _width: number = 100;
		private _height: number = 100;
		private _isWebGPU: boolean;

		constructor(rendererRef: THREE.WebGLRenderer, threeModule: typeof THREE, webgpu: boolean) {
			this._renderer = rendererRef;
			this._THREE = threeModule;
			this._isWebGPU = webgpu;

			// Create scene and camera for this manager
			this._scene = new threeModule.Scene();
			this._camera = new threeModule.PerspectiveCamera(75, 1, 0.1, 1000);
			this._camera.position.z = 5;

			// Create a mock container element for sizing
			this._container = document.createElement('div');
			this._container.style.width = '100px';
			this._container.style.height = '100px';
		}

		getTHREE(): typeof THREE {
			return this._THREE;
		}

		getRenderer(): THREE.WebGLRenderer {
			return this._renderer;
		}

		getScene(): THREE.Scene {
			return this._scene;
		}

		getCamera(): THREE.PerspectiveCamera {
			return this._camera;
		}

		getContainer(): HTMLElement {
			return this._container;
		}

		get isWebGPU(): boolean {
			return this._isWebGPU;
		}

		// Update container size (called before rendering each viewport)
		setSize(width: number, height: number): void {
			this._width = width;
			this._height = height;
			this._container.style.width = `${width}px`;
			this._container.style.height = `${height}px`;
			// Also update the actual clientWidth/clientHeight via a hack
			Object.defineProperty(this._container, 'clientWidth', { value: width, writable: true });
			Object.defineProperty(this._container, 'clientHeight', { value: height, writable: true });
			// Update camera aspect ratio
			this._camera.aspect = width / height;
			this._camera.updateProjectionMatrix();
		}
	}

	// Effect type to module mapping
	const effectModules: Record<string, () => Promise<any>> = {
		'synaptic-multipass': () => import('./effects/SynapticMultipass'),
		'sinuous-original': () => import('./effects/SinuousOriginal'),
		sinuous: () => import('./effects/SinuousOriginal'),
		synaptic: () => import('./effects/Synaptic'),
		ether: () => import('./effects/Ether'),
		'snake-trails': () => import('./effects/SnakeTrails')
	};

	// Initialize Three.js with WebGPU/WebGL selection
	async function init() {
		if (!browser || !canvas) return;

		THREE_MODULE = await import('three');

		// Use the renderer factory for automatic WebGPU/WebGL selection
		rendererResult = await createRenderer(THREE_MODULE, {
			canvas,
			alpha: true,
			antialias: true,
			powerPreference: 'high-performance',
			stencil: false,
			depth: false,
			preserveDrawingBuffer: false
		});

		renderer = rendererResult.renderer;
		isWebGPU = rendererResult.isWebGPU;
		gpuInfo = rendererResult.gpuInfo;

		renderer.setScissorTest(true);
		renderer.autoClear = false;

		// Log renderer type
		const rendererType = isWebGPU ? 'WebGPU' : 'WebGL';
		console.info(`[GlobalCanvas] Initialized with ${rendererType} renderer`);

		// Start render loop
		startRenderLoop();
	}

	// Get or create scene for effect type
	async function getOrCreateScene(effectType: string): Promise<SceneEntry | null> {
		if (!THREE_MODULE || !renderer) return null;

		// Return cached scene
		if (sceneCache.has(effectType)) {
			return sceneCache.get(effectType)!;
		}

		// Create new scene
		const { Scene, PerspectiveCamera } = THREE_MODULE;
		const scene = new Scene();
		const camera = new PerspectiveCamera(75, 1, 0.1, 1000);
		camera.position.z = 5;

		// Load effect module
		const moduleLoader = effectModules[effectType];
		if (!moduleLoader) {
			console.warn(`Unknown effect type: ${effectType}`);
			return null;
		}

		try {
			const effectModule = await moduleLoader();
			const EffectClass = effectModule.default || effectModule[Object.keys(effectModule)[0]];

			// Create mock SceneManager that the effect expects
			const mockManager = new MockSceneManager(renderer, THREE_MODULE, isWebGPU);

			// Effects expect a single manager argument
			const effectInstance = new EffectClass(mockManager);
			await effectInstance.init?.();

			const entry: SceneEntry = { scene, camera, effectInstance, effectModule, mockManager };
			sceneCache.set(effectType, entry);
			return entry;
		} catch (err) {
			console.error(`Failed to load effect ${effectType}:`, err);
			return null;
		}
	}

	// Render loop with scissor/viewport for each registered viewport
	let lastTime = performance.now();

	function renderFrame() {
		if (isDestroyed || !renderer || !THREE_MODULE) return;

		animationId = requestAnimationFrame(renderFrame);

		// Performance monitoring
		performanceMonitor.beginFrame();

		const currentTime = performance.now();
		const delta = (currentTime - lastTime) / 1000;
		lastTime = currentTime;

		// Get canvas dimensions
		const canvasRect = canvas.getBoundingClientRect();
		const pixelRatio = renderer.getPixelRatio();

		// Resize canvas if needed
		const width = Math.floor(canvasRect.width * pixelRatio);
		const height = Math.floor(canvasRect.height * pixelRatio);
		if (canvas.width !== width || canvas.height !== height) {
			canvas.width = width;
			canvas.height = height;
		}

		// Clear entire canvas
		renderer.setScissor(0, 0, width, height);
		renderer.setViewport(0, 0, width, height);
		renderer.clear();

		// Get all visible viewports
		const viewports = viewportRegistry.getVisibleViewports();

		// Render each viewport
		for (const viewport of viewports) {
			renderViewport(viewport, delta, canvasRect, pixelRatio);
		}

		// End frame monitoring
		performanceMonitor.endFrame();
	}

	async function renderViewport(
		viewport: any,
		delta: number,
		canvasRect: DOMRect,
		pixelRatio: number
	) {
		if (!renderer || !THREE_MODULE) return;

		// Get interpolated rect (handles animation)
		const rect = viewportRegistry.getInterpolatedRect(viewport.id);
		if (!rect) return;

		// Check if viewport is visible in canvas
		const isVisible =
			rect.left < canvasRect.right &&
			rect.left + rect.width > canvasRect.left &&
			rect.top < canvasRect.bottom &&
			rect.top + rect.height > canvasRect.top;

		if (!isVisible) return;

		// Get or create scene for this effect type
		const sceneEntry = await getOrCreateScene(viewport.effectType);
		if (!sceneEntry) return;

		// Calculate scissor/viewport in canvas coordinates
		// Note: WebGL Y is flipped (0 at bottom)
		const left = Math.floor((rect.left - canvasRect.left) * pixelRatio);
		const bottom = Math.floor((canvasRect.bottom - rect.top - rect.height) * pixelRatio);
		const vpWidth = Math.floor(rect.width * pixelRatio);
		const vpHeight = Math.floor(rect.height * pixelRatio);

		// Skip if dimensions are invalid
		if (vpWidth <= 0 || vpHeight <= 0) return;

		// Update mock manager with viewport size (effects use this for sizing)
		sceneEntry.mockManager.setSize(rect.width, rect.height);

		// Set scissor and viewport BEFORE effect renders
		renderer.setScissor(left, bottom, vpWidth, vpHeight);
		renderer.setViewport(left, bottom, vpWidth, vpHeight);

		// Update and render effect (effects handle their own rendering)
		sceneEntry.effectInstance?.update?.(delta);
	}

	function startRenderLoop() {
		lastTime = performance.now();
		renderFrame();
	}

	function stopRenderLoop() {
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	// Cleanup
	function destroy() {
		isDestroyed = true;
		stopRenderLoop();

		// Dispose all cached scenes
		for (const [, entry] of sceneCache) {
			entry.effectInstance?.destroy?.();
			entry.scene?.traverse((object: any) => {
				if (object.geometry) object.geometry.dispose();
				if (object.material) {
					if (Array.isArray(object.material)) {
						object.material.forEach((m: any) => m.dispose());
					} else {
						object.material.dispose();
					}
				}
			});
		}
		sceneCache.clear();

		// Use renderer result's dispose for proper cleanup
		rendererResult?.dispose();
		renderer = null;
		rendererResult = null;
	}

	onMount(() => {
		if (browser) {
			init();
		}
	});

	onDestroy(() => {
		destroy();
	});
</script>

<canvas bind:this={canvas} class="global-canvas"></canvas>

<style>
	.global-canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 1;
	}
</style>
