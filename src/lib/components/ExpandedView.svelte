<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { cardTransition, showOverlay } from '$lib/stores/transition';
  import { canvasRegistry } from '$lib/stores/canvasRegistry';
  import PageContent from './PageContent.svelte';

  // Animation constants - fast, smooth, professional
  const EXPAND_DURATION = 380; // ms
  const COLLAPSE_DURATION = 320; // ms
  // Smooth ease-out without overshoot - precise and professional
  const EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  // Animation state
  let containerEl: HTMLDivElement;
  let heroEl: HTMLDivElement;
  let canvasSlotEl: HTMLDivElement;
  let animationPhase = $state<'initial' | 'animating' | 'complete'>('initial');

  // Track original canvas dimensions for CSS scaling
  let originalCanvasWidth = $state(0);
  let originalCanvasHeight = $state(0);

  // Visibility-based rendering optimization
  let intersectionObserver: IntersectionObserver | null = null;
  let isCanvasVisible = $state(true);

  // Viewport dimensions
  let viewportWidth = $state(0);
  let viewportHeight = $state(0);

  // Calculate transform for FLIP animation with sub-pixel precision
  function calculateTransform(rect: { left: number; top: number; width: number; height: number }): string {
    if (viewportWidth === 0 || viewportHeight === 0) return '';

    // Use high precision for scale (4 decimals) to avoid size jumps
    const scaleX = Math.round((rect.width / viewportWidth) * 10000) / 10000;
    const scaleY = Math.round((rect.height / viewportHeight) * 10000) / 10000;
    // Round translation to 2 decimals for smooth positioning
    const translateX = Math.round((rect.left - (viewportWidth - rect.width) / 2) * 100) / 100;
    const translateY = Math.round((rect.top - (viewportHeight - rect.height) / 2) * 100) / 100;

    return `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`;
  }

  // Get transform from stored sourceRect (for expand animation)
  function getInitialTransform(): string {
    const state = cardTransition.get();
    if (!state.sourceRect) return '';
    return calculateTransform(state.sourceRect);
  }

  // Store original rect for collapse
  let originalRect: { left: number; top: number; width: number; height: number } | null = null;

  // Start expand animation - LIVE CANVAS approach
  // The canvas continues animating during expansion via CSS scaling
  async function startExpandAnimation() {
    if (!heroEl) return;

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
      // Store original dimensions for CSS scaling
      originalCanvasWidth = state.sourceRect.width;
      originalCanvasHeight = state.sourceRect.height;
    }

    // STEP 1: Lock resize to prevent WebGL renderer from changing
    // This preserves the exact shader state (particles, positions, etc.)
    if (canvasId) {
      canvasRegistry.lockResize(canvasId);
    }

    // STEP 2: Teleport canvas IMMEDIATELY - it will be scaled by CSS transform
    // The shader keeps running at original resolution
    if (canvasId && canvasSlotEl) {
      canvasRegistry.teleport(canvasId, canvasSlotEl);
    }

    // Set initial position (scaled down to card size)
    const initialTransform = getInitialTransform();
    heroEl.style.transform = initialTransform;
    heroEl.style.borderRadius = '8px';
    heroEl.style.transition = 'none';

    // Force reflow
    void heroEl.offsetHeight;

    // Start animation - canvas is LIVE and continues animating
    animationPhase = 'animating';

    // Apply CSS transition - the canvas scales up smoothly via CSS
    requestAnimationFrame(() => {
      if (!heroEl) return;
      heroEl.style.transition = `transform ${EXPAND_DURATION}ms ${EASING}, border-radius ${EXPAND_DURATION}ms ${EASING}`;
      heroEl.style.transform = 'translate(0, 0) scale(1, 1)';
      heroEl.style.borderRadius = '0px';
    });

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, EXPAND_DURATION + 30));

    // STEP 3: Unlock resize (animation preserved up to this point)
    if (canvasId) {
      canvasRegistry.unlockResize(canvasId);
    }

    animationPhase = 'complete';
    cardTransition.expandComplete();

    // Setup visibility observer after expansion
    setupVisibilityObserver();

    // Update URL cosmetically
    if (state.targetRoute && browser) {
      history.pushState({}, '', state.targetRoute);
    }

    // STEP 4: Delayed quality upgrade for retina displays
    // Wait for user to settle into the view, then upgrade to full resolution
    // This resets the shader but provides crisp visuals for reading
    if (canvasId) {
      await new Promise(resolve => setTimeout(resolve, 400));
      // Only upgrade if still expanded (user might have closed)
      const currentState = cardTransition.get();
      if (currentState.isExpanded && !currentState.isCollapsing) {
        // Upgrade to retina quality + full viewport resolution
        canvasRegistry.upgradeQuality(canvasId);
      }
    }
  }

  // Start collapse animation - LIVE CANVAS approach
  async function startCollapseAnimation() {
    if (!heroEl) return;

    const state = cardTransition.get();
    const canvasId = state.canvasId;

    // Disconnect visibility observer before collapse
    intersectionObserver?.disconnect();
    intersectionObserver = null;

    // Resume canvas rendering for collapse
    if (canvasId) {
      canvasRegistry.resume(canvasId);
    }

    // Scroll to top first (instant)
    if (containerEl) {
      containerEl.scrollTop = 0;
    }

    // STEP 1: Lock resize - canvas is already at card resolution from expand
    // Don't resize - preserve animation state
    if (canvasId) {
      canvasRegistry.lockResize(canvasId);
    }

    animationPhase = 'animating';

    // STEP 2: Explicitly set starting state (fullscreen) with no transition
    // This ensures the browser has a clear starting point for the animation
    heroEl.style.transition = 'none';
    heroEl.style.transform = 'translate(0, 0) scale(1, 1)';
    heroEl.style.borderRadius = '0px';

    // Force reflow to apply starting state
    void heroEl.offsetHeight;

    // STEP 3: Animate via CSS transform - canvas continues animating
    requestAnimationFrame(() => {
      if (!heroEl) return;
      heroEl.style.transition = `transform ${COLLAPSE_DURATION}ms ${EASING}, border-radius ${COLLAPSE_DURATION}ms ${EASING}`;
      heroEl.style.transform = getInitialTransform();
      heroEl.style.borderRadius = '8px';
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, COLLAPSE_DURATION + 20));

    // STEP 4: Unlock resize and return canvas to original card
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
    if (isExpanding && animationPhase === 'initial' && heroEl && canvasSlotEl && viewportWidth > 0) {
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
