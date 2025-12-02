<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { cardTransition, showOverlay } from '$lib/stores/transition';
  import { canvasRegistry } from '$lib/stores/canvasRegistry';
  import PageContent from './PageContent.svelte';

  // Animation constants - fast, smooth, professional
  const EXPAND_DURATION = 350; // ms - fast but smooth
  const COLLAPSE_DURATION = 300; // ms - slightly faster for close
  const EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'; // iOS-like spring easing

  // Animation state
  let containerEl: HTMLDivElement;
  let heroEl: HTMLDivElement;
  let canvasSlotEl: HTMLDivElement;
  let animationPhase = $state<'initial' | 'animating' | 'complete'>('initial');

  // Visibility-based rendering optimization
  let intersectionObserver: IntersectionObserver | null = null;
  let isCanvasVisible = $state(true);

  // Viewport dimensions
  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  // Calculate transform for FLIP animation
  function getInitialTransform(): string {
    const state = cardTransition.get();
    if (!state.sourceRect || viewportWidth === 0 || viewportHeight === 0) return '';

    const rect = state.sourceRect;
    const scaleX = rect.width / viewportWidth;
    const scaleY = rect.height / viewportHeight;
    const translateX = rect.left - (viewportWidth - rect.width) / 2;
    const translateY = rect.top - (viewportHeight - rect.height) / 2;

    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  }

  // Store original rect for collapse
  let originalRect: { left: number; top: number; width: number; height: number } | null = null;

  // Start expand animation
  async function startExpandAnimation() {
    if (!heroEl || !canvasSlotEl) return;

    const state = cardTransition.get();
    const canvasId = state.canvasId;

    // Store original rect for collapse animation
    if (state.sourceRect) {
      originalRect = {
        left: state.sourceRect.left,
        top: state.sourceRect.top,
        width: state.sourceRect.width,
        height: state.sourceRect.height
      };
    }

    // Set initial position FIRST (before any DOM changes)
    const initialTransform = getInitialTransform();
    heroEl.style.transform = initialTransform;
    heroEl.style.borderRadius = '8px';
    heroEl.style.transition = 'none';

    // Lock resize to prevent ResizeObserver-triggered resizes during animation
    if (canvasId) {
      canvasRegistry.lockResize(canvasId);
    }

    // Teleport the canvas to expanded view - DON'T resize yet
    // The CSS transform will handle visual scaling during animation
    if (canvasId) {
      canvasRegistry.teleport(canvasId, canvasSlotEl);
    }

    // Force a reflow to ensure initial state is painted
    void heroEl.offsetHeight;

    // Start animation immediately
    animationPhase = 'animating';

    // Apply transition and target state in single rAF
    requestAnimationFrame(() => {
      if (!heroEl) return;

      heroEl.style.transition = `transform ${EXPAND_DURATION}ms ${EASING}, border-radius ${EXPAND_DURATION}ms ${EASING}`;
      heroEl.style.transform = 'translate(0, 0) scale(1, 1)';
      heroEl.style.borderRadius = '0px';

      // NO resize during animation - CSS transform handles scaling
    });

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, EXPAND_DURATION + 20));

    // Unlock resize and do final resize ONCE after animation completes
    if (canvasId) {
      canvasRegistry.unlockResize(canvasId);
      canvasRegistry.forceResize(canvasId);
    }

    animationPhase = 'complete';
    cardTransition.expandComplete();

    // Setup visibility observer after expansion
    setupVisibilityObserver();

    // Update URL cosmetically
    if (state.targetRoute && browser) {
      history.pushState({}, '', state.targetRoute);
    }
  }

  // Start collapse animation
  async function startCollapseAnimation() {
    if (!heroEl) return;

    const state = cardTransition.get();
    const canvasId = state.canvasId;

    // Disconnect visibility observer before collapse
    intersectionObserver?.disconnect();
    intersectionObserver = null;

    // Resume canvas rendering for collapse animation
    if (canvasId) {
      canvasRegistry.resume(canvasId);
    }

    // Scroll to top first (instant)
    if (containerEl) {
      containerEl.scrollTop = 0;
    }

    animationPhase = 'animating';

    // Lock resize and set canvas to target size BEFORE animation starts
    // This way CSS transform scales it down smoothly without jumps
    if (canvasId) {
      canvasRegistry.lockResize(canvasId);
      if (originalRect) {
        canvasRegistry.forceResize(canvasId, originalRect.width, originalRect.height);
      }
    }

    // Force reflow then animate
    void heroEl.offsetHeight;

    requestAnimationFrame(() => {
      if (!heroEl) return;
      heroEl.style.transition = `transform ${COLLAPSE_DURATION}ms ${EASING}, border-radius ${COLLAPSE_DURATION}ms ${EASING}`;
      heroEl.style.transform = getInitialTransform();
      heroEl.style.borderRadius = '8px';
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, COLLAPSE_DURATION + 20));

    // Return canvas to original card and unlock resize
    if (canvasId) {
      canvasRegistry.unlockResize(canvasId);
      canvasRegistry.returnHome(canvasId);
    }

    // Reset transition state
    cardTransition.collapseComplete();
    animationPhase = 'initial';
    originalRect = null;

    // Update URL without full navigation
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

  // Watch for expansion trigger
  $effect(() => {
    const isExpanding = $cardTransition.isExpanding;
    if (isExpanding && animationPhase === 'initial' && heroEl && viewportWidth > 0) {
      startExpandAnimation();
    }
  });

  // Watch for collapse trigger
  $effect(() => {
    const isCollapsing = $cardTransition.isCollapsing;
    if (isCollapsing && animationPhase === 'complete') {
      startCollapseAnimation();
    }
  });

  // Setup IntersectionObserver for visibility-based rendering
  function setupVisibilityObserver() {
    if (!browser || !canvasSlotEl) return;

    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isCanvasVisible = entry.isIntersecting;

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
      {
        // Start pausing when hero is 10% visible
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    intersectionObserver.observe(canvasSlotEl);
  }

  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', handleKeydown);
    }
    // Cleanup observer
    intersectionObserver?.disconnect();
  });

  // Close handler
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
    <!-- Hero container with teleported canvas -->
    <div
      bind:this={heroEl}
      class="hero-container"
      style="will-change: transform;"
    >
      <!-- Canvas slot - teleported canvas goes here -->
      <div bind:this={canvasSlotEl} class="canvas-slot"></div>

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
    z-index: 0;
  }

  /* Teleported canvas needs to fill slot */
  .canvas-slot :global(.three-canvas) {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  /* Force canvas element to stretch and fill container during animation */
  /* This creates smooth scaling (slightly blurry) then snaps to crisp at end */
  .canvas-slot :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
  }

  /* GPU acceleration for smooth animation */
  .animating .canvas-slot :global(canvas) {
    will-change: transform;
    image-rendering: auto; /* smooth scaling during animation */
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
