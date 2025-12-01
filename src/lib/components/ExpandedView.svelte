<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { cardTransition, showOverlay } from '$lib/stores/transition';
  import PageContent from './PageContent.svelte';

  // Lazy load Three.js canvas
  let ThreeCanvas: any = $state(null);

  $effect(() => {
    if (browser && $showOverlay) {
      import('$lib/three/ThreeCanvas.svelte').then(module => {
        ThreeCanvas = module.default;
      });
    }
  });

  // Animation state
  let containerEl: HTMLDivElement;
  let heroEl: HTMLDivElement;
  let animationPhase = $state<'initial' | 'animating' | 'complete'>('initial');

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

  // Start expand animation
  async function startExpandAnimation() {
    if (!heroEl) return;

    // Set initial position (card position)
    const initialTransform = getInitialTransform();
    heroEl.style.transform = initialTransform;
    heroEl.style.borderRadius = '8px';

    // Force reflow
    heroEl.offsetHeight;

    animationPhase = 'animating';

    // Animate to fullscreen using requestAnimationFrame for smooth 60fps
    requestAnimationFrame(() => {
      heroEl.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      heroEl.style.transform = 'translate(0, 0) scale(1, 1)';
      heroEl.style.borderRadius = '0px';
    });

    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 520));

    animationPhase = 'complete';
    cardTransition.expandComplete();

    // Update URL without full navigation
    const state = cardTransition.get();
    if (state.targetRoute) {
      goto(state.targetRoute, { replaceState: false, noScroll: true });
    }
  }

  // Start collapse animation
  async function startCollapseAnimation() {
    if (!heroEl) return;

    // Scroll to top first
    if (containerEl) {
      containerEl.scrollTop = 0;
    }

    await tick();
    animationPhase = 'animating';

    // Animate back to card position
    requestAnimationFrame(() => {
      heroEl.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      heroEl.style.transform = getInitialTransform();
      heroEl.style.borderRadius = '8px';
    });

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 420));

    // Navigate back to home
    goto('/', { replaceState: false, noScroll: true });

    cardTransition.collapseComplete();
    animationPhase = 'initial';
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

  // Watch for expansion trigger - use $cardTransition directly for reactivity
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

  onMount(() => {
    if (browser) {
      window.addEventListener('keydown', handleKeydown);
    }
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('keydown', handleKeydown);
    }
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
    <!-- Three.js Hero -->
    <div
      bind:this={heroEl}
      class="hero-container"
      style="will-change: transform;"
    >
      {#if ThreeCanvas && $cardTransition.effectType}
        <ThreeCanvas type={$cardTransition.effectType} />
      {/if}

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
    background: #111;
    transform-origin: center center;
    overflow: hidden;
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
    transform: translateY(20px);
    transition: all 0.4s ease 0.3s;
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
    transform: translateY(20px);
    transition: all 0.4s ease 0.4s;
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
    transform: translateY(20px);
    transition: all 0.4s ease 0.5s;
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
    transform: scale(0.8);
    transition: all 0.3s ease 0.5s;
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
