/**
 * GPU Module - WebGPU/WebGL abstraction layer
 */

export {
	isWebGLSupported,
	isWebGPUSupported,
	getWebGPUAdapterInfo,
	detectGPUFromWebGL,
	getGPUInfo,
	setGPUInfo,
	PerformanceMonitor,
	performanceMonitor,
	type GPUInfo,
	type PerformanceMetrics
} from './capabilities';

export {
	createRenderer,
	isWebGPULikelyAvailable,
	getRendererCapabilities,
	type RendererConfig,
	type RendererResult
} from './rendererFactory';
