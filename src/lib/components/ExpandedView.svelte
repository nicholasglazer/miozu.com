<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';
  import { browser } from '$app/environment';
  import { cardTransition, showOverlay } from '$lib/stores/transition';
  import { canvasRegistry } from '$lib/stores/canvasRegistry';
  import PageContent from './PageContent.svelte';

  // Animation constants
  const EXPAND_DURATION = 380;
  const COLLAPSE_DURATION = 320;
  const EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  // Element refs - Svelte 5 requires $state for bind:this
  let containerEl = $state<HTMLDivElement | null>(null);
  let heroEl = $state<HTMLDivElement | null>(null);
  let canvasSlotEl = $state<HTMLDivElement | null>(null);

  // Animation state
  let animationPhase = $state<'initial' | 'animating' | 'complete'>('initial');
  let intersectionObserver: IntersectionObserver | null = null;

  // Viewport dimensions
  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  // Rect type for animation calculations
  type Rect = { left: number; top: number; width: number; height: number };

  // Calculate FLIP transform with sub-pixel precision
  function calculateTransform(rect: Rect, vw: number, vh: number): string {
    if (vw === 0 || vh === 0) return '';
    const scaleX = Math.round((rect.width / vw) * 10000) / 10000;
    const scaleY = Math.round((rect.height / vh) * 10000) / 10000;
    const translateX = Math.round((rect.left - (vw - rect.width) / 2) * 100) / 100;
    const translateY = Math.round((rect.top - (vh - rect.height) / 2) * 100) / 100;
    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  }

  // Start expand animation - LIVE CANVAS approach
  async function startExpandAnimation() {
    const hero = heroEl;
    const slot = canvasSlotEl;
    if (!hero || !slot) return;

    const state = cardTransition.get();
    const canvasId = state.canvasId;
    const sourceRect = state.sourceRect;

    // Lock resize to preserve shader state during animation
    if (canvasId) {
      canvasRegistry.lockResize(canvasId);
      canvasRegistry.teleport(canvasId, slot);
    }

    // Set initial transform (scaled down to card size)
    const initialTransform = sourceRect
      ? calculateTransform(sourceRect, viewportWidth, viewportHeight)
      : '';
    hero.style.transform = initialTransform;
    hero.style.borderRadius = '8px';
    hero.style.transition = 'none';
    void hero.offsetHeight; // Force reflow

    animationPhase = 'animating';

    // Animate to fullscreen
    requestAnimationFrame(() => {
      if (!heroEl) return;
      heroEl.style.transition = `transform ${EXPAND_DURATION}ms ${EASING}, border-radius ${EXPAND_DURATION}ms ${EASING}`;
      heroEl.style.transform = 'translate(0, 0) scale(1, 1)';
      heroEl.style.borderRadius = '0px';
    });

    await new Promise(resolve => setTimeout(resolve, EXPAND_DURATION + 30));

    // Unlock and complete
    if (canvasId) {
      canvasRegistry.unlockResize(canvasId);
    }

    animationPhase = 'complete';
    cardTransition.expandComplete();
    setupVisibilityObserver();

    // Update URL cosmetically
    if (state.targetRoute && browser) {
      history.pushState({}, '', state.targetRoute);
    }

    // Delayed quality upgrade for retina displays
    if (canvasId) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const currentState = cardTransition.get();
      if (currentState.isExpanded && !currentState.isCollapsing) {
        canvasRegistry.upgradeQuality(canvasId);
      }
    }
  }

  // Start collapse animation - LIVE CANVAS approach
  async function startCollapseAnimation() {
    const hero = heroEl;
    if (!hero) return;

    const state = cardTransition.get();
    const canvasId = state.canvasId;
    // Use the stored sourceRect from the transition store - this is the original card position
    const sourceRect = state.sourceRect;

    // Cleanup visibility observer
    intersectionObserver?.disconnect();
    intersectionObserver = null;

    // Resume canvas and scroll to top
    if (canvasId) canvasRegistry.resume(canvasId);
    if (containerEl) containerEl.scrollTop = 0;

    // Lock resize to preserve animation state
    if (canvasId) canvasRegistry.lockResize(canvasId);

    animationPhase = 'animating';

    // Set starting state (fullscreen)
    hero.style.transition = 'none';
    hero.style.transform = 'translate(0, 0) scale(1, 1)';
    hero.style.borderRadius = '0px';
    void hero.offsetHeight; // Force reflow

    // Animate back to original card position using stored sourceRect
    const collapseTransform = sourceRect
      ? calculateTransform(sourceRect, viewportWidth, viewportHeight)
      : '';

    requestAnimationFrame(() => {
      if (!heroEl) return;
      heroEl.style.transition = `transform ${COLLAPSE_DURATION}ms ${EASING}, border-radius ${COLLAPSE_DURATION}ms ${EASING}`;
      heroEl.style.transform = collapseTransform;
      heroEl.style.borderRadius = '8px';
    });

    await new Promise(resolve => setTimeout(resolve, COLLAPSE_DURATION + 20));

    // Resize canvas to original card dimensions before returning (prevents jump)
    if (canvasId && sourceRect) {
      canvasRegistry.forceResize(canvasId, Math.floor(sourceRect.width), Math.floor(sourceRect.height));
    }

    // Return canvas home
    if (canvasId) {
      canvasRegistry.unlockResize(canvasId);
      canvasRegistry.returnHome(canvasId);
    }

    // Reset state
    cardTransition.collapseComplete();
    animationPhase = 'initial';

    if (browser) {
      history.replaceState({}, '', '/');
    }
  }

  // Handle escape key
  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      const state = cardTransition.get();
      if (state.isExpanded && !state.isCollapsing) {
        cardTransition.collapse();
      }
    }
  }

  // Watch for expansion trigger - use untrack for animation functions
  $effect(() => {
    const isExpanding = $cardTransition.isExpanding;
    const phase = animationPhase;
    const hero = heroEl;
    const slot = canvasSlotEl;
    const vw = viewportWidth;

    if (isExpanding && phase === 'initial' && hero && slot && vw > 0) {
      untrack(() => startExpandAnimation());
    }
  });

  // Watch for collapse trigger
  $effect(() => {
    const isCollapsing = $cardTransition.isCollapsing;
    const phase = animationPhase;

    if (isCollapsing && phase === 'complete') {
      untrack(() => startCollapseAnimation());
    }
  });

  // Setup IntersectionObserver for visibility-based rendering
  function setupVisibilityObserver() {
    const slot = canvasSlotEl;
    if (!browser || !slot) return;

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const state = cardTransition.get();
        const canvasId = state.canvasId;

        if (canvasId) {
          if (entry.isIntersecting) {
            canvasRegistry.resume(canvasId);
          } else {
            canvasRegistry.pause(canvasId);
          }
        }
      },
      { threshold: 0.1 }
    );

    intersectionObserver.observe(slot);
  }

  // Lifecycle
  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', handleKeydown);
    }
    intersectionObserver?.disconnect();
  });

  function handleClose() {
    const state = cardTransition.get();
    if (state.isExpanded && !state.isCollapsing) {
      cardTransition.collapse();
    }
  }
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

{#if $showOverlay}
  <div
    bind:this={containerEl}
    class="expanded-view"
    class:animating={animationPhase === 'animating'}
    class:complete={animationPhase === 'complete'}
  >
    <!-- Hero container -->
    <div
      bind:this={heroEl}
      class="hero-container"
      style="will-change: transform;"
    >
      <!-- Canvas slot - live canvas teleported here immediately -->
      <div
        bind:this={canvasSlotEl}
        class="canvas-slot visible"
      ></div>

      <!-- Hero overlay with title -->
      <div class="hero-overlay">
        <div class="hero-content">
          {#if $cardTransition.blockInfo}
            <span class="hero-label">{$cardTransition.blockInfo.label}</span>
            <h1 class="hero-title">{$cardTransition.blockInfo.title}</h1>
            {#if $cardTransition.blockInfo.description}
              <p class="hero-desc">{$cardTransition.blockInfo.description}</p>
            {/if}
          {/if}
        </div>

        <!-- Close button -->
        <button class="close-btn" onclick={handleClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Scroll indicator -->
        {#if animationPhase === 'complete'}
          <div class="scroll-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12l7 7 7-7"/>
            </svg>
          </div>
        {/if}
      </div>
    </div>

    <!-- Scrollable content area -->
    {#if animationPhase === 'complete' && $cardTransition.targetRoute}
      <div class="content-container">
        <div class="content-inner">
          <PageContent route={$cardTransition.targetRoute} />
        </div>
      </div>
    {/if}
  </div>
{/if}

<style lang="postcss">
  .expanded-view {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: #0a0a0a;
    overflow: hidden;
  }

  .expanded-view.complete {
    overflow-y: auto;
    overflow-x: hidden;
  }

  .hero-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #0a0a0a;
    transform-origin: center center;
    overflow: hidden;
  }

  .canvas-slot {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .canvas-slot.visible {
    opacity: 1;
  }

  /* Canvas fills slot */
  .canvas-slot :global(.three-canvas) {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .canvas-slot :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  .complete .hero-container {
    position: relative;
    height: 100vh;
    min-height: 100vh;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 48px;
    background: linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.5) 40%, transparent 70%);
    pointer-events: none;
    z-index: 10;
  }

  .hero-content {
    max-width: 800px;
  }

  .hero-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #666;
    margin-bottom: 12px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .complete .hero-label {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.03em;
    margin: 0;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s ease 0.05s, transform 0.2s ease 0.05s;
  }

  .complete .hero-title {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-desc {
    font-size: 1.125rem;
    color: #888;
    margin: 16px 0 0 0;
    line-height: 1.6;
    max-width: 600px;
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.2s ease 0.1s, transform 0.2s ease 0.1s;
  }

  .complete .hero-desc {
    opacity: 1;
    transform: translateY(0);
  }

  .close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    pointer-events: auto;
    opacity: 0;
    transform: scale(0.9);
    transition: opacity 0.15s ease, transform 0.15s ease, background 0.2s ease, border-color 0.2s ease;
  }

  .complete .close-btn {
    opacity: 1;
    transform: scale(1);
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .scroll-indicator {
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    color: #666;
    animation: bounce 2s infinite;
    pointer-events: none;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }

  .content-container {
    position: relative;
    background: #f8f8f8;
    min-height: 50vh;
  }

  .content-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px;
  }

  /* Smooth content fade in */
  .content-container {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
    animation-delay: 0.1s;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
