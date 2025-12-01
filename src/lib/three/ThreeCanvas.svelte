<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    effect?: 'falling-cubes' | 'sinuous' | 'sinuous-original' | 'snake-trails' | 'synaptic' | 'synaptic-multipass' | 'ether';
    class?: string;
  }

  let { effect = 'sinuous', class: className = '' }: Props = $props();

  let container: HTMLDivElement;
  let isLoaded = $state(false);
  let sceneManager: any = null;
  let effectInstance: any = null;

  onMount(async () => {
    if (!browser) return;

    // Lazy load Three.js components
    const { SceneManager } = await import('./SceneManager');

    sceneManager = new SceneManager({
      container,
      alpha: true,
      antialias: true
    });

    await sceneManager.init();

    // Load the effect
    if (effect === 'sinuous') {
      const { SinuousShaderEffect } = await import('./effects/SinuousShader');
      effectInstance = new SinuousShaderEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'sinuous-original') {
      const { SinuousOriginalEffect } = await import('./effects/SinuousOriginal');
      effectInstance = new SinuousOriginalEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'falling-cubes') {
      const { FallingCubesEffect } = await import('./effects/FallingCubes');
      effectInstance = new FallingCubesEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'snake-trails') {
      const { SnakeTrailsEffect } = await import('./effects/SnakeTrails');
      effectInstance = new SnakeTrailsEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'synaptic') {
      const { SynapticEffect } = await import('./effects/Synaptic');
      effectInstance = new SynapticEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'synaptic-multipass') {
      const { SynapticMultipassEffect } = await import('./effects/SynapticMultipass');
      effectInstance = new SynapticMultipassEffect(sceneManager);
      await effectInstance.init();
    } else if (effect === 'ether') {
      const { EtherEffect } = await import('./effects/Ether');
      effectInstance = new EtherEffect(sceneManager);
      await effectInstance.init();
    }

    // Start render loop
    sceneManager.startRenderLoop((delta: number) => {
      effectInstance?.update(delta);
    });

    isLoaded = true;
  });

  onDestroy(() => {
    effectInstance?.destroy();
    sceneManager?.destroy();
  });
</script>

<div bind:this={container} class="three-canvas {className}">
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
