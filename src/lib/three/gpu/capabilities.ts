/**
 * GPU Capabilities Detection and Performance Monitoring
 * Detects WebGPU/WebGL support and monitors rendering performance
 */

export interface GPUInfo {
	renderer: string;
	vendor: string;
	isSoftware: boolean;
	isWebGPU: boolean;
	isWebGL2: boolean;
	maxTextureSize: number;
	maxViewportDims: [number, number];
	tier: 'high' | 'medium' | 'low';
}

export interface PerformanceMetrics {
	fps: number;
	frameTime: number;
	gpuTime?: number;
	drawCalls: number;
	triangles: number;
}

// Cached GPU info
let cachedGPUInfo: GPUInfo | null = null;

/**
 * Detect WebGPU availability
 */
export async function isWebGPUSupported(): Promise<boolean> {
	if (typeof navigator === 'undefined') return false;
	if (!navigator.gpu) return false;

	try {
		const adapter = await navigator.gpu.requestAdapter({
			powerPreference: 'high-performance'
		});
		return adapter !== null;
	} catch {
		return false;
	}
}

/**
 * Get WebGPU adapter info
 */
export async function getWebGPUAdapterInfo(): Promise<{ vendor: string; architecture: string } | null> {
	if (!navigator.gpu) return null;

	try {
		const adapter = await navigator.gpu.requestAdapter({
			powerPreference: 'high-performance'
		});
		if (!adapter) return null;

		const info = await adapter.requestAdapterInfo();
		return {
			vendor: info.vendor || 'Unknown',
			architecture: info.architecture || 'Unknown'
		};
	} catch {
		return null;
	}
}

/**
 * Detect GPU capabilities from WebGL context
 */
export function detectGPUFromWebGL(gl: WebGLRenderingContext | WebGL2RenderingContext): GPUInfo {
	const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

	let renderer = 'Unknown';
	let vendor = 'Unknown';

	if (debugInfo) {
		renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
		vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'Unknown';
	}

	// Detect software rendering
	const isSoftware = /SwiftShader|llvmpipe|Software|Mesa OffScreen|Microsoft Basic/i.test(renderer);

	// Check WebGL2
	const isWebGL2 = gl instanceof WebGL2RenderingContext;

	// Get capabilities
	const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
	const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) || [4096, 4096];

	// Determine GPU tier based on capabilities and renderer name
	const tier = determineGPUTier(renderer, maxTextureSize, isSoftware);

	return {
		renderer,
		vendor,
		isSoftware,
		isWebGPU: false,
		isWebGL2,
		maxTextureSize,
		maxViewportDims: maxViewportDims as [number, number],
		tier
	};
}

/**
 * Determine GPU performance tier
 */
function determineGPUTier(
	renderer: string,
	maxTextureSize: number,
	isSoftware: boolean
): 'high' | 'medium' | 'low' {
	if (isSoftware) return 'low';

	// High-end GPU indicators
	const highEnd =
		/RTX\s*(30|40|50)|RX\s*(6[89]|7)|Radeon\s*(VII|Pro)|M[1-4]\s*(Pro|Max|Ultra)|A[12][0-9]|Intel\s*Arc/i;
	// Mid-range GPU indicators
	const midRange = /GTX\s*(10|16)|RTX\s*20|RX\s*(5[0-9]|6[0-5])|Intel\s*(Iris|UHD\s*[67])|M[1-4](?!\s*Pro)/i;

	if (highEnd.test(renderer) || maxTextureSize >= 16384) {
		return 'high';
	} else if (midRange.test(renderer) || maxTextureSize >= 8192) {
		return 'medium';
	}

	return 'low';
}

/**
 * Get cached or detect GPU info
 */
export function getGPUInfo(): GPUInfo | null {
	return cachedGPUInfo;
}

/**
 * Set GPU info (called after renderer creation)
 */
export function setGPUInfo(info: GPUInfo): void {
	cachedGPUInfo = info;

	// Log GPU info
	const status = info.isSoftware ? 'SOFTWARE RENDERING' : info.tier.toUpperCase();
	console.info(`[GPU] ${info.vendor} - ${info.renderer} [${status}]`);

	if (info.isSoftware) {
		console.warn('[GPU] Software rendering detected. Performance will be degraded.');
		// Dispatch event for UI handling
		if (typeof window !== 'undefined') {
			window.dispatchEvent(
				new CustomEvent('gpu-software-rendering', {
					detail: info
				})
			);
		}
	}
}

/**
 * Performance monitor for frame timing
 */
export class PerformanceMonitor {
	private frameTimes: number[] = [];
	private lastFrameTime = 0;
	private frameCount = 0;
	private lastFPSUpdate = 0;
	private currentFPS = 60;
	private readonly maxSamples = 60;

	// Adaptive quality thresholds
	private readonly lowFPSThreshold = 30;
	private readonly highFPSThreshold = 55;
	private qualityCallbacks: ((quality: 'high' | 'medium' | 'low') => void)[] = [];
	private currentQuality: 'high' | 'medium' | 'low' = 'high';
	private qualityChangeDebounce = 0;

	/**
	 * Call at the start of each frame
	 */
	beginFrame(): void {
		this.lastFrameTime = performance.now();
	}

	/**
	 * Call at the end of each frame
	 */
	endFrame(): void {
		const now = performance.now();
		const frameTime = now - this.lastFrameTime;

		this.frameTimes.push(frameTime);
		if (this.frameTimes.length > this.maxSamples) {
			this.frameTimes.shift();
		}

		this.frameCount++;

		// Update FPS every 500ms
		if (now - this.lastFPSUpdate >= 500) {
			this.currentFPS = (this.frameCount * 1000) / (now - this.lastFPSUpdate);
			this.frameCount = 0;
			this.lastFPSUpdate = now;

			// Check for quality adjustment
			this.checkQualityAdjustment();
		}
	}

	/**
	 * Get current metrics
	 */
	getMetrics(): { fps: number; frameTime: number; avgFrameTime: number } {
		const avgFrameTime =
			this.frameTimes.length > 0
				? this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length
				: 16.67;

		return {
			fps: Math.round(this.currentFPS),
			frameTime: this.frameTimes[this.frameTimes.length - 1] || 0,
			avgFrameTime
		};
	}

	/**
	 * Register callback for quality changes
	 */
	onQualityChange(callback: (quality: 'high' | 'medium' | 'low') => void): void {
		this.qualityCallbacks.push(callback);
	}

	/**
	 * Check and adjust quality based on FPS
	 */
	private checkQualityAdjustment(): void {
		const now = performance.now();

		// Debounce quality changes (wait 2 seconds between changes)
		if (now - this.qualityChangeDebounce < 2000) return;

		let newQuality = this.currentQuality;

		if (this.currentFPS < this.lowFPSThreshold) {
			// Downgrade quality
			if (this.currentQuality === 'high') {
				newQuality = 'medium';
			} else if (this.currentQuality === 'medium') {
				newQuality = 'low';
			}
		} else if (this.currentFPS > this.highFPSThreshold) {
			// Upgrade quality (more conservative)
			if (this.currentQuality === 'low' && this.currentFPS > 58) {
				newQuality = 'medium';
			} else if (this.currentQuality === 'medium' && this.currentFPS > 59) {
				newQuality = 'high';
			}
		}

		if (newQuality !== this.currentQuality) {
			this.currentQuality = newQuality;
			this.qualityChangeDebounce = now;
			console.info(`[Performance] Quality adjusted to: ${newQuality} (FPS: ${Math.round(this.currentFPS)})`);
			this.qualityCallbacks.forEach((cb) => cb(newQuality));
		}
	}

	/**
	 * Get current quality level
	 */
	getCurrentQuality(): 'high' | 'medium' | 'low' {
		return this.currentQuality;
	}

	/**
	 * Force quality level
	 */
	setQuality(quality: 'high' | 'medium' | 'low'): void {
		this.currentQuality = quality;
		this.qualityCallbacks.forEach((cb) => cb(quality));
	}

	/**
	 * Reset metrics
	 */
	reset(): void {
		this.frameTimes = [];
		this.frameCount = 0;
		this.lastFPSUpdate = performance.now();
	}
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
