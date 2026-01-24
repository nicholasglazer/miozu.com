<script lang="ts">
  import { browser } from '$app/environment';
  import Metadata from '$features/seo/Metadata.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import {appName, domain} from '$settings/global';
  import { cardTransition } from '$lib/reactiveStates/cardTransition.svelte';
  import MegaMenu from '$lib/features/layout/MegaMenu.svelte';
  import Logo from '$lib/components/Logo.svelte';

  // Priority-based lazy loading for ThreeCanvas
  // Phase 1: Hero + About (visible immediately, highest priority)
  // Phase 2: Other cards (load after small delay)
  let ThreeCanvas = $state<any>(null);
  let priorityCardsReady = $state(false);
  let allCardsReady = $state(false);

  $effect(() => {
    if (browser) {
      // Load ThreeCanvas component
      import('$lib/three/ThreeCanvas.svelte').then(module => {
        ThreeCanvas = module.default;
        // Phase 1: Priority cards (Hero + About) render immediately
        priorityCardsReady = true;

        // Phase 2: Other cards load after 50ms delay
        // This allows Hero + About to initialize first
        setTimeout(() => {
          allCardsReady = true;
        }, 50);
      });
    }
  });

  // Card configuration for transitions
  const cardConfigs: Record<string, { route: string; effectType: string; canvasId: string; label: string; title: string; description: string }> = {
    about: {
      route: '/about',
      effectType: 'sinuous-original',
      canvasId: 'canvas-about',
      label: 'Enterprise',
      title: 'Design System',
      description: 'AI-first components for scalable enterprise applications and teams.'
    },
    platform: {
      route: '/solutions',
      effectType: 'synaptic-multipass',
      canvasId: 'canvas-platform',
      label: 'Components',
      title: 'Library',
      description: 'Production-ready Svelte 5 components with enterprise features.'
    },
    data: {
      route: '/data',
      effectType: 'synaptic',
      canvasId: 'canvas-data',
      label: 'Design',
      title: 'Tokens',
      description: 'Comprehensive design tokens and Base16 theme system.'
    },
    contact: {
      route: '/contact',
      effectType: 'ether',
      canvasId: 'canvas-contact',
      label: 'Enterprise',
      title: 'Solutions',
      description: 'Custom implementation and enterprise support programs.'
    }
  };

  // Handle card click - always use FLIP animation for smooth transitions
  // ExpandedView will handle navigation to fullscreen pages after animation
  function handleCardClick(e: MouseEvent, cardKey: string) {
    e.preventDefault();

    const config = cardConfigs[cardKey];
    const card = e.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();

    cardTransition.expand({
      targetRoute: config.route,
      effectType: config.effectType,
      canvasId: config.canvasId,
      sourceRect: rect,
      blockInfo: {
        label: config.label,
        title: config.title,
        description: config.description
      }
    });
  }

  // Track which card is being transitioned
  // fadingCard - immediately when expansion starts (for text fade)
  // expandingCard - only after animation completes (to hide card)
  let fadingCard = $state<string | null>(null);
  let expandingCard = $state<string | null>(null);

  $effect(() => {
    // Fade text immediately when expansion starts
    if (cardTransition.isExpanding) {
      for (const [key, config] of Object.entries(cardConfigs)) {
        if (config.route === cardTransition.targetRoute && config.effectType === cardTransition.effectType) {
          fadingCard = key;
          break;
        }
      }
    }

    if (cardTransition.isExpanded) {
      // Hide card after expansion animation is complete
      for (const [key, config] of Object.entries(cardConfigs)) {
        if (config.route === cardTransition.targetRoute && config.effectType === cardTransition.effectType) {
          expandingCard = key;
          break;
        }
      }
    } else if (!cardTransition.isExpanding && !cardTransition.isCollapsing) {
      expandingCard = null;
      fadingCard = null;
    }
  });
</script>

<Metadata
  title="Miozu — Enterprise Design System with AI-First Components"
  description="Enterprise design system built for scalable teams. AI-first Svelte 5 components, design tokens, and comprehensive enterprise features for production applications."
  canonicalUrl={domain}
  ogType="website"
  ogImage={`${domain}/images/miozu-og-banner.jpg`}
  ogImageAlt="Miozu - Enterprise Design System"
  robots="index, follow"
/>

<JsonLd
  type="Organization"
  data={{
    name: appName,
    description: 'Enterprise design system provider specializing in AI-first Svelte 5 components and scalable design tokens for enterprise teams and applications.',
    url: domain,
    logo: `${domain}/favicon.svg`,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@miozu.com',
      contactType: 'enterprise design system inquiries'
    },
    parentOrganization: {
      '@type': 'Organization',
      name: 'Up Go Corp.',
      url: 'https://upgo.ca'
    }
  }}
/>

<!-- WebSite Schema for SEO -->
<JsonLd
  type="WebSite"
  data={{
    name: appName,
    url: domain,
    description: 'Enterprise design system built for scalable teams. AI-first Svelte 5 components, comprehensive design tokens, and enterprise features for production applications.',
    publisher: {
      '@type': 'Organization',
      name: appName,
      url: domain
    }
  }}
/>

<!-- Corporation Schema with Products -->
<JsonLd
  type="Corporation"
  data={{
    name: appName,
    url: domain,
    description: 'Enterprise design system company providing AI-first Svelte 5 components and scalable design solutions for enterprise teams building at scale.',
    numberOfEmployees: {
      '@type': 'QuantitativeValue',
      value: '10-50'
    },
    subOrganization: [
      {
        '@type': 'Organization',
        name: '.miozu',
        description: 'Base16 theme system and development environment configurations for VSCode, Emacs, and Linux'
      }
    ],
    knowsAbout: [
      'Enterprise Design Systems',
      'AI-First Components',
      'Scalable Design Tokens',
      'Svelte 5 Component Library',
      'Enterprise Security Features',
      'Design System Governance',
      'Component Library Architecture',
      'Base16 Theme System',
      'Enterprise Development Tools'
    ]
  }}
/>

<div class="grid-page">
  <!-- Header Row -->
  <header class="grid-header">
    <div class="header-left">
      <a href="/" class="logo">
        <Logo type="full" size={32} variant="default" />
      </a>
    </div>
    <nav class="header-nav">
      <MegaMenu />
      <a href="/design-system" class="nav-link">Components</a>
      <a href="/solutions" class="nav-link">Solutions</a>
      <a href="/about" class="nav-link">About</a>
      <a href="/contact" class="nav-link">Contact</a>
    </nav>
  </header>

  <!-- Main Grid -->
  <div class="grid-main">
    <!-- Large Block 1: Hero with Three.js (PRIORITY 1) -->
    <div class="block block-hero">
      {#if ThreeCanvas && priorityCardsReady}
        <ThreeCanvas type="sinuous-original" />
      {/if}
      <div class="block-overlay">
        <div class="hero-content">
          <span class="hero-label">Enterprise Design System</span>
          <div class="hero-title">
            <Logo type="full" size={64} variant="default" />
          </div>
          <p class="hero-tagline">AI-first design system for enterprise teams building at scale</p>
        </div>
      </div>
    </div>

    <!-- Large Block 2: About/Visual with authentic Sinuous (PRIORITY 1) -->
    <button
      type="button"
      class="block block-about"
      class:fading-card={fadingCard === 'about'}
      class:hidden-card={expandingCard === 'about'}
      onclick={(e) => handleCardClick(e, 'about')}
    >
      {#if ThreeCanvas && priorityCardsReady}
        <ThreeCanvas type="sinuous-original" id="canvas-about" />
      {/if}
      <div class="block-overlay block-overlay-about">
        <div class="block-content">
          <span class="block-label">Enterprise</span>
          <h2 class="block-title">Design System</h2>
          <p class="block-desc">AI-first components for scalable teams. Production-ready.</p>
        </div>
        <div class="block-corner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </button>

    <!-- Small Block 1: Platform (PRIORITY 2) -->
    <button
      type="button"
      class="block block-small block-platform"
      class:fading-card={fadingCard === 'platform'}
      class:hidden-card={expandingCard === 'platform'}
      onclick={(e) => handleCardClick(e, 'platform')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="synaptic-multipass" lowRes={true} id="canvas-platform" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Components</span>
        <h2 class="block-title">Library</h2>
        <ul class="block-list">
          <li>Svelte 5 Components</li>
          <li>Enterprise Features</li>
        </ul>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Small Block 2: Data Schema (PRIORITY 2) -->
    <button
      type="button"
      class="block block-small block-data"
      class:fading-card={fadingCard === 'data'}
      class:hidden-card={expandingCard === 'data'}
      onclick={(e) => handleCardClick(e, 'data')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="synaptic" lowRes={true} id="canvas-data" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Design</span>
        <h2 class="block-title">Tokens</h2>
        <p class="block-desc">Comprehensive design tokens and Base16 themes.</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Small Block 3: Contact (PRIORITY 2) -->
    <button
      type="button"
      class="block block-small block-contact"
      class:fading-card={fadingCard === 'contact'}
      class:hidden-card={expandingCard === 'contact'}
      onclick={(e) => handleCardClick(e, 'contact')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="ether" lowRes={true} id="canvas-contact" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Enterprise</span>
        <h2 class="block-title">Solutions</h2>
        <span class="block-email-light">Custom implementation</span>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Small Block 4: .miozu Linux (Side Project) (PRIORITY 2) -->
    <button
      type="button"
      class="block block-small block-linux"
      onclick={() => window.open('/#linux', '_blank')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="snake-trails" lowRes={true} />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Linux</span>
        <h2 class="block-title">.miozu</h2>
        <p class="block-desc">System themes and configurations.</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>
  </div>
</div>

<style lang="postcss">
  @reference '$theme';

  .grid-page {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100%;
    width: 100%;
    gap: 5px;
    padding: 5px;
    background: #0a0a0a;
    box-sizing: border-box;
  }

  /* Header */
  .grid-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    height: 48px;
    background: #111;
    border-radius: 8px;
    border: 1px solid #222;
  }

  .header-left {
    flex: 0 0 auto;
  }

  .logo {
    font-size: 1.1rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    letter-spacing: -0.02em;
  }

  .logo-x {
    font-weight: 700;
    color: #4a9eff;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .nav-link {
    padding: 8px 16px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #888;
    text-decoration: none;
    transition: color 0.15s;
    letter-spacing: -0.01em;
  }

  .nav-link:hover {
    color: #fff;
  }

  .nav-link-highlight {
    color: #4a9eff;
  }

  .nav-link-highlight:hover {
    color: #6bb3ff;
  }

  /* Main Grid - Asymmetric layout */
  .grid-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 2fr 1fr;
    gap: 5px;
    height: 100%;
    min-height: 0;
  }

  /* Blocks base */
  .block {
    position: relative;
    background: #111;
    border-radius: 8px;
    border: 1px solid #222;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.3s ease;
    contain: layout style paint;
  }

  .block:hover {
    border-color: #333;
  }

  /* Hero block - top left */
  .block-hero {
    grid-column: 1;
    grid-row: 1;
  }

  .block-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 24px;
    pointer-events: none;
    background: linear-gradient(135deg, rgba(17, 17, 17, 0.9) 0%, rgba(17, 17, 17, 0.3) 50%, transparent 100%);
  }

  .hero-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .hero-label {
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #666;
  }

  .hero-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #fff;
    letter-spacing: -0.03em;
    margin: 0;
  }

  .title-x {
    font-weight: 800;
    color: #4a9eff;
    display: inline-block;
    transform: scaleX(1.15);
    margin-left: -0.02em;
  }

  /* About block - top right */
  .block-about {
    grid-column: 2;
    grid-row: 1;
    position: relative;
    padding: 0;
  }

  .block-overlay-about {
    background: linear-gradient(180deg, rgba(17, 17, 17, 0.85) 0%, rgba(17, 17, 17, 0.4) 40%, transparent 100%);
  }

  .block-overlay-about .block-content {
    padding: 24px;
  }

  .block-overlay-about .block-corner {
    bottom: 16px;
    right: 16px;
  }

  /* Small blocks - bottom row */
  .block-small {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
  }

  /* Small blocks span the bottom */
  .block-small:nth-of-type(3) { grid-column: 1; grid-row: 2; }
  .block-small:nth-of-type(4) { grid-column: 2; grid-row: 2; }

  /* Actually we need 4 small blocks in bottom row */
  .grid-main {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 2fr 1fr;
  }

  .block-hero {
    grid-column: 1 / 3;
    grid-row: 1;
  }

  .block-about {
    grid-column: 3 / 5;
    grid-row: 1;
  }

  .block-small:nth-of-type(3) { grid-column: 1; grid-row: 2; }
  .block-small:nth-of-type(4) { grid-column: 2; grid-row: 2; }
  .block-small:nth-of-type(5) { grid-column: 3; grid-row: 2; }
  .block-small:nth-of-type(6) { grid-column: 4; grid-row: 2; }

  /* J'ko block with snake trails */
  .block-jko {
    position: relative;
    padding: 0;
  }

  /* Platform block with synaptic effect */
  .block-platform {
    position: relative;
    padding: 0;
  }

  /* Data block with synaptic effect */
  .block-data {
    position: relative;
    padding: 0;
  }

  /* Contact block with ether effect */
  .block-contact {
    position: relative;
    padding: 0;
  }

  .block-content-overlay {
    position: relative;
    z-index: 1;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  /* Block content */
  .block-content {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .block-label {
    font-size: 0.65rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #555;
  }

  .block-label.dark {
    color: #666;
  }

  .block-title {
    font-size: 1.4rem;
    font-weight: 600;
    color: #fff;
    letter-spacing: -0.02em;
    margin: 0;
  }

  .block-title.dark {
    color: #111;
  }

  .block-desc {
    font-size: 0.8rem;
    color: #666;
    line-height: 1.5;
    margin: 4px 0 0 0;
  }

  .block-list {
    list-style: none;
    padding: 0;
    margin: 8px 0 0 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .block-list li {
    font-size: 0.8rem;
    color: #888;
    position: relative;
    padding-left: 12px;
  }

  .block-list li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 6px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #4a9eff;
  }

  .block-email {
    font-size: 0.85rem;
    font-weight: 500;
    color: #1a365d;
    margin-top: 8px;
  }

  .block-email-light {
    font-size: 0.85rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 8px;
  }

  /* Light block variant */
  .block-light {
    background: #f5f5f5;
    border-color: #e0e0e0;
  }

  .block-light:hover {
    border-color: #ccc;
  }

  /* Block corner arrow */
  .block-corner {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #1a1a1a;
    color: #666;
    transition: all 0.3s ease;
  }

  .block-corner.dark {
    background: #e5e5e5;
    color: #666;
  }

  .block:hover .block-corner {
    background: #4a9eff;
    color: #fff;
    transform: translate(2px, -2px);
  }

  .block-light:hover .block-corner {
    background: #1a365d;
    color: #fff;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .grid-main {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1.5fr 1fr 1fr;
    }

    .block-hero { grid-column: 1; grid-row: 1; }
    .block-about { grid-column: 2; grid-row: 1; }
    .block-small:nth-of-type(3) { grid-column: 1; grid-row: 2; }
    .block-small:nth-of-type(4) { grid-column: 2; grid-row: 2; }
    .block-small:nth-of-type(5) { grid-column: 1; grid-row: 3; }
    .block-small:nth-of-type(6) { grid-column: 2; grid-row: 3; }

    .hero-title {
      font-size: 2rem;
    }

    .block-title {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 640px) {
    .grid-page {
      gap: 4px;
      padding: 4px;
    }

    .grid-header {
      height: 44px;
      padding: 0 12px;
    }

    .header-nav {
      display: none;
    }

    .grid-main {
      grid-template-columns: 1fr;
      grid-template-rows: 2fr repeat(5, 1fr);
    }

    .block-hero { grid-column: 1; grid-row: 1; }
    .block-about { grid-column: 1; grid-row: 2; }
    .block-small:nth-of-type(3) { grid-column: 1; grid-row: 3; }
    .block-small:nth-of-type(4) { grid-column: 1; grid-row: 4; }
    .block-small:nth-of-type(5) { grid-column: 1; grid-row: 5; }
    .block-small:nth-of-type(6) { grid-column: 1; grid-row: 6; }

    .hero-title {
      font-size: 1.8rem;
    }

    .block-title {
      font-size: 1.1rem;
    }

    .block-small {
      padding: 16px;
    }
  }

  /* Button reset for card buttons */
  button.block {
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: transform 0.2s ease-out;
  }

  button.block:hover {
    transform: scale(1.01);
  }

  button.block:active {
    transform: scale(0.99);
  }

  /* Fading card text during expansion - text fades out quickly */
  .fading-card .block-content,
  .fading-card .block-content-overlay,
  .fading-card .block-overlay .block-content,
  .fading-card .block-corner {
    opacity: 0;
    transition: opacity 0.15s ease-out;
  }

  /* Hidden card after expansion complete */
  .hidden-card {
    opacity: 0;
    pointer-events: none;
  }

  /* Viewport card fills parent block */
  :global(.viewport-fill) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
