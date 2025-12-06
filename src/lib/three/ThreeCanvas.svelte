<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { canvasRegistry } from '$lib/reactiveStates/canvasRegistry.svelte';

  interface Props {
    type?: 'falling-cubes' | 'sinuous' | 'sinuous-original' | 'snake-trails' | 'synaptic' | 'synaptic-multipass' | 'ether';
    class?: string;
    /** Use lower pixel ratio for better performance on small cards */
    lowRes?: boolean;
    /** Unique ID for canvas teleportation system */
    id?: string;
    /** Force WebGL even if WebGPU is available */
    forceWebGL?: boolean;
    /** Enable adaptive quality based on FPS monitoring */
    adaptiveQuality?: boolean;
  }

  let { type: effectType = 'sinuous', class: className = '', lowRes = false, id, forceWebGL = false, adaptiveQuality = true }: Props = $props();

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement | null = $state(null);
  let isLoaded = $state(false);
  let sceneManager = $state<any>(null);
  let effectInstance: any = null;

  // Visibility-based optimization
  let intersectionObserver: IntersectionObserver | null = null;
  let isVisible = $state(true);

  // Svelte 5: Use bind:clientWidth/Height for resize (uses ResizeObserver internally)
  let containerWidth = $state(0);
  let containerHeight = $state(0);

  // React to dimension changes - runs when sceneManager or dimensions change
  // Skip if resize is locked (during animation)
  $effect(() => {
    if (sceneManager && containerWidth > 0 && containerHeight > 0) {
      // Check if this canvas has resize locked (during animation)
      if (id && canvasRegistry.isResizeLocked(id)) {
        return;
      }
      sceneManager.resize(containerWidth, containerHeight);
    }
  });

  // Setup visibility observer for performance optimization
  function setupVisibilityObserver() {
    if (!browser || !container) return;

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;

        if (sceneManager) {
          if (entry.isIntersecting) {
            sceneManager.resume();
          } else {
            sceneManager.pause();
          }
        }
      },
      {
        threshold: 0.05, // Start rendering when 5% visible
        rootMargin: '50px' // Pre-render slightly before entering viewport
      }
    );

    intersectionObserver.observe(container);
  }

  // Page visibility handling - pause all when tab is hidden
  function handleVisibilityChange() {
    if (!sceneManager) return;

    if (document.hidden) {
      sceneManager.pause();
    } else if (isVisible) {
      sceneManager.resume();
    }
  }

  onMount(async () => {
    if (!browser) return;

    console.info(`[ThreeCanvas] Mounting canvas: ${id || effectType}`);

    // Check container dimensions
    const rect = container.getBoundingClientRect();
    console.info(`[ThreeCanvas] Container dimensions: ${rect.width}x${rect.height}`);

    if (rect.width === 0 || rect.height === 0) {
      console.warn(`[ThreeCanvas] Container has zero dimensions! Canvas may not be visible.`);
    }

    // Lazy load Three.js components
    const { SceneManager } = await import('./SceneManager');

    // Cap pixel ratio more aggressively on mobile
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const maxPixelRatio = isMobile ? 1.5 : 2;

    console.info(`[ThreeCanvas] isMobile: ${isMobile}, maxPixelRatio: ${maxPixelRatio}`);

    const manager = new SceneManager({
      container,
      alpha: true,
      antialias: !lowRes && !isMobile, // Disable antialiasing on mobile for better performance
      pixelRatio: lowRes ? 1 : Math.min(window.devicePixelRatio, maxPixelRatio),
      forceWebGL,
      adaptiveQuality
    });

    try {
      await manager.init();
      console.info(`[ThreeCanvas] SceneManager initialized successfully for: ${id || effectType}`);
    } catch (error) {
      console.error(`[ThreeCanvas] Failed to initialize SceneManager:`, error);
      return;
    }

    // Set reactive state - this triggers the $effect for initial resize
    sceneManager = manager;

    // Load the effect
    if (effectType === 'sinuous') {
      const { SinuousShaderEffect } = await import('./effects/SinuousShader');
      effectInstance = new SinuousShaderEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'sinuous-original') {
      const { SinuousOriginalEffect } = await import('./effects/SinuousOriginal');
      effectInstance = new SinuousOriginalEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'falling-cubes') {
      const { FallingCubesEffect } = await import('./effects/FallingCubes');
      effectInstance = new FallingCubesEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'snake-trails') {
      const { SnakeTrailsEffect } = await import('./effects/SnakeTrails');
      effectInstance = new SnakeTrailsEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'synaptic') {
      const { SynapticEffect } = await import('./effects/Synaptic');
      effectInstance = new SynapticEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'synaptic-multipass') {
      const { SynapticMultipassEffect } = await import('./effects/SynapticMultipass');
      effectInstance = new SynapticMultipassEffect(manager);
      await effectInstance.init();
    } else if (effectType === 'ether') {
      const { EtherEffect } = await import('./effects/Ether');
      effectInstance = new EtherEffect(manager);
      await effectInstance.init();
    }

    // Start render loop
    manager.startRenderLoop((delta: number) => {
      effectInstance?.update(delta);
    });

    isLoaded = true;

    // Get the actual canvas element for registry
    canvas = container.querySelector('canvas');

    // Register with canvas registry if ID provided
    if (id && canvas) {
      canvasRegistry.register(id, {
        container,
        canvas,
        sceneManager: manager,
        effectInstance
      });
    }

    // Setup visibility-based optimization (only for canvases not in registry - those are managed by ExpandedView)
    if (!id) {
      setupVisibilityObserver();
    }

    // Setup page visibility listener
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });

  onDestroy(() => {
    // Cleanup visibility observer
    intersectionObserver?.disconnect();
    intersectionObserver = null;

    // Cleanup page visibility listener
    if (browser) {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }

    // Unregister from canvas registry
    if (id) {
      canvasRegistry.unregister(id);
    }
    effectInstance?.destroy();
    sceneManager?.destroy();
  });
</script>

<div
  bind:this={container}
  bind:clientWidth={containerWidth}
  bind:clientHeight={containerHeight}
  class="three-canvas {className}"
  class:loaded={isLoaded}
>
</div>

<style lang="postcss">
  .three-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.4s ease-out;
  }

  .three-canvas.loaded {
    opacity: 1;
  }

  .three-canvas :global(canvas) {
    display: block;
    /* Don't force 100% - let Three.js control canvas size via setSize() */
    /* This prevents distortion when canvas buffer dimensions differ from CSS dimensions */
  }
</style>
