<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { canvasRegistry } from '$lib/stores/canvasRegistry';

  interface Props {
    type?: 'falling-cubes' | 'sinuous' | 'sinuous-original' | 'snake-trails' | 'synaptic' | 'synaptic-multipass' | 'ether';
    class?: string;
    /** Use lower pixel ratio for better performance on small cards */
    lowRes?: boolean;
    /** Unique ID for canvas teleportation system */
    id?: string;
  }

  let { type: effectType = 'sinuous', class: className = '', lowRes = false, id }: Props = $props();

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement | null = $state(null);
  let isLoaded = $state(false);
  let sceneManager = $state<any>(null);
  let effectInstance: any = null;

  // Svelte 5: Use bind:clientWidth/Height for resize (uses ResizeObserver internally)
  let containerWidth = $state(0);
  let containerHeight = $state(0);

  // React to dimension changes - runs when sceneManager or dimensions change
  $effect(() => {
    if (sceneManager && containerWidth > 0 && containerHeight > 0) {
      sceneManager.resize(containerWidth, containerHeight);
    }
  });

  onMount(async () => {
    if (!browser) return;

    // Lazy load Three.js components
    const { SceneManager } = await import('./SceneManager');

    const manager = new SceneManager({
      container,
      alpha: true,
      antialias: !lowRes,
      pixelRatio: lowRes ? 1 : Math.min(window.devicePixelRatio, 2)
    });

    await manager.init();

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
  });

  onDestroy(() => {
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
>
  {#if !isLoaded}
    <div class="loading">
      <div class="loading-cube"></div>
    </div>
  {/if}
</div>

<style lang="postcss">
  .three-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .three-canvas :global(canvas) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  .loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }

  .loading-cube {
    width: 20px;
    height: 20px;
    background: var(--color-base3);
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1); }
  }
</style>
