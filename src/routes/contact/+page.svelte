<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import ContactContent from '$lib/components/content/ContactContent.svelte';
  import Footer from '$lib/features/layout/Footer.svelte';
  import Metadata from '$features/seo/Metadata.svelte';

  // Get theme from layout data
  let theme = $derived($page.data?.theme);

  // Dynamically load ThreeCanvas
  let ThreeCanvas = $state<any>(null);
  let canvasReady = $state(false);
  let mounted = $state(false);

  onMount(() => {
    mounted = true;
    // Load ThreeCanvas component
    import('$lib/three/ThreeCanvas.svelte').then(module => {
      ThreeCanvas = module.default;
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        canvasReady = true;
      }, 50);
    });
  });

  function handleClose() {
    goto('/');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<Metadata
  title="Contact - Oraklex | Get in Touch"
  description="Contact Oraklex for partnerships, data licensing, or to learn more about our AI visibility and commerce intelligence solutions."
/>

<div class="expanded-page">
  <!-- Hero with Three.js canvas -->
  <div class="hero-container">
    {#if ThreeCanvas && canvasReady}
      <div class="canvas-wrapper">
        <ThreeCanvas type="ether" />
      </div>
    {/if}

    <!-- Hero overlay with title -->
    <div class="hero-overlay">
      <div class="hero-content" class:visible={mounted}>
        <span class="hero-label">Get in Touch</span>
        <h1 class="hero-title">Contact</h1>
        <p class="hero-desc">Reach out to explore partnerships and opportunities.</p>
      </div>

      <!-- Close button -->
      <button class="close-btn" class:visible={mounted} onclick={handleClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" class:visible={mounted}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </div>

  <!-- Content area -->
  <div class="content-container app-container">
    <div class="content-inner">
      <ContactContent />
    </div>
    <Footer {theme} />
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .expanded-page {
    position: fixed;
    inset: 0;
    z-index: 10000;
    background: #0a0a0a;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .hero-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: #0a0a0a;
    overflow: hidden;
  }

  .canvas-wrapper {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }

  .canvas-wrapper :global(.three-canvas) {
    position: absolute !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }

  .canvas-wrapper :global(canvas) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
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
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.4s ease 0.2s, transform 0.4s ease 0.2s;
  }

  .hero-content.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .hero-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #666;
    margin-bottom: 12px;
  }

  .hero-title {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .hero-desc {
    font-size: 1.125rem;
    color: #888;
    margin: 16px 0 0 0;
    line-height: 1.6;
    max-width: 600px;
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
    transition: opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s, background 0.2s ease, border-color 0.2s ease;
  }

  .close-btn.visible {
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
    opacity: 0;
    transition: opacity 0.3s ease 0.5s;
  }

  .scroll-indicator.visible {
    opacity: 1;
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
    @apply bg-base0;
    min-height: 50vh;
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.5s ease forwards;
    animation-delay: 0.3s;
  }

  @keyframes fadeInUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .content-inner {
    width: 100%;
    padding: 60px 0 40px;
  }

  @media (max-width: 768px) {
    .hero-overlay {
      padding: 24px;
    }

    .content-inner {
      padding: 40px 0 20px;
    }
  }
</style>
