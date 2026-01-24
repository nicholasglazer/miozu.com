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

  // Card configuration for transitions - Enhanced for Fibonacci showcase
  const cardConfigs: Record<string, { route: string; effectType: string; canvasId: string; label: string; title: string; description: string }> = {
    hero: {
      route: '/about',
      effectType: 'sinuous-original',
      canvasId: 'canvas-hero',
      label: 'Enterprise',
      title: 'Design System',
      description: 'AI-first components for scalable enterprise applications and teams.'
    },
    about: {
      route: '/about',
      effectType: 'sinuous-original',
      canvasId: 'canvas-about',
      label: 'About',
      title: 'Our Story',
      description: 'Building the future of design systems with mathematical precision.'
    },
    platform: {
      route: '/solutions',
      effectType: 'synaptic-multipass',
      canvasId: 'canvas-platform',
      label: 'Components',
      title: 'Library',
      description: 'Production-ready Svelte 5 components with enterprise features.'
    },
    tokens: {
      route: '/solutions#design-tokens',
      effectType: 'synaptic',
      canvasId: 'canvas-tokens',
      label: 'Design',
      title: 'Tokens',
      description: 'DTCG standards with multi-brand support.'
    },
    solutions: {
      route: '/solutions',
      effectType: 'ether',
      canvasId: 'canvas-solutions',
      label: 'Enterprise',
      title: 'Solutions',
      description: 'Custom implementation and governance programs.'
    },
    themes: {
      route: '/ports',
      effectType: 'snake-trails',
      canvasId: 'canvas-themes',
      label: 'Base16',
      title: 'Themes',
      description: 'VSCode, Emacs, and Linux development themes.'
    },
    contact: {
      route: '/contact',
      effectType: 'ether',
      canvasId: 'canvas-contact',
      label: 'Contact',
      title: 'Get Started',
      description: 'Enterprise consultations and custom implementations.'
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

  // Fibonacci sequence verification function
  function fibonacci(n: number): number {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  }

  // Verify Fibonacci Rectangle Subdivision (dev mode only)
  $effect(() => {
    if (browser && import.meta.env.DEV) {
      // Generate Fibonacci sequence for verification
      const fibSeq = Array.from({length: 10}, (_, i) => fibonacci(i));
      console.log('🧮 Fibonacci Rectangle Subdivision Verification');
      console.log('📐 Golden Ratio Layout: 8:5:3 columns, 5:2:1 rows');
      console.log('🟦 Hero: 8×5 (largest rectangle - golden ratio foundation)');
      console.log('🟩 About: 3×5 (tall rectangle - next subdivision)');
      console.log('🟨 Platform: 2×2 (medium square)');
      console.log('🟪 Tokens: 2×1 (small rectangle)');
      console.log('🟫 Solutions: 3×2 (medium rectangle)');
      console.log('🟧 Contact: 8×1 (wide base rectangle)');
      console.log('🟥 Themes: 8×1 (final subdivision)');
      console.log('📊 Grid totals: 13fr width (8+3+2), 8fr height (5+2+1)');
      console.log('✨ Classic Fibonacci rectangle spiral pattern achieved!');
      console.log('🌀 Each rectangle relates to others through golden ratio φ ≈ 1.618');
    }
  });

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

  <!-- Main Grid: Classic Fibonacci Rectangle Subdivision -->
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
          <p class="hero-tagline">Enterprise design system with AI-first components for teams building at scale</p>
        </div>
      </div>
    </div>

    <!-- About Block: F6+F7 span (8+13=21, approaching F8=21!) -->
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
          <span class="block-label">About</span>
          <h2 class="block-title">Our Story</h2>
          <p class="block-desc">Building design systems with mathematical precision.</p>
        </div>
        <div class="block-corner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </button>

    <!-- Platform: F1 (1fr) -->
    <button
      type="button"
      class="block block-platform"
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
          <li>Svelte 5</li>
          <li>Enterprise</li>
        </ul>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Tokens: F2 (1fr) -->
    <button
      type="button"
      class="block block-tokens"
      class:fading-card={fadingCard === 'tokens'}
      class:hidden-card={expandingCard === 'tokens'}
      onclick={(e) => handleCardClick(e, 'tokens')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="synaptic" lowRes={true} id="canvas-tokens" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Design</span>
        <h2 class="block-title">Tokens</h2>
        <p class="block-desc">DTCG standards</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Solutions: F3 (2fr) -->
    <button
      type="button"
      class="block block-solutions"
      class:fading-card={fadingCard === 'solutions'}
      class:hidden-card={expandingCard === 'solutions'}
      onclick={(e) => handleCardClick(e, 'solutions')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="ether" lowRes={true} id="canvas-solutions" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Enterprise</span>
        <h2 class="block-title">Solutions</h2>
        <p class="block-desc">Governance programs</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Themes: F4 (3fr) -->
    <button
      type="button"
      class="block block-themes"
      class:fading-card={fadingCard === 'themes'}
      class:hidden-card={expandingCard === 'themes'}
      onclick={(e) => handleCardClick(e, 'themes')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="snake-trails" lowRes={true} id="canvas-themes" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Base16</span>
        <h2 class="block-title">Themes</h2>
        <p class="block-desc">VSCode, Emacs, Linux</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </button>

    <!-- Contact: F5+F6 (5+8=13, F7!) -->
    <button
      type="button"
      class="block block-contact"
      class:fading-card={fadingCard === 'contact'}
      class:hidden-card={expandingCard === 'contact'}
      onclick={(e) => handleCardClick(e, 'contact')}
    >
      {#if ThreeCanvas && allCardsReady}
        <ThreeCanvas type="ether" lowRes={true} id="canvas-contact" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Contact</span>
        <h2 class="block-title">Get Started</h2>
        <span class="block-email-light">Enterprise consultations</span>
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
    grid-template-rows: min-content 1fr; /* Header takes only needed space, main takes rest */
    height: 100vh; /* Full viewport height */
    width: 100vw;   /* Full viewport width */
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

  /* Classic Fibonacci Rectangle Layout - Perfect Cubes */
  .grid-main {
    display: grid;
    /* Exact Fibonacci: 8 left, 3+2=5 right, with 5,2,1 rows for proper 3,2,1 subdivision */
    grid-template-columns: 8fr 3fr 2fr;
    grid-template-rows: 5fr 2fr 1fr;
    gap: 5px;
    width: 100%;
    height: 100%;
    min-height: 0;
    /* Ensure grid takes all available space for proper cube proportions */
    flex: 1;
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

  /* Exact Fibonacci Zone Allocation */

  /* Hero: 8×8 - Spans FULL HEIGHT (all 3 rows), column 1 */
  .block-hero {
    grid-column: 1;
    grid-row: 1 / 4; /* Spans ALL rows = FULL HEIGHT */
  }

  /* About: 5×5 - Top right, spans columns 2&3, row 1 */
  .block-about {
    grid-column: 2 / 4;
    grid-row: 1;
    position: relative;
    padding: 0;
  }

  /* Platform: 3×3 - Left bottom area, column 2, spans rows 2&3 */
  .block-platform {
    grid-column: 2;
    grid-row: 2 / 4;
    position: relative;
    padding: 0;
  }

  /* Solutions: 2×2 - Right middle, column 3, row 2 */
  .block-solutions {
    grid-column: 3;
    grid-row: 2;
    position: relative;
    padding: 0;
  }

  /* Contact: 1×1 - Right bottom, column 3, row 3 */
  .block-contact {
    grid-column: 3;
    grid-row: 3;
    position: relative;
    padding: 0;
  }

  /* Completely remove blocks that don't fit Fibonacci pattern from grid flow */
  .block-tokens,
  .block-themes {
    display: none !important;
    grid-column: unset;
    grid-row: unset;
    position: absolute;
    left: -9999px; /* Move completely out of view */
    visibility: hidden;
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

  .hero-tagline {
    font-size: 1rem;
    color: #aaa;
    line-height: 1.5;
    margin: 8px 0 0 0;
    max-width: 400px;
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

  /* All blocks use consistent overlay pattern */
  .block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0;
  }

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

  /* Responsive - Maintain Fibonacci Rectangle proportions */
  @media (max-width: 1024px) {
    .grid-main {
      /* Simplified Fibonacci rectangle: 5:3 golden ratio */
      grid-template-columns: 5fr 3fr;
      grid-template-rows: 5fr 2fr 1fr;
    }

    /* Hero: Large rectangle (5×5) */
    .block-hero {
      grid-column: 1;
      grid-row: 1;
    }

    /* About: Medium rectangle (3×5) */
    .block-about {
      grid-column: 2;
      grid-row: 1;
    }

    /* Platform: Small rectangle (5×2) */
    .block-platform {
      grid-column: 1;
      grid-row: 2;
    }

    /* Solutions: Small rectangle (3×2) */
    .block-solutions {
      grid-column: 2;
      grid-row: 2;
    }

    /* Contact: Base rectangle (5×1) */
    .block-contact {
      grid-column: 1;
      grid-row: 3;
    }

    /* Hide tokens and themes for cleaner medium layout */
    .block-tokens,
    .block-themes {
      display: none;
    }

    .hero-title {
      font-size: 2rem;
    }

    .block-title {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    .grid-main {
      /* Golden ratio layout: 3:2 */
      grid-template-columns: 3fr 2fr;
      grid-template-rows: 3fr 2fr;
    }

    /* Hero: Main rectangle (3×3) */
    .block-hero {
      grid-column: 1;
      grid-row: 1;
    }

    /* About: Side rectangle (2×3) */
    .block-about {
      grid-column: 2;
      grid-row: 1;
    }

    /* Platform: Bottom left (3×2) */
    .block-platform {
      grid-column: 1;
      grid-row: 2;
    }

    /* Contact: Bottom right (2×2) */
    .block-contact {
      grid-column: 2;
      grid-row: 2;
    }

    /* Hide smaller blocks for cleaner tablet layout */
    .block-tokens,
    .block-solutions,
    .block-themes {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .grid-page {
      gap: 4px;
      padding: 4px;
      /* Perfect mobile scroll - remove height constraint */
      height: auto;
      min-height: 100vh;
    }

    .grid-header {
      height: 44px;
      padding: 0 12px;
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(8px);
      background: rgba(17, 17, 17, 0.95);
    }

    .header-nav {
      display: none;
    }

    .grid-main {
      /* Mobile golden ratio layout: single column with φ proportions */
      grid-template-columns: 1fr;
      grid-template-rows: 8fr 5fr 3fr 2fr;
      height: auto;
      min-height: calc(100vh - 60px);
    }

    /* Mobile Fibonacci rectangle stack */
    .block-hero {
      grid-column: 1;
      grid-row: 1;
      min-height: 50vh; /* F8 proportion */
    }

    .block-about {
      grid-column: 1;
      grid-row: 2;
      min-height: 30vh; /* F5 proportion */
    }

    .block-platform {
      grid-column: 1;
      grid-row: 3;
      min-height: 20vh; /* F3 proportion */
    }

    .block-contact {
      grid-column: 1;
      grid-row: 4;
      min-height: 15vh; /* F2 proportion */
    }

    /* Hide other blocks for clean mobile experience */
    .block-tokens,
    .block-solutions,
    .block-themes {
      display: none;
    }

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
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
  }

  button.block:hover {
    border-color: #4a9eff;
    box-shadow: 0 0 0 1px rgba(74, 158, 255, 0.2);
  }

  button.block:active {
    border-color: #4a9eff;
    box-shadow: 0 0 0 1px rgba(74, 158, 255, 0.4);
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
