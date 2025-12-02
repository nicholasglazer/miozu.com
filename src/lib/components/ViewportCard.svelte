<script lang="ts">
  /**
   * ViewportCard - A card that registers its position with the viewport registry
   *
   * The GlobalCanvas renders into this area using scissor/viewport.
   * This enables smooth transitions without recreating WebGL contexts.
   */

  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { viewportRegistry } from '$lib/stores/viewportRegistry';

  // Props
  interface Props {
    id: string;
    effectType: string;
    class?: string;
  }

  let { id, effectType, class: className = '' }: Props = $props();

  // Element reference
  let containerEl: HTMLDivElement;

  // Update registry with current position
  function updatePosition() {
    if (!containerEl || !browser) return;

    const rect = containerEl.getBoundingClientRect();
    viewportRegistry.updateRect(id, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });
  }

  // Register and set up tracking
  onMount(() => {
    if (!browser || !containerEl) return;

    // Initial registration
    const rect = containerEl.getBoundingClientRect();
    viewportRegistry.register(id, effectType, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });

    // Update on scroll and resize
    const handleScroll = () => requestAnimationFrame(updatePosition);
    const handleResize = () => requestAnimationFrame(updatePosition);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Also observe element size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePosition);
    });
    resizeObserver.observe(containerEl);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  });

  onDestroy(() => {
    if (browser) {
      viewportRegistry.unregister(id);
    }
  });
</script>

<div
  bind:this={containerEl}
  class="viewport-card {className}"
  data-viewport-id={id}
>
  <slot />
</div>

<style>
  .viewport-card {
    position: relative;
    width: 100%;
    height: 100%;
  }
</style>
