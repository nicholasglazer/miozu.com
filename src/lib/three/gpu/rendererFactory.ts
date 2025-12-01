/**
 * Renderer Factory - Creates WebGPU or WebGL renderer based on availability
 * Provides unified interface for both renderer types
 */

import type * as THREE from 'three';
import {
	isWebGPUSupported,
	getWebGPUAdapterInfo,
	detectGPUFromWebGL,
	setGPUInfo,
	type GPUInfo
} from './capabilities';

export interface RendererConfig {
	canvas?: HTMLCanvasElement;
	alpha?: boolean;
	antialias?: boolean;
	pixelRatio?: number;
	powerPreference?: 'high-performance' | 'low-power' | 'default';
	stencil?: boolean;
	depth?: boolean;
	preserveDrawingBuffer?: boolean;
	/** Force WebGL even if WebGPU is available */
	forceWebGL?: boolean;
}

export interface RendererResult {
	renderer: THREE.WebGLRenderer;
	isWebGPU: boolean;
	gpuInfo: GPUInfo;
	dispose: () => void;
}

// Track if WebGPU check has been done
let webGPUAvailable: boolean | null = null;
let webGPUCheckPromise: Promise<boolean> | null = null;

/**
 * Check WebGPU availability (cached)
 */
async function checkWebGPU(): Promise<boolean> {
	if (webGPUAvailable !== null) return webGPUAvailable;

	if (!webGPUCheckPromise) {
		webGPUCheckPromise = isWebGPUSupported().then((result) => {
			webGPUAvailable = result;
			return result;
		});
	}

	return webGPUCheckPromise;
}

/**
 * Create the optimal renderer for the current environment
 */
export async function createRenderer(
	THREE: typeof import('three'),
	config: RendererConfig = {}
): Promise<RendererResult> {
	const {
		canvas,
		alpha = true,
		antialias = true,
		pixelRatio = Math.min(window.devicePixelRatio, 2),
		powerPreference = 'high-performance',
		stencil = false,
		depth = false,
		preserveDrawingBuffer = false,
		forceWebGL = false
	} = config;

	// Check WebGPU availability
	const canUseWebGPU = !forceWebGL && (await checkWebGPU());

	if (canUseWebGPU) {
		try {
			return await createWebGPURenderer(THREE, {
				canvas,
				alpha,
				antialias,
				pixelRatio,
				powerPreference,
				depth
			});
		} catch (error) {
			console.warn('[RendererFactory] WebGPU initialization failed, falling back to WebGL:', error);
		}
	}

	// Fallback to WebGL
	return createWebGLRenderer(THREE, {
		canvas,
		alpha,
		antialias,
		pixelRatio,
		powerPreference,
		stencil,
		depth,
		preserveDrawingBuffer
	});
}

/**
 * Create WebGPU renderer
 */
async function createWebGPURenderer(
	THREE: typeof import('three'),
	config: {
		canvas?: HTMLCanvasElement;
		alpha: boolean;
		antialias: boolean;
		pixelRatio: number;
		powerPreference: string;
		depth: boolean;
	}
): Promise<RendererResult> {
	// Dynamic import WebGPU renderer
	const { WebGPURenderer } = await import('three/webgpu');

	const renderer = new WebGPURenderer({
		canvas: config.canvas,
		alpha: config.alpha,
		antialias: config.antialias,
		powerPreference: config.powerPreference as GPUPowerPreference,
		depth: config.depth
	});

	// Initialize WebGPU
	await renderer.init();

	renderer.setPixelRatio(config.pixelRatio);

	// Get GPU info from WebGPU adapter
	const adapterInfo = await getWebGPUAdapterInfo();

	const gpuInfo: GPUInfo = {
		renderer: adapterInfo?.architecture || 'WebGPU',
		vendor: adapterInfo?.vendor || 'Unknown',
		isSoftware: false,
		isWebGPU: true,
		isWebGL2: false,
		maxTextureSize: 16384, // WebGPU typically supports large textures
		maxViewportDims: [16384, 16384],
		tier: 'high' // WebGPU implies modern GPU
	};

	setGPUInfo(gpuInfo);

	console.info('[RendererFactory] WebGPU renderer created successfully');

	return {
		renderer: renderer as unknown as THREE.WebGLRenderer,
		isWebGPU: true,
		gpuInfo,
		dispose: () => {
			renderer.dispose();
		}
	};
}

/**
 * Create WebGL renderer
 */
function createWebGLRenderer(
	THREE: typeof import('three'),
	config: {
		canvas?: HTMLCanvasElement;
		alpha: boolean;
		antialias: boolean;
		pixelRatio: number;
		powerPreference: string;
		stencil: boolean;
		depth: boolean;
		preserveDrawingBuffer: boolean;
	}
): RendererResult {
	const renderer = new THREE.WebGLRenderer({
		canvas: config.canvas,
		alpha: config.alpha,
		antialias: config.antialias,
		powerPreference: config.powerPreference as WebGLPowerPreference,
		stencil: config.stencil,
		depth: config.depth,
		preserveDrawingBuffer: config.preserveDrawingBuffer,
		failIfMajorPerformanceCaveat: false
	});

	renderer.setPixelRatio(config.pixelRatio);

	// Detect GPU info
	const gl = renderer.getContext();
	const gpuInfo = detectGPUFromWebGL(gl);
	setGPUInfo(gpuInfo);

	console.info('[RendererFactory] WebGL renderer created');

	return {
		renderer,
		isWebGPU: false,
		gpuInfo,
		dispose: () => {
			renderer.dispose();
		}
	};
}

/**
 * Quick check if WebGPU is likely available (sync, for UI decisions)
 */
export function isWebGPULikelyAvailable(): boolean {
	if (typeof navigator === 'undefined') return false;
	return 'gpu' in navigator;
}

/**
 * Get renderer capabilities
 */
export function getRendererCapabilities(renderer: THREE.WebGLRenderer): {
	maxTextureSize: number;
	maxCubeMapSize: number;
	maxAttributes: number;
	maxVertexUniforms: number;
	maxFragmentUniforms: number;
	precision: string;
} {
	const capabilities = renderer.capabilities;

	return {
		maxTextureSize: capabilities.maxTextureSize,
		maxCubeMapSize: capabilities.maxCubemapSize,
		maxAttributes: capabilities.maxAttributes,
		maxVertexUniforms: capabilities.maxVertexUniforms,
		maxFragmentUniforms: capabilities.maxFragmentUniforms,
		precision: capabilities.precision
	};
}
