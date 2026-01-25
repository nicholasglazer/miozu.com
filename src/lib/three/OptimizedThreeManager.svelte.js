/**
 * Optimized ThreeJS Manager - Reactive Singleton
 * Implements shared WebGL context, single RAF loop, and visibility culling
 * Based on 2026 ThreeJS performance best practices with Svelte 5 runes
 */

import { browser } from '$app/environment';

// Performance monitoring variables
let frameCount = 0;
let lastTime = performance.now();

export class OptimizedThreeManager {
  // Reactive state using Svelte 5 runes as class properties
  sharedRenderer = $state(null);
  animationId = $state(null);
  activeScenes = $state(new Map());
  visibleCanvases = $state(new Set());
  renderStats = $state({ fps: 0, drawCalls: 0 });

  // Derived reactive values
  isRunning = $derived(this.animationId !== null);
  canvasCount = $derived(this.activeScenes.size);
  visibleCount = $derived(this.visibleCanvases.size);

  constructor() {
    if (browser) {
      this.initSharedRenderer();
      this.setupIntersectionObserver();
    }
  }

  // Initialize shared WebGL context - single context for all canvases
  async initSharedRenderer() {
    if (this.sharedRenderer) return this.sharedRenderer;

    try {
      // Try WebGPU first (2026 standard), fallback to WebGL
      const { WebGPURenderer, WebGLRenderer, Scene, PerspectiveCamera } = await import('three');

      // Create shared renderer with optimal settings
      const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false, // Disable if not needed
        depth: true,
        preserveDrawingBuffer: false // Better performance
      });

      // Configure for optimal performance
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
      renderer.physicallyBasedShading = false; // Disable if not needed
      renderer.shadowMap.enabled = false; // Enable only if needed per scene

      this.sharedRenderer = renderer;
      console.log('✅ Shared WebGL context initialized');

      return renderer;
    } catch (error) {
      console.error('❌ Failed to initialize WebGL:', error);
      return null;
    }
  }

  // Setup intersection observer for visibility culling
  setupIntersectionObserver() {
    if (!browser) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const canvasId = entry.target.dataset.canvasId;
          if (canvasId) {
            if (entry.isIntersecting) {
              this.visibleCanvases.add(canvasId);
            } else {
              this.visibleCanvases.delete(canvasId);
            }
            // Trigger reactivity
            this.visibleCanvases = new Set(this.visibleCanvases);
          }
        });
      },
      {
        threshold: 0.1, // Render when 10% visible
        rootMargin: '50px' // Start rendering 50px before visible
      }
    );

    this.intersectionObserver = observer;
  }

  // Register a new Three.js scene with viewport management
  async registerScene(canvasElement, config) {
    if (!canvasElement) return null;

    // Ensure shared renderer is initialized
    if (!this.sharedRenderer) {
      await this.initSharedRenderer();
      if (!this.sharedRenderer) return null;
    }

    const canvasId = config.id || `canvas-${Date.now()}`;
    canvasElement.dataset.canvasId = canvasId;

    // Create scene-specific resources
    const sceneData = {
      id: canvasId,
      element: canvasElement,
      scene: config.scene,
      camera: config.camera,
      effectType: config.effectType,
      lowRes: config.lowRes || false,
      lastRender: 0,
      targetFps: config.lowRes ? 30 : 60 // Lower FPS for non-priority scenes
    };

    // Add to active scenes
    this.activeScenes.set(canvasId, sceneData);
    this.activeScenes = new Map(this.activeScenes);

    // Observe for visibility
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(canvasElement);
    }

    // Start render loop if first scene
    if (this.activeScenes.size === 1) {
      this.startRenderLoop();
    }

    console.log(`✅ Scene registered: ${canvasId} (${config.effectType})`);
    return canvasId;
  }

  // Unregister scene and cleanup
  unregisterScene(canvasId) {
    if (!this.activeScenes.has(canvasId)) return;

    const sceneData = this.activeScenes.get(canvasId);

    // Stop observing
    if (this.intersectionObserver && sceneData.element) {
      this.intersectionObserver.unobserve(sceneData.element);
    }

    // Remove from state
    this.activeScenes.delete(canvasId);
    this.visibleCanvases.delete(canvasId);
    this.activeScenes = new Map(this.activeScenes);
    this.visibleCanvases = new Set(this.visibleCanvases);

    // Stop render loop if no scenes
    if (this.activeScenes.size === 0) {
      this.stopRenderLoop();
    }

    console.log(`♻️  Scene unregistered: ${canvasId}`);
  }

  // Single RAF loop managing all scenes (following oraklex.com timing pattern)
  startRenderLoop() {
    if (this.isRunning) return;

    let lastAnimationTime = performance.now();

    const renderFrame = (currentTime) => {
      if (this.activeScenes.size === 0) {
        this.stopRenderLoop();
        return;
      }

      // Calculate delta time for animations (like oraklex.com)
      const deltaTime = (currentTime - lastAnimationTime) / 1000;
      lastAnimationTime = currentTime;

      // Update FPS stats
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        this.renderStats.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        this.renderStats = { ...this.renderStats };
      }

      let totalDrawCalls = 0;

      // Render only visible scenes with throttling
      for (const [canvasId, sceneData] of this.activeScenes) {
        if (!this.visibleCanvases.has(canvasId)) continue; // Skip non-visible

        // FPS throttling for low-res scenes
        const targetInterval = 1000 / sceneData.targetFps;
        if (currentTime - sceneData.lastRender < targetInterval) continue;

        this.renderScene(sceneData, deltaTime); // Pass delta timing
        sceneData.lastRender = currentTime;
        totalDrawCalls++;
      }

      this.renderStats.drawCalls = totalDrawCalls;
      this.renderStats = { ...this.renderStats };

      this.animationId = requestAnimationFrame(renderFrame);
    };

    this.animationId = requestAnimationFrame(renderFrame);
    console.log('🚀 Centralized render loop started');
  }

  // Stop the render loop
  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
      console.log('⏹️  Render loop stopped');
    }
  }

  // Render individual scene with viewport management (following oraklex.com pattern)
  renderScene(sceneData, deltaTime) {
    if (!this.sharedRenderer || !sceneData.scene || !sceneData.camera) return;

    const { element, scene, camera } = sceneData;
    const rect = element.getBoundingClientRect();

    // Skip if element is not visible or has no size
    if (rect.width === 0 || rect.height === 0) return;

    // Update camera aspect ratio
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();

    // CRITICAL FIX: Execute animation updates with delta timing (like oraklex.com)
    if (scene.userData.animate && typeof scene.userData.animate === 'function') {
      try {
        scene.userData.animate(deltaTime); // Pass delta timing like oraklex.com
      } catch (err) {
        console.error('❌ Animation update failed for scene:', sceneData.id, err);
      }
    }

    // Set viewport for this canvas area
    const pixelRatio = this.sharedRenderer.getPixelRatio();
    const canvasElement = this.sharedRenderer.domElement;

    // Position the shared canvas behind the target element
    if (canvasElement.parentNode !== element.parentNode) {
      canvasElement.style.position = 'fixed';
      canvasElement.style.top = '0';
      canvasElement.style.left = '0';
      canvasElement.style.width = '100vw';
      canvasElement.style.height = '100vh';
      canvasElement.style.pointerEvents = 'none';
      canvasElement.style.zIndex = '-1';
      document.body.appendChild(canvasElement);
    }

    // Set render target size to full screen
    this.sharedRenderer.setSize(window.innerWidth, window.innerHeight, false);

    // Set viewport to match canvas element position
    this.sharedRenderer.setViewport(
      rect.left * pixelRatio,
      (window.innerHeight - rect.bottom) * pixelRatio,
      rect.width * pixelRatio,
      rect.height * pixelRatio
    );

    // Set scissor for clean edges
    this.sharedRenderer.setScissor(
      rect.left * pixelRatio,
      (window.innerHeight - rect.bottom) * pixelRatio,
      rect.width * pixelRatio,
      rect.height * pixelRatio
    );
    this.sharedRenderer.setScissorTest(true);

    // Render the scene
    this.sharedRenderer.render(scene, camera);
  }

  // Get reactive stats for debugging
  getStats() {
    return {
      isRunning: this.isRunning,
      canvasCount: this.canvasCount,
      visibleCount: this.visibleCount,
      fps: this.renderStats.fps,
      drawCalls: this.renderStats.drawCalls
    };
  }

  // Cleanup method
  dispose() {
    this.stopRenderLoop();

    // Cleanup intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // Cleanup WebGL resources
    if (this.sharedRenderer) {
      this.sharedRenderer.dispose();
      this.sharedRenderer = null;
    }

    // Clear all scenes
    this.activeScenes.clear();
    this.visibleCanvases.clear();
    this.activeScenes = new Map();
    this.visibleCanvases = new Set();

    console.log('♻️  OptimizedThreeManager disposed');
  }
}

// Create and export singleton instance following the theme pattern
let threeManagerInstance = null;

export function getThreeManager() {
  if (!threeManagerInstance) {
    threeManagerInstance = new OptimizedThreeManager();
  }
  return threeManagerInstance;
}

// Export convenience functions that use the singleton
export function getThreeStats() {
  const manager = getThreeManager();
  return manager.getStats();
}

export async function registerScene(canvasElement, config) {
  const manager = getThreeManager();
  return await manager.registerScene(canvasElement, config);
}

export function unregisterScene(canvasId) {
  const manager = getThreeManager();
  return manager.unregisterScene(canvasId);
}