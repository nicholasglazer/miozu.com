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
	// IMPORTANT: Disable WebGPU on most platforms - it's experimental and causes issues:
	// - Mobile: Black screens on Android Chrome (known issue)
	// - Chrome/Edge Windows/Mac: "WebGPU Device Lost" errors causing black/gray screens
	//   See: https://github.com/mrdoob/three.js/issues/30099
	// Only Firefox handles WebGPU fallback gracefully across platforms

	// Detect mobile devices (multiple methods for "Request Desktop Site" mode)
	const isMobileDevice = typeof navigator !== 'undefined' && (
		/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
		/arm/i.test(navigator.platform) ||
		(navigator.maxTouchPoints > 0 && typeof screen !== 'undefined' && screen.width < 1024)
	);

	// Detect Chrome/Edge on Windows/Mac (problematic WebGPU implementations)
	const isChromiumDesktop = typeof navigator !== 'undefined' &&
		/Chrome|Edg/i.test(navigator.userAgent) &&
		/Windows|Mac/i.test(navigator.userAgent) &&
		!/Android/i.test(navigator.userAgent);

	// Log which platform-specific WebGPU disabling is applied
	if (isMobileDevice) {
		console.info('[RendererFactory] Mobile device detected, forcing WebGL (WebGPU disabled on mobile)');
	} else if (isChromiumDesktop) {
		console.info('[RendererFactory] Chrome/Edge on Windows/Mac detected, forcing WebGL (WebGPU has known device-lost issues)');
	}

	// Only use WebGPU on platforms where it's stable (Linux, Firefox)
	const canUseWebGPU = !forceWebGL && !isMobileDevice && !isChromiumDesktop && (await checkWebGPU());

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

// Track active WebGL contexts for debugging
let activeContextCount = 0;

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
	activeContextCount++;
	console.info(`[RendererFactory] Creating WebGL context #${activeContextCount}`);

	// On mobile, use 'default' power preference to avoid issues
	// Use robust mobile detection (handles "Request Desktop Site" mode)
	const isMobile = typeof navigator !== 'undefined' && (
		/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
		/arm/i.test(navigator.platform) ||
		(navigator.maxTouchPoints > 0 && typeof screen !== 'undefined' && screen.width < 1024)
	);
	const powerPref = isMobile ? 'default' : config.powerPreference;

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({
			canvas: config.canvas,
			alpha: config.alpha,
			antialias: config.antialias,
			powerPreference: powerPref as WebGLPowerPreference,
			stencil: config.stencil,
			depth: config.depth,
			preserveDrawingBuffer: config.preserveDrawingBuffer,
			failIfMajorPerformanceCaveat: false
		});
	} catch (error) {
		console.error('[RendererFactory] Failed to create WebGL renderer:', error);
		activeContextCount--;
		throw error;
	}

	renderer.setPixelRatio(config.pixelRatio);

	// Detect GPU info
	const gl = renderer.getContext();
	if (!gl) {
		console.error('[RendererFactory] Failed to get WebGL context');
		activeContextCount--;
		throw new Error('Failed to get WebGL context');
	}

	const gpuInfo = detectGPUFromWebGL(gl);
	setGPUInfo(gpuInfo);

	// Enable shader error logging for debugging
	renderer.debug.checkShaderErrors = true;

	// Log WebGL capabilities for debugging mobile issues
	console.info(`[RendererFactory] WebGL context #${activeContextCount} created successfully`);
	console.info('[RendererFactory] WebGL version:', gl.getParameter(gl.VERSION));
	console.info('[RendererFactory] GLSL version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	console.info('[RendererFactory] Max texture size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
	console.info('[RendererFactory] Renderer:', gpuInfo.renderer);

	// Check for float texture support (critical for multipass effects)
	const floatTextures = gl.getExtension('OES_texture_float');
	const floatLinear = gl.getExtension('OES_texture_float_linear');
	const colorBufferFloat = gl.getExtension('EXT_color_buffer_float') || gl.getExtension('WEBGL_color_buffer_float');
	console.info('[RendererFactory] Float textures:', !!floatTextures, '| Linear:', !!floatLinear, '| Color buffer:', !!colorBufferFloat);

	// Listen for context loss (important for mobile!)
	const canvas = renderer.domElement;
	canvas.addEventListener('webglcontextlost', (event) => {
		console.error('[RendererFactory] WebGL context LOST! This often happens when too many contexts exist.');
		event.preventDefault();
	});

	canvas.addEventListener('webglcontextrestored', () => {
		console.info('[RendererFactory] WebGL context restored');
	});

	return {
		renderer,
		isWebGPU: false,
		gpuInfo,
		dispose: () => {
			activeContextCount--;
			console.info(`[RendererFactory] Disposing WebGL context. Remaining: ${activeContextCount}`);
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
