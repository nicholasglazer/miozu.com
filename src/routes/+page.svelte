<script>
  import { browser } from '$app/environment';
  import Metadata from '$features/seo/Metadata.svelte';
  import JsonLd from '$features/seo/JsonLd.svelte';
  import {appName, domain} from '$settings/global';

  // Lazy load Three.js canvas
  let ThreeCanvas = $state(null);

  $effect(() => {
    if (browser) {
      import('$lib/three/ThreeCanvas.svelte').then(module => {
        ThreeCanvas = module.default;
      });
    }
  });
</script>

<Metadata
  title="Oraklex — Corporate Holding"
  description="Oraklex is a holding company building the future of commerce intelligence through strategic investments in AI and data infrastructure."
  canonicalUrl={domain}
  ogType="website"
  ogImage={`${domain}/images/oraklex-og-banner.jpg`}
  ogImageAlt="Oraklex - Corporate Holding"
  robots="index, follow"
/>

<JsonLd
  type="Organization"
  data={{
    name: appName,
    description: 'Corporate holding company focused on commerce intelligence and AI infrastructure.',
    url: domain
  }}
/>

<div class="grid-page">
  <!-- Header Row -->
  <header class="grid-header">
    <div class="header-left">
      <a href="/" class="logo">Oraklex</a>
    </div>
    <nav class="header-nav">
      <a href="/products">Products</a>
      <a href="/team">Team</a>
      <a href="/contact">Contact</a>
    </nav>
    <div class="header-right">
      <a href="https://jko.ai" class="cta-btn">J'ko AI</a>
    </div>
  </header>

  <!-- Main Grid -->
  <div class="grid-main">
    <!-- Large Block 1: Hero with Three.js -->
    <div class="block block-hero">
      {#if ThreeCanvas}
        <ThreeCanvas effect="sinuous" />
      {/if}
      <div class="block-overlay">
        <div class="hero-content">
          <span class="hero-label">Strategic Investments</span>
          <h1 class="hero-title">ORAKLEX</h1>
        </div>
        <div class="block-corner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Large Block 2: About/Visual with authentic Sinuous -->
    <a href="/team" class="block block-about">
      {#if ThreeCanvas}
        <ThreeCanvas effect="sinuous-original" />
      {/if}
      <div class="block-overlay block-overlay-about">
        <div class="block-content">
          <span class="block-label">The Holding</span>
          <h2 class="block-title">About</h2>
          <p class="block-desc">A vertically integrated approach to commerce intelligence and AI infrastructure.</p>
        </div>
        <div class="block-corner">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </div>
      </div>
    </a>

    <!-- Small Block 1: Portfolio -->
    <a href="/products" class="block block-small">
      <div class="block-content">
        <span class="block-label">Our Companies</span>
        <h2 class="block-title">Portfolio</h2>
        <ul class="block-list">
          <li>J'ko AI</li>
          <li>Data Oracle</li>
          <li>HyperC</li>
        </ul>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </a>

    <!-- Small Block 2: Leadership -->
    <a href="/team" class="block block-small">
      <div class="block-content">
        <span class="block-label">Executive Team</span>
        <h2 class="block-title">Leadership</h2>
        <p class="block-desc">Building at the intersection of AI and commerce.</p>
      </div>
      <div class="block-corner">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </a>

    <!-- Small Block 3: Contact -->
    <a href="/contact" class="block block-small block-light">
      <div class="block-content">
        <span class="block-label dark">Get in Touch</span>
        <h2 class="block-title dark">Contact</h2>
        <span class="block-email">partners@oraklex.com</span>
      </div>
      <div class="block-corner dark">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17"/>
        </svg>
      </div>
    </a>

    <!-- Small Block 4: Updates -->
    <div class="block block-small block-updates">
      {#if ThreeCanvas}
        <ThreeCanvas effect="snake-trails" />
      {/if}
      <div class="block-content block-content-overlay">
        <span class="block-label">Latest News</span>
        <h2 class="block-title">Updates</h2>
        <p class="block-desc">Stay informed about our portfolio and initiatives.</p>
      </div>
    </div>
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

  .header-nav {
    display: flex;
    gap: 8px;
  }

  .header-nav a {
    padding: 6px 14px;
    font-size: 0.8rem;
    color: #888;
    text-decoration: none;
    transition: color 0.2s;
  }

  .header-nav a:hover {
    color: #fff;
  }

  .header-right {
    flex: 0 0 auto;
  }

  .cta-btn {
    padding: 6px 16px;
    font-size: 0.8rem;
    font-weight: 500;
    color: #000;
    background: #fff;
    border-radius: 6px;
    text-decoration: none;
    transition: all 0.2s;
  }

  .cta-btn:hover {
    background: #e0e0e0;
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

  /* Updates block with snake trails */
  .block-updates {
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
</style>
