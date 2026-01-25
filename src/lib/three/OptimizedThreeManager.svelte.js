/**
 * DEPRECATED - Optimized ThreeJS Manager with Individual Renderers
 *
 * This file is kept for compatibility but the new approach uses individual
 * OptimizedSceneManager instances per canvas instead of shared context.
 *
 * The shared context approach didn't work reliably. Individual renderers
 * (like oraklex.com) are the proven working pattern, with optimizations
 * to reduce temperature issues.
 */

console.warn('⚠️  OptimizedThreeManager.svelte.js is deprecated. Using individual SceneManager pattern.');

// Compatibility exports (no-op functions)
export function registerScene() {
  console.warn('registerScene() is deprecated - using individual SceneManager');
  return null;
}

export function unregisterScene() {
  console.warn('unregisterScene() is deprecated - using individual SceneManager');
}

export function getThreeManager() {
  console.warn('getThreeManager() is deprecated - using individual SceneManager per canvas');
  return null;
}

export function getThreeStats() {
  console.warn('getThreeStats() is deprecated - each SceneManager tracks its own stats');
  return { isRunning: false, canvasCount: 0, visibleCount: 0, fps: 0, drawCalls: 0 };
}